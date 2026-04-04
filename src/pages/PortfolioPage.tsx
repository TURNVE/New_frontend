import { useState, useEffect } from 'react';
import { 
  FileText, Calendar, Users, Clock, DollarSign, Eye, Download, 
  Share2, Heart, Star, Filter, Grid3X3, List, Search, Plus,
  Award, TrendingUp, ChevronRight, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const PortfolioPage = () => {
  // Page setup with scroll-to-top, viewport fix, and device detection
  const { isMobile, isIOS, isAndroid } = usePageSetup();
  const { user } = useAuth();
  
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      const { data: scoresData, error: scoresError } = await supabase
        .from('simulation_scores')
        .select('*, session:session_id(*, scenario:scenario_key(*))')
        .eq('user_id', user.id);

      if (!scoresError && scoresData) {
        const mappedItems = scoresData.map((score: any) => {
           const scenario = score.session?.scenario;
           return {
            id: score.id,
            title: scenario?.name || 'Simulation Project',
            description: scenario?.description || 'Completed project simulation.',
            industry: scenario?.industry || 'Technology',
            role: 'Product Manager',
            date: new Date(score.completed_at).toISOString().split('T')[0],
            duration: `${scenario?.duration_weeks || 12} weeks`,
            budget: scenario ? scenario.budget * 1000 : 150000,
            teamSize: scenario?.team_size || 4,
            rating: (score.overall_score / 20).toFixed(1), // Assuming score out of 100 
            achievements: score.strengths || ['Completed Successfully'],
            likes: Math.floor(Math.random() * 150) + 10,
            coverColor: getRandomColor(score.id),
            tags: [scenario?.industry || 'Project', 'Strategy']
           }
        });
        setPortfolioItems(mappedItems);
      }
      setIsLoading(false);
    }
    fetchPortfolio();
  }, [user]);

  function getRandomColor(id: string) {
    const colors = ['from-blue-500 to-cyan-600', 'from-emerald-500 to-green-600', 'from-violet-500 to-purple-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600', 'from-indigo-500 to-blue-600'];
    let val = 0;
    for (let i = 0; i < id.length; i++) val += id.charCodeAt(i);
    return colors[val % colors.length];
  }

  // Calculate stats
  const totalProjects = portfolioItems.length;
  const totalBudget = portfolioItems.reduce((sum, item) => sum + item.budget, 0);
  const totalTime = portfolioItems.reduce((sum, item) => sum + parseInt(item.duration), 0);
  const totalAchievements = portfolioItems.reduce((sum, item) => sum + item.achievements.length, 0);
  const avgRating = (portfolioItems.reduce((sum, item) => sum + item.rating, 0) / totalProjects).toFixed(1);

  // Filter and sort items
  const filteredItems = portfolioItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.industry.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
    
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'likes') return b.likes - a.likes;
    return a.title.localeCompare(b.title);
  });

  const categories = ['all', ...Array.from(new Set(portfolioItems.map(item => item.industry)))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Hub</h1>
              <p className="text-gray-600 mt-1">Showcase your achievements and project experience</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/dashboard" 
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Dashboard
              </Link>
              <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                <FileText className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Projects</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-500">Avg Budget</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${Math.round(totalBudget / totalProjects / 1000)}K</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-violet-600" />
              </div>
              <span className="text-sm text-gray-500">Avg Weeks</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{Math.round(totalTime / totalProjects)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">Achievements</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalAchievements}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-rose-600" />
              </div>
              <span className="text-sm text-gray-500">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
                <option value="likes">Sort by Likes</option>
                <option value="title">Sort by Title</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-xl">
                <button
                  onClick={() => setDisplayMode('grid')}
                  className={`p-2.5 transition-colors ${
                    displayMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setDisplayMode('list')}
                  className={`p-2.5 transition-colors ${
                    displayMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Grid/List */}
        {displayMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map(item => (
              <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Cover Image */}
                <div className={`h-40 bg-gradient-to-br ${item.coverColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-semibold text-gray-900">
                      {item.industry}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur rounded-lg">
                      <Star className="h-3 w-3 text-amber-500 fill-current" />
                      <span className="text-xs font-bold text-gray-900">{item.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{item.role} • {item.industry}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${item.budget.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {item.teamSize}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {sortedItems.map(item => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Cover */}
                  <div className={`w-full sm:w-32 h-24 bg-gradient-to-br ${item.coverColor} rounded-xl flex-shrink-0`} />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">{item.role} • {item.industry}</p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-lg">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {item.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${item.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {item.teamSize} team
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {item.likes} likes
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or complete a simulation to get started.</p>
            <Link 
              to="/industries" 
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Simulation
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default PortfolioPage;