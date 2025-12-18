import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Building2, ArrowRight, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const orgSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  industry: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [step, setStep] = useState<"choice" | "create" | "join">(inviteToken ? "join" : "choice");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateOrganization = async () => {
    // Validate form
    const result = orgSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_organization_with_admin', {
        org_name: formData.name,
        org_industry: formData.industry || null,
        org_website: formData.website || null,
      });

      if (error) throw error;

      toast.success("Organization created! You're now the Super Admin.");
      navigate("/");
    } catch (error: any) {
      console.error("Error creating organization:", error);
      toast.error(error.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!inviteToken) {
      toast.error("Invalid invite link");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('accept_organization_invite', {
        invite_token: inviteToken,
      });

      if (error) throw error;

      toast.success("Welcome to the team!");
      navigate("/");
    } catch (error: any) {
      console.error("Error accepting invite:", error);
      toast.error(error.message || "Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {step === "choice" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to CallFlow</h1>
              <p className="text-muted-foreground">
                Let's get you set up. Are you creating a new company or joining an existing one?
              </p>
            </div>

            <div className="grid gap-4">
              <Card 
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => setStep("create")}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Create New Company</CardTitle>
                    <CardDescription>
                      Set up your organization and become the admin
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => setStep("join")}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/50">
                    <Users className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Join Existing Company</CardTitle>
                    <CardDescription>
                      I have an invite link from my team
                    </CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
              </Card>
            </div>
          </div>
        )}

        {step === "create" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Company</CardTitle>
              <CardDescription>
                Set up your organization. You'll be the Super Admin with full access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Acme Inc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="Technology, Healthcare, etc."
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
                {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("choice")} disabled={loading}>
                  Back
                </Button>
                <Button onClick={handleCreateOrganization} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Company"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "join" && (
          <Card>
            <CardHeader>
              <CardTitle>Join Your Team</CardTitle>
              <CardDescription>
                {inviteToken 
                  ? "You've been invited to join a team. Click below to accept."
                  : "Enter the invite link you received from your admin."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inviteToken ? (
                <div className="text-center py-4">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Ready to join your team!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Invite Link</Label>
                  <Input
                    placeholder="Paste your invite link here"
                    onChange={(e) => {
                      // Extract token from URL if full URL is pasted
                      const url = e.target.value;
                      const token = url.includes("invite=") 
                        ? new URL(url).searchParams.get("invite")
                        : url;
                      if (token) {
                        window.location.href = `/onboarding?invite=${token}`;
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ask your team admin to send you an invite link
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("choice")} disabled={loading}>
                  Back
                </Button>
                {inviteToken && (
                  <Button onClick={handleAcceptInvite} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Accept Invite"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
