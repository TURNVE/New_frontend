import React from 'react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import { Link } from 'react-router-dom';
import {
  Users,
  Gamepad2,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Activity,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';
import { useActivityFeed, useClients, useOrganization, useSimulations } from '../../hooks/organization';
import type { OrganizationSimulation } from '../../lib/organization/types';

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, change, changeLabel, icon, color }: StatCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={cn(
                "w-4 h-4",
                change >= 0 ? "text-green-600" : "text-red-600"
              )} />
              <span className={cn(
                "text-sm font-medium",
                change >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorStyles[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Activity Item Component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  type: 'simulation' | 'client' | 'assignment' | 'system';
}

function ActivityItem({ title, description, time, type }: ActivityItemProps) {
  const typeIcons = {
    simulation: <Gamepad2 className="w-4 h-4" />,
    client: <Users className="w-4 h-4" />,
    assignment: <Activity className="w-4 h-4" />,
    system: <Clock className="w-4 h-4" />,
  };

  const typeColors = {
    simulation: 'bg-blue-100 text-blue-600',
    client: 'bg-green-100 text-green-600',
    assignment: 'bg-purple-100 text-purple-600',
    system: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="flex items-start gap-4 py-3">
      <div className={cn("p-2 rounded-lg flex-shrink-0", typeColors[type])}>
        {typeIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

// Simulation Card Component
interface SimulationCardProps {
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  completions: number;
  avgScore: number;
  thumbnail?: string;
}

function SimulationCard({ title, description, status, completions, avgScore }: SimulationCardProps) {
  const statusStyles = {
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <Gamepad2 className="w-12 h-12 text-blue-400" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusStyles[status])}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {completions} completions
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {avgScore} avg score
          </span>
        </div>
      </div>
    </div>
  );
}

// Quick Action Button
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
}

function QuickAction({ icon, label, description, href, color }: QuickActionProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className={cn("p-3 rounded-lg", color)}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

export default function OrgDashboardPage() {
  const { organization } = useOrganization();
  const { simulations } = useSimulations(organization?.id ?? '');
  const { clients } = useClients(organization?.id ?? '');
  const { activities } = useActivityFeed(organization?.id ?? '', 4);
  const sidebar = <OrgSidebar />;
  const header = <OrgHeader organizationName={organization?.name} organizationLogo={organization?.logoUrl} />;
  const activeSimulations = simulations.filter((simulation) => simulation.status === 'published');
  const completedCount = simulations.reduce((total, simulation) => total + (simulation.metrics?.completedCount ?? 0), 0);
  const assignments = simulations.reduce((total, simulation) => total + (simulation.metrics?.totalAssignments ?? 0), 0);
  const averageScore = simulations.length
    ? Math.round(simulations.reduce((total, simulation) => total + (simulation.metrics?.averageScore ?? 0), 0) / simulations.length)
    : 0;
  const completionRate = assignments ? Math.round((completedCount / assignments) * 100) : 0;
  const recentSimulations = simulations.slice(0, 4);

  const getSimulationCompletions = (simulation: OrganizationSimulation) => simulation.metrics?.completedCount ?? 0;
  const getSimulationScore = (simulation: OrganizationSimulation) => Math.round(simulation.metrics?.averageScore ?? 0);

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back{organization?.name ? ` to ${organization.name}` : ''}. Here's what's happening with your organization.
            </p>
          </div>
          <Link
            to="/org/simulations/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Simulation
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clients"
            value={clients.length}
            changeLabel="vs last month"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Active Simulations"
            value={activeSimulations.length}
            changeLabel="vs last month"
            icon={<Gamepad2 className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Completion Rate"
            value={`${completionRate}%`}
            changeLabel="vs last month"
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Avg. Completion Time"
            value={averageScore ? `${averageScore}% score` : 'No data'}
            changeLabel="vs last month"
            icon={<Clock className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Simulations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Simulations</h2>
                <Link
                  to="/org/simulations"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentSimulations.length > 0 ? (
                    recentSimulations.map((simulation) => (
                      <SimulationCard
                        key={simulation.id}
                        title={simulation.title}
                        description={simulation.description}
                        status={simulation.status}
                        completions={getSimulationCompletions(simulation)}
                        avgScore={getSimulationScore(simulation)}
                      />
                    ))
                  ) : (
                    <div className="md:col-span-2 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                      <Gamepad2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <h3 className="font-semibold text-gray-900">No simulations yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Create your first branded simulation for clients.</p>
                      <Link to="/org/simulations/new" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                        Create simulation
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                <QuickAction
                  icon={<Plus className="w-5 h-5 text-blue-600" />}
                  label="Create Simulation"
                  description="Build a new simulation from scratch"
                  href="/org/simulations/new"
                  color="bg-blue-50"
                />
                <QuickAction
                  icon={<Users className="w-5 h-5 text-green-600" />}
                  label="Invite Clients"
                  description="Add new clients to your organization"
                  href="/org/clients"
                  color="bg-green-50"
                />
                <QuickAction
                  icon={<Activity className="w-5 h-5 text-purple-600" />}
                  label="View Analytics"
                  description="See detailed performance reports"
                  href="/org/analytics"
                  color="bg-purple-50"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-1">
                  {activities.length > 0 ? activities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      title={`${activity.action} ${activity.targetType}`.replace(/^\w/, (char) => char.toUpperCase())}
                      description={`${activity.actorName} ${activity.action} ${activity.targetName}`}
                      time={new Date(activity.createdAt).toLocaleDateString()}
                      type={activity.targetType === 'client' ? 'client' : activity.targetType === 'assignment' ? 'assignment' : activity.targetType === 'simulation' ? 'simulation' : 'system'}
                    />
                  )) : (
                    <div className="py-8 text-center text-sm text-gray-500">Activity will appear here as your team works.</div>
                  )}
                </div>
                <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all activity
                </button>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {clients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {(client.fullName || client.email).charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{client.fullName || client.email}</p>
                        <p className="text-xs text-gray-500">{client.completedSimulations} completions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{Math.round(client.averageScore)}%</p>
                        <p className="text-xs text-gray-500">avg score</p>
                      </div>
                    </div>
                  ))}
                  {clients.length === 0 && (
                    <div className="py-8 text-center text-sm text-gray-500">Invite clients to track performance.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}
