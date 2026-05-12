import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileText, Clock, DollarSign, Heart, Star,
  Award, ExternalLink, ChevronRight, ArrowLeft, User,
  Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Portfolio, PortfolioItem, SimulationScore } from '../lib/supabase';
import { getRandomColor } from '../lib/portfolio-utils';

interface PortfolioItemView {
  id: string;
  title: string;
  description: string;
  industry: string;
  role: string;
  date: string;
  duration: string;
  budget: number;
  teamSize: number;
  rating: string;
  achievements: string[];
  likes: number;
  coverColor: string;
  tags: string[];
  imageUrl?: string;
  externalUrl?: string;
}

function ScoreToItem(score: SimulationScore): PortfolioItemView {
  const session = score.session as any;
  const scenario = session?.scenario;
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
    rating: (score.overall_score / 20).toFixed(1),
    achievements: score.strengths || ['Completed Successfully'],
    likes: Math.floor(Math.random() * 150) + 10,
    coverColor: getRandomColor(score.id),
    tags: [scenario?.industry || 'Project', 'Strategy'],
  };
}

function ItemToView(item: PortfolioItem): PortfolioItemView {
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    industry: item.industry || 'General',
    role: item.role || 'Project Lead',
    date: new Date(item.created_at).toISOString().split('T')[0],
    duration: item.duration_weeks ? `${item.duration_weeks} weeks` : 'Flexible',
    budget: item.budget || 0,
    teamSize: item.team_size || 1,
    rating: '5.0',
    achievements: item.tags || [],
    likes: 0,
    coverColor: getRandomColor(item.id),
    tags: item.tags || [],
    imageUrl: item.image_url,
    externalUrl: item.external_url,
  };
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-40 bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-lg w-full animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-100 rounded-md w-16 animate-pulse" />
          <div className="h-6 bg-gray-100 rounded-md w-16 animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 rounded-lg w-20 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-lg w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

const THEME_GRADIENT_MAP: Record<string, string> = {
  professional: 'from-blue-600 to-indigo-700',
  creative: 'from-violet-500 to-fuchsia-600',
  minimalist: 'from-slate-600 to-slate-800',
  vibrant: 'from-emerald-500 to-teal-600',
  dark: 'from-indigo-400 to-blue-500',
};

const THEME_TEXT_MAP: Record<string, { heading: string; body: string; muted: string; card: string; bg: string }> = {
  professional: { heading: 'text-gray-900', body: 'text-gray-600', muted: 'text-gray-500', card: 'bg-white', bg: 'bg-gray-50' },
  creative: { heading: 'text-gray-900', body: 'text-gray-600', muted: 'text-gray-500', card: 'bg-white', bg: 'bg-gray-50' },
  minimalist: { heading: 'text-slate-900', body: 'text-slate-600', muted: 'text-slate-400', card: 'bg-white', bg: 'bg-white' },
  vibrant: { heading: 'text-gray-900', body: 'text-gray-600', muted: 'text-gray-500', card: 'bg-white', bg: 'bg-gray-50' },
  dark: { heading: 'text-white', body: 'text-gray-300', muted: 'text-gray-400', card: 'bg-gray-800', bg: 'bg-gray-900' },
};

function getThemeGradient(preset: string): string {
  switch (preset) {
    case 'professional': return 'from-blue-600 to-indigo-700';
    case 'creative': return 'from-violet-500 to-fuchsia-600';
    case 'minimalist': return 'from-slate-600 to-slate-800';
    case 'vibrant': return 'from-emerald-500 to-teal-600';
    case 'dark': return 'from-indigo-400 to-blue-500';
    default: return 'from-blue-600 to-indigo-700';
  }
}

function getThemeTextClasses(preset: string) {
  switch (preset) {
    case 'professional':
      return { heading: 'text-gray-900', body: 'text-gray-600', muted: 'text-gray-500', card: 'bg-white', bg: 'bg-gray-50' };
    case 'creative':
      return { heading: 'text-gray-900', body: 'text-gray-600', muted: 'text-gray-500', card: 'bg-white', bg: 'bg-gray-50' };
    case 'minimalist':
      return { heading: 'text-slate-900', body: 'text-slate-600', muted: 'text-slate-400', card: 'bg-white', bg: 'bg-white' };
    case 'vibrant':
      return { heading: 'text-gray-900', body: 'text-gray-600', muted: 'text-gray-500', card: 'bg-white', bg: 'bg-gray-50' };
    case 'dark':
      return { heading: 'text-white', body: 'text-gray-300', muted: 'text-gray-400', card: 'bg-gray-800', bg: 'bg-gray-900' };
    default:
      return { heading: 'text-gray-900', body: 'text-gray-600', muted: 'text-gray-500', card: 'bg-white', bg: 'bg-gray-50' };
  }
}

