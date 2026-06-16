import { useState } from 'react';
import {
  LayoutGrid,
  Users,
  BarChart3,
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  Clock,
  TrendingUp,
  Building,
  Shield,
} from 'lucide-react';
import { ScrollReveal } from '../../components/ui/scroll-reveal';

interface SimulationTemplate {
  id: string;
  name: string;
  archetype: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  status: 'Active' | 'Draft' | 'Archived';
  roles: string[];
  createdAt: string;
}

interface SystemStats {
  totalSimulations: number;
  totalUsers: number;
  totalOrganizations: number;
  activeSimulations: number;
  completionsThisMonth: number;
  averageScore: number;
}

interface RecentActivity {
  id: string;
  action: string;
  entity: string;
  user: string;
  timestamp: string;
}

const MOCK_TEMPLATES: SimulationTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Product Launch Strategy',
    archetype: 'Product Management',
    difficulty: 'Intermediate',
    status: 'Active',
    roles: ['Product Manager', 'Project Lead'],
    createdAt: '2025-01-15',
  },
  {
    id: 'tpl-002',
    name: 'Team Restructuring Plan',
    archetype: 'People Management',
    difficulty: 'Advanced',
    status: 'Active',
    roles: ['Engineering Manager', 'Team Lead'],
    createdAt: '2025-02-03',
  },
  {
    id: 'tpl-003',
    name: 'Budget Reallocation Exercise',
    archetype: 'Finance',
    difficulty: 'Expert',
    status: 'Active',
    roles: ['Finance Manager', 'CFO'],
    createdAt: '2025-02-20',
  },
  {
    id: 'tpl-004',
    name: 'Crisis Communication Scenario',
    archetype: 'Communications',
    difficulty: 'Intermediate',
    status: 'Draft',
    roles: ['PR Manager', 'Communications Lead'],
    createdAt: '2025-03-10',
  },
  {
    id: 'tpl-005',
    name: 'Agile Sprint Planning',
    archetype: 'Product Management',
    difficulty: 'Beginner',
    status: 'Active',
    roles: ['Scrum Master', 'Product Owner'],
    createdAt: '2025-03-25',
  },
  {
    id: 'tpl-006',
    name: 'Vendor Negotiation Simulation',
    archetype: 'Operations',
    difficulty: 'Advanced',
    status: 'Archived',
    roles: ['Procurement Manager', 'Operations Lead'],
    createdAt: '2025-01-05',
  },
  {
    id: 'tpl-007',
    name: 'Performance Review Workshop',
    archetype: 'People Management',
    difficulty: 'Intermediate',
    status: 'Active',
    roles: ['HR Manager', 'Team Lead'],
    createdAt: '2025-04-01',
  },
  {
    id: 'tpl-008',
    name: 'Market Entry Strategy',
    archetype: 'Strategy',
    difficulty: 'Expert',
    status: 'Draft',
    roles: ['Strategy Manager', 'Business Analyst'],
    createdAt: '2025-04-15',
  },
];

const MOCK_SYSTEM_STATS: SystemStats = {
  totalSimulations: 1247,
  totalUsers: 8934,
  totalOrganizations: 156,
  activeSimulations: 423,
  completionsThisMonth: 189,
  averageScore: 78.5,
};

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  { id: 'act-001', action: 'Created', entity: 'Market Entry Strategy template', user: 'admin@turnve.com', timestamp: '2 hours ago' },
  { id: 'act-002', action: 'Updated', entity: 'Performance Review Workshop', user: 'admin@turnve.com', timestamp: '5 hours ago' },
  { id: 'act-003', action: 'Archived', entity: 'Vendor Negotiation Simulation', user: 'admin@turnve.com', timestamp: '1 day ago' },
  { id: 'act-004', action: 'Published', entity: 'Agile Sprint Planning template', user: 'admin@turnve.com', timestamp: '2 days ago' },
  { id: 'act-005', action: 'Deleted', entity: 'Legacy Onboarding template', user: 'admin@turnve.com', timestamp: '3 days ago' },
];

const MOCK_ROLE_DISTRIBUTION = [
  { role: 'Product Manager', count: 1245 },
  { role: 'Engineering Manager', count: 987 },
  { role: 'Team Lead', count: 1567 },
  { role: 'Finance Manager', count: 432 },
  { role: 'HR Manager', count: 654 },
  { role: 'Operations Lead', count: 789 },
  { role: 'Other', count: 3260 },
];

