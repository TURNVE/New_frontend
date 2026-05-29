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
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { profiles, supabase } from '../../lib/supabase';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { theme } = useTheme();
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
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card shadow-2xl"
            style={{ animation: 'slideInLeft 0.3s ease-out forwards' }}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
                <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary tap-target"
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
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent 
                    iconName={item.icon} 
                    className={`mr-3 h-5 w-5 ${isActiveRoute(item.href) ? 'text-primary' : 'text-muted-foreground'}`} 
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* Mobile sidebar footer */}
            <div className="p-4 border-t border-border shrink-0">
              <button
                onClick={() => { signOut?.(); setSidebarOpen(false); }}
                className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors tap-target"
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
        <div className="flex flex-col flex-grow bg-card border-r border-border overflow-y-auto">
          <div className="flex items-center h-16 px-6 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
            </Link>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors tap-target ${
                  isActiveRoute(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <IconComponent 
                  iconName={item.icon} 
                  className={`mr-3 h-5 w-5 ${isActiveRoute(item.href) ? 'text-primary' : 'text-muted-foreground'}`} 
                />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-xl p-4 text-white mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5" />
                <span className="font-semibold text-sm">Pro Plan</span>
              </div>
              <p className="text-xs text-white/80 mb-3">Get unlimited access to all simulations</p>
              <button className="w-full py-2 bg-white text-[#5e6ad2] text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap">
                Upgrade Now
              </button>
            </div>
            <button
              onClick={() => signOut?.()}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors tap-target"
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
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-2 rounded-lg text-muted-foreground hover:bg-secondary md:hidden tap-target"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/dashboard" className="flex items-center space-x-2">
                <img src="/logo.png" alt="TURNVE" className="h-7 w-auto sm:h-8" />
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors tap-target">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">{userName}</p>
                </div>
                <Link to="/profile">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base cursor-pointer hover:opacity-90 transition-opacity">
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
