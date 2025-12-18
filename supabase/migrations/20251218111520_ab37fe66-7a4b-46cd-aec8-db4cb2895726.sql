
-- Create function to get invite details without authentication
CREATE OR REPLACE FUNCTION public.get_invite_details(invite_token text)
RETURNS TABLE (
  email text,
  role app_role,
  organization_name text,
  expires_at timestamptz,
  is_valid boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.email,
    i.role,
    o.name as organization_name,
    i.expires_at,
    (i.expires_at > now() AND i.accepted_at IS NULL) as is_valid
  FROM public.organization_invites i
  JOIN public.organizations o ON o.id = i.organization_id
  WHERE i.token = invite_token;
END;
$$;
