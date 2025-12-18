import { useState } from "react";
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
  Phone as PhoneIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "team", label: "Team Members", icon: Users },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const teamMembers = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "Admin", status: "active" },
  { id: 2, name: "Sarah Smith", email: "sarah@company.com", role: "Manager", status: "active" },
  { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "Agent", status: "active" },
  { id: 4, name: "Emily Davis", email: "emily@company.com", role: "Agent", status: "pending" },
];

const integrations = [
  { id: "twilio", name: "Twilio", description: "Voice and SMS provider", status: "connected", icon: PhoneIcon },
  { id: "salesforce", name: "Salesforce", description: "CRM integration", status: "available", icon: Globe },
  { id: "hubspot", name: "HubSpot", description: "Marketing automation", status: "available", icon: Mail },
  { id: "google", name: "Google Calendar", description: "Calendar sync", status: "connected", icon: Globe },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("organization");

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
          {tabs.map((tab) => (
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
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "organization" && (
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-6">Organization Profile</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary-muted text-2xl font-bold text-primary">
                      CF
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" defaultValue="CallFlow Technologies" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" defaultValue="Technology" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://callflow.io" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="America/New_York (EST)" />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
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

          {activeTab === "team" && (
            <div className="rounded-xl border bg-card">
              <div className="flex items-center justify-between border-b p-6">
                <div>
                  <h3 className="font-semibold">Team Members</h3>
                  <p className="text-sm text-muted-foreground">Manage your team and permissions</p>
                </div>
                <Button>Invite Member</Button>
              </div>
              <div className="divide-y">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={member.status === "active" ? "success" : "warning"}>
                        {member.status}
                      </Badge>
                      <Badge variant="secondary">{member.role}</Badge>
                      <Button variant="ghost" size="icon-sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
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

          {activeTab === "api" && (
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

          {activeTab === "notifications" && (
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

          {activeTab === "billing" && (
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
