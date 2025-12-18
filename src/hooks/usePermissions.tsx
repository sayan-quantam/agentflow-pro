import { useAuth } from './useAuth';

type AppRole = 'super_admin' | 'admin' | 'manager' | 'agent';

type Permission = 
  | 'view_dashboard'
  | 'view_agents'
  | 'manage_agents'
  | 'view_campaigns'
  | 'manage_campaigns'
  | 'view_contacts'
  | 'manage_contacts'
  | 'view_calendar'
  | 'view_analytics'
  | 'view_settings'
  | 'manage_organization'
  | 'manage_team'
  | 'manage_integrations'
  | 'manage_api_keys'
  | 'manage_billing';

// Define permissions for each role
const rolePermissions: Record<AppRole, Permission[]> = {
  super_admin: [
    'view_dashboard',
    'view_agents',
    'manage_agents',
    'view_campaigns',
    'manage_campaigns',
    'view_contacts',
    'manage_contacts',
    'view_calendar',
    'view_analytics',
    'view_settings',
    'manage_organization',
    'manage_team',
    'manage_integrations',
    'manage_api_keys',
    'manage_billing',
  ],
  admin: [
    'view_dashboard',
    'view_agents',
    'manage_agents',
    'view_campaigns',
    'manage_campaigns',
    'view_contacts',
    'manage_contacts',
    'view_calendar',
    'view_analytics',
    'view_settings',
    'manage_organization',
    'manage_team',
    'manage_integrations',
    'manage_api_keys',
    // No billing access for admin
  ],
  manager: [
    'view_dashboard',
    'view_agents',
    'view_campaigns',
    'manage_campaigns',
    'view_contacts',
    'manage_contacts',
    'view_calendar',
    'view_analytics',
    'view_settings',
    // Limited settings access
  ],
  agent: [
    'view_dashboard',
    'view_agents',
    'view_campaigns',
    'view_contacts',
    'view_calendar',
    'view_settings',
    // Most restricted - view only
  ],
};

// Navigation items and their required permissions
export const navPermissions: Record<string, Permission> = {
  '/': 'view_dashboard',
  '/agents': 'view_agents',
  '/campaigns': 'view_campaigns',
  '/contacts': 'view_contacts',
  '/calendar': 'view_calendar',
  '/analytics': 'view_analytics',
  '/settings': 'view_settings',
};

// Settings tabs and their required permissions
export const settingsTabPermissions: Record<string, Permission> = {
  organization: 'manage_organization',
  team: 'manage_team',
  integrations: 'manage_integrations',
  api: 'manage_api_keys',
  notifications: 'view_settings', // Everyone with settings access can manage notifications
  billing: 'manage_billing',
};

export function usePermissions() {
  const { role } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!role) return false;
    return rolePermissions[role]?.includes(permission) ?? false;
  };

  const canAccessRoute = (path: string): boolean => {
    const permission = navPermissions[path];
    if (!permission) return true; // Unknown routes are allowed (will 404)
    return hasPermission(permission);
  };

  const canAccessSettingsTab = (tabId: string): boolean => {
    const permission = settingsTabPermissions[tabId];
    if (!permission) return true;
    return hasPermission(permission);
  };

  const getAccessibleNavItems = <T extends { href: string }>(items: T[]): T[] => {
    return items.filter(item => canAccessRoute(item.href));
  };

  const getAccessibleSettingsTabs = <T extends { id: string }>(tabs: T[]): T[] => {
    return tabs.filter(tab => canAccessSettingsTab(tab.id));
  };

  return {
    role,
    hasPermission,
    canAccessRoute,
    canAccessSettingsTab,
    getAccessibleNavItems,
    getAccessibleSettingsTabs,
  };
}
