import { 
  TrendingUp, 
  TrendingDown,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";

const callVolumeData = [
  { date: "Dec 1", outbound: 420, inbound: 180 },
  { date: "Dec 2", outbound: 380, inbound: 220 },
  { date: "Dec 3", outbound: 510, inbound: 190 },
  { date: "Dec 4", outbound: 480, inbound: 250 },
  { date: "Dec 5", outbound: 590, inbound: 300 },
  { date: "Dec 6", outbound: 320, inbound: 120 },
  { date: "Dec 7", outbound: 280, inbound: 100 },
  { date: "Dec 8", outbound: 450, inbound: 210 },
  { date: "Dec 9", outbound: 520, inbound: 280 },
  { date: "Dec 10", outbound: 600, inbound: 320 },
  { date: "Dec 11", outbound: 550, inbound: 290 },
  { date: "Dec 12", outbound: 480, inbound: 260 },
  { date: "Dec 13", outbound: 350, inbound: 140 },
  { date: "Dec 14", outbound: 310, inbound: 110 },
];

const callOutcomeData = [
  { name: "Successful", value: 68, color: "hsl(158, 64%, 52%)" },
  { name: "No Answer", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Failed", value: 8, color: "hsl(0, 84%, 60%)" },
  { name: "Busy", value: 6, color: "hsl(220, 9%, 46%)" },
];

const hourlyData = [
  { hour: "6AM", calls: 12 },
  { hour: "7AM", calls: 45 },
  { hour: "8AM", calls: 89 },
  { hour: "9AM", calls: 156 },
  { hour: "10AM", calls: 178 },
  { hour: "11AM", calls: 165 },
  { hour: "12PM", calls: 98 },
  { hour: "1PM", calls: 134 },
  { hour: "2PM", calls: 167 },
  { hour: "3PM", calls: 189 },
  { hour: "4PM", calls: 176 },
  { hour: "5PM", calls: 145 },
  { hour: "6PM", calls: 67 },
  { hour: "7PM", calls: 23 },
];

const metrics = [
  {
    title: "Total Calls",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Phone,
    description: "vs last month",
  },
  {
    title: "Avg Duration",
    value: "4:32",
    change: "+0:18",
    trend: "up",
    icon: Clock,
    description: "minutes",
  },
  {
    title: "Success Rate",
    value: "87.3%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle2,
    description: "completion rate",
  },
  {
    title: "Failed Calls",
    value: "1,027",
    change: "-5.2%",
    trend: "down",
    icon: XCircle,
    description: "vs last month",
  },
];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track performance metrics and gain insights from your calls.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4" />
            Last 14 days
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="rounded-xl border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
              </div>
              <div className="rounded-lg bg-muted p-2.5">
                <metric.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "flex items-center gap-0.5 font-medium",
                  metric.trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {metric.change}
              </span>
              <span className="text-muted-foreground">{metric.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Call Volume Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-semibold">Call Volume Trends</h3>
            <p className="text-sm text-muted-foreground">Daily call distribution over time</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callVolumeData}>
                <defs>
                  <linearGradient id="colorOutboundAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInboundAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="date" stroke="hsl(220, 9%, 46%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="outbound" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fillOpacity={1} fill="url(#colorOutboundAnalytics)" />
                <Area type="monotone" dataKey="inbound" stroke="hsl(158, 64%, 52%)" strokeWidth={2} fillOpacity={1} fill="url(#colorInboundAnalytics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Call Outcomes Pie Chart */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-semibold">Call Outcomes</h3>
            <p className="text-sm text-muted-foreground">Distribution by result</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={callOutcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {callOutcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {callOutcomeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Peak Hours */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-semibold">Peak Calling Hours</h3>
            <p className="text-sm text-muted-foreground">Call volume by hour of day</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="hour" stroke="hsl(220, 9%, 46%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="calls" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Call Type Breakdown */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-semibold">Call Type Breakdown</h3>
            <p className="text-sm text-muted-foreground">Inbound vs Outbound distribution</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneOutgoing className="h-4 w-4 text-primary" />
                  <span className="font-medium">Outbound Calls</span>
                </div>
                <span className="text-2xl font-bold">9,847</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[77%] rounded-full bg-primary" />
              </div>
              <p className="text-sm text-muted-foreground">77% of total volume</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneIncoming className="h-4 w-4 text-success" />
                  <span className="font-medium">Inbound Calls</span>
                </div>
                <span className="text-2xl font-bold">3,000</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[23%] rounded-full bg-success" />
              </div>
              <p className="text-sm text-muted-foreground">23% of total volume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
