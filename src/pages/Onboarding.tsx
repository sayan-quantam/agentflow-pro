import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Building2, ArrowRight, Users, Loader2, User, CreditCard, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const orgSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  industry: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type Plan = "starter" | "professional" | "enterprise";

const plans: { id: Plan; name: string; price: string; description: string; features: string[] }[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$29/mo",
    description: "Perfect for small teams getting started",
    features: ["Up to 5 AI agents", "1,000 calls/month", "Basic analytics", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$99/mo",
    description: "For growing businesses with more needs",
    features: ["Up to 20 AI agents", "10,000 calls/month", "Advanced analytics", "Priority support", "Custom integrations"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs",
    features: ["Unlimited AI agents", "Unlimited calls", "Dedicated support", "Custom SLA", "On-premise options"],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [step, setStep] = useState<"choice" | "company" | "profile" | "plan" | "join">(inviteToken ? "join" : "choice");
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    website: "",
  });
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    username: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan>("starter");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCompanyNext = () => {
    const result = orgSchema.safeParse(companyData);
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
    setStep("profile");
  };

  const handleProfileNext = () => {
    const result = profileSchema.safeParse(profileData);
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
    setStep("plan");
  };

  const handleCreateOrganization = async () => {
    setLoading(true);
    try {
      // Update user profile first
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            full_name: profileData.fullName,
          })
          .eq('user_id', user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }

      // Create organization
      const { data, error } = await supabase.rpc('create_organization_with_admin', {
        org_name: companyData.name,
        org_industry: companyData.industry || null,
        org_website: companyData.website || null,
      });

      if (error) throw error;

      toast.success("Organization created! Welcome to CallFlow.");
      navigate("/dashboard");
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
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error accepting invite:", error);
      toast.error(error.message || "Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndicator = () => {
    const steps = [
      { id: "company", label: "Company" },
      { id: "profile", label: "Profile" },
      { id: "plan", label: "Plan" },
    ];
    const currentIndex = steps.findIndex(s => s.id === step);
    
    if (step === "choice" || step === "join") return null;

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
              index < currentIndex ? "bg-primary text-primary-foreground" :
              index === currentIndex ? "bg-primary text-primary-foreground" :
              "bg-muted text-muted-foreground"
            )}>
              {index < currentIndex ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-0.5 w-12 mx-2",
                index < currentIndex ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {getStepIndicator()}

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
                onClick={() => setStep("company")}
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

        {step === "company" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Details
              </CardTitle>
              <CardDescription>
                Tell us about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Acme Inc."
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="Technology, Healthcare, etc."
                  value={companyData.industry}
                  onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                />
                {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("choice")}>
                  Back
                </Button>
                <Button onClick={handleCompanyNext} className="flex-1">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
              <CardDescription>
                Set up your admin profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">This is your login email</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value.toLowerCase() })}
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("company")}>
                  Back
                </Button>
                <Button onClick={handleProfileNext} className="flex-1">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "plan" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                Choose Your Plan
              </h2>
              <p className="text-muted-foreground">
                Select a plan that fits your needs. You can upgrade anytime.
              </p>
            </div>

            <div className="grid gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedPlan === plan.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {plan.name}
                          {plan.id === "professional" && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Popular
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{plan.price}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("profile")} disabled={loading}>
                Back
              </Button>
              <Button onClick={handleCreateOrganization} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
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
