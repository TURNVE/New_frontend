import { useState, useEffect, useCallback } from 'react';
import {
  FileText, Calendar, Users, Clock, DollarSign,
  Share2, Heart, Star, Grid3X3, List, Search, Plus,
  Award, ExternalLink, Link as LinkIcon,
  Copy, Check, Edit2, Trash2, X, Save,
  Globe, GlobeOff, Sparkles, Palette, Settings,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Portfolio, PortfolioItem } from '../lib/supabase';
import { getRandomColor, THEME_PRESETS, type ThemePresetKey, isValidTheme } from '../lib/portfolio-utils';

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
  isCustom?: boolean;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface PortfolioFormData {
  title: string;
  description: string;
  category: string;
  role: string;
  industry: string;
  durationWeeks: string;
  budget: string;
  teamSize: string;
  tags: string;
  imageUrl: string;
  externalUrl: string;
}

const INITIAL_FORM_DATA: PortfolioFormData = {
  title: '',
  description: '',
  category: '',
  role: '',
  industry: '',
  durationWeeks: '',
  budget: '',
  teamSize: '',
  tags: '',
  imageUrl: '',
  externalUrl: '',
};

const URL_REGEX = /^https?:\/\/.+\..+/;

function isValidUrl(value: string): boolean {
  if (!value) return true;
  return URL_REGEX.test(value);
}

