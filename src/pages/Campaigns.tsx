import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  StopCircle,
  BarChart2,
  Calendar,
  Users,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const campaigns = [
  {
    id: 1,
    name: "Q4 Sales Outreach",
    agent: "Sales Agent Pro",
    status: "active",
    type: "Outbound",
    progress: 68,
    totalCalls: 5000,
    completed: 3400,
    connected: 2890,
    successful: 2312,
    failed: 578,
    startDate: "Dec 1, 2024",
    endDate: "Dec 31, 2024",
  },
  {
    id: 2,
    name: "Appointment Reminders - Week 51",
    agent: "Appointment Setter",
    status: "active",
    type: "Outbound",
    progress: 45,
    totalCalls: 1200,
    completed: 540,
    connected: 498,
    successful: 456,
    failed: 42,
    startDate: "Dec 16, 2024",
    endDate: "Dec 22, 2024",
  },
  {
    id: 3,
    name: "Customer Feedback Survey",
    agent: "Feedback Collector",
    status: "paused",
    type: "Outbound",
    progress: 32,
    totalCalls: 800,
    completed: 256,
    connected: 224,
    successful: 201,
    failed: 23,
    startDate: "Dec 10, 2024",
    endDate: "Dec 20, 2024",
  },
  {
    id: 4,
    name: "Lead Qualification - Tech Sector",
    agent: "Lead Qualifier",
    status: "scheduled",
    type: "Outbound",
    progress: 0,
    totalCalls: 2500,
    completed: 0,
    connected: 0,
    successful: 0,
    failed: 0,
    startDate: "Dec 20, 2024",
    endDate: "Jan 15, 2025",
  },
  {
    id: 5,
    name: "Holiday Promotion Calls",
    agent: "Sales Agent Pro",
    status: "completed",
    type: "Outbound",
    progress: 100,
    totalCalls: 3000,
    completed: 3000,
    connected: 2670,
    successful: 2403,
    failed: 267,
    startDate: "Nov 25, 2024",
    endDate: "Dec 5, 2024",
  },
];

const statusConfig = {
  active: { variant: "active" as const, icon: Play, color: "text-success" },
  paused: { variant: "paused" as const, icon: Pause, color: "text-warning" },
  scheduled: { variant: "scheduled" as const, icon: Clock, color: "text-info" },
  completed: { variant: "completed" as const, icon: CheckCircle2, color: "text-muted-foreground" },
};

export default function Campaigns() {
  const [filter, setFilter] = useState("all");

  const filteredCampaigns = filter === "all" 
    ? campaigns 
    : campaigns.filter(c => c.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI calling campaigns.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-xl border p-4 text-left transition-all",
            filter === "all" ? "border-primary bg-primary-muted" : "hover:border-primary"
          )}
        >
          <div className="text-2xl font-bold">{campaigns.length}</div>
          <div className="text-sm text-muted-foreground">Total Campaigns</div>
        </button>
        <button
          onClick={() => setFilter("active")}
          className={cn(
            "rounded-xl border p-4 text-left transition-all",
            filter === "active" ? "border-success bg-success-muted" : "hover:border-success"
          )}
        >
          <div className="text-2xl font-bold text-success">
            {campaigns.filter(c => c.status === "active").length}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </button>
        <button
          onClick={() => setFilter("paused")}
          className={cn(
            "rounded-xl border p-4 text-left transition-all",
            filter === "paused" ? "border-warning bg-warning-muted" : "hover:border-warning"
          )}
        >
          <div className="text-2xl font-bold text-warning">
            {campaigns.filter(c => c.status === "paused").length}
          </div>
          <div className="text-sm text-muted-foreground">Paused</div>
        </button>
        <button
          onClick={() => setFilter("scheduled")}
          className={cn(
            "rounded-xl border p-4 text-left transition-all",
            filter === "scheduled" ? "border-info bg-info-muted" : "hover:border-info"
          )}
        >
          <div className="text-2xl font-bold text-info">
            {campaigns.filter(c => c.status === "scheduled").length}
          </div>
          <div className="text-sm text-muted-foreground">Scheduled</div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => {
          const status = statusConfig[campaign.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          
          return (
            <div
              key={campaign.id}
              className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Campaign Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold truncate">{campaign.name}</h3>
                    <Badge variant={status.variant}>
                      <StatusIcon className={cn("h-3 w-3 mr-1", status.color)} />
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {campaign.agent}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {campaign.startDate} - {campaign.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {campaign.totalCalls.toLocaleString()} calls
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="lg:w-48">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-success">
                      {campaign.successful.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-destructive">
                      {campaign.failed.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {campaign.status === "active" && (
                    <Button variant="outline" size="icon-sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {campaign.status === "paused" && (
                    <Button variant="outline" size="icon-sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon-sm">
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
