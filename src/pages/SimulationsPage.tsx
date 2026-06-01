import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Clock,
  Play, Users, DollarSign, Flag, Star, ChevronRight, Rocket, Lock, Sparkles, BookOpen, Target, CheckCircle2
} from 'lucide-react';
import { TurnveLogo } from '../components/brand/TurnveLogo';
import { simulations, supabase, type SimulationSession } from '../lib/supabase';
import { usePageSetup } from '../hooks/usePageSetup';
import { companySimulations } from '../lib/companySimulations';
import { getAllSimulations, getSimulationConfig } from '../features/simulations';

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
  isCatalogueSimulation?: boolean;
  description?: string;
  difficulty?: string;
  moduleCount?: number;
  metricLabel?: string;
  livePath?: string;
}

interface SessionStateData {
  project?: { title?: string };
  industry?: string;
  company?: { name?: string };
  budget?: number;
  teamSize?: number;
}

const SimulationsPage = () => {
  usePageSetup();
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [simulationsList, setSimulationsList] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const catalogueSimulations: Simulation[] = getAllSimulations().map((simulation) => {
    const moduleCount = simulation.weeklyActions?.length || simulation.totalWeeks;
    const isUpdatedPM = simulation.id.startsWith('sim-pm-fintech');

    return {
      id: simulation.id,
      title: simulation.name,
      industry: simulation.industry,
      client: simulation.companyName,
      budget: simulation.budget,
      duration: `${moduleCount} ${moduleCount === 1 ? 'module' : 'modules'}`,
      progress: 0,
      deadline: isUpdatedPM ? 'Updated PM simulation' : 'Available',
      status: 'active',
      color: isUpdatedPM ? 'bg-emerald-500' : 'bg-indigo-500',
      teamSize: simulation.teamSize,
      primaryColor: simulation.primaryColor,
      currentPhase: `${simulation.difficulty} - ${moduleCount} tasks`,
      isCatalogueSimulation: true,
      description: simulation.challengeDetails,
      difficulty: simulation.difficulty,
      moduleCount,
      metricLabel: simulation.kpis[0]?.label,
      livePath: `/simulation/${simulation.id}`,
    };
  });

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
        const mapped = allSessions.map((session: SimulationSession) => {
          const scoreMatch = scores?.find(sc => sc.session_id === session.id);
          const stateData = (session.state || {}) as SessionStateData;
          const isCompleted = session.status === 'completed';
          const template = session.scenario_key ? getSimulationConfig(session.scenario_key) : undefined;

          const phaseNames: Record<string, string> = {
            '1': 'Discovery',
            '2': 'Definition',
            '3': 'Delivery',
            '4': 'Launch'
          };
          const currentPhase = phaseNames[String(session.current_phase)] || 'Discovery';
          
          return {
            id: session.id,
            title: stateData.project?.title || template?.name || session.scenario_key || 'Simulation Project',
            industry: stateData.industry || template?.industry || 'Technology',
            client: stateData.company?.name || template?.companyName || 'Unknown Client',
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
            currentPhase: isCompleted ? 'Completed' : `Week ${session.current_week} - ${currentPhase}`
          };
        });
        const publicOrgSimulations: Simulation[] = (await companySimulations.listPublicAsync()).map((simulation) => ({
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

  const organizationSimulations = simulationsList.filter(sim => sim.isPublicOrgSimulation);
  const activeSessionSimulations = simulationsList.filter(sim => !sim.isPublicOrgSimulation);
  const availableSimulations = [...catalogueSimulations, ...organizationSimulations];

  const filteredSimulations = filter === 'all'
    ? activeSessionSimulations
    : activeSessionSimulations.filter(sim =>
        sim.status === filter || (filter === 'ongoing' && (sim.status === 'active' || sim.status === 'ongoing'))
      );

  const getSimColor = (sim: Simulation) => {
    return sim.primaryColor || '#6366f1';
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex h-10 items-center" aria-label="TURNVE dashboard">
              <TurnveLogo className="h-8 w-auto" />
            </Link>
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-primary/10 border border-primary/20 text-primary">
            <Rocket className="h-3.5 w-3.5 mr-1.5" />
            View simulations
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            All simulations in <span className="text-primary">one workspace</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Browse the complete TURNVE simulation catalogue, including the updated fintech Product Management projects, previous PM simulations, and any live organization simulations available to you.
          </p>
        </div>

        <div className="mb-10 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <Link
            to="/simulations/product-management"
            className="group block min-w-0 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-5 lg:p-6"
          >
            <div className="grid min-w-0 gap-5 sm:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-14 sm:w-14">
                <Rocket className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-primary sm:text-xs">Available path</p>
                <h2 className="mt-1 text-xl font-black leading-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">Product Management</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Start with the updated fintech PM simulations, then continue into the previous crisis, growth, platform, and zero-to-one PM scenarios.
                </p>
              </div>
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground sm:col-start-2 sm:w-fit xl:col-start-auto xl:justify-self-end xl:whitespace-nowrap">
                Select path
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <div className="min-w-0 rounded-2xl border border-border bg-card p-4 opacity-80 sm:p-5 lg:p-6">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start xl:flex-col">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Lock className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">Coming soon</p>
                <h2 className="mt-1 text-xl font-black leading-tight text-foreground">More tracks</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Marketing, operations, finance, and engineering leadership paths will appear here as they launch.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-black text-foreground">All available simulations</h2>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Every routed simulation appears here, so the new PM fintech simulations and the previous PM simulations are visible from the same page.
              </p>
            </div>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
              {availableSimulations.length} total
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {availableSimulations.map((simulation) => {
              const simColor = getSimColor(simulation);
              return (
                <Link
                  key={`available-${simulation.id}`}
                  to={simulation.livePath || `/simulation/${simulation.id}`}
                  className="group block rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm"
                      style={{ backgroundColor: simColor }}
                    >
                      {simulation.client.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      {simulation.deadline}
                    </span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{simulation.industry}</p>
                  <h3 className="mt-1 text-lg font-black leading-snug text-foreground group-hover:text-primary">{simulation.title}</h3>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{simulation.client}</p>
                  {simulation.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{simulation.description}</p>
                  )}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{simulation.moduleCount ? `${simulation.moduleCount} tasks` : simulation.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span>{simulation.metricLabel || simulation.difficulty || 'Practice'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-black text-foreground">Your active simulations</h2>
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
            <h3 className="text-xl font-bold mb-2 text-foreground">No active simulations found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {filter === 'all'
                ? "You have not started a simulation yet. Choose any simulation from the catalogue above."
                : `You don't have any ${filter} simulations at the moment.`}
            </p>
            <Link
              to="/simulation/sim-pm-fintech-001"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Play className="h-4 w-4" />
              Start PayLoop Simulation
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
