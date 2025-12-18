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
    default: "bg-primary/10 text-primary shadow-[0_0_15px_hsl(217_91%_60%/0.2)]",
    success: "bg-success/10 text-success shadow-[0_0_15px_hsl(160_84%_45%/0.2)]",
    warning: "bg-warning/10 text-warning shadow-[0_0_15px_hsl(38_92%_55%/0.2)]",
    info: "bg-info/10 text-info shadow-[0_0_15px_hsl(200_95%_55%/0.2)]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 group",
        "hover:border-border hover:shadow-lg hover:-translate-y-1",
        "border-l-4",
        variantStyles[variant]
      )}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl",
          variant === "default" && "bg-primary/10",
          variant === "success" && "bg-success/10",
          variant === "warning" && "bg-warning/10",
          variant === "info" && "bg-info/10"
        )} />
      </div>
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={cn("rounded-xl p-3 transition-transform duration-200 group-hover:scale-110", iconBgStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="relative mt-4 flex items-center gap-2 text-sm">
        <span
          className={cn(
            "flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full",
            trend === "up" 
              ? "text-success bg-success/10" 
              : "text-destructive bg-destructive/10"
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
