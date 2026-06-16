import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  Users,
  BarChart3,
  Settings,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Plus,
} from 'lucide-react';
import { cn } from '../../../lib/organization/utils';
import type { OrganizationRole } from '../../../lib/organization/types';
import { hasPermission } from '../../../lib/permissions';
import { useOrganization, useTeamMembers } from '../../../hooks/organization';
import { useAuth } from '../../../hooks/useAuth';

interface OrgSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  userRole?: OrganizationRole;
}

const allNavItems = [
  { name: 'Dashboard', href: '/org/dashboard', icon: LayoutDashboard, permission: 'view:dashboard' },
  { name: 'Simulations', href: '/org/simulations', icon: Gamepad2, permission: 'view:simulation' },
  { name: 'Clients', href: '/org/clients', icon: Users, permission: 'manage:clients' },
  { name: 'Analytics', href: '/org/analytics', icon: BarChart3, permission: 'view:analytics' },
  { name: 'Team', href: '/org/team', icon: UserCircle, permission: 'manage:members' },
  { name: 'Settings', href: '/org/settings', icon: Settings, permission: 'manage:settings' },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ['*'],
  admin: ['*'],
  editor: ['view:dashboard', 'view:simulation', 'manage:clients', 'view:analytics'],
  viewer: ['view:dashboard', 'view:simulation', 'view:analytics'],
};

function getNavItemsForRole(role?: OrganizationRole) {
  if (!role) return allNavItems;
  
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  const hasAll = rolePerms.includes('*');
  
  if (hasAll) return allNavItems;
  
  return allNavItems.filter(item => rolePerms.includes(item.permission));
}

export function OrgSidebar({ collapsed = false, onToggle, userRole: propUserRole }: OrgSidebarProps) {
  const location = useLocation();
  const { organization } = useOrganization();
  const { user } = useAuth();
  const { members } = useTeamMembers(organization?.id || '');
  const [resolvedRole, setResolvedRole] = useState<OrganizationRole | undefined>(propUserRole);

  useEffect(() => {
    if (propUserRole) {
      setResolvedRole(propUserRole);
      return;
    }
    if (user?.id && members.length > 0) {
      const member = members.find(m => m.userId === user.id || (m as any).user_id === user.id);
      if (member) {
        setResolvedRole(member.role as OrganizationRole);
      }
    }
  }, [propUserRole, user, members]);

  const navItems = getNavItemsForRole(resolvedRole);
  const currentRole = resolvedRole || 'viewer';

  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Organization Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="truncate text-sm font-semibold text-white">{organization?.name || 'My Org'}</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                         location.pathname.startsWith(item.href + '/');
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="border-t border-slate-800 p-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-slate-500">Quick Actions</h3>
            <NavLink
              to="/org/simulations/new"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              <span>New Simulation</span>
            </NavLink>
          </div>
        </div>
      )}

      {/* User Section */}
      <div className="border-t border-slate-800 p-4">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white w-full">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
            <UserCircle className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-white">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-xs text-slate-500 capitalize">{currentRole}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
