import { Link } from 'react-router-dom';
import { Award, ChevronRight, Star, Trophy, Zap, Target, TrendingUp, Calendar, Users, Rocket } from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';

const AchievementsPage = () => {
  usePageSetup();
  
  const achievements = [
    { id: 1, title: 'Rising Star', description: 'Complete your first simulation', icon: Star, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600', date: 'Feb 15, 2026', earned: true },
    { id: 2, title: 'Team Player', description: 'Collaborate with 5+ team members', icon: Users, color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600', date: 'Feb 20, 2026', earned: true },
    { id: 3, title: 'Innovation Award', description: 'Submit an innovative solution', icon: Zap, color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50', textColor: 'text-violet-600', date: 'Mar 1, 2026', earned: true },
    { id: 4, title: 'Goal Getter', description: 'Complete 3 simulations in one month', icon: Target, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', date: 'Mar 5, 2026', earned: true },
    { id: 5, title: 'Consistency King', description: '7-day login streak', icon: TrendingUp, color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', textColor: 'text-rose-600', date: 'Mar 10, 2026', earned: true },
    { id: 6, title: 'Master Mentor', description: 'Help 10 team members', icon: Award, color: 'from-indigo-500 to-blue-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', date: null, earned: false, progress: 7, total: 10 },
    { id: 7, title: 'Speed Demon', description: 'Complete simulation in under 2 weeks', icon: Zap, color: 'from-sky-500 to-blue-600', bgColor: 'bg-sky-50', textColor: 'text-sky-600', date: null, earned: false, progress: 0, total: 1 },
    { id: 8, title: 'Champion', description: 'Win first place in a competition', icon: Trophy, color: 'from-primary to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-primary', date: null, earned: false, progress: 0, total: 1 }
  ];

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className="animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Achievements</h1>
          <p className="text-muted-foreground mt-1 text-lg">Your milestones and professional accomplishments</p>
        </div>
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          View Profile
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Progress Overview */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-indigo-600 rounded-3xl p-8 sm:p-12 mb-12 text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest mb-6">
              <Rocket className="h-3.5 w-3.5 mr-2" />
              Level 4 Product Manager
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight">Your Professional Journey</h2>
            <p className="text-white/80 text-lg">You've mastered <span className="text-white font-bold">{earnedCount}</span> key competencies across <span className="text-white font-bold">{totalCount}</span> milestones.</p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 group-hover:scale-110 transition-transform shadow-xl">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <p className="text-3xl font-bold">{earnedCount}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">Unlocked</p>
            </div>
            <div className="w-px h-16 bg-white/20" />
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform shadow-lg">
                <Award className="h-12 w-12 text-white/50" />
              </div>
              <p className="text-3xl font-bold text-white/50">{totalCount - earnedCount}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Remaining</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 relative z-10">
          <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest">
            <span className="text-white/70">Overall Completion</span>
            <span className="text-white">{Math.round((earnedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 p-1 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`group bg-card rounded-3xl border border-border p-8 transition-all duration-300 ${
              achievement.earned 
                ? 'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1' 
                : 'opacity-60 grayscale-[0.5]'
            }`}
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                <achievement.icon className="h-10 w-10 text-white" />
              </div>
              {achievement.earned ? (
                <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Unlocked
                </div>
              ) : (
                <div className="px-3 py-1.5 bg-muted text-muted-foreground border border-border rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Locked
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">{achievement.description}</p>

            {achievement.earned ? (
              <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                <Calendar className="h-4 w-4" />
                Mastered on {achievement.date}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="text-muted-foreground/70">Progress</span>
                  <span className="text-foreground">{achievement.progress}/{achievement.total}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${achievement.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${((achievement.progress ?? 0) / (achievement.total ?? 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-16 bg-card rounded-3xl border border-border p-8 lg:p-12 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-foreground">Mastery Log</h2>
          <div className="w-12 h-1 bg-primary/20 rounded-full" />
        </div>
        <div className="space-y-6">
          {achievements.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
            <div key={achievement.id} className="group flex items-center gap-6 p-6 bg-secondary/50 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-card transition-all">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                <achievement.icon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-lg truncate">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{achievement.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-primary">+{100 * (index + 1)} XP</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
