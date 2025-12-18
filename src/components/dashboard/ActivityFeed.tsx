import { 
  PhoneIncoming, 
  PhoneOutgoing, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MoreHorizontal 
} from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { id: 1, type: "outbound", status: "success", agent: "Sales Agent Pro", contact: "John Smith", phone: "+1 (555) 123-4567", duration: "3:42", time: "2 min ago" },
  { id: 2, type: "inbound", status: "success", agent: "Support Bot", contact: "Sarah Johnson", phone: "+1 (555) 987-6543", duration: "5:18", time: "5 min ago" },
  { id: 3, type: "outbound", status: "failed", agent: "Appointment Setter", contact: "Mike Williams", phone: "+1 (555) 456-7890", duration: "0:12", time: "8 min ago" },
  { id: 4, type: "outbound", status: "pending", agent: "Lead Qualifier", contact: "Emily Davis", phone: "+1 (555) 321-0987", duration: "-", time: "10 min ago" },
  { id: 5, type: "inbound", status: "success", agent: "Customer Service", contact: "Robert Brown", phone: "+1 (555) 654-3210", duration: "2:55", time: "12 min ago" },
];

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", dot: "bg-success shadow-[0_0_6px_hsl(160_84%_45%/0.5)]" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", dot: "bg-destructive shadow-[0_0_6px_hsl(0_72%_55%/0.5)]" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", dot: "bg-warning shadow-[0_0_6px_hsl(38_92%_55%/0.5)] animate-pulse" },
};

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div>
          <h3 className="font-semibold text-lg">Real-time Activity</h3>
          <p className="text-sm text-muted-foreground">Live call status updates</p>
        </div>
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="divide-y divide-border/50">
        {activities.map((activity) => {
          const status = statusConfig[activity.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          return (
            <div key={activity.id} className="flex items-center gap-4 px-6 py-4 transition-all hover:bg-muted/30 group">
              <div className={cn("rounded-xl p-2.5 transition-transform group-hover:scale-110", status.bg)}>
                {activity.type === "inbound" ? <PhoneIncoming className={cn("h-4 w-4", status.color)} /> : <PhoneOutgoing className={cn("h-4 w-4", status.color)} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{activity.contact}</span>
                  <span className={cn("h-2 w-2 rounded-full", status.dot)} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{activity.agent}</span>
                  <span>•</span>
                  <span>{activity.phone}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <StatusIcon className={cn("h-4 w-4", status.color)} />
                  {activity.duration}
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
