import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bot, 
  Megaphone, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Phone,
  Zap,
  LucideIcon,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "AI Agents", href: "/agents", icon: Bot },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  agent: 'Agent',
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, role } = useAuth();
  const { getAccessibleNavItems } = usePermissions();

  const accessibleNavigation = getAccessibleNavItems(navigation);

  // Get user initials from email or name
  const getUserInitials = () => {
    if (!user?.email) return '??';
    const parts = user.email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <Phone className="h-5 w-5 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success shadow-[0_0_8px_hsl(160_84%_45%/0.5)]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-sidebar-foreground tracking-tight">CallFlow</span>
              <span className="text-xs text-sidebar-muted flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Platform
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-muted transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {accessibleNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110", 
                isActive && "text-primary"
              )} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Action */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-4 py-3 text-sm font-semibold text-primary-foreground transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5">
            <Zap className="h-4 w-4" />
            Quick Call
          </button>
        </div>
      )}

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-border text-sm font-semibold text-sidebar-foreground">
            {getUserInitials()}
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-sidebar shadow-[0_0_6px_hsl(160_84%_45%/0.5)]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground truncate max-w-[140px]">
                {user?.email?.split('@')[0] || 'User'}
              </span>
              <span className="text-xs text-sidebar-muted">
                {role ? roleLabels[role] : 'Loading...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
