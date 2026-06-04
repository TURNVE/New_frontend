import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ChevronRight, TrendingUp, TrendingDown,
  Home, FileText, BarChart3, LineChart, ArrowRight,
  Pause, Play, RotateCcw, Trophy, FolderOpen, FolderHeart,
  Building2, Bell, Mail, MessageSquare, LayoutList, Map, Gauge,
  PanelRight, PanelRightClose, AlertCircle, Zap, Target,
  Clock, CheckCircle, X, Moon, Sun, AlertTriangle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { createDefaultScenario, createScenarioFromTemplate, type ScenarioAction, type ActionChoice } from '../simulation/core/SimulationEngine';
import { getSimulationByRoute } from '../config/simulationTemplates';
import type { RoadmapPhase, BacklogItem } from '../pmtools/types';
import { DocumentsPanel } from '../components/simulation/DocumentsPanel';
import { PortfolioBuilder } from '../components/simulation/PortfolioBuilder';
import { CompanyPanel } from '../components/company/CompanyPanel';
import { BacklogPanel } from '../components/pmtools/BacklogPanel';
import { RoadmapPanel } from '../components/pmtools/RoadmapPanel';
import { MetricsPanel } from '../components/pmtools/MetricsPanel';
import { NotificationCenter, useNotifications } from '../components/communications/NotificationCenter';
import { ToastContainer } from '../components/communications/ToastContainer';
import { WelcomeHint } from '../components/overlay/WelcomeHint';
import { enableSounds } from '../utils/sounds';
import { ProjectReferencePanel } from '../components/simulation/ProjectReferencePanel';
import { useBriefing } from '../hooks/useBriefing';
import { useSimulationNotifications } from '../hooks/useSimulationNotifications';
import { useSimulation } from '../hooks/useSimulation';
import type { ArtifactType, Artifact } from '../../../src/artifacts/types';
import { ArtifactGenerator } from '../../../src/artifacts/ArtifactGenerator';
import { ArtifactSubmissionModal } from '../components/simulation/ArtifactSubmissionModal';
import { StakeholderChallengeModal } from '../components/simulation/StakeholderChallengeModal';
import type { ArtifactDefinition } from '../../../src/simulation/evaluation/AIEvaluationTypes';
import { webDev01Artifacts, getArtifactById } from '../../../src/simulation/content/web-dev-01/web-dev-01-artifacts';

interface SimulationMetric {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    color: 'green' | 'red' | 'primary';
  };
  goal?: string;
  progress?: number;
  borderColor: 'blue' | 'red' | 'primary' | 'green';
}

const DEFAULT_ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    name: 'Planning',
    startWeek: 1,
    endWeek: 4,
    items: [
      { id: 'r1', title: 'Requirements Gathering', description: 'Collect and document all requirements', status: 'completed', startWeek: 1, endWeek: 2, category: 'Planning', progress: 100 },
      { id: 'r2', title: 'Technical Design', description: 'Design system architecture', status: 'completed', startWeek: 2, endWeek: 3, category: 'Planning', progress: 100 },
      { id: 'r3', title: 'Sprint Planning', description: 'Plan first development sprint', status: 'completed', startWeek: 3, endWeek: 4, category: 'Planning', progress: 100 },
    ],
  },
  {
    id: 'phase-2',
    name: 'Development',
    startWeek: 5,
    endWeek: 9,
    items: [
      { id: 'd1', title: 'Sprint 1 - Core Features', description: 'Build authentication and dashboard', status: 'in-progress', startWeek: 5, endWeek: 6, category: 'Development', progress: 60 },
      { id: 'd2', title: 'Sprint 2 - User Features', description: 'Build user management features', status: 'planned', startWeek: 7, endWeek: 8, category: 'Development', progress: 20 },
      { id: 'd3', title: 'Sprint 3 - Polish', description: 'Bug fixes and improvements', status: 'planned', startWeek: 9, endWeek: 9, category: 'Development', progress: 0 },
    ],
  },
  {
    id: 'phase-3',
    name: 'Launch',
    startWeek: 10,
    endWeek: 12,
    items: [
      { id: 'l1', title: 'Beta Testing', description: 'Release to beta users', status: 'planned', startWeek: 10, endWeek: 11, category: 'Launch', progress: 0 },
      { id: 'l2', title: 'Production Launch', description: 'Full release', status: 'planned', startWeek: 12, endWeek: 12, category: 'Launch', progress: 0 },
    ],
  },
];

const SimulationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams<{ id: string }>();

  // Extract simulation ID from either params or pathname
  const simulationId = useMemo(() => {
    if (paramId) return paramId;
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.startsWith('sim-')) return lastPart;
    return lastPart; // Try using it directly as slug if it doesn't have sim-
  }, [paramId, location.pathname]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'backlog' | 'roadmap' | 'metrics' | 'documents' | 'portfolio' | 'company'>('dashboard');
  const [showWelcomeHint, setShowWelcomeHint] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedActionData, setSelectedActionData] = useState<ScenarioAction | null>(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactDefinition | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [pendingChallenges, setPendingChallenges] = useState<any[]>([]);
  const [feedback, setFeedback] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Get simulation template based on route ID
  const simulationScenario = useMemo(() => {
    if (simulationId) {
      const template = getSimulationByRoute(simulationId);
      if (template) {
        return createScenarioFromTemplate(template);
      }
    }
    return createDefaultScenario();
  }, [simulationId]);

  const {
    gameState,
    scenario,
    isRunning,
    isPaused,
    score,
    availableActions,
    upcomingEvents,
    lastEvent,
    isCompleted,
    startSimulation: baseStartSimulation,
    pauseSimulation,
    resumeSimulation,
    makeDecision,
    advanceTime,
    restartSimulation,
    updateCustomState,
    sessionId,
  } = useSimulation(simulationScenario);

  // Safely extract derived state
  const artifacts: Artifact[] = (gameState as any)?.artifacts || [];
  const backlogItems: BacklogItem[] = (gameState as any)?.backlogItems || DEFAULT_BACKLOG_ITEMS;
  const roadmapPhases: RoadmapPhase[] = (gameState as any)?.roadmapPhases || DEFAULT_ROADMAP_PHASES;

  const { briefing: projectBriefing, currentWeek: briefingWeek } = useBriefing({
    scenarioId: simulationId || undefined,
    initialWeek: gameState?.week || 1,
  });

  const getMetrics = (): SimulationMetric[] => {
    if (!gameState) return [];
    const budgetPercent = Math.round((gameState.budget / gameState.initialBudget) * 100);
    const progressPercent = Math.round(gameState.progress);
    const riskPercent = Math.round(gameState.riskLevel * 100);

    return [
      {
        label: 'Budget Remaining',
        value: `$${gameState.budget}K`,
        trend: {
          value: `${budgetPercent}% left`,
          direction: budgetPercent > 30 ? 'up' : 'down',
          color: budgetPercent > 30 ? 'green' : budgetPercent > 15 ? 'primary' : 'red'
        },
        borderColor: budgetPercent > 30 ? 'blue' : budgetPercent > 15 ? 'primary' : 'red',
      },
      {
        label: 'Project Progress',
        value: `${progressPercent}%`,
        trend: {
          value: `Week ${gameState.week}/${gameState.totalWeeks}`,
          direction: 'up',
          color: 'green'
        },
        borderColor: progressPercent > 70 ? 'green' : progressPercent > 40 ? 'blue' : 'primary',
      },
      {
        label: 'Risk Level',
        value: `${riskPercent}%`,
        trend: {
          value: gameState.riskLevel > 0.6 ? 'Critical' : gameState.riskLevel > 0.4 ? 'Elevated' : 'Managed',
          direction: gameState.riskLevel > 0.5 ? 'up' : 'down',
          color: gameState.riskLevel > 0.6 ? 'red' : gameState.riskLevel > 0.4 ? 'primary' : 'green'
        },
        borderColor: gameState.riskLevel > 0.6 ? 'red' : gameState.riskLevel > 0.4 ? 'primary' : 'green',
      },
      {
        label: 'Team Morale',
        value: `${Math.round(gameState.teamMorale)}%`,
        trend: {
          value: gameState.teamMorale > 75 ? 'High' : gameState.teamMorale > 50 ? 'Moderate' : 'Low',
          direction: gameState.teamMorale > 60 ? 'up' : 'down',
          color: gameState.teamMorale > 75 ? 'green' : gameState.teamMorale > 50 ? 'primary' : 'red'
        },
        borderColor: gameState.teamMorale > 75 ? 'green' : gameState.teamMorale > 50 ? 'blue' : 'primary',
      },
    ];
  };

  const getSignals = () => {
    if (!gameState?.signals) return [];
    return gameState.signals.slice(-5).map((signal, index) => ({
      id: signal.id || `signal-${index}`,
      from: signal.source === 'data' ? 'Data Science Team' :
        signal.source === 'support' ? 'Customer Support' :
          signal.source === 'leadership' ? 'Leadership' : 'Sales Team',
      team: signal.source?.substring(0, 2).toUpperCase() || 'DT',
      message: signal.message,
      priority: signal.priority === 'high' ? 'critical' : 'normal',
      avatarColor: signal.source === 'data' ? 'bg-purple-500/20 text-purple-400' :
        signal.source === 'support' ? 'bg-emerald-500/20 text-emerald-400' :
          signal.source === 'leadership' ? 'bg-primary/20 text-primary' :
            'bg-blue-500/20 text-blue-400',
    }));
  };

  const handleActionSelect = useCallback((action: ScenarioAction) => {
    setSelectedActionData(action);
    
    // For web-dev-01, check if action requires submitting an artifact
    if (simulationId === 'web-dev-01' && 'submitWork' in action && action.submitWork) {
      // Map action to appropriate artifact based on action type
      let artifactId: string | undefined;
      
      if (action.id === 'analyze_logs' || action.id === 'review_queries' || action.id === 'check_infrastructure') {
        artifactId = 'artifact-diagnosis';
      } else if (action.id === 'choose_fix_approach' || action.id === 'estimate_impact') {
        artifactId = 'artifact-tech-decision';
      } else if (action.id === 'implement_fix') {
        artifactId = 'artifact-code';
      } else if (action.id === 'document_rollback') {
        artifactId = 'artifact-pr';
      } else if (action.id === 'analyze_results' || action.id === 'run_load_test') {
        artifactId = 'artifact-perf-analysis';
      } else if (action.id === 'update_cto' || action.id === 'respond_to_cfo' || action.id === 'align_with_pm') {
        artifactId = 'artifact-comms';
      } else if (action.id === 'make_launch_decision' || action.id === 'prepare_rollback') {
        artifactId = 'artifact-launch-decision';
      }
      
      if (artifactId) {
        const artifact = getArtifactById(artifactId);
        if (artifact) {
          setCurrentArtifact(artifact);
          setShowArtifactModal(true);
          return;
        }
      }
    }
    
    // Default: show decision modal
    setShowDecisionModal(true);
  }, [simulationId]);

  const handleArtifactSubmit = useCallback((submission: { artifactTypeId: string; structured: Record<string, unknown>; rawContent: string }) => {
    console.log('Artifact submitted:', submission);
    
    // For web-dev-01, check if this submission triggers any stakeholder challenges
    if (simulationId === 'web-dev-01') {
      const raw = submission.rawContent.toLowerCase();
      const newChallenges: any[] = [];
      
      // Check for vague language - triggers challenge
      if (raw.includes('hopefully') || raw.includes('maybe') || raw.includes('might') || raw.includes('probably')) {
        newChallenges.push({
          id: `challenge-${Date.now()}`,
          stakeholderId: 'cto',
          channel: 'slack',
          subject: 'Clarification needed on your submission',
          message: 'I noticed some vague language in your submission. Can you be more specific about the timeline and expected outcomes?',
          context: 'Vague language detected in artifact',
          requiresResponse: true,
          responseRequired: true,
          timeoutMinutes: 5,
        });
      }
      
      // Check for contradiction with diagnosis - triggers challenge
      if (submission.artifactTypeId === 'artifact-tech-decision') {
        // In a real implementation, this would check against stored diagnosis
        // For now, we'll simulate a challenge if they choose caching vs indexing without proper justification
        newChallenges.push({
          id: `challenge-${Date.now()}-cto`,
          stakeholderId: 'cto',
          channel: 'meeting',
          subject: 'Architecture decision review',
          message: 'I\'d like to understand how this decision aligns with your diagnosis. Can you explain the reasoning?',
          context: 'Architecture decision needs justification',
          requiresResponse: true,
          responseRequired: true,
          timeoutMinutes: 10,
        });
      }
      
      if (newChallenges.length > 0) {
        setPendingChallenges(newChallenges);
        setShowChallengeModal(true);
      }
    }
    
    // For now, just close the modal and show decision modal
    setShowArtifactModal(false);
    setShowDecisionModal(true);
  }, [simulationId]);

  const handleChallengeResponse = useCallback((challengeId: string, response: string) => {
    console.log('Challenge response:', challengeId, response);
    setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));
  }, []);

  const handleDecision = (choice: ActionChoice) => {
    if (!selectedActionData) return;
    const result = makeDecision(selectedActionData.id, choice.id);
    setFeedback(result.feedback);
    setShowDecisionModal(false);
    setSelectedActionData(null);
    setTimeout(() => setFeedback(''), 5000);
  };

  const hasMadeDecisionThisWeek = useMemo(() => {
    return gameState?.decisionsMade.some(d => d.week === gameState.week) || false;
  }, [gameState?.decisionsMade, gameState?.week]);

  const handleNextWeek = async () => {
    advanceTime();
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, id: 'dashboard' as const },
    { name: 'Backlog', icon: LayoutList, id: 'backlog' as const },
    { name: 'Roadmap', icon: Map, id: 'roadmap' as const },
    { name: 'Metrics', icon: Gauge, id: 'metrics' as const },
    { name: 'Company', icon: Building2, id: 'company' as const },
    { name: 'Documents', icon: FolderOpen, id: 'documents' as const },
    { name: 'Portfolio', icon: FolderHeart, id: 'portfolio' as const },
  ];

  const startSimulation = useCallback(() => {
    baseStartSimulation();
  }, [baseStartSimulation]);

  const handleGenerateArtifact = (type: ArtifactType) => {
    if (!gameState || !scenario) return;
    const generator = new ArtifactGenerator(gameState, scenario);
    const artifact = generator.generateArtifact(type);
    const newArtifact: Artifact = {
      id: `artifact-${Date.now()}`,
      sessionId: sessionId || 'default-session',
      type,
      title: artifact.title || 'Untitled Document',
      description: artifact.description,
      content: artifact.content || { sections: [] },
      metadata: { author: 'System', version: 1, tags: [] },
      status: 'generated',
      createdAt: new Date(),
      updatedAt: new Date(),
      week: gameState.week,
      phaseId: (gameState as any).currentPhaseId || '',
    };
    updateCustomState('artifacts', [...artifacts, newArtifact]);
  };

  const handleViewArtifact = (artifact: Artifact) => {
    console.log('View artifact:', artifact);
  };

  const handleExportArtifact = (artifact: Artifact, format: 'pdf' | 'docx') => {
    // Basic export logic
    const content = artifacts.find(a => a.id === artifact.id)?.description || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title}.${format === 'pdf' ? 'txt' : 'doc'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteArtifact = (artifact: Artifact) => {
    updateCustomState('artifacts', artifacts.filter(a => a.id !== artifact.id));
  };

  const { notifications, markNotificationRead } = useNotifications();
  const { processTimelineEvent } = useSimulationNotifications(gameState, isRunning, handleActionSelect);

  useEffect(() => {
    enableSounds();
  }, []);

  useEffect(() => {
    if (lastEvent && gameState?.stakeholders) {
      processTimelineEvent(lastEvent, gameState.stakeholders);
    }
  }, [lastEvent, gameState?.stakeholders, processTimelineEvent]);

  if (!gameState || !scenario) {
    return (
      <div className="flex h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Initializing simulation engine...</p>
        </div>
      </div>
    );
  }

  const metrics = getMetrics();
  const signals = getSignals();

  return (
    <>
      <ToastContainer
        notifications={notifications}
        onDismiss={markNotificationRead}
        onNotificationClick={() => setShowNotifications(true)}
        hidden={showNotifications}
      />
      <WelcomeHint isOpen={showWelcomeHint} onClose={() => setShowWelcomeHint(false)} />

      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
        <aside className="w-64 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] flex flex-col shrink-0">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              <span className="font-bold text-lg tracking-tight dark:text-white">{gameState?.company?.name || 'FlowDesk'}</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === item.id ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="p-4 mx-4 mb-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Current Phase</div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${gameState.phaseProgress}%` }} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(gameState.phaseProgress)}% complete</p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#121212]">
          <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                <ChevronRight className="h-5 w-5 rotate-180 text-gray-500 dark:text-gray-400" />
              </button>
              <h1 className="text-lg font-semibold dark:text-white">PM Workspace</h1>
              <div className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded border border-blue-500/20">
                WEEK {String(gameState.week).padStart(2, '0')}
              </div>

              {/* Real-time Countdown Timer */}
              <div className="flex items-center gap-2 px-3 py-1 font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-inner">
                <Clock className={`w-4 h-4 ${gameState.timeLeft < 600 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                <span className={`${gameState.timeLeft < 600 ? 'text-red-500 font-bold' : 'text-gray-900 dark:text-white'}`}>
                  {Math.floor(gameState.timeLeft / 3600).toString().padStart(2, '0')}:
                  {Math.floor((gameState.timeLeft % 3600) / 60).toString().padStart(2, '0')}:
                  {(gameState.timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {isPaused && (
                <div className="bg-primary-500/10 text-primary-500 text-xs font-bold px-2 py-1 rounded border border-primary-500/20 flex items-center gap-1">
                  <Pause className="w-3 h-3" />
                  PAUSED
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNotifications(true)} className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              </button>
              {!isRunning ? (
                <button onClick={startSimulation} className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
                  <Play className="w-4 h-4" />Start Simulation
                </button>
              ) : isPaused ? (
                <button onClick={resumeSimulation} className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" />Resume
                </button>
              ) : (
                <button onClick={pauseSimulation} className="bg-primary-500 hover:bg-primary-600 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-1" />
                    <Pause className="w-4 h-4" />Running
                  </span>
                </button>
              )}
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                {isDarkMode ? <Sun className="w-5 h-5 text-gray-400 dark:text-white" /> : <Moon className="w-5 h-5 text-gray-500" />}
              </button>
              <button onClick={restartSimulation} className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white px-3 py-2 rounded-md text-sm font-medium transition-all">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={handleNextWeek} disabled={!isRunning || isPaused} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                Next Week<ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </header>

          {feedback && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-8 py-3 text-sm">{feedback}</div>
          )}

          <div className="flex-1 overflow-hidden flex">
            {activeTab === 'documents' ? (
              <DocumentsPanel artifacts={artifacts} onGenerateArtifact={handleGenerateArtifact} onViewArtifact={handleViewArtifact} onExportArtifact={handleExportArtifact} onDeleteArtifact={handleDeleteArtifact} currentWeek={gameState?.week || 1} />
            ) : activeTab === 'portfolio' ? (
              <PortfolioBuilder artifacts={artifacts} />
            ) : activeTab === 'company' ? (
              <CompanyPanel currentWeek={gameState?.week || 1} />
            ) : activeTab === 'backlog' ? (
              <BacklogPanel gameState={gameState as any} items={backlogItems} setItems={(v) => {
                const newItems = typeof v === 'function' ? v(backlogItems) : v;
                updateCustomState('backlogItems', newItems);
              }} />
            ) : activeTab === 'roadmap' ? (
              <RoadmapPanel totalWeeks={gameState?.totalWeeks || 12} currentWeek={gameState?.week || 1} phases={roadmapPhases} />
            ) : activeTab === 'metrics' ? (
              <MetricsPanel gameState={gameState as any} />
            ) : (
              <div className="flex-1 flex overflow-hidden">
                <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar transition-all duration-300 ${showRightPanel ? 'mr-0' : ''}`}>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="bg-white dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${metric.borderColor === 'blue' ? 'bg-blue-500' : metric.borderColor === 'red' ? 'bg-red-500' : metric.borderColor === 'primary' ? 'bg-primary-500' : 'bg-green-500'}`} />
                          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">{metric.label}</div>
                        </div>
                        <div className="text-2xl font-bold mb-1 dark:text-white">{metric.value}</div>
                        {metric.trend && (
                          <div className={`text-xs flex items-center gap-1 ${metric.trend.color === 'green' ? 'text-emerald-400' : metric.trend.color === 'red' ? 'text-red-400' : 'text-primary-400'}`}>
                            {metric.trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {metric.trend.value}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      {gameState.week === 1 && (
                        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Week 1: Project Kickoff</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your simulation has begun! As the PM, you'll need to make strategic decisions each week. Start by reviewing your available actions and setting the project direction.</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Target className="w-3 h-3" />Goal: Deliver MVP by Week 8</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />12 weeks total</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            Signals & Events
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{signals.length} latest</span>
                        </div>
                        <div className="p-4">
                          {signals.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">No new signals yet</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {signals.map((signal) => (
                                <div key={signal.id} className="bg-gray-50 dark:bg-gray-800/80 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500/30 transition shadow-sm">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-full ${signal.avatarColor} flex items-center justify-center text-[10px] font-bold`}>{signal.team}</div>
                                      <span className="text-sm font-medium dark:text-gray-200">{signal.from}</span>
                                    </div>
                                    {signal.priority === 'critical' && <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">Critical</span>}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{signal.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800/50 rounded-xl border-2 border-blue-500/20 shadow-xl overflow-hidden">
                        <div className="bg-blue-500 px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-white" />
                            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Strategic Actions</h3>
                          </div>
                          {!hasMadeDecisionThisWeek && availableActions.length > 0 && (
                            <span className="text-[10px] bg-white text-blue-600 px-2 py-1 rounded-full font-bold animate-pulse">ACTION REQUIRED</span>
                          )}
                        </div>

                        <div className="p-6">
                          {availableActions.length === 0 ? (
                            <div className="text-center py-6">
                              <CheckCircle className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">All tasks completed for Week {gameState.week}. Advance to continue.</p>
                              <button onClick={handleNextWeek} className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all">Advance Time</button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {availableActions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() => handleActionSelect(action)}
                                  className="w-full group text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-300"
                                >
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    {action.name}
                                    <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{action.description}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stakeholders Content */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Key Stakeholders</h3>
                        </div>
                        <div className="p-4 space-y-4">
                          {(gameState.stakeholders || []).map((person) => (
                            <div key={person.id} className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-500">{person.name.charAt(0)}</div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${person.satisfaction > 70 ? 'bg-emerald-500' : person.satisfaction > 40 ? 'bg-primary' : 'bg-red-500'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-semibold truncate dark:text-gray-200">{person.name}</span>
                                  <span className="text-[10px] text-gray-400 font-medium">{person.role}</span>
                                </div>
                                <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all duration-500 ${person.satisfaction > 70 ? 'bg-emerald-500' : person.satisfaction > 40 ? 'bg-primary' : 'bg-red-500'}`} style={{ width: `${person.satisfaction}%` }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {projectBriefing && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-64">
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5" />
                              Project Reference
                            </h3>
                          </div>
                          <div className="overflow-y-auto flex-1">
                            <ProjectReferencePanel briefing={projectBriefing} currentWeek={gameState?.week || briefingWeek} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showArtifactModal && currentArtifact && (
        <ArtifactSubmissionModal
          isOpen={showArtifactModal}
          onClose={() => {
            setShowArtifactModal(false);
            setCurrentArtifact(null);
          }}
          artifact={currentArtifact}
          phase={gameState?.week || 1}
          onSubmit={handleArtifactSubmit}
        />
      )}

      {showChallengeModal && (
        <StakeholderChallengeModal
          isOpen={showChallengeModal}
          onClose={() => setShowChallengeModal(false)}
          challenges={pendingChallenges}
          onRespond={handleChallengeResponse}
        />
      )}

      {showDecisionModal && selectedActionData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 max-w-lg w-full p-8 shadow-2xl scale-in-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedActionData.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{selectedActionData.description}</p>
            <div className="space-y-4 mb-8">
              {selectedActionData.choices.map((choice) => (
                <button key={choice.id} onClick={() => handleDecision(choice)} className="w-full text-left p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{choice.label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">{choice.description}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowDecisionModal(false)} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel Decision</button>
          </div>
        </div>
      )}

      {isCompleted && score && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Simulation Complete!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">You have reached the end of the project timeline.</p>
            <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-800">
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">{score.overall}%</div>
              <div className="text-sm font-bold text-emerald-500 uppercase tracking-widest">{score.grade} GRADE</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={restartSimulation} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all">Try Again</button>
              <button onClick={() => navigate('/simulations')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 rounded-xl transition-all">Exit</button>
            </div>
          </div>
        </div>
      )}

      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};

export default SimulationPage;
