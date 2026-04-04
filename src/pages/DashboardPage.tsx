import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Folder, Users, Award, BarChart3, Settings, Plus,
  Briefcase, FileText, Menu, X, Bell, Search, Clock, Zap,
  TrendingUp, User, Trophy, Play, CheckCircle
} from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import { simulations, auth } from '../lib/supabase';

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
      const { user } = await auth.getUser();
      if (user) {
        const { profile } = await auth.getProfile(user.id);
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 tap-target"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors tap-target"
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent iconName={item.icon} className="mr-3 h-5 w-5 text-gray-400" />
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* Mobile sidebar footer */}
            <div className="p-4 border-t border-gray-100">
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
        <div className="flex flex-col flex-grow bg-white border-r border-gray-100 overflow-y-auto">
          <div className="flex items-center h-16 px-6 border-b border-gray-100">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="TURNVE" className="h-8 w-auto" />
            </Link>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors tap-target ${location.pathname === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <IconComponent iconName={item.icon} className={`mr-3 h-5 w-5 ${location.pathname === item.href ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
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
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
            <div className="flex items-center flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-2 sm:mr-4 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden tap-target"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects, simulations..."
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors tap-target">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Explorer</p>
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
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
            <div className="mb-6 sm:mb-8 animate-fade-in">
              <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
                <Trophy className="h-3 w-3 mr-1" />
                Welcome to TURNVE
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Let's build your career together!</h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                You're about to step into a real-world management simulation.
                Choose an industry, select your role, and start making impactful decisions.
              </p>
            </div>
          ) : (
            <div className="mb-6 sm:mb-8 animate-fade-in">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {userName.split(' ')[0]}! 👋</h1>
                {onboardingProgress < 100 && (
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs sm:text-sm font-semibold">
                    {onboardingProgress}% complete
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm sm:text-base text-gray-600">Here's what's happening with your projects today.</p>
            </div>
          )}

          {/* First Time User CTA */}
          {isFirstTimeUser && (
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white shadow-lg shadow-violet-500/20 animate-scale-in">
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Your First Step Awaits</h2>
                  <p className="text-violet-100 mb-4 sm:mb-6 text-sm sm:text-base">
                    Start your first simulation journey. Choose your industry and role to begin making real-world management decisions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                    <Link
                      to="/industries"
                      className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-violet-50 transition-all shadow-lg hover:shadow-xl tap-target"
                    >
                      <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                      Start Simulation
                    </Link>
                    <Link
                      to="/tracks"
                      className="inline-flex items-center justify-center gap-2 bg-violet-500/30 hover:bg-violet-500/40 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all tap-target"
                    >
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                      Explore Tracks
                    </Link>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/20">
                    <Play className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Link
                to="/industries"
                className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all duration-200 tap-target ${isFirstTimeUser ? 'bg-violet-50 hover:bg-violet-100' : 'bg-blue-50 hover:bg-blue-100'}`}
              >
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center mb-2 ${isFirstTimeUser ? 'bg-violet-500' : 'bg-blue-500'}`}>
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">New Simulation</span>
              </Link>
              <Link to="/projects" className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-violet-50 hover:bg-violet-100 transition-all duration-200 tap-target">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-violet-500 flex items-center justify-center mb-2">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">Projects</span>
              </Link>
              <Link to="/simulations" className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-all duration-200 tap-target">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-pink-500 flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">Simulations</span>
              </Link>
              <Link to="/settings" className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 tap-target">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-500 flex items-center justify-center mb-2">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">Settings</span>
              </Link>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Ongoing Simulations */}
            <div>
              {isFirstTimeUser ? (
                <div className="bg-white rounded-xl sm:rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
                  <div className="bg-violet-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-violet-100 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                      Recommended for You
                    </h2>
                  </div>
                  <div className="p-4 sm:p-6">
                    <Link to="/industries" className="block group p-4 sm:p-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white hover:shadow-lg transition-all duration-300 tap-target">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base sm:text-lg">Start Your First Simulation</h3>
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-violet-100 text-sm mb-4">Choose an industry and begin your journey toward real-world management experience.</p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-violet-200">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Beginner-friendly</span>
                        <span>•</span>
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Step 1 of 4</span>
                      </div>
                    </Link>
                  </div>
                </div>
              ) : ongoingSimulations.length > 0 ? (
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Ongoing Simulations</h2>
                    <Link to="/simulations" className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      View all
                    </Link>
                  </div>
                  <div className="p-4 sm:p-6">
                    {ongoingSimulations.slice(0, 2).map((sim) => (
                      <Link
                        key={sim.id}
                        to={`/simulation/${sim.id}`}
                        className="block group p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors mb-3 last:mb-0 tap-target"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sim.status === 'active' ? 'bg-blue-100 text-blue-700' : sim.status === 'in-progress' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>
                            {sim.status}
                          </span>
                          <span className="text-xs text-gray-500">{sim.industry}</span>
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">{sim.title}</h3>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-2">
                          <div className={`${sim.color} h-1.5 sm:h-2 rounded-full transition-all`} style={{ width: `${sim.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{sim.progress}% complete</span>
                          <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{sim.dueDate}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">No active simulations</h3>
                  <p className="text-sm text-gray-500 mb-6">Start your first simulation journey today!</p>
                  <Link
                    to="/industries"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors tap-target"
                  >
                    <Play className="h-4 w-4" />
                    Start Simulation
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column - Recent Activity */}
            <div>
              {!isFirstTimeUser && (
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Activity</h2>
                    <Link to="/activity" className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentActivity.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center">
                              <IconComponent iconName={activity.icon} className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{activity.title}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-1">{activity.desc}</p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
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
