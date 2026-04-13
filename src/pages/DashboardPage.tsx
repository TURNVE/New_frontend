import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Play,
  Trophy,
  Folder,
  Settings,
  HelpCircle,
  LogOut,
  Briefcase,
  FileText,
  Menu,
  X,
  Bell,
  Clock,
  Zap,
  TrendingUp,
  Plus,
  CheckCircle,
  Star,
  Target,
  Users,
  Award,
  Home,
  BarChart3,
  User,
  Sparkles
} from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import { simulations, supabase, profiles } from '../lib/supabase';

const DashboardPage = () => {
  usePageSetup();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState(0);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('turnve_onboarding_complete');
    const hasStartedSimulation = localStorage.getItem('turnve_started_simulation');

    setIsFirstTimeUser(!hasCompletedOnboarding);

    if (hasStartedSimulation) {
      setOnboardingProgress(50);
    } else if (!hasCompletedOnboarding) {
      setOnboardingProgress(10);
    } else {
      setOnboardingProgress(100);
    }
  }, []);

  const location = useLocation();
  const [userName, setUserName] = useState('User');
  const [userInitials, setUserInitials] = useState('U');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [ongoingSimulations, setOngoingSimulations] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { profile } = await profiles.getProfile(user.id);
        const name = profile?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(name);
        setUserInitials(name.substring(0, 2).toUpperCase());

        const { sessions } = await simulations.getActiveSessions();
        const { scores } = await simulations.getScores();

        if (sessions) {
          const sims = sessions.map(session => {
            const stateData: any = session.state || {};
            return {
              id: session.id,
              title: stateData.project?.title || session.scenario_key || 'Simulation Project',
              industry: stateData.industry || 'Technology',
              progress: session.total_weeks ? Math.round((session.current_week / session.total_weeks) * 100) : 0,
              dueDate: session.total_weeks ? `${session.total_weeks - session.current_week} weeks left` : 'Ongoing',
              status: 'active',
              color: 'bg-blue-500'
            };
          });
          setOngoingSimulations(sims.slice(0, 3));

          let activities: any[] = [];
          scores?.slice(0, 2).forEach(sc => {
            activities.push({
              id: sc.id, title: 'Simulation Completed', desc: `Finished with a score of ${sc.overall_score}%`, time: new Date(sc.completed_at).toLocaleDateString(), icon: 'briefcase'
            });
          });
          sessions?.slice(0, 2).forEach(s => {
            activities.push({
              id: s.id, title: 'Simulation Updated', desc: `Progressed to week ${s.current_week}`, time: new Date(s.updated_at).toLocaleDateString(), icon: 'trend'
            });
          });
          setRecentActivity(activities.slice(0, 4));
        }
      }
    }
    loadData();
  }, []);

  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'My Projects', href: '/projects', icon: 'folder' },
    { name: 'Simulations', href: '/simulations', icon: 'briefcase' },
    { name: 'Profile', href: '/profile', icon: 'user' },
    { name: 'Settings', href: '/settings', icon: 'settings' }
  ];

  const IconComponent = ({ iconName, className = "h-5 w-5" }: { iconName: string, className?: string }) => {
    const icons: Record<string, any> = {
      home: Home, folder: Folder, users: Users, award: Award,
      chart: BarChart3, settings: Settings, briefcase: Briefcase,
      file: FileText, trend: TrendingUp, zap: Zap, user: User
    };
    const Icon = icons[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary tap-target"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-secondary transition-colors tap-target"
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent iconName={item.icon} className="mr-3 h-5 w-5 text-muted-foreground" />
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* Mobile sidebar footer */}
            <div className="p-4 border-t border-border">
              {isFirstTimeUser && (
                <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl p-4 text-white mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-semibold text-xs">Onboarding</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                    <div className="bg-white h-1.5 rounded-full transition-all" style={{ width: `${onboardingProgress}%` }} />
                  </div>
                  <p className="text-xs text-sky-100 mb-2">Complete onboarding to start</p>
                  <Link
                    to="/industries"
                    onClick={() => setSidebarOpen(false)}
                    className="text-xs font-semibold bg-white text-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors block text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 lg:w-72 md:flex-col">
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
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors tap-target ${location.pathname === item.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'}`}
              >
                <IconComponent iconName={item.icon} className={`mr-3 h-5 w-5 ${location.pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            {isFirstTimeUser && (
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-4 text-white mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold text-xs">Onboarding</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                  <div className="bg-white h-1.5 rounded-full transition-all" style={{ width: `${onboardingProgress}%` }} />
                </div>
                <p className="text-xs text-violet-100 mb-2">Complete onboarding to start</p>
                <Link
                  to="/industries"
                  className="text-xs font-semibold bg-white text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors block text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5" />
                <span className="font-semibold text-sm">Pro Plan</span>
              </div>
              <p className="text-xs text-blue-100 mb-3">Get unlimited access to all simulations</p>
              <button className="w-full py-2 bg-white text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">Upgrade Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-2 sm:mr-4 rounded-lg text-muted-foreground hover:bg-secondary md:hidden tap-target"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors tap-target">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">Explorer</p>
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base">
                  {userInitials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8">
          {/* Welcome Section */}
          {isFirstTimeUser ? (
            <div className="mb-8 sm:mb-10 animate-fade-in">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
                <Trophy className="h-3.5 w-3.5 mr-1.5" />
                Welcome to TURNVE
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
                Let's build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">career together!</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                You're about to step into a real-world management simulation.
                Choose an industry, select your role, and start making impactful decisions.
              </p>
            </div>
          ) : (
            <div className="mb-8 sm:mb-10 animate-fade-in">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">Welcome back, {userName.split(' ')[0]}! 👋</h1>
                {onboardingProgress < 100 && (
                  <span className="px-3.5 py-1 rounded-full bg-[#ffe6cd] dark:bg-[#746019]/30 border border-[#ffe6cd] dark:border-[#746019]/50 text-[#746019] dark:text-[#ffe6cd] text-sm font-semibold shadow-sm">
                    {onboardingProgress}% complete
                  </span>
                )}
              </div>
              <p className="mt-2 text-base sm:text-lg text-muted-foreground">Here's what's happening with your projects today.</p>
            </div>
          )}

          {/* First Time User CTA */}
          {isFirstTimeUser && (
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-primary to-violet-900 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 text-white shadow-2xl shadow-primary/20 animate-scale-in border border-white/10 group">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all duration-700"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-semibold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Simulation Engine
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight text-white drop-shadow-sm">
                    Your First Step Awaits
                  </h2>
                  <p className="text-indigo-100/90 mb-8 text-base sm:text-lg max-w-xl leading-relaxed mx-auto md:mx-0">
                    Start your first simulation journey. Choose your industry and role to begin making real-world management decisions in a risk-free environment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Link
                      to="/industries"
                      className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] tap-target"
                    >
                      <Play className="h-5 w-5 fill-primary" />
                      Start Simulation
                    </Link>
                    <Link
                      to="/tracks"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 tap-target"
                    >
                      <TrendingUp className="h-5 w-5" />
                      Explore Tracks
                    </Link>
                  </div>
                </div>
                <div className="flex-shrink-0 hidden sm:block relative">
                  <div className="absolute inset-0 bg-white/20 rounded-[32px] blur-2xl animate-pulse"></div>
                  <div className="relative w-40 h-40 lg:w-48 lg:h-48 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center border border-white/20 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                    <div className="absolute right-0 top-0 -mr-6 -mt-6 bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg animate-float">
                      <Star className="h-6 w-6 text-[#fcd34d] fill-[#fcd34d]" />
                    </div>
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                      <Play className="h-10 w-10 text-primary ml-1.5 fill-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <Link
                to="/industries"
                className={`flex flex-col items-center p-5 sm:p-6 rounded-[24px] transition-all duration-300 tap-target border group ${isFirstTimeUser ? 'bg-primary/5 border-primary/20 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/40' : 'bg-card border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30'}`}
              >
                <div className={`h-14 w-14 rounded-[16px] flex items-center justify-center mb-4 transition-colors duration-300 ${isFirstTimeUser ? 'bg-primary text-primary-foreground group-hover:bg-primary/90 shadow-md' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                  <Plus className="h-7 w-7" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">New Simulation</span>
              </Link>
              <Link to="/projects" className="flex flex-col items-center p-5 sm:p-6 rounded-[24px] bg-card border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 tap-target group">
                <div className="h-14 w-14 rounded-[16px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300">
                  <Briefcase className="h-7 w-7" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">Projects</span>
              </Link>
              <Link to="/simulations" className="flex flex-col items-center p-5 sm:p-6 rounded-[24px] bg-card border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 tap-target group">
                <div className="h-14 w-14 rounded-[16px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">Simulations</span>
              </Link>
              <Link to="/settings" className="flex flex-col items-center p-5 sm:p-6 rounded-[24px] bg-card border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 tap-target group">
                <div className="h-14 w-14 rounded-[16px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300">
                  <Settings className="h-7 w-7" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">Settings</span>
              </Link>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Left Column - Ongoing Simulations */}
            <div>
              {isFirstTimeUser ? (
                <div className="bg-card rounded-[24px] border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                  <div className="bg-secondary/50 px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      Recommended for You
                    </h2>
                  </div>
                  <div className="p-6">
                    <Link to="/industries" className="block group p-6 rounded-[20px] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 hover:shadow-md transition-all duration-300 tap-target relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">Start Your First Simulation</h3>
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-4 w-4 text-primary ml-0.5 fill-primary" />
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-5 leading-relaxed">Choose an industry and begin your journey toward real-world management experience.</p>
                        <div className="flex items-center gap-3 text-xs font-semibold text-primary">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Beginner-friendly</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Step 1 of 4</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ) : ongoingSimulations.length > 0 ? (
                <div className="bg-card rounded-[24px] border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Ongoing Simulations</h2>
                    <Link to="/simulations" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                      View all
                    </Link>
                  </div>
                  <div className="p-6 space-y-4">
                    {ongoingSimulations.slice(0, 2).map((sim) => (
                      <Link
                        key={sim.id}
                        to={`/simulation/${sim.id}`}
                        className="block group p-5 rounded-[20px] bg-secondary/30 hover:bg-secondary/80 border border-transparent hover:border-border transition-all duration-300 tap-target"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md ${sim.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : sim.status === 'in-progress' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'}`}>
                            {sim.status}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">{sim.industry}</span>
                        </div>
                        <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1">{sim.title}</h3>
                        <div className="w-full bg-secondary rounded-full h-2 mb-3 overflow-hidden">
                          <div className={`${sim.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${sim.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                          <span>{sim.progress}% complete</span>
                          <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5" />{sim.dueDate}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-[24px] border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-10 sm:p-12 text-center">
                  <div className="w-20 h-20 bg-secondary rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">No active simulations</h3>
                  <p className="text-base text-muted-foreground mb-8 max-w-sm mx-auto">Start your first simulation journey today and build real-world experience!</p>
                  <Link
                    to="/industries"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 tap-target"
                  >
                    <Play className="h-5 w-5 fill-primary-foreground" />
                    Start Simulation
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column - Recent Activity */}
            <div>
              {!isFirstTimeUser && (
                <div className="bg-card rounded-[24px] border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                    <Link to="/activity" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">View all</Link>
                  </div>
                  <div className="divide-y divide-border">
                    {recentActivity.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="px-6 py-5 hover:bg-secondary/30 transition-colors group cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-[16px] bg-primary/10 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                              <IconComponent iconName={activity.icon} className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-300" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">{activity.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">{activity.desc}</p>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pt-1 bg-secondary px-2.5 py-1 rounded-md">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