const PortfolioPage = () => {
  const { isMobile } = usePageSetup();
  const { user } = useAuth();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemView[]>([]);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItemView | null>(null);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState<PortfolioFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [themeForm, setThemeForm] = useState<{
    theme_preset: ThemePresetKey;
    layout_style: 'grid' | 'list';
    show_achievements: boolean;
    show_ratings: boolean;
    show_budget: boolean;
    show_team_size: boolean;
  }>({
    theme_preset: 'professional',
    layout_style: 'grid',
    show_achievements: true,
    show_ratings: true,
    show_budget: true,
    show_team_size: true,
  });

  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const validateUrl = (value: string): string | null => {
    if (!value) return null;
    return isValidUrl(value) ? null : 'Please enter a valid URL starting with http:// or https://';
  };

  const fetchPortfolio = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (portfolioError && portfolioError.code !== 'PGRST116') {
        console.error('Error fetching portfolio:', portfolioError);
      }

      setPortfolio(portfolioData as Portfolio | null);

      if (portfolioData) {
        setThemeForm({
          theme_preset: (portfolioData.theme_preset as ThemePresetKey) || 'professional',
          layout_style: (portfolioData.layout_style as 'grid' | 'list') || 'grid',
          show_achievements: portfolioData.show_achievements ?? true,
          show_ratings: portfolioData.show_ratings ?? true,
          show_budget: portfolioData.show_budget ?? true,
          show_team_size: portfolioData.show_team_size ?? true,
        });
      }

      const { data: scoresData, error: scoresError } = await supabase
        .from('simulation_scores')
        .select('*, session:session_id(*, scenario:scenario_key(*))')
        .eq('user_id', user.id);

      const simulationItems: PortfolioItemView[] = [];
      if (!scoresError && scoresData) {
        for (const score of scoresData) {
          const scenario = score.session?.scenario;
          simulationItems.push({
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
            isCustom: false,
          });
        }
      }

      const { data: customItems, error: itemsError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const customItemViews: PortfolioItemView[] = [];
      if (!itemsError && customItems) {
        for (const item of customItems) {
          customItemViews.push({
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
            isCustom: true,
          });
        }
      }

      setPortfolioItems([...customItemViews, ...simulationItems]);
    } catch (err) {
      console.error('Unexpected error loading portfolio:', err);
      addToast('Failed to load portfolio data', 'error');
    }

    setIsLoading(false);
  }, [user, addToast]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleCreatePortfolio = async () => {
    if (!user || !formData.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .upsert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setPortfolio(data as Portfolio);
      setShowCreateModal(false);
      setFormData(INITIAL_FORM_DATA);
      addToast('Portfolio created successfully!');
    } catch (err) {
      console.error('Error creating portfolio:', err);
      addToast('Failed to create portfolio', 'error');
    }
  };

  const handlePublishPortfolio = async () => {
    if (!portfolio) return;

    try {
      const randomValues = crypto.getRandomValues(new Uint32Array(2));
      const shareToken = `portfolio-${user?.id}-${Array.from(randomValues).map(n => n.toString(16)).join('')}`;
      const { data, error } = await supabase
        .from('portfolios')
        .update({
          is_published: true,
          share_token: shareToken,
          published_at: new Date().toISOString(),
        } as any)
        .eq('id', portfolio.id)
        .eq('user_id', user!.id)
        .select()
        .single();

      if (error) throw error;

      setPortfolio(data as Portfolio);
      addToast('Portfolio published! Share the link publicly.');
    } catch (err) {
      console.error('Error publishing portfolio:', err);
      addToast('Failed to publish portfolio', 'error');
    }
  };

  const handleUnpublishPortfolio = async () => {
    if (!portfolio) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .update({ is_published: false, share_token: null, published_at: null })
        .eq('id', portfolio.id)
        .eq('user_id', user!.id)
        .select()
        .single();

      if (error) throw error;

      setPortfolio(data as Portfolio);
      addToast('Portfolio unpublished', 'info');
    } catch (err) {
      console.error('Error unpublishing portfolio:', err);
      addToast('Failed to unpublish portfolio', 'error');
    }
  };

  const handleCopyLink = async () => {
    if (!portfolio?.share_token) return;
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const url = `${baseUrl}/portfolio/public/${portfolio.share_token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveItem = async () => {
    if (!user || !formData.title.trim()) return;

    const errors: Record<string, string> = {};
    const imgError = validateUrl(formData.imageUrl);
    const extError = validateUrl(formData.externalUrl);
    if (imgError) errors.imageUrl = imgError;
    if (extError) errors.externalUrl = extError;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const itemData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      category: formData.category.trim() || null,
      role: formData.role.trim() || null,
      industry: formData.industry.trim() || null,
      duration_weeks: formData.durationWeeks ? parseInt(formData.durationWeeks) : null,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      team_size: formData.teamSize ? parseInt(formData.teamSize) : null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      image_url: formData.imageUrl.trim() || null,
      external_url: formData.externalUrl.trim() || null,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(itemData)
          .eq('id', editingItem.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setPortfolioItems(prev => prev.map(item =>
          item.id === editingItem.id ? {
            ...item,
            title: itemData.title,
            description: itemData.description || '',
            industry: itemData.industry || 'General',
            role: itemData.role || 'Project Lead',
            duration: itemData.duration_weeks ? `${itemData.duration_weeks} weeks` : 'Flexible',
            budget: itemData.budget || 0,
            teamSize: itemData.team_size || 1,
            tags: itemData.tags || [],
            imageUrl: itemData.image_url || undefined,
            externalUrl: itemData.external_url || undefined,
          } : item
        ));
        addToast('Project updated!');
      } else {
        const portfolioId = portfolio?.id;
        if (!portfolioId) {
          addToast('Create a portfolio first', 'error');
          return;
        }

        const { data: newItem, error } = await supabase
          .from('portfolio_items')
          .insert({
            ...itemData,
            portfolio_id: portfolioId,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        setPortfolioItems(prev => [{
          id: newItem.id,
          title: newItem.title,
          description: newItem.description || '',
          industry: newItem.industry || 'General',
          role: newItem.role || 'Project Lead',
          date: new Date(newItem.created_at).toISOString().split('T')[0],
          duration: newItem.duration_weeks ? `${newItem.duration_weeks} weeks` : 'Flexible',
          budget: newItem.budget || 0,
          teamSize: newItem.team_size || 1,
          rating: '5.0',
          achievements: newItem.tags || [],
          likes: 0,
          coverColor: getRandomColor(newItem.id),
          tags: newItem.tags || [],
          imageUrl: newItem.image_url,
          externalUrl: newItem.external_url,
          isCustom: true,
        }, ...prev]);
        addToast('Project added!');
      }

      setShowItemModal(false);
      setEditingItem(null);
      setFormData(INITIAL_FORM_DATA);
      setFormErrors({});
    } catch (err) {
      console.error('Error saving item:', err);
      addToast('Failed to save project', 'error');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
      addToast('Project deleted', 'info');
    } catch (err) {
      console.error('Error deleting item:', err);
      addToast('Failed to delete project', 'error');
    }
  };

  const handleSaveTheme = async () => {
    if (!portfolio) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .update({
          theme_preset: themeForm.theme_preset,
          layout_style: themeForm.layout_style,
          show_achievements: themeForm.show_achievements,
          show_ratings: themeForm.show_ratings,
          show_budget: themeForm.show_budget,
          show_team_size: themeForm.show_team_size,
        })
        .eq('id', portfolio.id)
        .eq('user_id', user!.id)
        .select()
        .single();

      if (error) throw error;

      setPortfolio(data as Portfolio);
      setShowThemeModal(false);
      addToast('Theme settings saved!');
    } catch (err) {
      console.error('Error saving theme:', err);
      addToast('Failed to save theme settings', 'error');
    }
  };

  const openEditItem = (item: PortfolioItemView) => {
    setEditingItem(item);
    setFormErrors({});
    setFormData({
      title: item.title,
      description: item.description,
      category: '',
      role: item.role,
      industry: item.industry,
      durationWeeks: item.duration.replace(' weeks', ''),
      budget: item.budget.toString(),
      teamSize: item.teamSize.toString(),
      tags: item.tags.join(', '),
      imageUrl: item.imageUrl || '',
      externalUrl: item.externalUrl || '',
    });
    setShowItemModal(true);
  };

  const openCreateItem = () => {
    setEditingItem(null);
    setFormErrors({});
    setFormData(INITIAL_FORM_DATA);
    setShowItemModal(true);
  };

  const totalProjects = portfolioItems.length;
  const totalBudget = portfolioItems.reduce((sum, item) => sum + item.budget, 0);
  const totalTime = portfolioItems.reduce((sum, item) => sum + (parseInt(item.duration) || 0), 0);
  const totalAchievements = portfolioItems.reduce((sum, item) => sum + item.achievements.length, 0);
  const avgRating = totalProjects > 0
    ? (portfolioItems.reduce((sum, item) => sum + (parseFloat(item.rating) || 0), 0) / totalProjects).toFixed(1)
    : '0.0';

  const filteredItems = portfolioItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.industry.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'rating') return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
    if (sortBy === 'likes') return b.likes - a.likes;
    return a.title.localeCompare(b.title);
  });

  const categories = ['all', ...Array.from(new Set(portfolioItems.map(item => item.industry).filter(Boolean)))];

  const themeColors: Record<string, { from: string; to: string; bg: string; cardBg: string }> = {
    professional: { from: 'blue', to: 'indigo', bg: 'gray-50', cardBg: 'white' },
    creative: { from: 'violet', to: 'fuchsia', bg: 'gray-50', cardBg: 'white' },
    minimalist: { from: 'slate', to: 'slate', bg: 'white', cardBg: 'gray' },
    vibrant: { from: 'emerald', to: 'teal', bg: 'gray-50', cardBg: 'white' },
    dark: { from: 'indigo', to: 'blue', bg: 'gray-900', cardBg: 'gray-800' },
  };

  return (
    <div className="animate-fade-in relative">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-slide-in-right ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' :
              toast.type === 'error' ? 'bg-red-600 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            {toast.type === 'success' && <Check className="h-4 w-4" />}
            {toast.type === 'error' && <X className="h-4 w-4" />}
            {toast.text}
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio Hub</h1>
          <p className="text-muted-foreground mt-1">Create, manage, and share your professional portfolio</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!portfolio ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Portfolio
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowThemeModal(true)}
                className="px-4 py-2.5 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Theme
              </button>
              {portfolio.is_published ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Share Link'}
                  </button>
                  <button
                    onClick={handleUnpublishPortfolio}
                    className="px-4 py-2.5 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    <GlobeOff className="h-4 w-4" />
                    Unpublish
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePublishPortfolio}
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Publish Portfolio
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="py-4">
        {portfolio && (
          <div className="bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 rounded-2xl p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{portfolio.title}</h3>
                  {portfolio.description && (
                    <p className="text-sm text-muted-foreground">{portfolio.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={openCreateItem}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 self-start"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
            </div>
            {portfolio.is_published && portfolio.share_token && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Your portfolio is public. Share this link:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-background border border-border rounded-lg px-3 py-2 text-foreground truncate">
                    {`${import.meta.env.VITE_APP_URL || window.location.origin}/portfolio/public/${portfolio.share_token}`}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!portfolio && !isLoading && (
          <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Create Your Portfolio</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Build a professional portfolio showcasing your simulation projects and achievements. Share it publicly with a unique link.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Portfolio
            </button>
          </div>
        )}

        {portfolio && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Projects</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalProjects}</p>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Avg Budget</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ${totalProjects > 0 ? Math.round(totalBudget / totalProjects / 1000) : 0}K
                </p>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Avg Weeks</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {totalProjects > 0 ? Math.round(totalTime / totalProjects) : 0}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Achievements</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalAchievements}</p>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/20 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{avgRating}</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-4 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setFilterCategory(category)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                          }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="likes">Sort by Likes</option>
                    <option value="title">Sort by Title</option>
                  </select>

                  <div className="flex border border-border rounded-xl">
                    <button
                      onClick={() => setDisplayMode('grid')}
                      className={`p-2.5 transition-colors ${displayMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                        }`}
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDisplayMode('list')}
                      className={`p-2.5 transition-colors ${displayMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                        }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {displayMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItems.map(item => (
                  <div key={item.id} className="group bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className={`h-40 bg-gradient-to-br ${item.coverColor} relative overflow-hidden`}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-background/90 backdrop-blur rounded-lg text-xs font-semibold text-foreground">
                          {item.industry}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 bg-background/90 backdrop-blur rounded-lg">
                          <Star className="h-3 w-3 text-amber-500 fill-current" />
                          <span className="text-xs font-bold text-foreground">{item.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.role} &bull; {item.industry}</p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-secondary text-foreground text-xs font-medium rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
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

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditItem(item)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {item.externalUrl && (
                            <a
                              href={item.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border">
                {sortedItems.map(item => (
                  <div key={item.id} className="p-6 hover:bg-secondary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className={`w-full sm:w-32 h-24 bg-gradient-to-br ${item.coverColor} rounded-xl flex-shrink-0 relative overflow-hidden`}>
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.role} &bull; {item.industry}</p>
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/20 rounded-lg">
                            <Star className="h-4 w-4 text-amber-500 fill-current" />
                            <span className="text-sm font-bold text-foreground">{item.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
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

                      <div className="flex sm:flex-col items-center gap-1">
                        <button
                          onClick={() => openEditItem(item)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sortedItems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">Add your first project or adjust your filters.</p>
                <button
                  onClick={openCreateItem}
                  className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Your Portfolio</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Portfolio Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., My Professional Portfolio"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description about your portfolio..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <button
                onClick={handleCreatePortfolio}
                disabled={!formData.title.trim()}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Create Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Settings Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Settings
                </h2>
                <p className="text-sm text-gray-500 mt-1">Customize how your public portfolio looks</p>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme Presets */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Theme Preset</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {([
                    ['professional', 'Professional', 'from-blue-500 to-indigo-600'],
                    ['creative', 'Creative', 'from-violet-500 to-fuchsia-600'],
                    ['minimalist', 'Minimalist', 'from-slate-500 to-slate-700'],
                    ['vibrant', 'Vibrant', 'from-emerald-500 to-teal-600'],
                    ['dark', 'Dark Mode', 'from-indigo-400 to-blue-500'],
                  ] as [ThemePresetKey, string, string][]).map(([key, name, gradient]) => (
                    <button
                      key={key}
                      onClick={() => setThemeForm(prev => ({ ...prev, theme_preset: key }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        themeForm.theme_preset === key
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${gradient} mb-2`} />
                      <span className="text-sm font-medium text-gray-700">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Preview</label>
                <div className={`rounded-xl border border-gray-200 p-4 ${
                  themeForm.theme_preset === 'professional' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                  themeForm.theme_preset === 'creative' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600' :
                  themeForm.theme_preset === 'minimalist' ? 'bg-gradient-to-r from-slate-500 to-slate-700' :
                  themeForm.theme_preset === 'vibrant' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                  'bg-gradient-to-r from-indigo-400 to-blue-500'
                } text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm">{portfolio?.title}</span>
                  </div>
                  <div className="bg-white/20 rounded-lg h-6 flex items-center px-3 text-xs">
                    Project card preview...
                  </div>
                </div>
              </div>

              {/* Layout */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Layout Style</label>
                <div className="flex gap-3">
                  {(['grid', 'list'] as const).map(layout => (
                    <button
                      key={layout}
                      onClick={() => setThemeForm(prev => ({ ...prev, layout_style: layout }))}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                        themeForm.layout_style === layout
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {layout === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                      {layout.charAt(0).toUpperCase() + layout.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Toggles */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Display Options</label>
                <div className="space-y-3">
                  {[
                    { key: 'show_ratings', label: 'Show Ratings', icon: Star },
                    { key: 'show_achievements', label: 'Show Achievements', icon: Award },
                    { key: 'show_budget', label: 'Show Budget', icon: DollarSign },
                    { key: 'show_team_size', label: 'Show Team Size', icon: Users },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                      <button
                        onClick={() => setThemeForm(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          themeForm[key as keyof typeof themeForm] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          themeForm[key as keyof typeof themeForm] ? 'translate-x-5' : ''
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveTheme}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Theme Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => { setShowItemModal(false); setFormErrors({}); }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., E-commerce Platform Redesign"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Product Manager"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., Technology"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (weeks)</label>
                  <input
                    type="number"
                    value={formData.durationWeeks}
                    onChange={(e) => setFormData(prev => ({ ...prev, durationWeeks: e.target.value }))}
                    placeholder="12"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget ($)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="150000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Size</label>
                  <input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                    placeholder="4"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Strategy, Design, Development"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => { setFormData(prev => ({ ...prev, imageUrl: e.target.value })); setFormErrors(prev => ({ ...prev, imageUrl: '' })); }}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.imageUrl ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {formErrors.imageUrl && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.imageUrl}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">External URL (optional)</label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => { setFormData(prev => ({ ...prev, externalUrl: e.target.value })); setFormErrors(prev => ({ ...prev, externalUrl: '' })); }}
                  placeholder="https://example.com/project"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.externalUrl ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {formErrors.externalUrl && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.externalUrl}</p>
                )}
              </div>
              <button
                onClick={handleSaveItem}
                disabled={!formData.title.trim()}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingItem ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
