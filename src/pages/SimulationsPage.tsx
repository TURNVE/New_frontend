import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Clock, CheckCircle,
  Play, Users, DollarSign, Flag, Star, ChevronRight, Rocket
} from 'lucide-react';
import { simulations, supabase } from '../lib/supabase';
import { usePageSetup } from '../hooks/usePageSetup';
import { simulationTemplates } from '../config/simulationTemplates';
import { companySimulations } from '../lib/companySimulations';

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
  currentPhase?: string;
  isPublicOrgSimulation?: boolean;
  livePath?: string;
}

const SimulationsPage = () => {
  usePageSetup();
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'in-progress' | 'completed'>('all');
  const [simulationsList, setSimulationsList] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSimulations() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { sessions: allSessions } = await simulations.getAllUserSessions(user.id);
      const { scores } = await simulations.getScores();

      if (allSessions) {
        const mapped = allSessions.map((session: any) => {
          const scoreMatch = scores?.find(sc => sc.session_id === session.id);
          const stateData: any = session.state || {};
          const isCompleted = session.status === 'completed';
          const template = session.scenario_key ? simulationTemplates[session.scenario_key] : undefined;

          const phaseNames: Record<string, string> = {
            '1': 'Discovery',
            '2': 'Definition',
            '3': 'Delivery',
            '4': 'Launch'
          };
          const currentPhase = phaseNames[String(session.current_phase)] || 'Discovery';
          
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
            primaryColor: template?.primaryColor || '#6366f1',
            currentPhase: isCompleted ? 'Completed' : `Week ${session.current_week} · ${currentPhase}`
          };
        });
        const publicOrgSimulations: Simulation[] = companySimulations.listPublic().map((simulation) => ({
          id: simulation.id,
          title: simulation.title,
          industry: simulation.industry,
          client: simulation.companyName,
          budget: simulation.budget,
          duration: `${simulation.durationWeeks} weeks`,
          progress: 0,
          deadline: 'Live',
          status: 'ongoing',
          color: 'bg-violet-500',
          teamSize: simulation.teamSize,
          primaryColor: simulation.template.primaryColor || '#5e6ad2',
          currentPhase: 'Organization simulation',
          isPublicOrgSimulation: true,
          livePath: simulation.livePath,
        }));

        setSimulationsList([...publicOrgSimulations, ...mapped]);
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

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="text-xl font-bold tracking-tighter text-primary">TURNVE</Link>
            <div className="flex gap-2">
              {(['all', 'ongoing', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === f 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-primary/10 border border-primary/20 text-primary">
            <Rocket className="h-3.5 w-3.5 mr-1.5" />
            Project Mastery
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Your <span className="text-primary">Simulation Projects</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Monitor your progress, review performance metrics, and continue your journey 
            through real-world product management scenarios.
          </p>
        </div>

        <Link
          to="/simulations/product-management"
          className="mb-10 block rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">Simulation track</p>
                <h2 className="mt-1 text-2xl font-black text-foreground">Product Management</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Start with the first unlocked TechCorp simulation, then preview the premium workforce scenarios behind the paywall.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground lg:self-center">
              Open track
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.ongoing}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Ongoing</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Avg Rating</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{filteredSimulations.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Cards */}
        <div className="space-y-6">
          {filteredSimulations.map((simulation) => {
            const simColor = getSimColor(simulation);
            return (
              <Link
                key={simulation.id}
                to={simulation.livePath || `/simulation/${simulation.id}`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {simulation.currentPhase || simulation.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{simulation.industry}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">{simulation.title}</h3>
                      <p className="text-sm text-muted-foreground">Client: <span className="text-foreground font-medium">{simulation.client}</span></p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {simulation.status === 'completed' && simulation.rating && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold">{simulation.rating}</span>
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Budget</p>
                        <p className="text-xs font-bold text-foreground">${(simulation.budget / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Duration</p>
                        <p className="text-xs font-bold text-foreground">{simulation.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Team</p>
                        <p className="text-xs font-bold text-foreground">{simulation.teamSize} members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-500">
                        <Flag className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Deadline</p>
                        <p className="text-xs font-bold text-foreground">{simulation.deadline}</p>
                      </div>
                    </div>
                  </div>

                  {simulation.status !== 'completed' && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{simulation.progress}% Progress</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${simulation.progress}%`, backgroundColor: simColor }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {filteredSimulations.length === 0 && !isLoading && (
          <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">No simulations found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {filter === 'all'
                ? "You haven't started any simulations yet. Kickstart your journey today!"
                : `You don't have any ${filter} simulations at the moment.`}
            </p>
            <Link
              to="/simulations/product-management"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Play className="h-4 w-4" />
              Start a Simulation
            </Link>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Loading your journey...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationsPage;
