import { useState } from "react";
import { Plus, Upload, Bot, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreateCampaignDialog } from "@/components/dialogs/CreateCampaignDialog";
import { CreateAgentDialog } from "@/components/dialogs/CreateAgentDialog";
import { ImportContactsDialog } from "@/components/dialogs/ImportContactsDialog";
import { TestCallDialog } from "@/components/dialogs/TestCallDialog";

const actions = [
  {
    id: "campaign",
    icon: Plus,
    label: "New Campaign",
    description: "Create a calling campaign",
    variant: "default" as const,
  },
  {
    id: "agent",
    icon: Bot,
    label: "Create Agent",
    description: "Build an AI agent",
    variant: "outline" as const,
  },
  {
    id: "import",
    icon: Upload,
    label: "Import Contacts",
    description: "Upload CSV file",
    variant: "outline" as const,
  },
  {
    id: "call",
    icon: Phone,
    label: "Test Call",
    description: "Try an agent now",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  const navigate = useNavigate();
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [testCallDialogOpen, setTestCallDialogOpen] = useState(false);

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "campaign":
        setCampaignDialogOpen(true);
        break;
      case "agent":
        setAgentDialogOpen(true);
        break;
      case "import":
        setImportDialogOpen(true);
        break;
      case "call":
        setTestCallDialogOpen(true);
        break;
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto justify-start gap-3 px-4 py-3"
              onClick={() => handleActionClick(action.id)}
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

      {/* Dialogs */}
      <CreateCampaignDialog
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
      />
      <CreateAgentDialog
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
      />
      <ImportContactsDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
      <TestCallDialog
        open={testCallDialogOpen}
        onOpenChange={setTestCallDialogOpen}
      />
    </>
  );
}
