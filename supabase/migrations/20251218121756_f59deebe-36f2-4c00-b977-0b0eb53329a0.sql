
-- AI Agents table
CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
  voice TEXT DEFAULT 'nova',
  language TEXT DEFAULT 'en-US',
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'paused', 'inactive')),
  system_prompt TEXT,
  greeting_message TEXT,
  settings JSONB DEFAULT '{}',
  total_calls INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agent templates table
CREATE TABLE public.agent_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
  industry TEXT,
  system_prompt TEXT,
  greeting_message TEXT,
  settings JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'inactive')),
  custom_fields JSONB DEFAULT '{}',
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, name)
);

-- Contact tags junction table
CREATE TABLE public.contact_tags (
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, tag_id)
);

-- Contact lists table
CREATE TABLE public.contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact list members junction table
CREATE TABLE public.contact_list_members (
  contact_list_id UUID NOT NULL REFERENCES public.contact_lists(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (contact_list_id, contact_id)
);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('outbound', 'scheduled', 'triggered')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  contact_list_id UUID REFERENCES public.contact_lists(id) ON DELETE SET NULL,
  schedule_start TIMESTAMPTZ,
  schedule_end TIMESTAMPTZ,
  daily_start_time TIME,
  daily_end_time TIME,
  timezone TEXT DEFAULT 'UTC',
  settings JSONB DEFAULT '{}',
  total_contacts INTEGER DEFAULT 0,
  contacted INTEGER DEFAULT 0,
  successful INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaign contacts junction table (tracks individual contact status in campaign)
CREATE TABLE public.campaign_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'failed', 'skipped')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  result JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, contact_id)
);

-- Call logs table
CREATE TABLE public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL CHECK (status IN ('initiated', 'ringing', 'answered', 'completed', 'failed', 'busy', 'no_answer', 'cancelled')),
  duration_seconds INTEGER DEFAULT 0,
  from_number TEXT,
  to_number TEXT,
  recording_url TEXT,
  transcript TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  outcome TEXT,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Calendar events table
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('campaign', 'appointment', 'callback', 'meeting', 'other')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT false,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI Agents
CREATE POLICY "Users can view agents in their organization"
  ON public.ai_agents FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins and managers can create agents"
  ON public.ai_agents FOR INSERT
  WITH CHECK (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  );

CREATE POLICY "Admins and managers can update agents"
  ON public.ai_agents FOR UPDATE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  );

CREATE POLICY "Admins can delete agents"
  ON public.ai_agents FOR DELETE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
  );

-- RLS Policies for Agent Templates
CREATE POLICY "Anyone can view public templates"
  ON public.agent_templates FOR SELECT
  USING (is_public = true OR organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins can create templates"
  ON public.agent_templates FOR INSERT
  WITH CHECK (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
  );

-- RLS Policies for Contacts
CREATE POLICY "Users can view contacts in their organization"
  ON public.contacts FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can create contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update contacts in their organization"
  ON public.contacts FOR UPDATE
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins and managers can delete contacts"
  ON public.contacts FOR DELETE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  );

-- RLS Policies for Tags
CREATE POLICY "Users can view tags in their organization"
  ON public.tags FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can create tags"
  ON public.tags FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete tags in their organization"
  ON public.tags FOR DELETE
  USING (organization_id = get_user_organization_id(auth.uid()));

-- RLS Policies for Contact Tags
CREATE POLICY "Users can view contact tags"
  ON public.contact_tags FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.contacts c WHERE c.id = contact_id AND c.organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Users can manage contact tags"
  ON public.contact_tags FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.contacts c WHERE c.id = contact_id AND c.organization_id = get_user_organization_id(auth.uid()))
  );

-- RLS Policies for Contact Lists
CREATE POLICY "Users can view contact lists in their organization"
  ON public.contact_lists FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can create contact lists"
  ON public.contact_lists FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update contact lists in their organization"
  ON public.contact_lists FOR UPDATE
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins can delete contact lists"
  ON public.contact_lists FOR DELETE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
  );

-- RLS Policies for Contact List Members
CREATE POLICY "Users can view contact list members"
  ON public.contact_list_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.contact_lists cl WHERE cl.id = contact_list_id AND cl.organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Users can manage contact list members"
  ON public.contact_list_members FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.contact_lists cl WHERE cl.id = contact_list_id AND cl.organization_id = get_user_organization_id(auth.uid()))
  );

-- RLS Policies for Campaigns
CREATE POLICY "Users can view campaigns in their organization"
  ON public.campaigns FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins and managers can create campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  );

CREATE POLICY "Admins and managers can update campaigns"
  ON public.campaigns FOR UPDATE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  );

CREATE POLICY "Admins can delete campaigns"
  ON public.campaigns FOR DELETE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
  );

-- RLS Policies for Campaign Contacts
CREATE POLICY "Users can view campaign contacts"
  ON public.campaign_contacts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.organization_id = get_user_organization_id(auth.uid()))
  );

CREATE POLICY "Managers can manage campaign contacts"
  ON public.campaign_contacts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.organization_id = get_user_organization_id(auth.uid())) AND
    (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
  );

-- RLS Policies for Call Logs
CREATE POLICY "Users can view call logs in their organization"
  ON public.call_logs FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "System can insert call logs"
  ON public.call_logs FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- RLS Policies for Calendar Events
CREATE POLICY "Users can view calendar events in their organization"
  ON public.calendar_events FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can create calendar events"
  ON public.calendar_events FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update calendar events"
  ON public.calendar_events FOR UPDATE
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete their calendar events"
  ON public.calendar_events FOR DELETE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
  );

-- Create updated_at triggers
CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_lists_updated_at
  BEFORE UPDATE ON public.contact_lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_ai_agents_org ON public.ai_agents(organization_id);
CREATE INDEX idx_ai_agents_status ON public.ai_agents(status);
CREATE INDEX idx_contacts_org ON public.contacts(organization_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_phone ON public.contacts(phone);
CREATE INDEX idx_campaigns_org ON public.campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_call_logs_org ON public.call_logs(organization_id);
CREATE INDEX idx_call_logs_agent ON public.call_logs(agent_id);
CREATE INDEX idx_call_logs_campaign ON public.call_logs(campaign_id);
CREATE INDEX idx_calendar_events_org ON public.calendar_events(organization_id);
CREATE INDEX idx_calendar_events_start ON public.calendar_events(start_time);
