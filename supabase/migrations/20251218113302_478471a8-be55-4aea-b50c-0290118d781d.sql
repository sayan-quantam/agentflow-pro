-- Allow users to view profiles of members in the same organization
CREATE POLICY "Users can view organization members"
ON public.profiles
FOR SELECT
USING (
  organization_id IS NOT NULL AND
  organization_id IN (
    SELECT organization_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Function to fetch organization members with roles
CREATE OR REPLACE FUNCTION public.get_organization_members()
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role app_role,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_org_id UUID;
BEGIN
  -- Get caller's organization
  SELECT p.organization_id INTO caller_org_id
  FROM profiles p WHERE p.user_id = auth.uid();
  
  IF caller_org_id IS NULL THEN
    RAISE EXCEPTION 'User not in an organization';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.user_id,
    p.full_name,
    p.email,
    p.avatar_url,
    ur.role,
    p.created_at
  FROM profiles p
  LEFT JOIN user_roles ur ON p.user_id = ur.user_id
  WHERE p.organization_id = caller_org_id;
END;
$$;

-- Function to update member role (super_admin only)
CREATE OR REPLACE FUNCTION public.update_member_role(target_user_id UUID, new_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_org_id UUID;
  target_org_id UUID;
BEGIN
  -- Verify caller is super_admin
  IF NOT has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super admins can change roles';
  END IF;
  
  -- Prevent changing own role
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot change your own role';
  END IF;
  
  -- Verify both users are in same organization
  SELECT organization_id INTO caller_org_id FROM profiles WHERE user_id = auth.uid();
  SELECT organization_id INTO target_org_id FROM profiles WHERE user_id = target_user_id;
  
  IF caller_org_id IS NULL OR target_org_id IS NULL OR caller_org_id != target_org_id THEN
    RAISE EXCEPTION 'User not in your organization';
  END IF;
  
  -- Update the role
  UPDATE user_roles SET role = new_role
  WHERE user_id = target_user_id;
  
  RETURN TRUE;
END;
$$;

-- Function to remove member from organization (super_admin only)
CREATE OR REPLACE FUNCTION public.remove_organization_member(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_org_id UUID;
  target_org_id UUID;
BEGIN
  -- Verify caller is super_admin
  IF NOT has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super admins can remove members';
  END IF;
  
  -- Prevent removing self
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove yourself from organization';
  END IF;
  
  -- Verify both users are in same organization
  SELECT organization_id INTO caller_org_id FROM profiles WHERE user_id = auth.uid();
  SELECT organization_id INTO target_org_id FROM profiles WHERE user_id = target_user_id;
  
  IF caller_org_id IS NULL OR target_org_id IS NULL OR caller_org_id != target_org_id THEN
    RAISE EXCEPTION 'User not in your organization';
  END IF;
  
  -- Remove organization association
  UPDATE profiles SET organization_id = NULL
  WHERE user_id = target_user_id;
  
  -- Reset role to agent
  UPDATE user_roles SET role = 'agent'
  WHERE user_id = target_user_id;
  
  RETURN TRUE;
END;
$$;