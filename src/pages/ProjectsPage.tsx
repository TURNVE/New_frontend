import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Folder, Plus, ChevronRight, Search, Filter, Calendar,
  Users, Clock, DollarSign, TrendingUp, MoreVertical, Star
} from 'lucide-react';
import { usePageSetup } from '../hooks/usePageSetup';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const ProjectsPage = () => {
  // Page setup with scroll-to-top, viewport fix, and device detection
  const { isMobile, isIOS, isAndroid } = usePageSetup();
  const { user } = useAuth();

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
        // map data to match the UI shape
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
          color: getRandomColor(d.id)
        }));
        setProjects(mapped);
      }
      setIsLoading(false);
    }
    fetchProjects();
  }, [user]);

  function getRandomColor(id: string) {
    const colors = ['from-blue-500 to-cyan-600', 'from-emerald-500 to-green-600', 'from-violet-500 to-purple-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600', 'from-indigo-500 to-blue-600'];
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-600 mt-1">Manage and track all your projects</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Dashboard
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Folder className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-violet-600" />
              </div>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'completed').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
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
            <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Cover */}
              <div className={`h-32 bg-gradient-to-br ${project.color} relative`}>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'active' ? 'bg-emerald-500 text-white' :
                      project.status === 'pending' ? 'bg-amber-500 text-white' :
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
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${project.color} h-2 rounded-full`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Due {project.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{project.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{project.team} team</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <DollarSign className="h-4 w-4" />
                      <span>${project.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Link
                    to={`/simulation/${project.id}`}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    View Project
                  </Link>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Folder className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
            <Link
              to="/industries"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Project
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;