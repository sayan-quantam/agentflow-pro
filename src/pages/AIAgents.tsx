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
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const agents = [
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
  { name: "Appointment Reminder", icon: Calendar, color: "bg-info-muted text-info" },
  { name: "Lead Qualification", icon: TrendingUp, color: "bg-success-muted text-success" },
  { name: "Customer Feedback", icon: MessageSquare, color: "bg-warning-muted text-warning" },
  { name: "Sales Outreach", icon: Phone, color: "bg-primary-muted text-primary" },
];

export default function AIAgents() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        <Button>
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
            <Input placeholder="Search agents..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
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
        {agents.map((agent) => (
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
              <button className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-accent group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </button>
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
              <Button variant="outline" size="sm" className="flex-1">
                <Play className="h-4 w-4" />
                Test
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
