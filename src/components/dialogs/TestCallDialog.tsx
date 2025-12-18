import { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, MicOff, Bot, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TestCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedAgent?: string;
}

const mockAgents = [
  { id: "1", name: "Sales Assistant Pro" },
  { id: "2", name: "Customer Support Bot" },
  { id: "3", name: "Lead Qualifier" },
  { id: "4", name: "Survey Agent" },
];

type CallState = "idle" | "connecting" | "active" | "ended";

export function TestCallDialog({ open, onOpenChange, preselectedAgent }: TestCallDialogProps) {
  const [agent, setAgent] = useState(preselectedAgent || "");
  const [phoneNumber, setPhoneNumber] = useState("+1 555-000-0000");
  const [callState, setCallState] = useState<CallState>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setCallState("idle");
      setCallDuration(0);
      setMuted(false);
      setTranscript([]);
    }
  }, [open]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "active") {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Simulate call conversation
  useEffect(() => {
    if (callState === "active") {
      const messages = [
        { delay: 1000, text: "Agent: Hello! Thank you for calling. How can I help you today?" },
        { delay: 4000, text: "User: Hi, I'm interested in learning more about your services." },
        { delay: 7000, text: "Agent: I'd be happy to tell you about our offerings. We provide AI-powered calling solutions..." },
        { delay: 12000, text: "User: That sounds interesting. Can you tell me about pricing?" },
        { delay: 15000, text: "Agent: Absolutely! Our plans start at $99/month for small teams..." },
      ];

      const timeouts = messages.map(msg => 
        setTimeout(() => {
          if (callState === "active") {
            setTranscript(prev => [...prev, msg.text]);
          }
        }, msg.delay)
      );

      return () => timeouts.forEach(clearTimeout);
    }
  }, [callState]);

  const startCall = async () => {
    if (!agent) return;
    
    setCallState("connecting");
    setTranscript([]);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCallState("active");
  };

  const endCall = () => {
    setCallState("ended");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Test Call
          </DialogTitle>
          <DialogDescription>
            Simulate a call with your AI agent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {callState === "idle" && (
            <>
              <div className="space-y-2">
                <Label>Select Agent</Label>
                <Select value={agent} onValueChange={setAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAgents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Test Phone Number</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 555-000-0000"
                />
                <p className="text-xs text-muted-foreground">
                  This is a simulated call - no real calls will be made
                </p>
              </div>
              <Button onClick={startCall} disabled={!agent} className="w-full">
                <Phone className="h-4 w-4" />
                Start Test Call
              </Button>
            </>
          )}

          {callState === "connecting" && (
            <div className="py-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="font-medium">Connecting...</p>
              <p className="text-sm text-muted-foreground">
                Dialing {phoneNumber}
              </p>
            </div>
          )}

          {(callState === "active" || callState === "ended") && (
            <>
              {/* Call Header */}
              <div className={cn(
                "rounded-lg p-4 text-center",
                callState === "active" ? "bg-success/10" : "bg-muted"
              )}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Bot className="h-5 w-5" />
                  <span className="font-medium">
                    {mockAgents.find(a => a.id === agent)?.name}
                  </span>
                </div>
                <div className={cn(
                  "text-2xl font-mono font-bold",
                  callState === "active" ? "text-success" : "text-muted-foreground"
                )}>
                  {formatDuration(callDuration)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {callState === "active" ? "Call in progress" : "Call ended"}
                </p>
              </div>

              {/* Transcript */}
              <div className="rounded-lg border p-3 h-[150px] overflow-auto space-y-2">
                <p className="text-xs text-muted-foreground font-medium mb-2">Live Transcript</p>
                {transcript.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Waiting for conversation...</p>
                ) : (
                  transcript.map((line, i) => (
                    <p key={i} className={cn(
                      "text-sm",
                      line.startsWith("Agent:") ? "text-primary" : "text-foreground"
                    )}>
                      {line}
                    </p>
                  ))
                )}
              </div>

              {/* Controls */}
              {callState === "active" && (
                <div className="flex justify-center gap-4">
                  <Button
                    variant={muted ? "destructive" : "outline"}
                    size="icon"
                    onClick={() => setMuted(!muted)}
                  >
                    {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button variant="destructive" onClick={endCall}>
                    <PhoneOff className="h-4 w-4" />
                    End Call
                  </Button>
                </div>
              )}

              {callState === "ended" && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCallState("idle")}>
                    New Test
                  </Button>
                  <Button className="flex-1" onClick={() => onOpenChange(false)}>
                    Done
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
