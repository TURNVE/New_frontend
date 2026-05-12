import { ArrowLeft, Rocket, Clock, Target, Star, ChevronRight, Briefcase, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import { simulationTemplates } from '../config/simulationTemplates';
import { INTERN_ONBOARDING_CONFIG } from '../features/sim-intern-onboarding/config';

const StartSimulationPage = () => {
  usePageSetup();
  const navigate = useNavigate();

  // Combine Intern Onboarding with PM simulations
  const allSimulations = [
    {
      id: INTERN_ONBOARDING_CONFIG.id,
      name: INTERN_ONBOARDING_CONFIG.name,
      companyName: INTERN_ONBOARDING_CONFIG.companyName,
      difficulty: INTERN_ONBOARDING_CONFIG.difficulty,
      challengeDetails: INTERN_ONBOARDING_CONFIG.challengeDetails,
      primaryColor: INTERN_ONBOARDING_CONFIG.primaryColor,
      briefing: { totalWeeks: INTERN_ONBOARDING_CONFIG.totalWeeks },
      budget: INTERN_ONBOARDING_CONFIG.budget || 0,
      isInternship: true
    },
    ...[
      simulationTemplates['sim-pm-001'],
      simulationTemplates['sim-pm-002'],
      simulationTemplates['sim-pm-003'],
      simulationTemplates['sim-pm-004'],
    ].filter(Boolean).map(sim => ({ ...sim, isInternship: false }))
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intro': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20';
      case 'intermediate': return 'text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20';
      case 'advanced': return 'text-rose-600 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/20';
      default: return 'text-primary bg-primary/5 border-primary/10';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="text-xl font-bold tracking-tighter text-primary">TURNVE</Link>
            <button
              onClick={() => navigate('/simulations')}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Simulations
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-primary/10 border border-primary/20 text-primary">
            <Target className="h-3.5 w-3.5 mr-1.5" />
            Product Management Journey
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Select your <span className="text-primary">Simulation Project</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every simulation is a real-world scenario designed to build practical experience. 
            Start with the Internship Onboarding to learn the basics, or jump into advanced challenges.
          </p>
        </div>

        {/* Simulation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {allSimulations.map((sim) => (
            <button
              key={sim.id}
              onClick={() => {
                if (sim.isInternship) {
                  navigate('/simulation/intern');
                } else {
                  navigate(`/briefing?industry=technology&track=product-management&role=product-management&templateId=${sim.id}`);
                }
              }}
              className="group relative flex flex-col bg-card hover:bg-accent/50 rounded-2xl p-6 lg:p-8 transition-all duration-300 text-left border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 shadow-sm" 
                  style={{ backgroundColor: `${sim.primaryColor}10`, borderColor: `${sim.primaryColor}30`, color: sim.primaryColor }}>
                  {sim.isInternship ? <GraduationCap className="w-7 h-7" /> : <Briefcase className="w-7 h-7" />}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getDifficultyColor(sim.difficulty)}`}>
                  {sim.difficulty}
                </div>
              </div>

              <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {sim.name}
              </h3>
              <p className="text-sm lg:text-base text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
                {sim.challengeDetails}
              </p>

              <div className="mt-auto grid grid-cols-3 gap-4 py-6 border-t border-border/60">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70">Company</p>
                  <p className="text-xs font-semibold text-foreground truncate">{sim.companyName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70">Duration</p>
                  <p className="text-xs font-semibold text-foreground">{sim.briefing.totalWeeks} {sim.briefing.totalWeeks === 1 ? 'Week' : 'Weeks'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70">Budget</p>
                  <p className="text-xs font-semibold text-foreground">{sim.budget > 0 ? `$${(sim.budget / 1000).toFixed(0)}K` : 'N/A'}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <Rocket className="w-4 h-4" />
                  {sim.isInternship ? 'Start Onboarding' : 'Start Project'}
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StartSimulationPage;
