import { useState } from "react";
import { CalendarPlus, Clock, Users, Bot } from "lucide-react";
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

interface ScheduleEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

const eventTypes = [
  { id: "campaign", label: "Campaign", icon: Bot, description: "Schedule an automated campaign" },
  { id: "appointment", label: "Appointment", icon: Clock, description: "Book a specific time slot" },
  { id: "callback", label: "Callback", icon: Users, description: "Schedule a follow-up call" },
];

const mockContacts = [
  { id: "1", name: "John Smith", company: "Acme Inc" },
  { id: "2", name: "Sarah Johnson", company: "Tech Corp" },
  { id: "3", name: "Mike Wilson", company: "Startup.io" },
];

const mockAgents = [
  { id: "1", name: "Sales Assistant Pro" },
  { id: "2", name: "Customer Support Bot" },
  { id: "3", name: "Lead Qualifier" },
];

export function ScheduleEventDialog({ open, onOpenChange, defaultDate }: ScheduleEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "appointment",
    date: defaultDate ? defaultDate.toISOString().split('T')[0] : "",
    time: "09:00",
    duration: "30",
    contact: "",
    agent: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Event "${formData.title}" scheduled successfully`);
    
    setLoading(false);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: "",
      type: "appointment",
      date: "",
      time: "09:00",
      duration: "30",
      contact: "",
      agent: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-primary" />
            Schedule Event
          </DialogTitle>
          <DialogDescription>
            Create a new calendar event
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="e.g., Follow-up call with John"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Event Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {eventTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                    formData.type === type.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/50"
                  }`}
                >
                  <type.icon className="h-5 w-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">{type.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select 
              value={formData.duration} 
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Contact (Optional)</Label>
              <Select 
                value={formData.contact} 
                onValueChange={(value) => setFormData({ ...formData, contact: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {mockContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Agent (Optional)</Label>
              <Select 
                value={formData.agent} 
                onValueChange={(value) => setFormData({ ...formData, agent: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {mockAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
