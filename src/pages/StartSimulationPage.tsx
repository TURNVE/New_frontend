import { useState } from 'react';
import { ArrowRight, Briefcase, GraduationCap, Lock, PlayCircle, Rocket, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import { simulationTemplates } from '../config/simulationTemplates';
import { INTERN_ONBOARDING_CONFIG } from '../features/sim-intern-onboarding/config';

const StartSimulationPage = () => {
  usePageSetup();
  const navigate = useNavigate();
  const [showSimulations, setShowSimulations] = useState(false);

  const productManagementSimulations = [
    {
      id: INTERN_ONBOARDING_CONFIG.id,
      name: 'Product Management: First 30 Days',
      companyName: INTERN_ONBOARDING_CONFIG.companyName,
      difficulty: INTERN_ONBOARDING_CONFIG.difficulty,
      challengeDetails: INTERN_ONBOARDING_CONFIG.challengeDetails,
      primaryColor: INTERN_ONBOARDING_CONFIG.primaryColor,
      briefing: { totalWeeks: INTERN_ONBOARDING_CONFIG.totalWeeks },
      budget: INTERN_ONBOARDING_CONFIG.budget || 0,
      isFirstSimulation: true,
      access: 'Unlocked',
      summary: 'Start as an intern, accept your offer, meet the team, then grow into real PM work inside TechCorp.'
    },
    ...[
      simulationTemplates['sim-pm-001'],
      simulationTemplates['sim-pm-002'],
      simulationTemplates['sim-pm-003'],
      simulationTemplates['sim-pm-004'],
    ].filter(Boolean).map(sim => ({
      ...sim,
      isFirstSimulation: false,
      access: 'Premium',
      summary: sim.challengeDetails || 'A premium workplace simulation with deeper product trade-offs, stakeholders, and execution pressure.'
    }))
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intro': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20';
      case 'intermediate': return 'text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20';
      case 'advanced': return 'text-rose-600 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/20';
      default: return 'text-primary bg-primary/5 border-primary/10';
    }
  };

  const startSimulation = (sim: typeof productManagementSimulations[number]) => {
    if (sim.isFirstSimulation) {
      navigate('/simulation/sim-intern-001');
      return;
    }

    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
              <Target className="mr-1.5 h-3.5 w-3.5" />
              Product Management Path
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Learn product management through a workplace simulation path.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              The first simulation starts with an internship-style onboarding moment, then grows into real workforce scenarios: team communication, product judgment, stakeholder calls, prioritization, and delivery pressure.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => setShowSimulations(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <PlayCircle className="h-4 w-4" />
                Get Started
              </button>
              <button
                onClick={() => navigate('/simulations')}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-accent/40"
              >
                My simulations
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['Real workplace flow', Users],
                ['Portfolio-ready decisions', ShieldCheck],
                ['Premium paths locked', Lock],
              ].map(([label, Icon]) => (
                <div key={String(label)} className="rounded-2xl border border-border bg-card p-4">
                  <Icon className="mb-3 h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">{String(label)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-2xl shadow-primary/10">
            <img
              src="/images/intern-mentor.png"
              alt="Product management workplace mentor"
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/40 bg-white/90 p-5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#111318]/90">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">Current focus</p>
                  <p className="text-sm font-bold text-foreground">Simulation 1: onboarding into practical PM work</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {showSimulations && (
          <section className="mt-10 rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">Simulation library</p>
                <h2 className="mt-1 text-2xl font-black text-foreground">Product Management simulations</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Start with the open TechCorp path. The other simulations are visible so learners understand the roadmap, but they require an upgraded plan.
                </p>
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                {productManagementSimulations.length} simulations
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {productManagementSimulations.map((sim) => (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => startSimulation(sim)}
                  className={`group flex min-h-[220px] flex-col rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    sim.isFirstSimulation
                      ? 'border-primary/25 bg-primary/5 hover:border-primary/40'
                      : 'border-border bg-background/60 hover:border-amber-400/40'
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                        style={{ backgroundColor: `${sim.primaryColor}10`, borderColor: `${sim.primaryColor}30`, color: sim.primaryColor }}
                      >
                        {sim.isFirstSimulation ? <GraduationCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary">{sim.name}</h3>
                        <p className="text-xs font-medium text-muted-foreground">{sim.companyName}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${sim.isFirstSimulation ? getDifficultyColor(sim.difficulty) : 'border-amber-300/30 bg-amber-400/10 text-amber-600 dark:text-amber-300'}`}>
                      {sim.isFirstSimulation ? sim.difficulty : 'Paywall'}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{sim.summary}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {sim.isFirstSimulation ? 'Unlocked first simulation' : `${sim.briefing.totalWeeks} week premium project`}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${sim.isFirstSimulation ? 'text-primary' : 'text-amber-600 dark:text-amber-300'}`}>
                      {sim.isFirstSimulation ? <Rocket className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {sim.isFirstSimulation ? 'Start' : 'Upgrade'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StartSimulationPage;
