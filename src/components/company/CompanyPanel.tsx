import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  Globe,
  Newspaper,
  Search,
  Server,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import type {
  SimulationConfig,
  Stakeholder,
  StakeholderState,
  WeeklyEvent,
  WeeklySignal,
} from '../../shared/simulation/types';

type NewsCategory = 'internal' | 'business' | 'product' | 'industry' | 'leadership';

interface SimulationNewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  type: NewsCategory;
  week: number;
  author: string;
  priority: 'high' | 'normal';
}

interface CompanyPanelProps {
  currentWeek: number;
  config: SimulationConfig;
  stakeholderStates?: StakeholderState[];
}

const NEWS_CATEGORIES: Record<NewsCategory, { label: string; shortLabel: string }> = {
  internal: { label: 'Internal', shortLabel: 'Ops' },
  business: { label: 'Business', shortLabel: 'Biz' },
  product: { label: 'Product', shortLabel: 'Prod' },
  industry: { label: 'Industry', shortLabel: 'Mkt' },
  leadership: { label: 'Leadership', shortLabel: 'Lead' },
};

function truncateText(value: string, maxLength = 145) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function getCategoryColor(category: NewsCategory) {
  const colors: Record<NewsCategory, string> = {
    internal: 'bg-blue-500/20 text-blue-400',
    business: 'bg-emerald-500/20 text-emerald-400',
    product: 'bg-purple-500/20 text-purple-400',
    industry: 'bg-amber-500/20 text-amber-400',
    leadership: 'bg-rose-500/20 text-rose-400',
  };
  return colors[category];
}

function getSignalCategory(signal: WeeklySignal): NewsCategory {
  const source = signal.source.toLowerCase();
  const tags = signal.tags?.join(' ').toLowerCase() ?? '';
  if (source.includes('head') || source.includes('mentor') || source.includes('leadership')) return 'leadership';
  if (source.includes('support') || tags.includes('feedback')) return 'product';
  if (source.includes('growth') || tags.includes('business')) return 'business';
  if (source.includes('industry') || tags.includes('market')) return 'industry';
  return 'internal';
}

function getEventCategory(event: WeeklyEvent): NewsCategory {
  const text = `${event.title} ${event.description} ${event.from}`.toLowerCase();
  if (text.includes('head of product') || text.includes('mentor') || text.includes('manager')) return 'leadership';
  if (text.includes('prd') || text.includes('product') || text.includes('engineering')) return 'product';
  if (text.includes('portfolio') || text.includes('business')) return 'business';
  return 'internal';
}

