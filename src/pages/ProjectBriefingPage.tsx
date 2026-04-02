import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Rocket, Calendar, Users, Target, AlertTriangle, 
  CheckCircle2, ArrowRight, Lightbulb, Info, Sun, Moon,
  PlayCircle, FileText, Award, TrendingUp, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { simulationTemplates } from '../config/simulationTemplates';

interface SimulationBrief {
  id: string;
  title: string;
  company: string;
  industry: string;
  duration: string;
  difficulty: string;
  teamSize: number;
  description: string;
  businessGoal: string;
  constraints: string[];
  deliverables: string[];
  successMetrics: string[];
  milestones: { week: number; title: string; description: string }[];
}

function getRandomPMSimulation(): string {
  const pmSimulationIds = ['sim-pm-001', 'sim-pm-002', 'sim-pm-003', 'sim-pm-004'];
  return pmSimulationIds[Math.floor(Math.random() * pmSimulationIds.length)];
}

const ProjectBriefingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const [showHints, setShowHints] = useState(true);
  const [acceptedBrief, setAcceptedBrief] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    constraints: true,
    deliverables: true,
    milestones: true,
    metrics: true,
    team: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const industry = searchParams.get('industry') || 'Technology';
  const role = searchParams.get('role') || 'product-management';
  
  const pmSimulationId = getRandomPMSimulation();
  const pmTemplate = simulationTemplates[pmSimulationId];
  
  const briefs: Record<string, SimulationBrief> = {
    'product-management': {
      id: pmSimulationId,
      title: pmTemplate.briefing.title,
      company: pmTemplate.companyName,
      industry: pmTemplate.industry,
      duration: `${pmTemplate.briefing.totalWeeks} weeks`,
      difficulty: pmTemplate.difficulty === 'intro' ? 'Beginner' : pmTemplate.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
      teamSize: pmTemplate.briefing.teamSize || 8,
      description: pmTemplate.challengeDetails,
      businessGoal: pmTemplate.challenge,
      constraints: pmTemplate.briefing.currentRisks?.map(r => `${r.title} (${r.severity})`) || [],
      deliverables: pmTemplate.tasks.map(t => t.title),
      successMetrics: pmTemplate.briefing.successCriteria?.map(c => c.description) || [],
      milestones: pmTemplate.briefing.timelinePhases?.map((phase, idx) => ({
        week: Math.ceil((idx + 1) * (pmTemplate.briefing.totalWeeks / pmTemplate.briefing.timelinePhases!.length)),
        title: phase.name,
        description: phase.description
      })) || [],
    },
    'web-dev': {
      id: 'sim-web-001',
      title: 'E-commerce Checkout Optimization',
      company: 'Shopify Plus',
      industry: industry,
      duration: '8 weeks',
      difficulty: 'Advanced',
      teamSize: 3,
      description: 'Refactor the core checkout microservice to handle peak traffic during Black Friday. You\'ll need to optimize database queries, implement caching, and ensure 99.99% reliability.',
      businessGoal: 'Reduce checkout latency by 45% and increase successful transaction rate by 5% during high-load periods.',
      constraints: [
        'Zero-downtime migration required',
        'Must maintain full backward compatibility with existing payment APIs',
        'Budget: $85K for infrastructure and dev costs',
        'Stack: Node.js, PostgreSQL, Redis, Kubernetes',
      ],
      deliverables: [
        'Technical Design Document',
        'Optimized Codebase & PRs',
        'Load Testing Results & Report',
        'Monitoring Dashboards (Grafana)',
        'Post-mortem & Stability Report',
      ],
      successMetrics: [
        'Average latency < 200ms at 10k RPS',
        'Error rate < 0.01%',
        'Test coverage > 90%',
        'Successful Black Friday load test simulation',
      ],
      milestones: [
        { week: 2, title: 'Profiling & Bottleneck ID', description: 'Deep dive into existing infra, identify slow queries' },
        { week: 4, title: 'Refactoring Phase 1', description: 'Database indexing and caching layer implementation' },
        { week: 6, title: 'Load Testing', description: 'Simulate peak traffic, refine performance' },
        { week: 8, title: 'Rollout', description: 'Canary deployment and final monitoring' },
      ],
    },
    'data-analytics': {
      id: 'sim-data-001',
      title: 'Predictive Subscriber Churn Model',
      company: 'Netflix',
      industry: industry,
      duration: '10 weeks',
      difficulty: 'Intermediate',
      teamSize: 3,
      description: 'Analyze millions of user behavior data points to build a predictive model that identifies subscribers likely to churn within the next 30 days.',
      businessGoal: 'Achieve > 80% precision in churn prediction and provide actionable insights for retention marketing campaigns.',
      constraints: [
        'Strict GDPR and data privacy compliance',
        'Integration with existing Snowflake / AWS data stack',
        'Explainable AI requirements (stakeholders must understand feature importance)',
      ],
      deliverables: [
        'Exploratory Data Analysis (EDA) Report',
        'Predictive Model (Production-ready)',
        'Automated Reporting Dashboard',
        'Feature Importance Analysis',
        'Retention Strategy Recommendations',
      ],
      successMetrics: [
        'Model F1-Score > 0.82',
        'Processing time < 4 hours for full dataset',
        'Dashboard update frequency: Daily',
        'Stakeholder approval of insight clarity',
      ],
      milestones: [
        { week: 3, title: 'Data Cleaning & Prep', description: 'Feature engineering from raw logs, handling missing data' },
        { week: 5, title: 'Model Prototyping', description: 'Testing XGBoost, Random Forest, and MLP models' },
        { week: 8, title: 'Model Optimization', description: 'Hyperparameter tuning, cross-validation' },
        { week: 10, title: 'Presentation', description: 'Final report to marketing heads and dashboard handover' },
      ],
    },
    'brand-design-advertising': {
      id: 'sim-design-001',
      title: 'Global Rebranding & Identity Refresh',
      company: 'Nike Vision',
      industry: industry,
      duration: '6 weeks',
      difficulty: 'Advanced',
      teamSize: 5,
      description: 'Lead the creative direction for a brand identity refresh targeting Gen Z athletes. Create a cohesive visual language that works across digital, print, and physical spaces.',
      businessGoal: 'Increase brand sentiment scores by 25% among target demographic and launch a viral social media campaign.',
      constraints: [
        'Must respect core brand assets (Swoosh logo)',
        'Extremely tight timeline for high-fidelity assets',
        'Coordination with international marketing leads',
      ],
      deliverables: [
        'New Brand Style Guide',
        'Social Media Asset Pack',
        'Video Campaign Direction',
        'OOH (Out-of-home) Mockups',
        'Brand Launch Strategy',
      ],
      successMetrics: [
        'Social media engagement rate > 8%',
        'Brand recall boost > 15%',
        'Positive sentiment on Twitter/IG > 70%',
        'Internal stakeholder alignment (100% approval)',
      ],
      milestones: [
        { week: 1, title: 'Moodboards & Direction', description: 'Defining the visual vibe and core colors/type' },
        { week: 3, title: 'Logo Refinement', description: 'Subtle updates to secondary marks and sub-branding' },
        { week: 5, title: 'Campaign Rollout', description: 'Finalizing ads and video storyboards' },
        { week: 6, title: 'Brand Book Delivery', description: 'Final sign-off and distribution' },
      ],
    },
    'project-management': {
      id: 'sim-oper-001',
      title: 'Cross-border Logistics Expansion',
      company: 'Amazon Global',
      industry: industry,
      duration: '14 weeks',
      difficulty: 'Advanced',
      teamSize: 6,
      description: 'Manage the complex setup of three new automated fulfillment centers across Southeast Asia, coordinating with local vendors, governments, and tech teams.',
      businessGoal: 'Bring fulfillment centers online within budget and on time to support 200% growth in regional delivery volume.',
      constraints: [
        'Complex international regulation and customs laws',
        'Strict $5M budget per location',
        'Reliance on 3rd party logistics (3PL) partners',
      ],
      deliverables: [
        'Detailed Project Plan (Gantt)',
        'Risk Management Registry',
        'Vendor Service Level Agreements (SLAs)',
        'Operations Manual',
        'Site Readiness Reports',
      ],
      successMetrics: [
        '0% deviation from go-live date',
        'Budget overrun < 2%',
        'Storage capacity > 1M units per site',
        'Safety incident rate: 0.0',
      ],
      milestones: [
        { week: 3, title: 'Site Acquisition & Permits', description: 'Finalizing land deals and legal paperwork' },
        { week: 6, title: 'Infrastructure Build', description: 'Setting up automation tech and warehouses' },
        { week: 10, title: 'Hiring & Training', description: 'Staffing the centers with 500+ workers each' },
        { week: 14, title: 'First Package Shipment', description: 'Official launch and stress testing' },
      ],
    }
  };

  const brief = briefs[role] || briefs['product-management'];

  const handleStartSimulation = () => {
    if (acceptedBrief) {
      navigate(`/simulation/${brief.id}`);
    }
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg sm:rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">T</span>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-gray-900">Turnve</h1>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden xs:block">Project Management Simulation</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowStartModal(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-white transition-all text-sm sm:text-base min-w-[120px] sm:min-w-auto shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Rocket className="w-5 h-5" />
              <span>Start Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const renderProgressIndicator = () => (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">Industry, Track & Role</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 min-w-4 sm:min-w-8" />
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-blue-600 whitespace-nowrap">Project Briefing</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 min-w-4 sm:min-w-8" />
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Simulation</span>
        </div>
      </div>
    </div>
  );

  const renderBriefingHeader = () => (
    <div className="rounded-xl sm:rounded-2xl border p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 bg-white border-gray-200 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              {brief.industry}
            </span>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              {role.replace(/-/g, ' ')}
            </span>
            <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
              brief.difficulty === 'Intermediate' 
                ? 'bg-amber-500/20 text-amber-600' 
                : brief.difficulty === 'Beginner' 
                ? 'bg-green-500/20 text-green-600' 
                : 'bg-red-500/20 text-red-600'
            }`}>
              {brief.difficulty}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
            {brief.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {brief.company}
          </p>
        </div>
        {showHints && (
          <div className="group relative p-2 sm:p-3 rounded-lg cursor-help flex-shrink-0 bg-gray-100">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 sm:w-80 p-3 sm:p-4 rounded-lg shadow-xl border text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-white border-gray-200 text-gray-700">
              <p>This is your project briefing. Read carefully - all constraints, deliverables, and success metrics will affect your final evaluation score.</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 text-gray-700">
        {brief.description}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          icon={Calendar}
          label="Duration"
          value={brief.duration}
          hint="Total simulation time. Manage it wisely."
          showHint={showHints}
        />
        <StatCard 
          icon={Users}
          label="Team Size"
          value={`${brief.teamSize} members`}
          hint="Your cross-functional team. Monitor their capacity and morale."
          showHint={showHints}
        />
        <StatCard 
          icon={Target}
          label="Industry"
          value={brief.industry}
          hint="Industry context affects stakeholder priorities and constraints."
          showHint={showHints}
        />
        <StatCard 
          icon={Award}
          label="Success Metrics"
          value={`${brief.successMetrics.length} KPIs`}
          hint="Your performance will be evaluated against these metrics."
          showHint={showHints}
        />
      </div>
    </div>
  );

  const renderBusinessGoal = () => (
    <Section 
      title="Business Goal"
      icon={Target}
      hint="This is your North Star. Every decision should ladder up to this goal."
      showHint={showHints}
    >
      <p className="text-sm sm:text-base leading-relaxed text-gray-700">
        {brief.businessGoal}
      </p>
    </Section>
  );

  const renderConstraints = () => (
    <CollapsibleSection
      title="Constraints & Limitations"
      icon={AlertTriangle}
      hint="Constraints are fixed. You cannot change these - you must work within them. Violating constraints will severely impact your score."
      showHint={showHints}
      isExpanded={expandedSections.constraints}
      onToggle={() => toggleSection('constraints')}
    >
      <ul className="space-y-2 sm:space-y-3">
        {brief.constraints.map((constraint, i) => (
          <li key={i} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-gray-700">{constraint}</span>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );

  const renderDeliverables = () => (
    <CollapsibleSection
      title="Required Deliverables"
      icon={FileText}
      hint="These artifacts will be auto-generated as you work. Complete them for full credit."
      showHint={showHints}
      isExpanded={expandedSections.deliverables}
      onToggle={() => toggleSection('deliverables')}
    >
      <ul className="space-y-2">
        {brief.deliverables.map((deliverable, i) => (
          <li key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-100">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700">{deliverable}</span>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );

  const renderMilestones = () => (
    <CollapsibleSection
      title="Project Milestones"
      icon={Calendar}
      hint="Milestones are checkpoints. Missing them will cascade delays and affect stakeholder trust."
      showHint={showHints}
      isExpanded={expandedSections.milestones}
      onToggle={() => toggleSection('milestones')}
    >
      <div className="relative">
        <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-4 sm:space-y-6">
          {brief.milestones.map((milestone, i) => (
            <div key={i} className="relative flex gap-3 sm:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-white text-[10px] sm:text-xs font-bold">{milestone.week}</span>
              </div>
              <div className="flex-1 p-3 sm:p-4 rounded-lg border bg-white border-gray-200">
                <h4 className="text-sm sm:text-base font-semibold mb-1 text-gray-900">
                  {milestone.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CollapsibleSection>
  );

  const renderSuccessMetrics = () => (
    <CollapsibleSection
      title="Success Metrics (KPIs)"
      icon={TrendingUp}
      hint="Your final score is calculated from these metrics. Aim to exceed all targets."
      showHint={showHints}
      isExpanded={expandedSections.metrics}
      onToggle={() => toggleSection('metrics')}
    >
      <ul className="space-y-2 sm:space-y-3">
        {brief.successMetrics.map((metric, i) => (
          <li key={i} className="p-2 sm:p-3 rounded-lg border bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span className="text-[10px] sm:text-xs font-medium text-green-700">
                Target
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700">{metric}</p>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );

  const renderTeamInfo = () => (
    <CollapsibleSection
      title="Your Team"
      icon={Users}
      hint="Team members have different capacities and skills. Monitor their workload and morale."
      showHint={showHints}
      isExpanded={expandedSections.team}
      onToggle={() => toggleSection('team')}
    >
      <div className="flex flex-wrap gap-3">
        <TeamAvatar name="Alex C." role="Senior Engineer" color="from-blue-500 to-blue-600" />
        <TeamAvatar name="Sarah M." role="Junior Engineer" color="from-green-500 to-green-600" />
        <TeamAvatar name="Jordan P." role="Product Designer" color="from-purple-500 to-purple-600" />
        <TeamAvatar name="Taylor K." role="QA Engineer" color="from-amber-500 to-amber-600" />
      </div>
    </CollapsibleSection>
  );

  const renderFooter = () => (
    <footer className="border-t mt-12 py-6 bg-white/50 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowHints(!showHints)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                showHints 
                  ? 'bg-blue-500/20 text-blue-600' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {showHints ? 'Hints On' : 'Hints Off'}
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition bg-gray-200 text-gray-600"
            >
              {theme === 'dark' ? <><Sun className="w-4 h-4" /> Dark Mode</> : <><Moon className="w-4 h-4" /> Light Mode</>}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>© 2026 Turnve</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span>PM Simulation v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );

  const renderStartModal = () => {
    if (!showStartModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl border shadow-2xl bg-white border-gray-200">
          <button
            onClick={() => setShowStartModal(false)}
            className="absolute top-4 right-4 p-2 rounded-lg transition hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Ready to Begin?
                </h3>
                <p className="text-sm text-gray-600">
                  Start your simulation journey
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-6 bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-amber-700">
                    Important Notice
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Once you start, the simulation clock begins. You cannot pause or restart. All decisions are final and will be recorded for evaluation.
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl cursor-pointer mb-6 transition bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={acceptedBrief}
                onChange={(e) => setAcceptedBrief(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">
                I have read and understood the project brief, constraints, and success criteria
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowStartModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStartSimulation}
                disabled={!acceptedBrief}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                  acceptedBrief 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25' 
                    : 'bg-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <Rocket className="w-5 h-5" />
                <span>Start</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderProgressIndicator()}
        {renderBriefingHeader()}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {renderBusinessGoal()}
            {renderConstraints()}
            {renderDeliverables()}
            {renderMilestones()}
          </div>

          <div className="space-y-6 lg:space-y-8">
            {renderSuccessMetrics()}
            {renderTeamInfo()}
          </div>
        </div>

        {renderStartModal()}
      </main>

      {renderFooter()}
    </div>
  );
};

function StatCard({ icon: Icon, label, value, hint, showHint }: { 
  icon: any; 
  label: string; 
  value: string; 
  hint: string;
  showHint: boolean;
}) {
  return (
    <div className="relative p-3 sm:p-4 rounded-xl border bg-white border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        {showHint && (
          <div className="group relative">
            <Info className="w-3 h-3 sm:w-4 sm:h-4 cursor-help text-gray-400" />
            <div className="absolute right-0 top-8 w-40 sm:w-48 p-2 rounded-lg shadow-lg border text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-white border-gray-200 text-gray-700">
              {hint}
            </div>
          </div>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] sm:text-xs mt-1 text-gray-500">{label}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children, hint, showHint }: { 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  hint: string;
  showHint: boolean;
}) {
  return (
    <div className="rounded-xl border p-4 sm:p-6 bg-white border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {showHint && (
          <div className="group relative flex-shrink-0">
            <Info className="w-4 h-4 cursor-help text-gray-400" />
            <div className="absolute right-0 top-8 w-56 sm:w-64 p-2 sm:p-3 rounded-lg shadow-xl border text-[10px] sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-white border-gray-200 text-gray-700">
              {hint}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, children, hint, showHint, isExpanded, onToggle }: {
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  hint: string;
  showHint: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border overflow-hidden bg-white border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 text-left">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {showHint && (
            <div className="group relative hidden sm:block">
              <Info className="w-4 h-4 cursor-help text-gray-400" />
              <div className="absolute right-0 top-8 w-56 sm:w-64 p-2 sm:p-3 rounded-lg shadow-xl border text-[10px] sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-white border-gray-200 text-gray-700">
                {hint}
              </div>
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {children}
        </div>
      )}
    </div>
  );
}

function TeamAvatar({ name, role, color }: { name: string; role: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[70px]">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg`}>
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="text-center">
        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[80px] sm:max-w-full">{name}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[80px] sm:max-w-full">{role}</p>
      </div>
    </div>
  );
}

export default ProjectBriefingPage;
