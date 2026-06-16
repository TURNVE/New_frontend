import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Building2,
  Menu,
  Command,
  ChevronRight,
  Users,
  Gamepad2,
  BarChart3,
  UserCircle,
} from 'lucide-react';
import { cn } from '../../../lib/organization/utils';
import { useAuth } from '../../../hooks/useAuth';

interface OrgHeaderProps {
  organizationName?: string;
  organizationLogo?: string;
  onMenuClick?: () => void;
}

export function OrgHeader({ organizationName = 'My Organization', organizationLogo, onMenuClick }: OrgHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);

  const notifications = [
    { id: 1, message: 'New simulation completed', time: '2 min ago', type: 'success' },
    { id: 2, message: 'Client invitation accepted', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'Simulation draft saved', time: '3 hours ago', type: 'info' },
  ];

  const shortcuts = [
    { keys: '⌘+K', description: 'Command palette' },
    { keys: '⌘+B', description: 'Toggle sidebar' },
    { keys: 'G+D', description: 'Go to Dashboard' },
    { keys: 'G+S', description: 'Go to Simulations' },
    { keys: 'C+S', description: 'Create simulation' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/org/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex h-16 items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          aria-label="Toggle mobile menu"
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Organization Info */}
        <div className="flex items-center gap-3">
          {organizationLogo ? (
            <img
              src={organizationLogo}
              alt={organizationName}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => {
                setShowOrgMenu(!showOrgMenu);
                setShowUserMenu(false);
                setShowNotifications(false);
              }}
              aria-expanded={showOrgMenu}
              aria-haspopup="listbox"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-700"
            >
              <span className="max-w-[150px] lg:max-w-[200px] truncate hidden sm:inline">{organizationName}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showOrgMenu && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-500">
                  Organizations
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {organizationName}
                  </div>
                </button>
                <div className="my-1 border-t border-gray-100" />
                <Link
                  to="/org/create"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                  Create Organization
                </Link>
                <Link
                  to="/org/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4" />
                  Organization Settings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden flex-1 max-w-xl px-8 md:block">
        <form onSubmit={handleSearch} className="relative">
          <label htmlFor="org-search" className="sr-only">Search</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="org-search"
            type="text"
            placeholder="Search simulations, clients... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-20 py-2 text-sm',
              'focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20'
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">K</kbd>
          </div>
        </form>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Quick Create Button - Desktop */}
        <button
          onClick={() => navigate('/org/simulations/new')}
          data-tour="create-simulation"
          className={cn(
            'hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white',
            'transition-colors hover:bg-blue-700 md:flex'
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">New Simulation</span>
          <span className="lg:hidden">New</span>
        </button>

        {/* Keyboard Shortcuts Hint - Desktop */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          aria-label="Keyboard shortcuts"
          className="hidden lg:flex items-center gap-1 px-2 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Command className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
              setShowOrgMenu(false);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
              <div className="px-4 py-2 text-sm font-semibold text-gray-900">
                Notifications
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <Link
                  to="/org/notifications"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowOrgMenu(false);
            }}
            aria-label="User menu"
            aria-expanded={showUserMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            <User className="w-5 h-5" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'Signed in'}</p>
              </div>
              <Link
                to="/org/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                to="/org/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <div className="border-t border-gray-100" />
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/sign-in');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcuts(false)}
                aria-label="Close keyboard shortcuts"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.split('+').map((key, i) => (
                      <kbd
                        key={i}
                        className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6">
              Press <kbd className="px-1 bg-gray-100 rounded">G</kbd> then a letter to navigate
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
