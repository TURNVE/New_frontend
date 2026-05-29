import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Folder, Plus, ChevronRight, Search, Calendar,
  Users, Clock, DollarSign, TrendingUp, MoreVertical, Star
} from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import { useAuth } from '../hooks/useAuth';
import { usePageTheme } from '../hooks/usePageTheme';
import { supabase } from '../lib/supabase';

const ProjectsPage = () => {
  usePageSetup();
  const { user } = useAuth();
  const pageTheme = usePageTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*, scenario:scenario_key(name, industry, difficulty, duration_weeks, team_size, budget)')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          title: d.scenario?.name || 'Custom Simulation',
          industry: d.scenario?.industry || 'Technology',
          status: d.status,
          progress: d.status === 'completed' ? 100 : Math.round((d.current_week / (d.total_weeks || 12)) * 100),
          deadline: new Date(new Date(d.started_at).getTime() + (d.total_weeks || 12) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          team: d.scenario?.team_size || 4,
          budget: d.scenario?.budget ? d.scenario.budget * 1000 : 50000,
          rating: 4.8,
          color: getProjectColor(d.id)
        }));
        setProjects(mapped);
      }
      setIsLoading(false);
    }
    fetchProjects();
  }, [user]);

  function getProjectColor(id: string) {
    const colors = [
      [pageTheme.primary, pageTheme.primaryLight],
      ['#10b981', '#34d399'],
      ['#8b5cf6', '#a78bfa'],
      ['#f59e0b', '#fbbf24'],
      ['#f43f5e', '#fb7185'],
      ['#3b82f6', '#60a5fa'],
    ];
    let v = 0;
    for (let c of id) v += c.charCodeAt(0);
    return colors[v % colors.length];
  }

  const statuses = ['all', 'active', 'pending', 'completed'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your projects</p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-white rounded-xl font-medium flex items-center gap-2 whitespace-nowrap"
            style={{ backgroundColor: pageTheme.primary }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = pageTheme.primaryDark; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = pageTheme.primary; }}
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pageTheme.primary}15`, color: pageTheme.primary }}>
              <Folder className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 dark:bg-primary/20 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary dark:text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === 'pending').length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/20 rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === 'completed').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                  filterStatus === status
                    ? 'text-white'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
                style={filterStatus === status ? { backgroundColor: pageTheme.primary } : {}}
              >
                {status === 'all' ? 'All Status' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Cover */}
            <div
              className="h-32 relative"
              style={{ background: `linear-gradient(135deg, ${project.color[0]}, ${project.color[1]})` }}
            >
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'active' ? 'bg-emerald-500 text-white' :
                  project.status === 'pending' ? 'bg-primary text-white' :
                  'bg-violet-500 text-white'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs opacity-80">{project.industry}</p>
                <p className="text-lg font-bold">{project.title}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${project.progress}%`, background: `linear-gradient(90deg, ${project.color[0]}, ${project.color[1]})` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Due {project.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{project.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{project.team} team</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Link
                  to={`/simulation/${project.id}`}
                  className="flex-1 px-3 py-2 text-white rounded-xl text-sm font-medium text-center"
                  style={{ backgroundColor: pageTheme.primary }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = pageTheme.primaryDark; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = pageTheme.primary; }}
                >
                  View Project
                </Link>
                <button className="px-3 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
          <Link
            to="/start-simulation"
            className="inline-flex items-center px-5 py-2.5 text-white font-medium rounded-xl"
            style={{ backgroundColor: pageTheme.primary }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = pageTheme.primaryDark; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = pageTheme.primary; }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Start New Project
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
