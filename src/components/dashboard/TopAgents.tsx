import { Bot, TrendingUp, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const agents = [
  {
    id: 1,
    name: "Sales Agent Pro",
    type: "Outbound",
    calls: 2847,
    successRate: 94.2,
    trend: "up",
  },
  {
    id: 2,
    name: "Appointment Setter",
    type: "Outbound",
    calls: 2103,
    successRate: 89.7,
    trend: "up",
  },
  {
    id: 3,
    name: "Customer Support",
    type: "Inbound",
    calls: 1892,
    successRate: 96.1,
    trend: "up",
  },
  {
    id: 4,
    name: "Lead Qualifier",
    type: "Outbound",
    calls: 1654,
    successRate: 82.3,
    trend: "down",
  },
  {
    id: 5,
    name: "Follow-up Agent",
    type: "Outbound",
    calls: 1421,
    successRate: 91.5,
    trend: "up",
  },
];

export function TopAgents() {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold">Top Performing Agents</h3>
        <p className="text-sm text-muted-foreground">By success rate this month</p>
      </div>
      <div className="divide-y">
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted text-sm font-semibold text-primary">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{agent.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{agent.calls.toLocaleString()} calls</span>
              </div>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-semibold",
                  agent.successRate >= 90 ? "text-success" : "text-warning"
                )}
              >
                <TrendingUp className={cn("h-4 w-4", agent.trend === "down" && "rotate-180")} />
                {agent.successRate}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
