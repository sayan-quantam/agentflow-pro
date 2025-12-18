import { Plus, Upload, Bot, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: Plus,
    label: "New Campaign",
    description: "Create a calling campaign",
    variant: "default" as const,
  },
  {
    icon: Bot,
    label: "Create Agent",
    description: "Build an AI agent",
    variant: "outline" as const,
  },
  {
    icon: Upload,
    label: "Import Contacts",
    description: "Upload CSV file",
    variant: "outline" as const,
  },
  {
    icon: Phone,
    label: "Test Call",
    description: "Try an agent now",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto justify-start gap-3 px-4 py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <action.icon className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
