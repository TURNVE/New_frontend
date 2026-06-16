import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  Briefcase,
  FileText,
  User,
  Settings,
  Zap,
  Menu,
  X,
  Bell,
  Home,
  Users,
  Award,
  BarChart3,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TurnveLogo } from '../brand/TurnveLogo';
import { profiles, supabase } from '../../lib/supabase';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userInitials, setUserInitials] = useState('U');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('turnve_onboarding_complete');
    setIsFirstTimeUser(!hasCompletedOnboarding);
  }, []);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { profile } = await profiles.getProfile(authUser.id);
        const name = profile?.full_name || authUser.email?.split('@')[0] || 'User';
        setUserName(name);
        setUserInitials(name.substring(0, 2).toUpperCase());
      }
    }
    loadUserData();
  }, [user]);

  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'My Projects', href: '/projects', icon: 'folder' },
    { name: 'Simulations', href: '/simulations', icon: 'briefcase' },
    { name: 'Portfolio', href: '/portfolio', icon: 'file' },
    { name: 'Profile', href: '/profile', icon: 'user' },
    { name: 'Settings', href: '/settings', icon: 'settings' }
  ];

  const IconComponent = ({ iconName, className = "h-5 w-5" }: { iconName: string, className?: string }) => {
    const icons: Record<string, any> = {
      home: Home,
      folder: Folder,
      users: Users,
      award: Award,
      chart: BarChart3,
      settings: Settings,
      briefcase: Briefcase,
      file: FileText,
      trend: TrendingUp,
      zap: Zap,
      user: User
    };
    const Icon = icons[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#0a142f]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl"
            style={{ animation: 'slideInLeft 0.3s ease-out forwards' }}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 shrink-0">
              <Link to="/" className="flex h-10 items-center" onClick={() => setSidebarOpen(false)} aria-label="TURNVE home">
                <TurnveLogo className="h-8 w-auto max-w-[132px] object-contain" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 tap-target"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-colors tap-target ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent 
                    iconName={item.icon} 
                    className={`mr-3 h-5 w-5 ${isActiveRoute(item.href) ? 'text-blue-700' : 'text-slate-400'}`} 
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* Mobile sidebar footer */}
            <div className="p-4 border-t border-slate-200 shrink-0">
              <button
                onClick={() => { signOut?.(); setSidebarOpen(false); }}
                className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors tap-target"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 lg:w-72 md:flex-col z-40">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 overflow-y-auto">
          <div className="flex items-center h-16 px-6 border-b border-slate-200">
            <Link to="/" className="flex h-10 items-center" aria-label="TURNVE home">
              <TurnveLogo className="h-8 w-auto max-w-[132px] object-contain" />
            </Link>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors tap-target ${
                  isActiveRoute(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <IconComponent 
                  iconName={item.icon} 
                  className={`mr-3 h-5 w-5 ${isActiveRoute(item.href) ? 'text-blue-700' : 'text-slate-400'}`} 
                />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-[#0a142f] mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-sm">Pro Plan</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">Get unlimited access to all simulations</p>
              <button className="w-full py-2 bg-[#0b6bff] text-white text-xs font-semibold rounded-lg hover:bg-[#0758d8] transition-colors whitespace-nowrap">
                Upgrade Now
              </button>
            </div>
            <button
              onClick={() => signOut?.()}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors tap-target"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 lg:pl-72">
        {/* Header - Fixed/Sticky */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden tap-target"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/dashboard" className="flex h-10 items-center" aria-label="TURNVE dashboard">
                <TurnveLogo className="h-7 w-auto max-w-[124px] object-contain sm:h-8" />
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors tap-target">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{userName}</p>
                </div>
                <Link to="/profile">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#0b6bff] flex items-center justify-center text-white font-semibold text-sm sm:text-base cursor-pointer hover:bg-[#0758d8] transition-colors">
                    {userInitials}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
