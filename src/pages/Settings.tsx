import { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  Key, 
  Bell, 
  Plug, 
  CreditCard,
  ChevronRight,
  Upload,
  Shield,
  Globe,
  Mail,
  Phone as PhoneIcon,
  Lock,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { useOrganization } from "@/hooks/useOrganization";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TeamManagement } from "@/components/settings/TeamManagement";
import { toast } from "sonner";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const allTabs: Tab[] = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "team", label: "Team Members", icon: Users },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const integrations = [
  { id: "twilio", name: "Twilio", description: "Voice and SMS provider", status: "connected", icon: PhoneIcon },
  { id: "salesforce", name: "Salesforce", description: "CRM integration", status: "available", icon: Globe },
  { id: "hubspot", name: "HubSpot", description: "Marketing automation", status: "available", icon: Mail },
  { id: "google", name: "Google Calendar", description: "Calendar sync", status: "connected", icon: Globe },
];

export default function Settings() {
  const { canAccessSettingsTab, getAccessibleSettingsTabs } = usePermissions();
  const { organization, updateOrganization } = useOrganization();
  const accessibleTabs = getAccessibleSettingsTabs(allTabs);
  const [activeTab, setActiveTab] = useState(accessibleTabs[0]?.id || "notifications");
  const [orgName, setOrgName] = useState("");
  const [orgIndustry, setOrgIndustry] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [saving, setSaving] = useState(false);

  // Populate org fields when organization loads
  useEffect(() => {
    if (organization) {
      setOrgName(organization.name || "");
      setOrgIndustry(organization.industry || "");
      setOrgWebsite(organization.website || "");
    }
  }, [organization]);

  const isTabRestricted = (tabId: string) => !canAccessSettingsTab(tabId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization, team, and integrations.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <nav className="lg:w-64 space-y-1">
          {allTabs.map((tab) => {
            const restricted = isTabRestricted(tab.id);
            
            if (restricted) {
              return (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <div
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                      <Lock className="h-3 w-3 ml-auto" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>You don't have permission to access this section</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "organization" && canAccessSettingsTab("organization") && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-6">Organization Profile</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary-muted text-2xl font-bold text-primary">
                      {organization?.name?.slice(0, 2).toUpperCase() || "CO"}
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input 
                        id="company" 
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input 
                        id="industry" 
                        value={orgIndustry}
                        onChange={(e) => setOrgIndustry(e.target.value)}
                        placeholder="Technology, Healthcare, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        value={orgWebsite}
                        onChange={(e) => setOrgWebsite(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="America/New_York (EST)" />
                    </div>
                  </div>
                  <Button 
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        await updateOrganization({
                          name: orgName,
                          industry: orgIndustry || null,
                          website: orgWebsite || null,
                        });
                        toast.success("Organization updated");
                      } catch (error) {
                        toast.error("Failed to update organization");
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">SSO Integration</div>
                        <div className="text-sm text-muted-foreground">Enable single sign-on</div>
                      </div>
                    </div>
                    <Badge variant="info">Enterprise</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && canAccessSettingsTab("team") && (
            <TeamManagement />
          )}

          {activeTab === "integrations" && canAccessSettingsTab("integrations") && (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between rounded-xl border bg-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <integration.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">{integration.name}</div>
                      <div className="text-sm text-muted-foreground">{integration.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={integration.status === "connected" ? "success" : "secondary"}>
                      {integration.status}
                    </Badge>
                    <Button variant={integration.status === "connected" ? "outline" : "default"} size="sm">
                      {integration.status === "connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "api" && canAccessSettingsTab("api") && (
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-6">API Keys</h3>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Production Key</div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                      cf_live_••••••••••••••••••••••••
                    </code>
                    <Button variant="outline" size="sm">Copy</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last used: 2 hours ago</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Test Key</div>
                    <Badge variant="warning">Test Mode</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                      cf_test_••••••••••••••••••••••••
                    </code>
                    <Button variant="outline" size="sm">Copy</Button>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">For development use only</p>
                </div>
                <Button variant="outline">Create New Key</Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && canAccessSettingsTab("notifications") && (
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Campaign Completed</div>
                    <div className="text-sm text-muted-foreground">Get notified when a campaign finishes</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Summary</div>
                    <div className="text-sm text-muted-foreground">Receive a daily performance report</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Agent Errors</div>
                    <div className="text-sm text-muted-foreground">Alert when an agent encounters issues</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">New Callbacks</div>
                    <div className="text-sm text-muted-foreground">Notify when callbacks are scheduled</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && canAccessSettingsTab("billing") && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">Business Plan</p>
                  </div>
                  <Badge variant="info">$299/month</Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-2xl font-bold">50,000</div>
                    <div className="text-sm text-muted-foreground">Calls included</div>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-2xl font-bold">12,847</div>
                    <div className="text-sm text-muted-foreground">Calls used</div>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-2xl font-bold">37,153</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button>Upgrade Plan</Button>
                  <Button variant="outline">View Invoices</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
