import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { Loader2 } from 'lucide-react';

type AppRole = 'super_admin' | 'admin' | 'manager' | 'agent';

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
  skipOrgCheck?: boolean;
}

export function ProtectedRoute({ allowedRoles, skipOrgCheck = false }: ProtectedRouteProps) {
  const { user, role, loading: authLoading } = useAuth();
  const { hasOrganization, loading: orgLoading } = useOrganization();
  const location = useLocation();

  const loading = authLoading || (!skipOrgCheck && orgLoading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user needs to complete onboarding (no organization)
  if (!skipOrgCheck && hasOrganization === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
