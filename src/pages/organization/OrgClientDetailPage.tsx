import React, { useState } from 'react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  Target,
  Gamepad2,
  Send,
  MoreHorizontal,
  Edit,
  Ban,
  Archive,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';

// Mock data
const mockClient = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  status: 'active',
  joinedAt: '2026-04-15',
  lastActiveAt: '2026-05-04',
  department: 'Product',
  role: 'Product Manager',
  bio: 'Product Manager with 5 years of experience in SaaS. Passionate about user-centered design and data-driven decisions.',
  tags: ['high-performer', 'senior', 'mentor'],
  simulationsCompleted: 3,
  totalSimulations: 4,
  averageScore: 92,
  totalTime: 420,
  streak: 5,
  rank: 1,
};

const mockSimulations = [
  {
    id: '1',
    title: 'PM-01: The Growth Stall',
    status: 'completed',
    score: 94,
    completedAt: '2026-05-03',
    timeSpent: 125,
    attempts: 1,
  },
  {
    id: '2',
    title: 'Crisis Communication',
    status: 'in_progress',
    score: null,
    completedAt: null,
    timeSpent: 45,
    attempts: 1,
    progress: 45,
  },
  {
    id: '3',
    title: 'Team Restructure',
    status: 'assigned',
    score: null,
    completedAt: null,
    timeSpent: 0,
    attempts: 0,
    progress: 0,
  },
];

const mockActivity = [
  {
    id: '1',
    type: 'simulation_completed',
    title: 'Completed PM-01: The Growth Stall',
    description: 'Scored 94% - Excellent performance',
    timestamp: '2026-05-03T14:30:00Z',
  },
  {
    id: '2',
    type: 'simulation_started',
    title: 'Started Crisis Communication',
    description: 'Beginner difficulty',
    timestamp: '2026-05-01T10:00:00Z',
  },
  {
    id: '3',
    type: 'joined',
    title: 'Joined organization',
    description: 'Accepted invitation',
    timestamp: '2026-04-15T09:00:00Z',
  },
];

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-green-100 text-green-700',
    invited: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-gray-100 text-gray-700',
  };

  const icons = {
    active: <CheckCircle className="w-3 h-3" />,
    invited: <Mail className="w-3 h-3" />,
    inactive: <XCircle className="w-3 h-3" />,
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      styles[status as keyof typeof styles]
    )}>
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Stat Card
function StatCard({ label, value, subtext, icon }: { label: string; value: string; subtext?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

// Simulation Row
function SimulationRow({ simulation }: { simulation: typeof mockSimulations[0] }) {
  const statusLabels: Record<string, string> = {
    completed: 'Completed',
    in_progress: 'In Progress',
    assigned: 'Not Started',
  };

  const statusStyles: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    assigned: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center font-bold text-blue-600">
        {simulation.title.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900">{simulation.title}</h3>
        <p className="text-sm text-gray-500">
          {simulation.timeSpent > 0 ? `${simulation.timeSpent} min spent` : 'Not started yet'}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {simulation.status === 'in_progress' && simulation.progress !== undefined && (
          <div className="w-32">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{simulation.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${simulation.progress}%` }}
              />
            </div>
          </div>
        )}
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          statusStyles[simulation.status]
        )}>
          {statusLabels[simulation.status]}
        </span>
        {simulation.score !== null && (
          <span className="text-sm font-semibold text-gray-900">{simulation.score}%</span>
        )}
      </div>
    </div>
  );
}

// Activity Item
function ActivityItem({ activity }: { activity: typeof mockActivity[0] }) {
  const typeIcons = {
    simulation_completed: <Award className="w-4 h-4 text-green-600" />,
    simulation_started: <Gamepad2 className="w-4 h-4 text-blue-600" />,
    joined: <CheckCircle className="w-4 h-4 text-purple-600" />,
  };

  const typeColors = {
    simulation_completed: 'bg-green-100',
    simulation_started: 'bg-blue-100',
    joined: 'bg-purple-100',
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", typeColors[activity.type as keyof typeof typeColors])}>
        {typeIcons[activity.type as keyof typeof typeIcons]}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{timeAgo(activity.timestamp)}</p>
      </div>
    </div>
  );
}

export default function OrgClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'simulations' | 'activity'>('overview');
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader />;

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/org/clients')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Clients
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {mockClient.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockClient.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gray-600">{mockClient.email}</span>
                  <StatusBadge status={mockClient.status} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">{mockClient.department}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{mockClient.role}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMessageDialog(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Send className="w-4 h-4" />
                Message
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {mockClient.bio && (
            <p className="text-gray-600 mt-4 max-w-2xl">{mockClient.bio}</p>
          )}

          {mockClient.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {mockClient.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Simulations Completed"
            value={`${mockClient.simulationsCompleted}/${mockClient.totalSimulations}`}
            subtext="75% completion rate"
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <StatCard
            label="Average Score"
            value={`${mockClient.averageScore}%`}
            subtext="Top 10% performer"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            label="Total Time"
            value={`${Math.round(mockClient.totalTime / 60)}h`}
            subtext={`${mockClient.totalTime} minutes total`}
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            label="Current Streak"
            value={`${mockClient.streak} days`}
            subtext={`Ranked #${mockClient.rank} in org`}
            icon={<Award className="w-5 h-5" />}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              {['overview', 'simulations', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={cn(
                    'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Simulations</h3>
                  <div className="space-y-2">
                    {mockSimulations.slice(0, 3).map((sim) => (
                      <SimulationRow key={sim.id} simulation={sim} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-1">
                    {mockActivity.slice(0, 3).map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'simulations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">All Simulations</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Target className="w-4 h-4" />
                    Assign New
                  </button>
                </div>
                <div className="space-y-2">
                  {mockSimulations.map((sim) => (
                    <SimulationRow key={sim.id} simulation={sim} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-1">
                {mockActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Dialog */}
      {showMessageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Send Message</h2>
            <p className="text-gray-600 mb-6">Send a message to {mockClient.name}</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowMessageDialog(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMessageDialog(false);
                  setMessage('');
                }}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </OrgLayout>
  );
}