type TabType = 'templates' | 'users' | 'stats';

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Archived: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
};

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-blue-500/15 text-blue-400',
  Intermediate: 'bg-indigo-500/15 text-indigo-400',
  Advanced: 'bg-purple-500/15 text-purple-400',
  Expert: 'bg-rose-500/15 text-rose-400',
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [archetypeFilter, setArchetypeFilter] = useState('All');

  const archetypes = ['All', ...Array.from(new Set(MOCK_TEMPLATES.map((t) => t.archetype)))];

  const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.archetype.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.roles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesArchetype = archetypeFilter === 'All' || template.archetype === archetypeFilter;
    return matchesSearch && matchesArchetype;
  });

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'stats', label: 'System Stats', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-white">Platform Admin</h1>
                <p className="text-xs text-gray-400">System Management</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/15 text-primary'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-300">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@turnve.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <ScrollReveal className="mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {activeTab === 'templates' && 'Simulation Templates'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'stats' && 'System Statistics'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === 'templates' && 'Manage platform-wide simulation templates'}
                {activeTab === 'users' && 'View and manage system users'}
                {activeTab === 'stats' && 'Platform performance and usage metrics'}
              </p>
            </ScrollReveal>

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <ScrollReveal className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                  </div>
                  <select
                    value={archetypeFilter}
                    onChange={(e) => setArchetypeFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  >
                    {archetypes.map((archetype) => (
                      <option key={archetype} value={archetype}>
                        {archetype}
                      </option>
                    ))}
                  </select>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                    <Plus className="h-4 w-4" />
                    New Template
                  </button>
                </div>

                {/* Template Table */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Template</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Archetype</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Roles</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredTemplates.map((template) => (
                          <tr key={template.id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-gray-200">{template.name}</p>
                              <p className="text-xs text-gray-500">{template.id}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-300">{template.archetype}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[template.difficulty]}`}>
                                {template.difficulty}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${statusColors[template.status]}`}>
                                {template.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {template.roles.slice(0, 2).map((role) => (
                                  <span key={role} className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                                    {role}
                                  </span>
                                ))}
                                {template.roles.length > 2 && (
                                  <span className="text-xs text-gray-500">+{template.roles.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* TODO: Implement edit handler - integrate with backend API */}
                                <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                                {/* TODO: Implement delete handler - integrate with backend API */}
                                <button className="p-1.5 rounded hover:bg-red-500/15 text-gray-400 hover:text-red-400 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredTemplates.length === 0 && (
                    <div className="p-8 text-center">
                      <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No templates found</p>
                    </div>
                  )}
                </div>

                {/* Backend API Integration Note */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-400">API Integration:</span>{' '}
                    Fetch templates from <code className="bg-gray-800 px-1 py-0.5 rounded text-primary">GET /api/v1/admin/simulations</code>.
                    CRUD operations will use POST/PUT/DELETE endpoints.
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <ScrollReveal className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Users</p>
                        <p className="text-2xl font-semibold text-white mt-1">{MOCK_SYSTEM_STATS.totalUsers.toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active This Month</p>
                        <p className="text-2xl font-semibold text-white mt-1">2,341</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">New Signups</p>
                        <p className="text-2xl font-semibold text-white mt-1">187</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Organizations</p>
                        <p className="text-2xl font-semibold text-white mt-1">{MOCK_SYSTEM_STATS.totalOrganizations}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                        <Building className="h-5 w-5 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Distribution */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Role Distribution</h3>
                  <div className="space-y-3">
                    {MOCK_ROLE_DISTRIBUTION.map((item) => {
                      const percentage = (item.count / MOCK_SYSTEM_STATS.totalUsers) * 100;
                      return (
                        <div key={item.role} className="flex items-center gap-4">
                          <span className="text-sm text-gray-300 w-40 shrink-0">{item.role}</span>
                          <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-16 text-right">{item.count.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Backend API Integration Note */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-400">API Integration:</span>{' '}
                    Fetch users from <code className="bg-gray-800 px-1 py-0.5 rounded text-primary">GET /api/v1/admin/users</code>.
                    User management actions will use corresponding endpoints.
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* System Stats Tab */}
            {activeTab === 'stats' && (
              <ScrollReveal className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                        <LayoutGrid className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-400">Total Simulations</h3>
                    </div>
                    <p className="text-3xl font-semibold text-white">{MOCK_SYSTEM_STATS.totalSimulations.toLocaleString()}</p>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% from last month
                    </p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                    </div>
                    <p className="text-3xl font-semibold text-white">{MOCK_SYSTEM_STATS.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% from last month
                    </p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                        <Building className="h-5 w-5 text-amber-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-400">Total Organizations</h3>
                    </div>
                    <p className="text-3xl font-semibold text-white">{MOCK_SYSTEM_STATS.totalOrganizations}</p>
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +3% from last month
                    </p>
                  </div>
                </div>

                {/* Activity Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-base font-semibold text-white mb-4">Activity Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Active Simulations</span>
                        <span className="text-lg font-semibold text-white">{MOCK_SYSTEM_STATS.activeSimulations}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Completions This Month</span>
                        <span className="text-lg font-semibold text-white">{MOCK_SYSTEM_STATS.completionsThisMonth}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Average Score</span>
                        <span className="text-lg font-semibold text-white">{MOCK_SYSTEM_STATS.averageScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-base font-semibold text-white mb-4">Platform Health</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">API Uptime</span>
                        <span className="text-lg font-semibold text-emerald-400">99.9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Avg Response Time</span>
                        <span className="text-lg font-semibold text-white">145ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Error Rate</span>
                        <span className="text-lg font-semibold text-emerald-400">0.02%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Recent Activity
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {MOCK_RECENT_ACTIVITY.map((activity) => (
                      <div key={activity.id} className="px-6 py-4 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-200">
                              <span className="font-medium text-white">{activity.action}</span>{' '}
                              {activity.entity}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">by {activity.user}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend API Integration Note */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-400">API Integration:</span>{' '}
                    Fetch stats from <code className="bg-gray-800 px-1 py-0.5 rounded text-primary">GET /api/v1/admin/stats</code>{' '}
                    and activity from <code className="bg-gray-800 px-1 py-0.5 rounded text-primary">GET /api/v1/admin/activity</code>.
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminPage;
