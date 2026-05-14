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
import { companySimulations } from '../../lib/companySimulations';

export function CompanyDashboardPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ total: 0, live: 0, public: 0 });

  const orgName = profile?.full_name || user?.email?.split('@')[0] || 'Organization';

  useEffect(() => {
    if (!user) return;
    const simulations = companySimulations.listForOwner(user.id);
    setStats({
      total: simulations.length,
      live: simulations.filter((simulation) => simulation.status === 'live').length,
      public: simulations.filter((simulation) => simulation.isPublic).length,
    });
  }, [user]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {orgName}</h1>
        <p className="text-[#8a8f98]">Manage your simulations and track team performance.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#5e6ad2]/10 rounded-lg flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-[#7170ff]" />
            </div>
            <span className="text-sm text-[#8a8f98]">Total Simulations</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-sm text-[#8a8f98]">Public</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.public}</p>
        </div>
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-[#8a8f98]">Active</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.live}</p>
        </div>
        <div className="bg-[#111418] border border-[#23252a] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-sm text-[#8a8f98]">Team Members</span>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
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
