import { useState } from 'react';
import { 
  Newspaper, Building2, TrendingUp, Users, 
  Bell, Filter, Search, ExternalLink, Calendar,
  ChevronRight, Star, Target, Award, Globe
} from 'lucide-react';
import type { CompanyNews, NewsCategory, IndustryTrend, StakeholderProfile, TeamMember } from '../../company/types';
import { NEWS_CATEGORIES, INITIAL_NEWS, INDUSTRY_TRENDS, ENHANCED_STAKEHOLDERS, TEAM_MEMBERS, DEFAULT_COMPANY, COMPETITORS } from '../../company/types';

interface CompanyPanelProps {
  currentWeek: number;
  onAddNews?: (news: CompanyNews) => void;
}

export const CompanyPanel: React.FC<CompanyPanelProps> = ({ currentWeek }) => {
  const [activeSection, setActiveSection] = useState<'news' | 'culture' | 'industry' | 'team'>('news');
  const [newsFilter, setNewsFilter] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(INITIAL_NEWS.filter(n => !n.isRead).length);

  const filteredNews = INITIAL_NEWS.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = newsFilter === 'all' || news.type === newsFilter;
    return matchesSearch && matchesCategory;
  });

  const markAsRead = (id: string) => {
    const news = INITIAL_NEWS.find(n => n.id === id);
    if (news && !news.isRead) {
      news.isRead = true;
      setUnreadCount(prev => prev - 1);
    }
  };

  const getCategoryColor = (category: NewsCategory) => {
    const colors: Record<NewsCategory, string> = {
      internal: 'bg-blue-500/20 text-blue-400',
      business: 'bg-emerald-500/20 text-emerald-400',
      product: 'bg-purple-500/20 text-purple-400',
      industry: 'bg-amber-500/20 text-amber-400',
      leadership: 'bg-rose-500/20 text-rose-400',
    };
    return colors[category];
  };

  const sections = [
    { id: 'news', label: 'News Feed', icon: Newspaper, count: unreadCount },
    { id: 'culture', label: 'About', icon: Building2 },
    { id: 'industry', label: 'Industry', icon: TrendingUp },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <div className="h-full flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 p-4 space-y-1">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-white/5 text-white'
                : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'news' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Company News</h2>
                <p className="text-sm text-[#a1a1aa]">Latest updates and announcements</p>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#a1a1aa]" />
                <span className="text-xs text-[#a1a1aa]">{unreadCount} unread</span>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#a1a1aa] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#a1a1aa]" />
                <select
                  value={newsFilter}
                  onChange={(e) => setNewsFilter(e.target.value as NewsCategory | 'all')}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All News</option>
                  {Object.entries(NEWS_CATEGORIES).map(([key, val]) => (
                    <option key={key} value={key}>{val.icon} {val.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* News List */}
            <div className="space-y-4">
              {filteredNews.map(news => (
                <div
                  key={news.id}
                  onClick={() => markAsRead(news.id)}
                  className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer hover:border-white/20 ${
                    news.isRead ? 'border-white/5' : 'border-l-2 border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(news.type)}`}>
                        {NEWS_CATEGORIES[news.type].icon} {NEWS_CATEGORIES[news.type].label}
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
                  <h3 className="font-semibold text-white mb-1">{news.title}</h3>
                  <p className="text-sm text-[#a1a1aa] mb-2">{news.summary || news.content.slice(0, 150)}...</p>
                  <div className="text-xs text-[#a1a1aa]">
                    By {news.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'culture' && (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{DEFAULT_COMPANY.name}</h2>
              <p className="text-[#a1a1aa]">{DEFAULT_COMPANY.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="glass-panel p-4 rounded-xl border border-white/5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Mission
                </h3>
                <p className="text-sm text-[#a1a1aa]">{DEFAULT_COMPANY.mission}</p>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Vision
                </h3>
                <p className="text-sm text-[#a1a1aa]">{DEFAULT_COMPANY.vision}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-white mb-4">Core Values</h3>
              <div className="grid gap-3">
                {DEFAULT_COMPANY.values.map((value, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-blue-400 text-lg">{String.fromCharCode(65 + i)}</span>
                    <span className="text-sm text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                <div className="text-2xl font-bold text-white">{DEFAULT_COMPANY.founded}</div>
                <div className="text-xs text-[#a1a1aa]">Founded</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                <div className="text-2xl font-bold text-white">{DEFAULT_COMPANY.size}</div>
                <div className="text-xs text-[#a1a1aa]">Team Size</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                <div className="text-2xl font-bold text-white">{DEFAULT_COMPANY.headquarters}</div>
                <div className="text-xs text-[#a1a1aa]">HQ</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'industry' && (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Industry Insights</h2>
              <p className="text-sm text-[#a1a1aa]">Stay informed about market trends and competitive landscape</p>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Key Trends
              </h3>
              <div className="space-y-3">
                {INDUSTRY_TRENDS.map(trend => (
                  <div key={trend.id} className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs text-[#a1a1aa]">{trend.category}</span>
                        <h4 className="font-semibold text-white">{trend.title}</h4>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        trend.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                        trend.impact === 'neutral' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {trend.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-[#a1a1aa] mb-2">{trend.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                      {trend.data && (
                        <span>{trend.data.value}% {trend.data.period}, change: {trend.data.change > 0 ? '+' : ''}{trend.data.change}%</span>
                      )}
                      {trend.source && <span>Source: {trend.source}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Competitive Landscape
              </h3>
              <div className="space-y-3">
                {COMPETITORS.map(comp => (
                  <div key={comp.id} className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-white">{comp.name}</h4>
                      <span className="text-sm text-[#a1a1aa]">{comp.marketShare}% share</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-emerald-400 font-medium">Strengths</span>
                        <ul className="text-[#a1a1aa] mt-1 space-y-1">
                          {comp.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-red-400 font-medium">Weaknesses</span>
                        <ul className="text-[#a1a1aa] mt-1 space-y-1">
                          {comp.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                        </ul>
                      </div>
                    </div>
                    {comp.recentNews && (
                      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-[#a1a1aa]">
                        📰 {comp.recentNews}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'team' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Team Directory</h2>
              <p className="text-sm text-[#a1a1aa]">Meet the people behind {DEFAULT_COMPANY.name}</p>
            </div>

            <div className="grid gap-4">
              {TEAM_MEMBERS.map(member => (
                <div key={member.id} className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-sm text-blue-400">{member.role}</p>
                      <p className="text-xs text-[#a1a1aa]">{member.department}</p>
                      {member.bio && (
                        <p className="text-sm text-[#a1a1aa] mt-2">{member.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {member.skills?.map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded bg-white/5 text-[#a1a1aa]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-white mb-4">Key Stakeholders</h3>
              <div className="grid gap-4">
                {ENHANCED_STAKEHOLDERS.map(stakeholder => (
                  <div key={stakeholder.id} className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{stakeholder.name}</h4>
                        <p className="text-sm text-[#a1a1aa]">{stakeholder.role} - {stakeholder.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">Satisfaction: {stakeholder.satisfaction}%</div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          stakeholder.relationshipStrength === 'strong' ? 'bg-emerald-500/20 text-emerald-400' :
                          stakeholder.relationshipStrength === 'neutral' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {stakeholder.relationshipStrength}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#a1a1aa] mb-3">{stakeholder.bio}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#a1a1aa]">Concerns:</span>
                        <ul className="text-white">
                          {stakeholder.concerns?.map((c, i) => <li key={i}>• {c}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[#a1a1aa]">Priorities:</span>
                        <ul className="text-white">
                          {stakeholder.priorities?.map((p, i) => <li key={i}>• {p}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPanel;