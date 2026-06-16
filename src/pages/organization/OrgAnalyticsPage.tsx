import React, { useState, useRef } from 'react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import {
  TrendingUp,
  Users,
  Gamepad2,
  Clock,
  Award,
  Calendar,
  Download,
  ChevronDown,
  Filter,
  FileSpreadsheet,
  FileText,
  FileType2,
  Target,
  Zap,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';

// Mock data for comprehensive analytics
const mockTrendData = [
  { date: 'Apr 1', completions: 2, active: 8, newUsers: 3 },
  { date: 'Apr 3', completions: 3, active: 9, newUsers: 1 },
  { date: 'Apr 5', completions: 4, active: 10, newUsers: 2 },
  { date: 'Apr 7', completions: 3, active: 12, newUsers: 0 },
  { date: 'Apr 9', completions: 5, active: 11, newUsers: 2 },
  { date: 'Apr 11', completions: 4, active: 13, newUsers: 1 },
  { date: 'Apr 13', completions: 6, active: 14, newUsers: 3 },
  { date: 'Apr 15', completions: 5, active: 15, newUsers: 2 },
  { date: 'Apr 17', completions: 7, active: 16, newUsers: 1 },
  { date: 'Apr 19', completions: 6, active: 15, newUsers: 0 },
  { date: 'Apr 21', completions: 8, active: 17, newUsers: 2 },
  { date: 'Apr 23', completions: 7, active: 16, newUsers: 1 },
  { date: 'Apr 25', completions: 9, active: 18, newUsers: 3 },
  { date: 'Apr 27', completions: 8, active: 19, newUsers: 2 },
  { date: 'Apr 30', completions: 10, active: 20, newUsers: 1 },
];

const mockSimulationStats = [
  { name: 'PM-01: The Growth Stall', completions: 18, avgScore: 82, trend: 'up', totalTime: 2400, difficulty: 'intermediate', category: 'project-management' },
  { name: 'Team Restructure', completions: 6, avgScore: 78, trend: 'stable', totalTime: 720, difficulty: 'beginner', category: 'team-building' },
  { name: 'Crisis Communication', completions: 12, avgScore: 85, trend: 'up', totalTime: 1560, difficulty: 'advanced', category: 'crisis-management' },
  { name: 'Product Launch Strategy', completions: 32, avgScore: 85, trend: 'down', totalTime: 4800, difficulty: 'intermediate', category: 'product-launch' },
  { name: 'Stakeholder Management', completions: 9, avgScore: 79, trend: 'up', totalTime: 1080, difficulty: 'beginner', category: 'stakeholder-management' },
];

const mockTopPerformers = [
  { name: 'Sarah Chen', score: 94, completions: 8, trend: 'up', timeSpent: 420, simulations: ['PM-01', 'Crisis Communication', 'Team Restructure'] },
  { name: 'Marcus Johnson', score: 89, completions: 6, trend: 'stable', timeSpent: 380, simulations: ['PM-01', 'Product Launch', 'Crisis Communication'] },
  { name: 'Emily Rodriguez', score: 87, completions: 5, trend: 'up', timeSpent: 290, simulations: ['Team Restructure', 'Crisis Communication'] },
  { name: 'David Park', score: 85, completions: 4, trend: 'down', timeSpent: 310, simulations: ['PM-01', 'Product Launch'] },
  { name: 'Aisha Mohammed', score: 82, completions: 4, trend: 'stable', timeSpent: 280, simulations: ['PM-01', 'Team Restructure', 'Product Launch'] },
];

const mockCohortData = [
  { week: 'Week 1', retention: [100, 65, 52, 48, 45] },
  { week: 'Week 2', retention: [100, 70, 58, 52, 48] },
  { week: 'Week 3', retention: [100, 68, 55, 50, 44] },
  { week: 'Week 4', retention: [100, 72, 60, 54, 50] },
];

const mockScoreDistribution = [
  { range: '90-100%', count: 8, label: 'Excellent' },
  { range: '80-89%', count: 15, label: 'Good' },
  { range: '70-79%', count: 12, label: 'Average' },
  { range: '60-69%', count: 6, label: 'Below Average' },
  { range: 'Below 60%', count: 3, label: 'Needs Improvement' },
];

const mockEngagementMetrics = [
  { metric: 'Daily Active Users', value: 16, change: '+12%', trend: 'up' },
  { metric: 'Session Duration', value: '42m', change: '+8%', trend: 'up' },
  { metric: 'Return Rate', value: '76%', change: '+5%', trend: 'up' },
  { metric: 'Completion Rate', value: '68%', change: '-3%', trend: 'down' },
];

