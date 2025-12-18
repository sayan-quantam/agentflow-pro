-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Add organization_id to profiles
ALTER TABLE public.profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id);

-- Create organization_invites table for team invitations
CREATE TABLE public.organization_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'agent',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invites
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
-- Users can view their own organization
CREATE POLICY "Users can view their organization"
ON public.organizations FOR SELECT
USING (
  id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Super admins and admins can update their organization
CREATE POLICY "Admins can update their organization"
ON public.organizations FOR UPDATE
USING (
  id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
  AND (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
);

-- Allow insert during signup (handled by trigger)
CREATE POLICY "Allow organization creation"
ON public.organizations FOR INSERT
WITH CHECK (true);

-- RLS Policies for organization_invites
-- Admins can view invites for their organization
CREATE POLICY "Admins can view organization invites"
ON public.organization_invites FOR SELECT
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
  AND (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
);

-- Admins can create invites
CREATE POLICY "Admins can create invites"
ON public.organization_invites FOR INSERT
WITH CHECK (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
  AND (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
);

-- Admins can delete invites
CREATE POLICY "Admins can delete invites"
ON public.organization_invites FOR DELETE
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
  AND (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
);

-- Update timestamp trigger for organizations
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_slug(name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(encode(gen_random_bytes(4), 'hex'), 1, 8);
END;
$$;

-- Function to create organization and set user as super_admin
CREATE OR REPLACE FUNCTION public.create_organization_with_admin(
  org_name TEXT,
  org_industry TEXT DEFAULT NULL,
  org_website TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Create organization
  INSERT INTO public.organizations (name, slug, industry, website)
  VALUES (org_name, generate_slug(org_name), org_industry, org_website)
  RETURNING id INTO new_org_id;
  
  -- Update user profile with organization
  UPDATE public.profiles 
  SET organization_id = new_org_id
  WHERE user_id = current_user_id;
  
  -- Update user role to super_admin
  UPDATE public.user_roles
  SET role = 'super_admin'
  WHERE user_id = current_user_id;
  
  RETURN new_org_id;
END;
$$;

-- Function to accept invite and join organization
CREATE OR REPLACE FUNCTION public.accept_organization_invite(invite_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_record RECORD;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Find valid invite
  SELECT * INTO invite_record
  FROM public.organization_invites
  WHERE token = invite_token
    AND expires_at > now()
    AND accepted_at IS NULL;
    
  IF invite_record IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invite';
  END IF;
  
  -- Update profile with organization
  UPDATE public.profiles
  SET organization_id = invite_record.organization_id
  WHERE user_id = current_user_id;
  
  -- Set user role from invite
  UPDATE public.user_roles
  SET role = invite_record.role
  WHERE user_id = current_user_id;
  
  -- Mark invite as accepted
  UPDATE public.organization_invites
  SET accepted_at = now()
  WHERE id = invite_record.id;
  
  RETURN true;
END;
$$;