function buildSimulationNews(config: SimulationConfig, currentWeek: number): SimulationNewsItem[] {
  const visibleSignals = (config.weeklySignals ?? []).filter((signal) => signal.week <= currentWeek);
  const visibleEvents = (config.weeklyEvents ?? []).filter((event) => event.week <= currentWeek);
  const visibleActions = (config.weeklyActions ?? []).filter((action) => action.week <= currentWeek);

  const signalNews = visibleSignals.map((signal) => ({
    id: `signal-${signal.id}`,
    title: `${signal.source} update`,
    content: signal.message,
    summary: truncateText(signal.message),
    type: getSignalCategory(signal),
    week: signal.week,
    author: signal.source,
    priority: signal.severity === 'critical' || signal.severity === 'warning' ? 'high' as const : 'normal' as const,
  }));

  const eventNews = visibleEvents.map((event) => ({
    id: `event-${event.id}`,
    title: event.title,
    content: event.description,
    summary: truncateText(event.description),
    type: getEventCategory(event),
    week: event.week,
    author: event.from,
    priority: event.priority === 'high' || event.priority === 'urgent' ? 'high' as const : 'normal' as const,
  }));

  const actionNews = visibleActions.map((action) => {
    const materialNames = action.workplaceMaterials?.map((material) => material.title).join(', ');
    const content = [
      action.description,
      action.learnerInstruction,
      materialNames ? `Source materials: ${materialNames}.` : '',
    ].filter(Boolean).join(' ');

    return {
      id: `action-${action.id}`,
      title: `Module ${action.week}: ${action.title}`,
      content,
      summary: truncateText(content),
      type: 'product' as const,
      week: action.week,
      author: 'Product workspace',
      priority: action.priority === 'high' || action.priority === 'urgent' ? 'high' as const : 'normal' as const,
    };
  });

  return [...signalNews, ...eventNews, ...actionNews].sort((a, b) => {
    if (b.week !== a.week) return b.week - a.week;
    if (a.priority !== b.priority) return a.priority === 'high' ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

function getStakeholderSatisfaction(stakeholder: Stakeholder, states?: StakeholderState[]) {
  return states?.find((state) => state.id === stakeholder.id)?.satisfaction ?? stakeholder.satisfaction;
}

function getRelationshipLabel(satisfaction: number) {
  if (satisfaction >= 75) return 'strong';
  if (satisfaction >= 55) return 'neutral';
  return 'needs attention';
}

function getRelationshipClass(satisfaction: number) {
  if (satisfaction >= 75) return 'bg-emerald-500/20 text-emerald-400';
  if (satisfaction >= 55) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-red-500/20 text-red-400';
}

export const CompanyPanel: React.FC<CompanyPanelProps> = ({
  currentWeek,
  config,
  stakeholderStates,
}) => {
  const [activeSection, setActiveSection] = useState<'news' | 'culture' | 'industry' | 'team'>('news');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsFilter, setNewsFilter] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  const simulationNews = useMemo(() => buildSimulationNews(config, currentWeek), [config, currentWeek]);
  const unreadCount = simulationNews.filter((news) => !readIds.has(news.id)).length;

  const filteredNews = simulationNews.filter(news => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = news.title.toLowerCase().includes(query) ||
      news.content.toLowerCase().includes(query) ||
      news.author.toLowerCase().includes(query);
    const matchesCategory = newsFilter === 'all' || news.type === newsFilter;
    return matchesSearch && matchesCategory;
  });

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const sections = [
    { id: 'news', label: `${config.companyName} Updates`, icon: Newspaper, count: unreadCount },
    { id: 'culture', label: 'Product Brief', icon: Building2 },
    { id: 'industry', label: `${config.industry} Context`, icon: TrendingUp },
    { id: 'team', label: 'Stakeholders', icon: Users },
  ] as const;

  const activeSectionLabel = sections.find(s => s.id === activeSection)?.label || `${config.companyName} Updates`;
  const ActiveSectionIcon = sections.find(s => s.id === activeSection)?.icon || Newspaper;

  return (
    <div className="h-full flex flex-col lg:flex-row bg-white dark:bg-[#0a0a0a]">
      <div className="lg:hidden border-b border-gray-200 dark:border-white/5">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5"
        >
          <div className="flex items-center gap-3">
            <ActiveSectionIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">{activeSectionLabel}</span>
          </div>
          {mobileMenuOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </button>

        {mobileMenuOpen && (
          <div className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </div>
                {section.count !== undefined && section.count > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {section.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block w-56 border-r border-gray-200 dark:border-white/5 p-4 space-y-1">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white'
                : 'text-[#a1a1aa] hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
            </div>
            {section.count !== undefined && section.count > 0 && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {section.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeSection === 'news' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{config.companyName} News</h2>
                <p className="text-sm text-[#a1a1aa]">Live updates from this simulation workspace</p>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#a1a1aa]" />
                <span className="text-xs text-[#a1a1aa]">{unreadCount} unread</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6 sm:flex-row">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                <input
                  type="text"
                  placeholder="Search simulation updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-[#a1a1aa] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#a1a1aa]" />
                <select
                  value={newsFilter}
                  onChange={(e) => setNewsFilter(e.target.value as NewsCategory | 'all')}
                  className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All News</option>
                  {Object.entries(NEWS_CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNews.map(news => (
                <button
                  type="button"
                  key={news.id}
                  onClick={() => markAsRead(news.id)}
                  className={`glass-panel w-full text-left p-4 rounded-xl border transition-all cursor-pointer hover:border-gray-300 dark:hover:border-white/20 ${
                    readIds.has(news.id) ? 'border-gray-200 dark:border-white/5' : 'border-l-2 border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(news.type)}`}>
                        {NEWS_CATEGORIES[news.type].shortLabel} - {NEWS_CATEGORIES[news.type].label}
                      </span>
                      {news.priority === 'high' && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Important</span>
                      )}
                    </div>
                    <div className="text-xs text-[#a1a1aa] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Week {news.week}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{news.title}</h3>
                  <p className="text-sm text-[#a1a1aa] mb-2">{news.summary}</p>
                  <div className="text-xs text-[#a1a1aa]">
                    By {news.author}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'culture' && (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{config.companyName}</h2>
              <p className="text-[#a1a1aa]">{config.description}</p>
            </div>

            <div className="grid gap-6 mb-8 xl:grid-cols-2">
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Business Goal
                </h3>
                <p className="text-sm text-[#a1a1aa]">{config.challenge}</p>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Current Product Problem
                </h3>
                <p className="text-sm text-[#a1a1aa]">{config.challengeDetails}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Success Criteria</h3>
              <div className="grid gap-3">
                {config.successCriteria.map((criterion, index) => (
                  <div key={criterion.id} className="flex items-start gap-3 p-3 bg-gray-100 dark:bg-white/5 rounded-lg">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-sm text-gray-900 dark:text-white">{criterion.description}</span>
                      <div className="mt-1 text-xs text-[#a1a1aa]">Due week {criterion.weekDue ?? 'TBD'} - {criterion.priority} priority</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center">
                <div className="break-words text-xl font-bold text-gray-900 dark:text-white">{config.founded}</div>
                <div className="text-xs text-[#a1a1aa]">Founded</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center">
                <div className="break-words text-xl font-bold text-gray-900 dark:text-white">{config.employees}</div>
                <div className="text-xs text-[#a1a1aa]">Employees</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center">
                <div className="break-words text-xl font-bold text-gray-900 dark:text-white">{config.headquarters}</div>
                <div className="text-xs text-[#a1a1aa]">HQ</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center">
                <div className="break-words text-xl font-bold text-gray-900 dark:text-white">{config.fundingStatus}</div>
                <div className="text-xs text-[#a1a1aa]">Funding</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'industry' && (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{config.industry} Context</h2>
              <p className="text-sm text-[#a1a1aa]">Market, technical, metric, and risk context for this simulation</p>
            </div>

            <div className="grid gap-4 mb-8 xl:grid-cols-2">
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Market Context
                </h3>
                <p className="text-sm text-[#a1a1aa]">{config.marketContext}</p>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  Technical Environment
                </h3>
                <p className="text-sm text-[#a1a1aa]">{config.technicalStack}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Simulation Metrics
              </h3>
              <div className="grid gap-3 xl:grid-cols-2">
                {config.kpis.map(kpi => (
                  <div key={kpi.id} className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-[#a1a1aa]">{kpi.status} status</span>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{kpi.label}</h4>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{kpi.value}/{kpi.maxValue}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, Math.max(0, kpi.progress))}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-[#a1a1aa]">Goal: {kpi.goal}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Current Risks
              </h3>
              <div className="space-y-3">
                {config.currentRisks.map(risk => (
                  <div key={risk.id} className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{risk.title}</h4>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">{risk.severity}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">{risk.likelihood}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'team' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Simulation Team</h2>
              <p className="text-sm text-[#a1a1aa]">Stakeholders configured for {config.companyName}</p>
            </div>

            <div className="grid gap-4">
              {config.stakeholders.map(stakeholder => {
                const satisfaction = getStakeholderSatisfaction(stakeholder, stakeholderStates);
                return (
                  <div key={stakeholder.id} className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gray-200 dark:border-white/10 transition-all">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                        {stakeholder.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{stakeholder.name}</h3>
                            <p className="text-sm text-blue-400">{stakeholder.role}</p>
                            <p className="text-xs text-[#a1a1aa]">{stakeholder.department} - {stakeholder.communicationStyle} communicator</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Influence {stakeholder.influence}/10</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${getRelationshipClass(satisfaction)}`}>
                              {getRelationshipLabel(satisfaction)} - {satisfaction}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 text-xs lg:grid-cols-2">
                          <div>
                            <span className="text-[#a1a1aa]">Concerns</span>
                            <ul className="text-gray-900 dark:text-white mt-1 space-y-1">
                              {stakeholder.concerns.map((concern) => <li key={concern}>- {concern}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[#a1a1aa]">Priorities</span>
                            <ul className="text-gray-900 dark:text-white mt-1 space-y-1">
                              {stakeholder.priorities.map((priority) => <li key={priority}>- {priority}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center">
                <Award className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                <div className="break-words text-xl font-bold text-gray-900 dark:text-white">{config.teamSize}</div>
                <div className="text-xs text-[#a1a1aa]">Team size</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center">
                <Users className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                <div className="break-words text-xl font-bold text-gray-900 dark:text-white">{config.stakeholders.length}</div>
                <div className="text-xs text-[#a1a1aa]">Stakeholders</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center">
                <BookOpen className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                <div className="break-words text-sm font-bold leading-snug text-gray-900 dark:text-white">{config.projectType}</div>
                <div className="text-xs text-[#a1a1aa]">Project type</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPanel;
