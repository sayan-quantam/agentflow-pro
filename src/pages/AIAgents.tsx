import { useState } from "react";
import { 
  Bot, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Phone,
  MessageSquare,
  Calendar,
  TrendingUp,
  Play,
  Settings,
  Copy,
  Trash2,
  Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CreateAgentDialog } from "@/components/dialogs/CreateAgentDialog";
import { TestCallDialog } from "@/components/dialogs/TestCallDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";

const initialAgents = [
  {
    id: 1,
    name: "Sales Agent Pro",
    description: "High-conversion outbound sales calls with persuasive scripting",
    type: "Outbound",
    status: "active",
    calls: 2847,
    successRate: 94.2,
    voice: "Professional Male",
    language: "English",
    template: "Sales",
  },
  {
    id: 2,
    name: "Appointment Setter",
    description: "Schedules appointments and confirms bookings with customers",
    type: "Outbound",
    status: "active",
    calls: 2103,
    successRate: 89.7,
    voice: "Friendly Female",
    language: "English",
    template: "Scheduling",
  },
  {
    id: 3,
    name: "Customer Support Bot",
    description: "Handles inbound support queries and provides instant solutions",
    type: "Inbound",
    status: "active",
    calls: 1892,
    successRate: 96.1,
    voice: "Calm Female",
    language: "English, Spanish",
    template: "Support",
  },
  {
    id: 4,
    name: "Lead Qualifier",
    description: "Qualifies leads based on budget, timeline and authority",
    type: "Outbound",
    status: "paused",
    calls: 1654,
    successRate: 82.3,
    voice: "Energetic Male",
    language: "English",
    template: "Qualification",
  },
  {
    id: 5,
    name: "Follow-up Agent",
    description: "Nurtures leads with personalized follow-up conversations",
    type: "Outbound",
    status: "active",
    calls: 1421,
    successRate: 91.5,
    voice: "Professional Female",
    language: "English",
    template: "Follow-up",
  },
  {
    id: 6,
    name: "Feedback Collector",
    description: "Gathers customer feedback and satisfaction scores post-service",
    type: "Outbound",
    status: "inactive",
    calls: 892,
    successRate: 88.9,
    voice: "Warm Female",
    language: "English",
    template: "Feedback",
  },
];

const templates = [
  { name: "Appointment Reminder", icon: Calendar, color: "bg-info-muted text-info", type: "outbound", description: "Remind customers about upcoming appointments" },
  { name: "Lead Qualification", icon: TrendingUp, color: "bg-success-muted text-success", type: "outbound", description: "Qualify leads based on criteria" },
  { name: "Customer Feedback", icon: MessageSquare, color: "bg-warning-muted text-warning", type: "outbound", description: "Collect customer satisfaction data" },
  { name: "Sales Outreach", icon: Phone, color: "bg-primary-muted text-primary", type: "outbound", description: "Conduct sales calls to prospects" },
];

export default function AIAgents() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [agents, setAgents] = useState(initialAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [testCallDialogOpen, setTestCallDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [templateDefaults, setTemplateDefaults] = useState<{ name: string; description: string; type: string } | null>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setTemplateDefaults(null);
    setCreateDialogOpen(true);
  };

  const handleTemplateClick = (template: typeof templates[0]) => {
    setSelectedAgent(null);
    setTemplateDefaults({
      name: template.name,
      description: template.description,
      type: template.type,
    });
    setCreateDialogOpen(true);
    toast.info(`Creating agent from "${template.name}" template`);
  };

  const handleEditAgent = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setTemplateDefaults(null);
    setCreateDialogOpen(true);
  };

  const handleTestAgent = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setTestCallDialogOpen(true);
  };

  const handleCopyAgent = (agent: typeof agents[0]) => {
    const configText = JSON.stringify({
      name: agent.name,
      type: agent.type,
      voice: agent.voice,
      language: agent.language,
    }, null, 2);
    navigator.clipboard.writeText(configText);
    toast.success(`Agent config copied to clipboard`);
  };

  const handleDuplicateAgent = (agent: typeof agents[0]) => {
    const newAgent = {
      ...agent,
      id: Date.now(),
      name: `${agent.name} (Copy)`,
      calls: 0,
    };
    setAgents(prev => [...prev, newAgent]);
    toast.success(`Agent "${agent.name}" duplicated`);
  };

  const handleToggleStatus = (agent: typeof agents[0]) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agent.id) {
        const newStatus = a.status === "active" ? "paused" : "active";
        toast.success(`Agent "${a.name}" ${newStatus === "active" ? "activated" : "paused"}`);
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  const handleDeleteAgent = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAgent = () => {
    if (selectedAgent) {
      setAgents(prev => prev.filter(a => a.id !== selectedAgent.id));
      toast.success(`Agent "${selectedAgent.name}" deleted`);
      setDeleteDialogOpen(false);
      setSelectedAgent(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">
            Create and manage your AI calling agents with custom personalities.
          </p>
        </div>
        <Button onClick={handleCreateAgent}>
          <Plus className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Templates Section */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Quick Start Templates</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleTemplateClick(template)}
              className="flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:border-primary hover:shadow-sm"
            >
              <div className={cn("rounded-lg p-2.5", template.color)}>
                <template.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-muted-foreground">Use template</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search agents..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paused")}>
                Paused Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            List
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{agent.name}</h4>
                  <Badge variant={agent.status === "active" ? "success" : agent.status === "paused" ? "warning" : "secondary"}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-accent group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicateAgent(agent)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleStatus(agent)}>
                    {agent.status === "active" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteAgent(agent)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {agent.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type</span>
                <p className="font-medium">{agent.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Voice</span>
                <p className="font-medium">{agent.voice}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Calls</span>
                <p className="font-medium">{agent.calls.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Success</span>
                <p className={cn("font-medium", agent.successRate >= 90 ? "text-success" : "text-warning")}>
                  {agent.successRate}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleTestAgent(agent)}
              >
                <Play className="h-4 w-4" />
                Test
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleEditAgent(agent)}
              >
                <Settings className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => handleCopyAgent(agent)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-1">No agents found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Dialogs */}
      <CreateAgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        editAgent={selectedAgent ? {
          id: selectedAgent.id,
          name: selectedAgent.name,
          description: selectedAgent.description,
          type: selectedAgent.type.toLowerCase(),
          voice: selectedAgent.voice.toLowerCase().replace(' ', '-'),
          language: selectedAgent.language.includes(',') ? 'en-US' : 'en-US',
        } : null}
        templateDefaults={templateDefaults}
      />

      <TestCallDialog
        open={testCallDialogOpen}
        onOpenChange={setTestCallDialogOpen}
        preselectedAgent={selectedAgent?.id.toString()}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Agent"
        description={`Are you sure you want to delete "${selectedAgent?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDeleteAgent}
        variant="destructive"
      />
    </div>
  );
}