const PublicPortfolioPage = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [portfolio, setPortfolio] = useState<(Portfolio & { items: PortfolioItem[] }) | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPublicPortfolio() {
      if (!shareToken) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const { portfolio: portfolioData, scores, error } = await supabase.rpc('get_public_portfolio_with_scores', { p_share_token: shareToken });

        if (error) {
          const { portfolio: fallbackData, error: fallbackError } = await supabase
            .from('portfolios')
            .select('*, items:portfolio_items(*)')
            .eq('share_token', shareToken)
            .eq('is_published', true)
            .single();

          if (fallbackError || !fallbackData) {
            setNotFound(true);
            setIsLoading(false);
            return;
          }

          setPortfolio(fallbackData as (Portfolio & { items: PortfolioItem[] }));

          const { data: scoresData } = await supabase
            .from('simulation_scores')
            .select('*, session:session_id(*, scenario:scenario_key(*))')
            .eq('user_id', fallbackData.user_id);

          const items: PortfolioItemView[] = [];

          if (fallbackData.items) {
            items.push(...fallbackData.items.map(ItemToView));
          }

          if (scoresData) {
            items.push(...scoresData.map(ScoreToItem));
          }

          setPortfolioItems(items);
        } else {
          setPortfolio(portfolioData);

          const items: PortfolioItemView[] = [];

          if (portfolioData.items) {
            items.push(...portfolioData.items.map(ItemToView));
          }

          if (scores) {
            items.push(...scores.map(ScoreToItem));
          }

          setPortfolioItems(items);
        }
      } catch (err) {
        console.error('Error fetching public portfolio:', err);
        setNotFound(true);
      }

      setIsLoading(false);
    }

    fetchPublicPortfolio();
  }, [shareToken]);

  const totalProjects = portfolioItems.length;
  const totalBudget = portfolioItems.reduce((sum, item) => sum + item.budget, 0);
  const totalTime = portfolioItems.reduce((sum, item) => sum + (parseInt(item.duration) || 0), 0);
  const totalAchievements = portfolioItems.reduce((sum, item) => sum + item.achievements.length, 0);
  const avgRating = totalProjects > 0
    ? (portfolioItems.reduce((sum, item) => sum + (parseFloat(item.rating) || 0), 0) / totalProjects).toFixed(1)
    : '0.0';

  const theme = portfolio?.theme_preset || 'professional';
  const themeGradient = getThemeGradient(theme);
  const themeText = getThemeTextClasses(theme);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themeText.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`${themeText.muted} text-sm`}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio Not Found</h3>
          <p className="text-gray-600 mb-6">This portfolio may have been unpublished or the link is incorrect.</p>
          <a
            href={import.meta.env.VITE_APP_URL || '/'}
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to TURNVE
          </a>
        </div>
      </div>
    );
  }

  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;

  return (
    <div className={`min-h-screen ${themeText.bg}`}>
      <header className={`${themeText.card} border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className={`flex items-center gap-2 text-sm ${themeText.muted} mb-2`}>
                <span>TURNVE</span>
                <ChevronRight className="h-4 w-4" />
                <span>Portfolio</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${themeText.heading}`}>{portfolio?.title}</h1>
              {portfolio?.description && (
                <p className={themeText.body}>{portfolio.description}</p>
              )}
            </div>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 self-start"
            >
              <ExternalLink className="h-4 w-4" />
              Join TURNVE
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${themeText.card} rounded-2xl border border-gray-100 shadow-sm p-6 mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${themeGradient} rounded-2xl flex items-center justify-center`}>
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-lg font-bold ${themeText.heading}`}>
                {portfolio?.title || 'Professional Portfolio'}
              </h2>
              <p className={`text-sm ${themeText.muted}`}>
                Published {portfolio?.published_at ? new Date(portfolio.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'recently'}
              </p>
              <p className={`text-sm ${themeText.body} mt-1`}>
                Showcasing {totalProjects} project{totalProjects !== 1 ? 's' : ''} with an average rating of {avgRating} stars
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className={`${themeText.card} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <span className={`text-sm ${themeText.muted}`}>Projects</span>
            </div>
            <p className={`text-2xl font-bold ${themeText.heading}`}>{totalProjects}</p>
          </div>
          <div className={`${themeText.card} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <span className={`text-sm ${themeText.muted}`}>Avg Budget</span>
            </div>
            <p className={`text-2xl font-bold ${themeText.heading}`}>
              ${totalProjects > 0 ? Math.round(totalBudget / totalProjects / 1000) : 0}K
            </p>
          </div>
          <div className={`${themeText.card} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-violet-600" />
              </div>
              <span className={`text-sm ${themeText.muted}`}>Avg Weeks</span>
            </div>
            <p className={`text-2xl font-bold ${themeText.heading}`}>
              {totalProjects > 0 ? Math.round(totalTime / totalProjects) : 0}
            </p>
          </div>
          <div className={`${themeText.card} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <span className={`text-sm ${themeText.muted}`}>Achievements</span>
            </div>
            <p className={`text-2xl font-bold ${themeText.heading}`}>{totalAchievements}</p>
          </div>
          <div className={`${themeText.card} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-rose-600" />
              </div>
              <span className={`text-sm ${themeText.muted}`}>Avg Rating</span>
            </div>
            <p className={`text-2xl font-bold ${themeText.heading}`}>{avgRating}</p>
          </div>
        </div>

        {portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map(item => (
              <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className={`h-40 bg-gradient-to-br ${item.coverColor} relative overflow-hidden`}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {!item.imageUrl && (
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-semibold text-gray-900">
                      {item.industry}
                    </span>
                  </div>
                  {portfolio?.show_ratings !== false && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur rounded-lg">
                        <Star className="h-3 w-3 text-primary fill-current" />
                        <span className="text-xs font-bold text-gray-900">{item.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{item.role} &bull; {item.industry}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </div>
                    {portfolio?.show_budget !== false && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${item.budget.toLocaleString()}
                      </div>
                    )}
                    {portfolio?.show_team_size !== false && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.teamSize}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.likes}</span>
                    </div>
                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className={`text-lg font-semibold ${themeText.heading} mb-2`}>No projects yet</h3>
            <p className={themeText.body}>This portfolio hasn't been populated yet.</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-4">Built with TURNVE - AI-Powered Practical Career Platform</p>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get Started with TURNVE
            <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
          </a>
        </div>
      </main>
    </div>
  );
};

export default PublicPortfolioPage;
