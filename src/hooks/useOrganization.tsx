import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  website: string | null;
  logo_url: string | null;
}

interface OrganizationInvite {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'agent';
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export function useOrganization() {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setOrganization(null);
      setHasOrganization(null);
      setLoading(false);
      return;
    }

    const fetchOrganization = async () => {
      try {
        // First check if user has organization_id in profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('user_id', user.id)
          .single();

        if (!profile?.organization_id) {
          setHasOrganization(false);
          setOrganization(null);
          setLoading(false);
          return;
        }

        // Fetch organization details
        const { data: org } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single();

        setOrganization(org);
        setHasOrganization(!!org);
      } catch (error) {
        console.error('Error fetching organization:', error);
        setHasOrganization(false);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [user]);

  const fetchInvites = async (): Promise<OrganizationInvite[]> => {
    if (!organization) return [];

    const { data, error } = await supabase
      .from('organization_invites')
      .select('*')
      .eq('organization_id', organization.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invites:', error);
      return [];
    }

    return data || [];
  };

  const createInvite = async (email: string, role: 'admin' | 'manager' | 'agent') => {
    if (!organization || !user) {
      throw new Error('No organization or user');
    }

    const { data, error } = await supabase
      .from('organization_invites')
      .insert({
        organization_id: organization.id,
        email,
        role,
        invited_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteInvite = async (inviteId: string) => {
    const { error } = await supabase
      .from('organization_invites')
      .delete()
      .eq('id', inviteId);

    if (error) throw error;
  };

  const updateOrganization = async (updates: Partial<Pick<Organization, 'name' | 'industry' | 'website'>>) => {
    if (!organization) throw new Error('No organization');

    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', organization.id)
      .select()
      .single();

    if (error) throw error;
    setOrganization(data);
    return data;
  };

  return {
    organization,
    loading,
    hasOrganization,
    fetchInvites,
    createInvite,
    deleteInvite,
    updateOrganization,
  };
}
