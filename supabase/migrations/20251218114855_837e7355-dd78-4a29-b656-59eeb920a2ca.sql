-- Create a security definer function to get user's organization_id without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can view organization members" ON public.profiles;

-- Recreate the policy using the security definer function
CREATE POLICY "Users can view organization members"
ON public.profiles
FOR SELECT
USING (
  (organization_id IS NOT NULL) 
  AND (organization_id = get_user_organization_id(auth.uid()))
);