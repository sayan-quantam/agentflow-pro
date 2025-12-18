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
  LucideIcon
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
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Phone className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">CallFlow</span>
              <span className="text-xs text-sidebar-muted">AI Platform</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md text-sidebar-muted transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {accessibleNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-item group",
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Action */}
      {!collapsed && (
        <div className="border-t border-sidebar-border p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-hover">
            <Zap className="h-4 w-4" />
            Quick Call
          </button>
        </div>
      )}

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-foreground">
            {getUserInitials()}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[140px]">
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
