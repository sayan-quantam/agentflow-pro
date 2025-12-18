import { useState } from "react";
import { Megaphone, Bot, Users, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockAgents = [
  { id: "1", name: "Sales Assistant Pro" },
  { id: "2", name: "Customer Support Bot" },
  { id: "3", name: "Lead Qualifier" },
  { id: "4", name: "Survey Agent" },
];

const mockContactLists = [
  { id: "1", name: "All Contacts", count: 2847 },
  { id: "2", name: "New Leads", count: 523 },
  { id: "3", name: "Qualified Leads", count: 189 },
  { id: "4", name: "VIP Customers", count: 45 },
];

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    agent: "",
    contactList: "",
    type: "outbound",
    startDate: "",
    endDate: "",
    dailyLimit: "500",
    startTime: "09:00",
    endTime: "17:00",
  });

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }
    if (step === 2 && !formData.agent) {
      toast.error("Please select an agent");
      return;
    }
    if (step === 3 && !formData.contactList) {
      toast.error("Please select a contact list");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Campaign "${formData.name}" created successfully`);
    setLoading(false);
    onOpenChange(false);
    
    // Reset form
    setStep(1);
    setFormData({
      name: "",
      description: "",
      agent: "",
      contactList: "",
      type: "outbound",
      startDate: "",
      endDate: "",
      dailyLimit: "500",
      startTime: "09:00",
      endTime: "17:00",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Create Campaign
          </DialogTitle>
          <DialogDescription>
            Step {step} of 4 — {step === 1 ? "Basic Info" : step === 2 ? "Select Agent" : step === 3 ? "Contact List" : "Schedule"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Q4 Sales Outreach"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the campaign objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outbound">Outbound Calls</SelectItem>
                    <SelectItem value="followup">Follow-up Campaign</SelectItem>
                    <SelectItem value="survey">Survey Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Select Agent */}
          {step === 2 && (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Select AI Agent
              </Label>
              <div className="grid gap-3">
                {mockAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => setFormData({ ...formData, agent: agent.id })}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      formData.agent === agent.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Bot className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Contact List */}
          {step === 3 && (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Contact List
              </Label>
              <div className="grid gap-3">
                {mockContactLists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => setFormData({ ...formData, contactList: list.id })}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      formData.contactList === list.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Users className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{list.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{list.count.toLocaleString()} contacts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          {step === 4 && (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Campaign Schedule
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyLimit">Daily Call Limit</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  value={formData.dailyLimit}
                  onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Maximum calls per day to avoid overwhelming contacts</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