// Simple bar chart component
function SimpleBarChart({ data }: { data: typeof mockTrendData }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.completions, d.active, d.newUsers)));
  
  return (
    <div className="h-64 flex items-end justify-between gap-1">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '200px' }}>
            <div
              className="flex-1 bg-purple-400 rounded-t hover:bg-purple-500 transition-colors"
              style={{ height: `${(item.newUsers / maxValue) * 100}%` }}
              title={`New Users: ${item.newUsers}`}
            />
            <div
              className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
              style={{ height: `${(item.active / maxValue) * 100}%` }}
              title={`Active: ${item.active}`}
            />
            <div
              className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors"
              style={{ height: `${(item.completions / maxValue) * 100}%` }}
              title={`Completions: ${item.completions}`}
            />
          </div>
          <span className="text-xs text-gray-500 rotate-0 md:rotate-0 whitespace-nowrap">{item.date}</span>
        </div>
      ))}
    </div>
  );
}

// Score Distribution Bar Chart
function ScoreDistributionChart({ data }: { data: typeof mockScoreDistribution }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const colors = ['bg-green-500', 'bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400'];
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">{item.range}</span>
              <span className="text-gray-500">{item.count} users</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", colors[index])}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Cohort Retention Table
function CohortTable({ data }: { data: typeof mockCohortData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-2 font-medium text-gray-500">Cohort</th>
            <th className="text-center py-2 px-2 font-medium text-gray-500">Users</th>
            {[1, 2, 3, 4, 5].map(week => (
              <th key={week} className="text-center py-2 px-2 font-medium text-gray-500">Week {week}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((cohort, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-2 px-2 font-medium text-gray-900">{cohort.week}</td>
              <td className="py-2 px-2 text-center text-gray-600">24</td>
              {cohort.retention.map((rate, i) => (
                <td key={i} className="py-2 px-2">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-12 h-8 rounded text-xs font-medium",
                      rate >= 70 ? "bg-green-100 text-green-700" :
                      rate >= 50 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    )}
                  >
                    {rate}%
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Stat Card
function StatCard({ title, value, change, icon, color }: { 
  title: string; 
  value: string; 
  change?: string; 
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  const isNegative = change?.startsWith('-');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-1 flex items-center gap-1",
              isNegative ? "text-red-600" : "text-green-600"
            )}>
              {isNegative ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colors[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Export Menu Component
function ExportMenu({ onExport }: { onExport: (format: 'csv' | 'pdf' | 'excel') => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          <button
            onClick={() => { onExport('csv'); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Export as CSV</p>
              <p className="text-xs text-gray-500">Comma-separated values</p>
            </div>
          </button>
          <button
            onClick={() => { onExport('excel'); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Export as Excel</p>
              <p className="text-xs text-gray-500">Microsoft Excel format</p>
            </div>
          </button>
          <button
            onClick={() => { onExport('pdf'); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <FileType2 className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Export as PDF</p>
              <p className="text-xs text-gray-500">Portable document format</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default function OrgAnalyticsPage() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [activeTab, setActiveTab] = useState('overview');
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    setExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would generate and download the file
    const formats = { csv: 'CSV', pdf: 'PDF', excel: 'Excel' };
    alert(`Analytics report exported as ${formats[format]}!`);
    
    setExporting(false);
  };

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'simulations', label: 'Simulations', icon: Gamepad2 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'engagement', label: 'Engagement', icon: Activity },
  ];

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Track your organization's performance and engagement
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="last-year">Last year</option>
              <option value="custom">Custom range</option>
            </select>
            <ExportMenu onExport={handleExport} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Completions"
                value="56"
                change="+12% from last month"
                icon={<CheckIcon className="w-6 h-6" />}
                color="green"
              />
              <StatCard
                title="Active Users"
                value="24"
                change="+5% from last month"
                icon={<Users className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                title="Avg Completion Time"
                value="4.2 days"
                change="-8% from last month"
                icon={<Clock className="w-6 h-6" />}
                color="purple"
              />
              <StatCard
                title="Avg Score"
                value="82%"
                change="+3% from last month"
                icon={<Award className="w-6 h-6" />}
                color="orange"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-gray-900">Activity Overview</h2>
                    <p className="text-sm text-gray-500">Active users, completions, and new users over time</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded" />
                      <span className="text-gray-600">New</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded" />
                      <span className="text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded" />
                      <span className="text-gray-600">Completed</span>
                    </div>
                  </div>
                </div>
                <SimpleBarChart data={mockTrendData} />
              </div>

              {/* Score Distribution */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-gray-900">Score Distribution</h2>
                    <p className="text-sm text-gray-500">How clients are performing across all simulations</p>
                  </div>
                </div>
                <ScoreDistributionChart data={mockScoreDistribution} />
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Participants</span>
                    <span className="font-semibold text-gray-900">44</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Pass Rate (70%+)</span>
                    <span className="font-semibold text-green-600">79.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-gray-900">Top Performers</h2>
                  <p className="text-sm text-gray-500">Clients with highest scores and most completions</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTopPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{performer.name}</p>
                      <p className="text-sm text-gray-500">{performer.completions} completions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{performer.score}%</p>
                      <p className={cn(
                        "text-xs",
                        performer.trend === 'up' ? "text-green-600" : 
                        performer.trend === 'down' ? "text-red-600" : "text-gray-500"
                      )}>
                        {performer.trend === 'up' ? '↑' : performer.trend === 'down' ? '↓' : '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cohort Retention */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-gray-900">Cohort Retention</h2>
                  <p className="text-sm text-gray-500">Client retention rate by signup week</p>
                </div>
              </div>
              <CohortTable data={mockCohortData} />
            </div>
          </>
        )}

        {/* Simulations Tab */}
        {activeTab === 'simulations' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Simulation Performance</h2>
              <p className="text-sm text-gray-500">Detailed metrics for each simulation</p>
            </div>
            <div className="divide-y divide-gray-100">
              {mockSimulationStats.map((sim) => (
                <div key={sim.name} className="p-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center font-bold text-blue-600">
                      {sim.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{sim.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                          {sim.category.replace('-', ' ')}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs capitalize",
                          sim.difficulty === 'beginner' ? "bg-green-100 text-green-700" :
                          sim.difficulty === 'intermediate' ? "bg-blue-100 text-blue-700" :
                          "bg-purple-100 text-purple-700"
                        )}>
                          {sim.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{sim.completions}</p>
                      <p className="text-xs text-gray-500">Completions</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{sim.avgScore}%</p>
                      <p className="text-xs text-gray-500">Avg Score</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{Math.round(sim.totalTime / 60)}h</p>
                      <p className="text-xs text-gray-500">Total Time</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className={cn(
                        "text-2xl font-bold",
                        sim.trend === 'up' ? "text-green-600" : 
                        sim.trend === 'down' ? "text-red-600" : "text-gray-600"
                      )}>
                        {sim.trend === 'up' ? '↑' : sim.trend === 'down' ? '↓' : '—'}
                      </p>
                      <p className="text-xs text-gray-500">Trend</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Client Engagement</h2>
              <div className="space-y-4">
                {mockEngagementMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        metric.trend === 'up' ? "bg-green-100 text-green-600" : 
                        metric.trend === 'down' ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
                      )}>
                        {metric.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : 
                         metric.trend === 'down' ? <TrendingDown className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{metric.metric}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{metric.value}</p>
                      <p className={cn(
                        "text-xs",
                        metric.change.startsWith('+') ? "text-green-600" : "text-red-600"
                      )}>
                        {metric.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Client Activity</h2>
              <div className="space-y-3">
                {mockTopPerformers.slice(0, 5).map((client, index) => (
                  <div key={client.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round(client.timeSpent / 60)}h total time
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{client.completions}</p>
                      <p className="text-xs text-gray-500">completions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <p className="text-blue-100 text-sm">Peak Activity Time</p>
                <p className="text-2xl font-bold mt-1">2:00 PM - 4:00 PM</p>
                <p className="text-blue-100 text-sm mt-1">Most active period</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <p className="text-purple-100 text-sm">Avg Session Length</p>
                <p className="text-2xl font-bold mt-1">42 minutes</p>
                <p className="text-purple-100 text-sm mt-1">+8% from last month</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <p className="text-green-100 text-sm">Return Rate</p>
                <p className="text-2xl font-bold mt-1">76%</p>
                <p className="text-green-100 text-sm mt-1">Clients come back</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Weekly Activity Pattern</h2>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const activity = [85, 92, 78, 88, 95, 45, 38][index];
                  return (
                    <div key={day} className="text-center">
                      <div className="h-32 bg-gray-100 rounded-lg relative overflow-hidden mb-2">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-b-lg transition-all"
                          style={{ height: `${activity}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600">{day}</p>
                      <p className="text-xs font-semibold text-gray-900">{activity}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </OrgLayout>
  );
}

// Simple check icon
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// TrendingUp icon - renamed to avoid conflict
function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
