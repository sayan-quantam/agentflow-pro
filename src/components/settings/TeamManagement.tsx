import { useState, useEffect } from "react";
import { ChevronRight, UserPlus, Loader2, Copy, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email");

interface Invite {
  id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

// Mock team members - in real app, fetch from profiles table
const teamMembers = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "Super Admin", status: "active" },
];

export function TeamManagement() {
  const { organization, createInvite, fetchInvites, deleteInvite } = useOrganization();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "manager" | "agent">("agent");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    loadInvites();
  }, [organization]);

  const loadInvites = async () => {
    const data = await fetchInvites();
    setInvites(data);
  };

  const handleInvite = async () => {
    // Validate email
    const result = emailSchema.safeParse(inviteEmail);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }
    setEmailError("");

    setLoading(true);
    try {
      const invite = await createInvite(inviteEmail, inviteRole);
      
      // Generate invite link
      const inviteLink = `${window.location.origin}/invite?token=${invite.token}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(inviteLink);
      
      toast.success("Invite created! Link copied to clipboard.");
      setDialogOpen(false);
      setInviteEmail("");
      setInviteRole("agent");
      loadInvites();
    } catch (error: any) {
      console.error("Error creating invite:", error);
      toast.error(error.message || "Failed to create invite");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = async (token: string) => {
    const inviteLink = `${window.location.origin}/invite?token=${token}`;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
  };

  const handleDeleteInvite = async (inviteId: string) => {
    try {
      await deleteInvite(inviteId);
      toast.success("Invite cancelled");
      loadInvites();
    } catch (error) {
      toast.error("Failed to cancel invite");
    }
  };

  const pendingInvites = invites.filter(i => !i.accepted_at && new Date(i.expires_at) > new Date());

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h3 className="font-semibold">Team Members</h3>
          <p className="text-sm text-muted-foreground">Manage your team and permissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invite link to add a new member to your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full access except billing</SelectItem>
                    <SelectItem value="manager">Manager - Manage campaigns & team</SelectItem>
                    <SelectItem value="agent">Agent - Basic access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Invite...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Create Invite Link
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-muted-foreground">Pending Invites</p>
          </div>
          <div className="divide-y">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{invite.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Expires {new Date(invite.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Pending</Badge>
                  <Badge variant="secondary" className="capitalize">{invite.role}</Badge>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleCopyInviteLink(invite.token)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleDeleteInvite(invite.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="divide-y">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={member.status === "active" ? "success" : "warning"}>
                {member.status}
              </Badge>
              <Badge variant="secondary">{member.role}</Badge>
              <Button variant="ghost" size="icon-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
