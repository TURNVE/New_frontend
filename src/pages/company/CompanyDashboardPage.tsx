import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Gamepad2,
  Plus,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  Zap,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  buildCompanyDashboardStats,
  getCompanyDashboardStats,
  type CompanyDashboardStats,
} from '../../lib/companyStats';

const emptyCompanyDashboardStats = buildCompanyDashboardStats({ localSimulations: [] });

export function CompanyDashboardPage() {
  const { user, profile } = useAuth();
  const [loadedStats, setLoadedStats] = useState<CompanyDashboardStats>(emptyCompanyDashboardStats);

  const orgName = profile?.full_name || user?.email?.split('@')[0] || 'Organization';
  const stats = user ? loadedStats : emptyCompanyDashboardStats;

  useEffect(() => {
    if (!user) return;

    let isCurrent = true;

    void getCompanyDashboardStats(user.id).then((nextStats) => {
      if (isCurrent) setLoadedStats(nextStats);
    });

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const statCards = [
    {
      label: 'Owned simulations',
      value: stats.totalSimulations,
      icon: Gamepad2,
      iconClassName: 'text-[#7170ff]',
      iconContainerClassName: 'bg-[#5e6ad2]/10',
    },
    {
      label: 'Public links',
      value: stats.publicSimulations,
      icon: CheckCircle,
      iconClassName: 'text-emerald-400',
      iconContainerClassName: 'bg-emerald-500/10',
    },
    {
      label: 'Live simulations',
      value: stats.liveSimulations,
      icon: Clock,
      iconClassName: 'text-primary',
      iconContainerClassName: 'bg-primary/10',
    },
    {
      label: 'Learners reached',
      value: stats.learnersReached,
      icon: BarChart3,
      iconClassName: 'text-blue-400',
      iconContainerClassName: 'bg-blue-500/10',
    },
    {
      label: 'Completion rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      iconClassName: 'text-amber-300',
      iconContainerClassName: 'bg-amber-500/10',
    },
    {
      label: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      iconClassName: 'text-cyan-300',
      iconContainerClassName: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {orgName}</h1>
        <p className="text-[#8a8f98]">Manage your simulations and track team performance.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconContainerClassName}`}>
                  <Icon className={`h-5 w-5 ${card.iconClassName}`} />
                </div>
                <span className="text-sm text-[#8a8f98]">{card.label}</span>
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/company/simulations/new"
            className="flex items-center gap-4 p-6 bg-[#111418] border border-[#23252a] rounded-xl hover:border-[#5e6ad2]/30 hover:bg-[#15171a] transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-[#7170ff] transition-colors">Create Simulation</h3>
              <p className="text-sm text-[#8a8f98]">Build a new scenario for your team</p>
            </div>
            <ArrowRight className="h-5 w-5 text-[#8a8f98] group-hover:text-[#7170ff] group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            to="/company/simulations"
            className="flex items-center gap-4 p-6 bg-[#111418] border border-[#23252a] rounded-xl hover:border-[#5e6ad2]/30 hover:bg-[#15171a] transition-all group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-[#7170ff] transition-colors">View Simulations</h3>
              <p className="text-sm text-[#8a8f98]">Manage and review existing simulations</p>
            </div>
            <ArrowRight className="h-5 w-5 text-[#8a8f98] group-hover:text-[#7170ff] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide opacity-80">Getting Started</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">Create your first simulation</h2>
          <p className="text-white/80 mb-6 max-w-md">
            Build realistic project scenarios for your team to practice. Define challenges, stakeholders, and evaluation criteria.
          </p>
          <Link
            to="/company/simulations/new"
            className="inline-flex items-center gap-2 bg-white text-[#5e6ad2] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Start Creating
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboardPage;
