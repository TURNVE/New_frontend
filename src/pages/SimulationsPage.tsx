import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Clock, CheckCircle, TrendingUp,
  Play, Calendar, Users, DollarSign, Flag, Star
} from 'lucide-react';
import { simulations, supabase } from '../lib/supabase';
import { usePageSetup } from '../hooks/usePageSetup';
import { simulationTemplates } from '../config/simulationTemplates';

interface Simulation {
  id: string;
  title: string;
  industry: string;
  client: string;
  budget: number;
  duration: string;
  progress: number;
  deadline: string;
  status: 'ongoing' | 'in-progress' | 'completed' | 'abandoned' | 'active';
  color: string;
  teamSize: number;
  rating?: string | number;
  completedDate?: string;
  scenario_key?: string;
  primaryColor?: string;
}

const SimulationsPage = () => {
  usePageSetup();
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'in-progress' | 'completed'>('all');
  const [simulationsList, setSimulationsList] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSimulations() {
      setIsLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { sessions: allSessions } = await simulations.getAllUserSessions(user.id);
      const { scores } = await simulations.getScores();

      if (allSessions) {
        const mapped = allSessions.map((session: any) => {
          const scoreMatch = scores?.find(sc => sc.session_id === session.id);
          const stateData: any = session.state || {};
          const isCompleted = session.status === 'completed';
          const template = session.scenario_key ? simulationTemplates[session.scenario_key] : undefined;

          return {
            id: session.id,
            title: stateData.project?.title || session.scenario_key || 'Simulation Project',
            industry: stateData.industry || 'Technology',
            client: stateData.company?.name || 'Unknown Client',
            budget: stateData.budget || 50000,
            duration: `${session.total_weeks} weeks`,
            progress: session.total_weeks ? Math.round((session.current_week / session.total_weeks) * 100) : 0,
            deadline: isCompleted ? 'Completed' : `${session.total_weeks - session.current_week} weeks left`,
            status: isCompleted ? 'completed' : 'ongoing',
            color: isCompleted ? 'bg-blue-500' : 'bg-emerald-500',
            teamSize: stateData.teamSize || 4,
            rating: scoreMatch ? (scoreMatch.overall_score / 20).toFixed(1) : undefined,
            completedDate: scoreMatch ? new Date(scoreMatch.completed_at).toLocaleDateString() : undefined,
            scenario_key: session.scenario_key,
            primaryColor: template?.primaryColor || '#6366f1'
          };
        });
        setSimulationsList(mapped);
      }
      setIsLoading(false);
    }
    loadSimulations();
  }, []);

  const filteredSimulations = filter === 'all'
    ? simulationsList
    : simulationsList.filter(sim => 
        sim.status === filter || (filter === 'ongoing' && (sim.status === 'active' || sim.status === 'ongoing'))
      );

  const stats = {
    ongoing: simulationsList.filter(s => s.status === 'ongoing' || s.status === 'active').length,
    inProgress: simulationsList.filter(s => s.status === 'in-progress').length,
    completed: simulationsList.filter(s => s.status === 'completed').length,
    avgRating: simulationsList.filter(s => s.rating).length > 0
      ? (simulationsList.filter(s => s.rating).reduce((sum, s) => sum + Number(s.rating), 0) / simulationsList.filter(s => s.rating).length).toFixed(1)
      : '0.0'
  };

  const getSimColor = (sim: Simulation) => {
    return sim.primaryColor || '#6366f1';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'in-progress':
        return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Play className="h-4 w-4" />;
      case 'in-progress':
        return <TrendingUp className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Simulations</h1>
        <p className="text-muted-foreground">Track your ongoing, in-progress, and completed simulations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.ongoing}</p>
              <p className="text-sm text-muted-foreground">Ongoing</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-2 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            All Simulations
          </button>
          <button
            onClick={() => setFilter('ongoing')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === 'ongoing'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Play className="h-4 w-4" />
            Ongoing
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === 'in-progress'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === 'completed'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            Completed
          </button>
        </div>
      </div>

      {/* Simulations List */}
      <div className="space-y-4">
        {filteredSimulations.map((simulation) => {
          const simColor = getSimColor(simulation);
          return (
            <Link
              key={simulation.id}
              to={`/simulation/${simulation.id}`}
              className="block bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${getStatusBadge(simulation.status)}`}>
                        {getStatusIcon(simulation.status)}
                        {simulation.status.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">{simulation.industry}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{simulation.title}</h3>
                    <p className="text-sm text-muted-foreground">Client: {simulation.client}</p>
                  </div>
                  {simulation.status === 'completed' && simulation.rating && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/20 rounded-lg">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="text-sm font-bold text-foreground">{simulation.rating}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="text-sm font-semibold text-foreground">${simulation.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-semibold text-foreground">{simulation.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-50 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Team</p>
                      <p className="text-sm font-semibold text-foreground">{simulation.teamSize} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-50 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Flag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-semibold text-foreground">{simulation.deadline}</p>
                    </div>
                  </div>
                </div>

                {simulation.status !== 'completed' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground font-medium">{simulation.progress}% complete</span>
                      <span className="text-xs text-muted-foreground">{simulation.deadline}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${simulation.progress}%`, backgroundColor: simColor }}
                      />
                    </div>
                  </div>
                )}

                {simulation.status === 'completed' && simulation.completedDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Completed {simulation.completedDate}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredSimulations.length === 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-12 text-center">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground mb-2">No simulations found</h3>
          <p className="text-muted-foreground mb-6">
            {filter === 'all'
              ? "You haven't started any simulations yet"
              : `No ${filter} simulations at the moment`}
          </p>
          <Link
            to="/industries"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Play className="h-4 w-4" />
            Start a Simulation
          </Link>
        </div>
      )}
    </div>
  );
};

export default SimulationsPage;
