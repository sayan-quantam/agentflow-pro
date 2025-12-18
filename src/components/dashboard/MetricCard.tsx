import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  description: string;
  variant?: "default" | "success" | "warning" | "info";
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  variant = "default",
}: MetricCardProps) {
  const variantStyles = {
    default: "border-l-primary",
    success: "border-l-success",
    warning: "border-l-warning",
    info: "border-l-info",
  };

  const iconBgStyles = {
    default: "bg-primary-muted text-primary",
    success: "bg-success-muted text-success",
    warning: "bg-warning-muted text-warning",
    info: "bg-info-muted text-info",
  };

  return (
    <div
      className={cn(
        "stat-card border-l-4 animate-slide-up",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={cn("rounded-lg p-2.5", iconBgStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span
          className={cn(
            "flex items-center gap-0.5 font-medium",
            trend === "up" ? "text-success" : "text-destructive"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {change}
        </span>
        <span className="text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}
