import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  Pause
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { TopAgents } from "@/components/dashboard/TopAgents";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your AI calling agents and campaign performance in real-time.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Calls"
          value="12,847"
          change="+12.5%"
          trend="up"
          icon={Phone}
          description="This month"
        />
        <MetricCard
          title="Success Rate"
          value="87.3%"
          change="+2.1%"
          trend="up"
          icon={CheckCircle2}
          description="Avg completion"
          variant="success"
        />
        <MetricCard
          title="Active Campaigns"
          value="24"
          change="-3"
          trend="down"
          icon={Zap}
          description="Running now"
          variant="info"
        />
        <MetricCard
          title="Agent Utilization"
          value="78%"
          change="+5.2%"
          trend="up"
          icon={Users}
          description="Avg efficiency"
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart />
          <ActivityFeed />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <QuickActions />
          <TopAgents />
        </div>
      </div>
    </div>
  );
}
