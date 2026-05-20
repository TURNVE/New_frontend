import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Trophy,
  Zap,
  TrendingUp,
  Plus,
  CheckCircle,
  Star,
  Clock,
  Briefcase,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import { simulations, supabase, profiles } from '../lib/supabase';

const DashboardPage = () => {
  usePageSetup();
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('turnve_onboarding_complete');
    setIsFirstTimeUser(!hasCompletedOnboarding);
  }, []);

  const [userName, setUserName] = useState('User');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [ongoingSimulations, setOngoingSimulations] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { profile } = await profiles.getProfile(user.id);
        const name = profile?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(name);

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

  const IconComponent = ({ iconName, className = "h-5 w-5" }: { iconName: string, className?: string }) => {
    const icons: Record<string, any> = {
      briefcase: Briefcase,
      trend: TrendingUp,
      zap: Zap,
    };
    const Icon = icons[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      {isFirstTimeUser ? (
        <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4 shadow-sm">
            <Trophy className="h-3.5 w-3.5 mr-1.5" />
            Welcome to TURNVE
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-2 sm:mb-3">
            Let's build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">career together!</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            You're about to step into a real-world management simulation.
            Choose an industry, select your role, and start making impactful decisions.
          </p>
        </div>
      ) : (
        <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-in">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">Welcome back, {userName.split(' ')[0]}!</h1>
          </div>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>
      )}

      {/* First Time User CTA - Your First Step Awaits */}
      {isFirstTimeUser && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#5e6ad2] via-[#6366d3] to-[#7170ff] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 lg:mb-8 text-white shadow-lg shadow-[rgba(94,106,210,0.2)] animate-scale-in border border-white/10">
          <div className="relative z-10">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 backdrop-blur-md shadow-sm">
                Get Started
              </div>

              {/* Heading */}
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1.5 sm:mb-2 lg:mb-3 tracking-tight text-white drop-shadow-sm leading-tight">
                Your First Step Awaits
              </h2>

              {/* Description */}
              <p className="text-indigo-100/90 mb-3 sm:mb-4 lg:mb-5 text-xs sm:text-sm max-w-lg leading-relaxed">
                Start your first simulation journey. Choose your industry and role to begin making real-world management decisions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                <Link
                  to="/simulations"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-[#5e6ad2] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md shadow-white/20 tap-target"
                >
                  Start Simulation
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </Link>
                <Link
                  to="/simulations"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] tap-target"
                >
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Explore Tracks
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid - Responsive adjustments */}
      <div className="mb-6 sm:mb-8 lg:mb-12">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4 lg:mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Link
            to="/simulations"
            className={`flex flex-col items-center p-4 sm:p-5 lg:p-6 rounded-2xl transition-all duration-300 tap-target border group ${isFirstTimeUser ? 'bg-primary/5 border-primary/20 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/40' : 'bg-card border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30'}`}
          >
            <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-[16px] flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-300 ${isFirstTimeUser ? 'bg-primary text-primary-foreground group-hover:bg-primary/90 shadow-md' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
              <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">New Simulation</span>
          </Link>
          <Link to="/projects" className="flex flex-col items-center p-4 sm:p-5 lg:p-6 rounded-2xl bg-card border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 tap-target group">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-[16px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-300">
              <Briefcase className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">Projects</span>
          </Link>
          <Link to="/simulations" className="flex flex-col items-center p-4 sm:p-5 lg:p-6 rounded-2xl bg-card border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 tap-target group">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-[16px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-300">
              <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">Simulations</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center p-4 sm:p-5 lg:p-6 rounded-2xl bg-card border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 tap-target group">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-[16px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-300">
              <Zap className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">Settings</span>
          </Link>
        </div>
      </div>

      {/* Content Grid - Improved responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Ongoing Simulations or Recommended */}
        <div>
          {isFirstTimeUser ? (
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
              <div className="bg-secondary/50 px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-primary" />
                  Recommended for You
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <Link to="/simulations" className="block group p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[rgba(94,106,210,0.1)] to-[rgba(113,112,255,0.1)] border border-[rgba(94,106,210,0.2)] hover:shadow-md transition-all duration-300 tap-target relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#5e6ad2]/10 rounded-full blur-3xl group-hover:bg-[#5e6ad2]/20 transition-colors"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">Start Your First Simulation</h3>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary ml-0.5 fill-primary" />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-5 leading-relaxed">Choose an industry and begin your journey toward real-world management experience.</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-primary">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Beginner-friendly</span>
                      </div>
                      <span className="text-muted-foreground hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Step 1 of 4</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ) : ongoingSimulations.length > 0 ? (
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Ongoing Simulations</h2>
                <Link to="/simulations" className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  View all
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {ongoingSimulations.slice(0, 2).map((sim) => (
                  <Link
                    key={sim.id}
                    to={`/simulation/${sim.id}`}
                    className="block group p-4 sm:p-5 rounded-xl sm:rounded-[20px] bg-secondary/30 hover:bg-secondary/80 border border-transparent hover:border-border transition-all duration-300 tap-target"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md ${sim.status === 'active' ? 'bg-[rgba(94,106,210,0.2)] text-[#7170ff]' : sim.status === 'in-progress' ? 'bg-[rgba(39,166,68,0.2)] text-[#27a644]' : 'bg-[rgba(255,255,255,0.1)] text-text-secondary'}`}>
                        {sim.status}
                      </span>
                      <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">{sim.industry}</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors mb-2 sm:mb-3 line-clamp-1">{sim.title}</h3>
                    <div className="w-full bg-secondary rounded-full h-1.5 sm:h-2 mb-2 sm:mb-3 overflow-hidden">
                      <div className={`${sim.color} h-full rounded-full transition-all duration-500`} style={{ width: `${sim.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-muted-foreground">
                      <span>{sim.progress}% complete</span>
                      <span className="flex items-center"><Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />{sim.dueDate}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 sm:p-10 lg:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary rounded-2xl sm:rounded-[24px] flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm border border-border">
                <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">No active simulations</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-8 max-w-sm mx-auto">Start your first simulation journey today and build real-world experience!</p>
              <Link
                to="/simulations"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm sm:text-base hover:bg-primary/90 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 tap-target"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-primary-foreground" />
                Start Simulation
              </Link>
            </div>
          )}
        </div>

        {/* Right Column - Recent Activity */}
        <div>
          {!isFirstTimeUser && (
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</h2>
                <Link to="/activity" className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors">View all</Link>
              </div>
              <div className="divide-y divide-border">
                {recentActivity.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="px-4 sm:px-6 py-3 sm:py-5 hover:bg-secondary/30 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-[16px] bg-primary/10 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                          <IconComponent iconName={activity.icon} className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{activity.title}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1 leading-relaxed">{activity.desc}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pt-0.5 sm:pt-1 bg-secondary px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
