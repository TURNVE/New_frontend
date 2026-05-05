import { Link } from 'react-router-dom';
import { Award, ChevronRight, Star, Trophy, Zap, Target, TrendingUp, Calendar, Users } from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';

const AchievementsPage = () => {
  // Page setup with scroll-to-top, viewport fix, and device detection
  const { isMobile, isIOS, isAndroid } = usePageSetup();
  const achievements = [
    { id: 1, title: 'Rising Star', description: 'Complete your first simulation', icon: Star, color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600', date: 'Feb 15, 2026', earned: true },
    { id: 2, title: 'Team Player', description: 'Collaborate with 5+ team members', icon: Users, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600', date: 'Feb 20, 2026', earned: true },
    { id: 3, title: 'Innovation Award', description: 'Submit an innovative solution', icon: Zap, color: 'from-violet-400 to-purple-500', bgColor: 'bg-violet-50', textColor: 'text-violet-600', date: 'Mar 1, 2026', earned: true },
    { id: 4, title: 'Goal Getter', description: 'Complete 3 simulations in one month', icon: Target, color: 'from-emerald-400 to-green-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', date: 'Mar 5, 2026', earned: true },
    { id: 5, title: 'Consistency King', description: '7-day login streak', icon: TrendingUp, color: 'from-rose-400 to-pink-500', bgColor: 'bg-rose-50', textColor: 'text-rose-600', date: 'Mar 10, 2026', earned: true },
    { id: 6, title: 'Master Mentor', description: 'Help 10 team members', icon: Award, color: 'from-indigo-400 to-blue-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', date: null, earned: false, progress: 7, total: 10 },
    { id: 7, title: 'Speed Demon', description: 'Complete simulation in under 2 weeks', icon: Zap, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600', date: null, earned: false, progress: 0, total: 1 },
    { id: 8, title: 'Champion', description: 'Win first place in a competition', icon: Trophy, color: 'from-amber-400 to-yellow-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600', date: null, earned: false, progress: 0, total: 1 }
  ];

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground mt-1">Track your milestones and accomplishments</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/profile" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            View Profile
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="py-4">
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Your Achievement Journey</h2>
              <p className="text-white/80">You've earned {earnedCount} out of {totalCount} achievements</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-2">
                  <Trophy className="h-10 w-10" />
                </div>
                <p className="text-2xl font-bold">{earnedCount}</p>
                <p className="text-sm text-white/80">Earned</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-2">
                  <Award className="h-10 w-10" />
                </div>
                <p className="text-2xl font-bold">{totalCount - earnedCount}</p>
                <p className="text-sm text-white/80">Remaining</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all"
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm text-white/80">
              {Math.round((earnedCount / totalCount) * 100)}% complete
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`bg-card rounded-2xl border border-border shadow-sm p-6 transition-all ${
                achievement.earned 
                  ? 'hover:shadow-md' 
                  : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center ${achievement.earned ? '' : 'grayscale'}`}>
                  <achievement.icon className="h-8 w-8 text-white" />
                </div>
                {achievement.earned && (
                  <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                    Earned
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>

              {achievement.earned ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Earned on {achievement.date}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{achievement.progress}/{achievement.total}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${achievement.color} h-2 rounded-full`}
                      style={{ width: `${((achievement.progress ?? 0) / (achievement.total ?? 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            {achievements.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
              <div key={achievement.id} className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                  <achievement.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">+{100 * (index + 1)} pts</p>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;