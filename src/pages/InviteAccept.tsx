import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Building2, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

interface InviteDetails {
  email: string;
  role: string;
  organization_name: string;
  expires_at: string;
  is_valid: boolean;
}

export default function InviteAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) {
      setError('No invite token provided');
      setLoading(false);
      return;
    }

    const fetchInviteDetails = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .rpc('get_invite_details', { invite_token: token });

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          setError('Invalid invite link');
          return;
        }

        const invite = data[0] as InviteDetails;
        
        if (!invite.is_valid) {
          setError('This invite has expired or has already been used');
          return;
        }

        setInviteDetails(invite);
      } catch (err) {
        console.error('Error fetching invite:', err);
        setError('Failed to load invite details');
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    if (!inviteDetails || !token) return;

    setSubmitting(true);

    try {
      // Sign up the user with the invite email
      const { error: signUpError } = await supabase.auth.signUp({
        email: inviteDetails.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast.error('An account with this email already exists. Please login instead.');
          navigate('/auth');
          return;
        }
        throw signUpError;
      }

      // Wait a moment for the user to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Accept the invite
      const { error: acceptError } = await supabase
        .rpc('accept_organization_invite', { invite_token: token });

      if (acceptError) {
        console.error('Accept invite error:', acceptError);
        // Don't throw - user is created, they can try accepting again
        toast.warning('Account created but there was an issue joining the organization. Please contact your admin.');
      } else {
        toast.success('Welcome! You have joined the organization.');
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'admin': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'manager': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid Invite</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => navigate('/auth')} variant="outline">
              Go to Login
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Contact your administrator for a new invite link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inviteDetails) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            Create your account to join the team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Invite Details */}
          <div className="mb-6 p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Organization</span>
              <span className="ml-auto font-medium">{inviteDetails.organization_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Your Role</span>
              <Badge variant="outline" className={`ml-auto ${getRoleBadgeColor(inviteDetails.role)}`}>
                {inviteDetails.role.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={inviteDetails.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                This email is linked to your invite
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={submitting}
              />
              {formErrors.fullName && (
                <p className="text-xs text-destructive">{formErrors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={submitting}
              />
              {formErrors.password && (
                <p className="text-xs text-destructive">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={submitting}
              />
              {formErrors.confirmPassword && (
                <p className="text-xs text-destructive">{formErrors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account & Join'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/auth')}>
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
