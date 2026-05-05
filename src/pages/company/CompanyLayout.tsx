import { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  List,
  Plus,
  LogOut,
  ChevronRight,
  Building2,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon?: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/company', icon: LayoutDashboard },
  {
    label: 'Simulations',
    href: '/company/simulations',
    icon: Gamepad2,
    children: [
      { label: 'All Simulations', href: '/company/simulations', icon: List },
      { label: 'Create New', href: '/company/simulations/new', icon: Plus },
    ],
  },
  { label: 'Analytics', href: '/company/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/company/settings', icon: Settings },
];

export function CompanyLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-[#0d0f11] flex">
      <aside className="w-64 bg-[#111418] border-r border-[#23252a] flex flex-col fixed h-full">
        <div className="p-6 border-b border-[#23252a]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#f7f8f8]">TURNVE</h1>
              <p className="text-xs text-[#8a8f98]">Organization</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.children?.some(child => location.pathname.startsWith(child.href)) ?? false);

              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#5e6ad2]/10 text-[#7170ff] border border-[#5e6ad2]/20'
                        : 'text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f7f8f8]'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.children && (
                      <ChevronRight className={cn(
                        'w-4 h-4 transition-transform',
                        isActive && 'rotate-90'
                      )} />
                    )}
                  </NavLink>

                  {item.children && isActive && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavLink
                            to={child.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                              location.pathname === child.href
                                ? 'text-[#7170ff] bg-[#5e6ad2]/5'
                                : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                            )}
                          >
                            {child.icon && <child.icon className="w-4 h-4" />}
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#23252a]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#23252a] flex items-center justify-center">
              <span className="text-sm font-medium text-[#d0d6e0]">
                {user?.email?.charAt(0).toUpperCase() || 'O'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f7f8f8] truncate">
                {user?.email || 'Organization'}
              </p>
              <p className="text-xs text-[#8a8f98]">Organization Admin</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default CompanyLayout;