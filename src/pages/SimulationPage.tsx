import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ChevronRight, TrendingUp, TrendingDown,
  Home, FileText, BarChart3, LineChart, ArrowRight,
  Pause, Play, RotateCcw, Trophy, FolderOpen, FolderHeart,
  Building2, Bell, Mail, MessageSquare, LayoutList, Map, Gauge,
  PanelRight, PanelRightClose, AlertCircle, Zap, Target,
  Clock, CheckCircle, X, ChevronUp, ChevronDown
} from 'lucide-react';
import useSimulation from '../../../src/hooks/useSimulation';
import { createDefaultScenario, createScenarioFromTemplate, type ScenarioAction, type ActionChoice } from '../../../src/simulation/core/SimulationEngine';
import { getSimulationByRoute } from '../config/simulationTemplates';
import { DocumentsPanel } from '../components/simulation/DocumentsPanel';
import { PortfolioBuilder } from '../components/simulation/PortfolioBuilder';
import { CompanyPanel } from '../components/company/CompanyPanel';
import { BacklogPanel } from '../components/pmtools/BacklogPanel';
import { RoadmapPanel } from '../components/pmtools/RoadmapPanel';
import { MetricsPanel } from '../components/pmtools/MetricsPanel';
import { NotificationProvider, NotificationCenter, useNotifications } from '../components/communications/NotificationCenter';
import { ToastContainer } from '../components/communications/ToastContainer';
import { WelcomeHint } from '../components/overlay/WelcomeHint';
import { enableSounds } from '../utils/sounds';
import { ProjectReferencePanel } from '../components/simulation/ProjectReferencePanel';
import { useBriefing } from '../hooks/useBriefing';
import { useSimulationNotifications } from '../hooks/useSimulationNotifications';
import type { ArtifactType, Artifact } from '../../../src/artifacts/types';
import { ArtifactGenerator } from '../../../src/artifacts/ArtifactGenerator';

interface SimulationMetric {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    color: 'green' | 'red' | 'yellow';
  };
  goal?: string;
  progress?: number;
  borderColor: 'blue' | 'red' | 'yellow' | 'green';
}

const SimulationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams<{ id: string }>();
  
  // Extract simulation ID from either params or pathname
  const simulationId = useMemo(() => {
    if (paramId) return paramId;
    // Extract from pathname like /simulation/sim-pm-001
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.startsWith('sim-')) return lastPart;
    return null;
  }, [paramId, location.pathname]);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'backlog' | 'roadmap' | 'metrics' | 'documents' | 'portfolio' | 'company'>('dashboard');
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [showWelcomeHint, setShowWelcomeHint] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedActionData, setSelectedActionData] = useState<ScenarioAction | null>(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);

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
    currentPhase,
    isRunning,
    isPaused,
    score,
    availableActions,
    upcomingEvents,
    lastEvent,
    isCompleted,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    makeDecision,
    advanceTime,
    restartSimulation,
  } = useSimulation(simulationScenario);
  
  // Project Reference Panel data - use route ID if available
  const { briefing: projectBriefing, currentWeek: briefingWeek } = useBriefing({
    scenarioId: simulationId || undefined,
    initialWeek: gameState?.week || 1,
  });

  // Convert gameState to metrics display format
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
          value: `${budgetPercent}% of initial`, 
          direction: budgetPercent > 50 ? 'up' : 'down', 
          color: budgetPercent > 30 ? 'green' : budgetPercent > 15 ? 'yellow' : 'red'
        },
        goal: `Initial: $${gameState.initialBudget}K`,
        progress: budgetPercent,
        borderColor: budgetPercent > 30 ? 'blue' : budgetPercent > 15 ? 'yellow' : 'red',
      },
      {
        label: 'Project Progress',
        value: `${progressPercent}%`,
        trend: { 
          value: `Week ${gameState.week}/${gameState.totalWeeks}`, 
          direction: 'up', 
          color: 'green' 
        },
        goal: `Target: 100%`,
        progress: progressPercent,
        borderColor: progressPercent > 70 ? 'green' : progressPercent > 40 ? 'blue' : 'yellow',
      },
      {
        label: 'Risk Level',
        value: `${riskPercent}%`,
        trend: { 
          value: gameState.riskLevel > 0.6 ? 'Critical' : gameState.riskLevel > 0.4 ? 'Elevated' : 'Managed', 
          direction: gameState.riskLevel > 0.5 ? 'up' : 'down', 
          color: gameState.riskLevel > 0.6 ? 'red' : gameState.riskLevel > 0.4 ? 'yellow' : 'green'
        },
        borderColor: gameState.riskLevel > 0.6 ? 'red' : gameState.riskLevel > 0.4 ? 'yellow' : 'green',
      },
      {
        label: 'Team Morale',
        value: `${Math.round(gameState.teamMorale)}%`,
        trend: { 
          value: gameState.teamMorale > 75 ? 'High' : gameState.teamMorale > 50 ? 'Moderate' : 'Low', 
          direction: gameState.teamMorale > 60 ? 'up' : 'down', 
          color: gameState.teamMorale > 75 ? 'green' : gameState.teamMorale > 50 ? 'yellow' : 'red'
        },
        borderColor: gameState.teamMorale > 75 ? 'green' : gameState.teamMorale > 50 ? 'blue' : 'yellow',
      },
    ];
  };

  // Convert signals from gameState
  const getSignals = () => {
    if (!gameState?.signals) return [];
    
    return gameState.signals.slice(-3).map((signal, index) => ({
      id: signal.id || `signal-${index}`,
      from: signal.source === 'data' ? 'Data Science Team' : 
            signal.source === 'support' ? 'Customer Support' : 
            signal.source === 'leadership' ? 'Leadership' : 'Sales Team',
      team: signal.source?.substring(0, 2).toUpperCase() || 'DT',
      time: 'Just now',
      message: signal.message,
      priority: signal.priority === 'high' ? 'critical' : 'normal',
      avatarColor: signal.source === 'data' ? 'bg-purple-500/20 text-purple-400' :
                   signal.source === 'support' ? 'bg-emerald-500/20 text-emerald-400' :
                   signal.source === 'leadership' ? 'bg-amber-500/20 text-amber-400' :
                   'bg-blue-500/20 text-blue-400',
    }));
  };

  const handleActionSelect = (action: ScenarioAction) => {
    setSelectedActionData(action);
    setShowDecisionModal(true);
  };

  const handleDecision = (choice: ActionChoice) => {
    if (!selectedActionData) return;
    
    const result = makeDecision(selectedActionData.id, choice.id);
    setFeedback(result.feedback);
    setShowDecisionModal(false);
    setSelectedActionData(null);
    
    // Clear feedback after 5 seconds
    setTimeout(() => setFeedback(''), 5000);
  };

  const handleNextWeek = () => {
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

  const handleGenerateArtifact = (type: ArtifactType) => {
    if (!gameState || !scenario) return;
    
    const generator = new ArtifactGenerator(gameState, scenario);
    const artifact = generator.generateArtifact(type);
    
    const newArtifact: Artifact = {
      id: `artifact-${Date.now()}`,
      sessionId: (gameState as { id?: string }).id || 'default-session',
      type,
      title: artifact.title || 'Untitled Document',
      description: artifact.description,
      content: artifact.content || { sections: [] },
      metadata: {
        author: 'System',
        version: 1,
        tags: [],
      },
      status: 'generated',
      createdAt: new Date(),
      updatedAt: new Date(),
      week: gameState.week,
      phaseId: (gameState as { currentPhaseId?: string }).currentPhaseId || '',
    };
    
    setArtifacts(prev => [...prev, newArtifact]);
  };

  const handleViewArtifact = (artifact: Artifact) => {
    console.log('View artifact:', artifact);
  };

  const handleExportArtifact = (artifact: Artifact, format: 'pdf' | 'docx') => {
    const content = generateExportContent(artifact);
    downloadFile(content, artifact.title, format);
  };

  const generateExportContent = (artifact: Artifact): string => {
    if (!gameState || !scenario) return '';
    
    const generator = new ArtifactGenerator(gameState, scenario);
    const result = generator.generateArtifact(artifact.type);
    
    return formatAsText(result);
  };

  const formatAsText = (result: Partial<Artifact>): string => {
    const content = result.content;
    if (!content?.sections) return '';
    
    return content.sections
      .sort((a, b) => a.order - b.order)
      .map(section => `${section.title}\n${'='.repeat(section.title.length)}\n\n${section.content}\n`)
      .join('\n');
  };

  const downloadFile = (content: string, filename: string, format: 'pdf' | 'docx') => {
    const blob = new Blob([content], { type: format === 'pdf' ? 'text/plain' : 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format === 'pdf' ? 'txt' : 'doc'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteArtifact = (artifact: Artifact) => {
    setArtifacts(prev => prev.filter(a => a.id !== artifact.id));
  };

  const metrics = getMetrics();
  const signals = getSignals();

  if (!gameState) {
    return (
      <div className="flex h-screen w-full bg-[#0a0a0a] text-[#ededed] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[#a1a1aa]">Loading simulation...</p>
        </div>
      </div>
    );
  }

  // Inner component that has access to NotificationProvider context
  const SimulationContent = () => {
    const { notifications, markNotificationRead } = useNotifications();
    const { processTimelineEvent } = useSimulationNotifications(gameState, isRunning);
    
    // Enable sounds on first render
    useEffect(() => {
      enableSounds();
    }, []);
    
    // Process timeline events when they occur
    useEffect(() => {
      if (lastEvent && gameState?.stakeholders) {
        processTimelineEvent(lastEvent, gameState.stakeholders);
      }
    }, [lastEvent, gameState?.stakeholders, processTimelineEvent]);
    
    return (
      <>
        <ToastContainer 
          notifications={notifications} 
          onDismiss={markNotificationRead}
          onNotificationClick={() => setShowNotifications(true)}
          hidden={showNotifications}
        />
        <WelcomeHint isOpen={showWelcomeHint} onClose={() => setShowWelcomeHint(false)} />
      
      <div className="flex h-screen w-full bg-[#0a0a0a] text-[#ededed] overflow-hidden">
        <aside className="w-64 border-r border-white/5 bg-[#141414] flex flex-col shrink-0">
          <div className="p-6 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <span className="font-bold text-lg tracking-tight">{gameState?.company?.name || 'FlowDesk'}</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id ? 'bg-white/5 text-white' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="p-4 mx-4 mb-4 border-t border-white/5">
            <div className="text-xs text-[#a1a1aa] mb-2">Current Phase</div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${gameState.phaseProgress}%` }} />
            </div>
            <p className="text-xs text-[#a1a1aa] mt-1">{Math.round(gameState.phaseProgress)}% complete</p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg transition">
                <ChevronRight className="h-5 w-5 rotate-180 text-[#a1a1aa]" />
              </button>
              <h1 className="text-lg font-semibold">PM Workspace</h1>
              <div className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded border border-blue-500/20">
                WEEK {String(gameState.week).padStart(2, '0')}
              </div>
              {isPaused && (
                <div className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                  <Pause className="w-3 h-3" />
                  PAUSED
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNotifications(true)} className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-[#a1a1aa]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              </button>
              {!isRunning ? (
                <button onClick={startSimulation} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" />Start
                </button>
              ) : isPaused ? (
                <button onClick={resumeSimulation} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" />Resume
                </button>
              ) : (
                <button onClick={pauseSimulation} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2">
                  <Pause className="w-4 h-4" />Pause
                </button>
              )}
              <button onClick={restartSimulation} className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-md text-sm font-medium transition-all">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={handleNextWeek} disabled={!isRunning || isPaused} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
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
              <BacklogPanel gameState={gameState} />
            ) : activeTab === 'roadmap' ? (
              <RoadmapPanel totalWeeks={gameState?.totalWeeks || 12} currentWeek={gameState?.week || 1} />
            ) : activeTab === 'metrics' ? (
              <MetricsPanel gameState={gameState} />
            ) : (
              <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar transition-all duration-300 ${showRightPanel ? 'mr-0' : ''}`}>
                  {/* Quick Stats Row - Compact */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${metric.borderColor === 'blue' ? 'bg-blue-500' : metric.borderColor === 'red' ? 'bg-red-500' : metric.borderColor === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          <div className="text-xs text-[#a1a1aa] uppercase font-medium">{metric.label}</div>
                        </div>
                        <div className="text-2xl font-bold mb-1">{metric.value}</div>
                        {metric.trend && (
                          <div className={`text-xs flex items-center gap-1 ${metric.trend.color === 'green' ? 'text-emerald-400' : metric.trend.color === 'red' ? 'text-red-400' : 'text-yellow-400'}`}>
                            {metric.trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {metric.trend.value}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Main Content Grid - Better Space Usage */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Left Column - Signals & Context */}
                    <div className="space-y-6">
                      {/* Welcome/Context Card for First Week */}
                      {gameState.week === 1 && signals.length === 0 && (
                        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl p-6 border border-blue-500/30">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white mb-1">Week 1: Project Kickoff</h3>
                              <p className="text-sm text-[#a1a1aa] mb-3">Your simulation has begun! As the PM, you'll need to make strategic decisions each week. Start by reviewing your available actions and setting the project direction.</p>
                              <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  Goal: Deliver MVP by Week 8
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  12 weeks total
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Signals & Events - Improved Empty State */}
                      <div className="bg-white/5 rounded-xl border border-white/5">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            Signals & Events
                          </h3>
                          <span className="text-xs text-[#a1a1aa]">{signals.length} new</span>
                        </div>
                        <div className="p-4">
                          {signals.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="w-6 h-6 text-[#a1a1aa]" />
                              </div>
                              <p className="text-[#a1a1aa] text-sm mb-2">No new signals this week</p>
                              <p className="text-xs text-[#525252]">Signals appear when teams need your input or when events occur</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {signals.slice(0, 5).map((signal) => (
                                <div key={signal.id} className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/10 transition">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-full ${signal.avatarColor} flex items-center justify-center text-[10px] font-bold`}>{signal.team}</div>
                                      <span className="text-sm font-medium">{signal.from}</span>
                                    </div>
                                    {signal.priority === 'critical' && <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs">Critical</span>}
                                  </div>
                                  <p className="text-xs text-[#a1a1aa]">{signal.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upcoming Events Preview */}
                      {upcomingEvents && upcomingEvents.length > 0 && (
                        <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#a1a1aa]" />
                            Upcoming Events
                          </h3>
                          <div className="space-y-2">
                            {upcomingEvents.slice(0, 3).map((event, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <span className="text-xs text-[#525252] w-12">Week {event.week}</span>
                                <span className="text-[#a1a1aa]">{event.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Actions & Decisions */}
                    <div className="space-y-6">
                      {/* Available Actions */}
                      <div className="bg-white/5 rounded-xl border border-white/5">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white">Actions</h3>
                          <span className="text-xs text-[#a1a1aa]">Week {gameState.week}</span>
                        </div>
                        <div className="p-4">
                          {availableActions.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                              </div>
                              <p className="text-[#a1a1aa] text-sm mb-2">All actions completed for this week</p>
                              <button 
                                onClick={handleNextWeek}
                                disabled={!isRunning || isPaused}
                                className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Advance to Week {gameState.week + 1}
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {availableActions.map((action: ScenarioAction) => (
                                <button 
                                  key={action.id} 
                                  onClick={() => handleActionSelect(action)} 
                                  disabled={!isRunning || isPaused} 
                                  className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/5 hover:border-white/20 disabled:opacity-50 group"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{action.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${action.urgency === 'high' ? 'bg-red-500/20 text-red-400' : action.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                      {action.urgency}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#a1a1aa] line-clamp-2">{action.description}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Decision Impact Preview */}
                      {selectedActionData && (
                        <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-xl p-4 border border-amber-500/30">
                          <h3 className="text-sm font-semibold text-amber-400 mb-2">Decision Preview</h3>
                          <p className="text-xs text-[#a1a1aa] mb-3">{selectedActionData.description}</p>
                          <div className="flex gap-2">
                            {selectedActionData.choices.slice(0, 2).map((choice) => (
                              <button
                                key={choice.id}
                                onClick={() => handleDecision(choice)}
                                className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white transition-colors"
                              >
                                {choice.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Briefing Panel Toggle */}
                <div className="fixed bottom-6 right-6 z-40">
                  {/* The Panel - Animated */}
                  <div 
                    className={`
                      absolute bottom-16 right-0
                      w-80 max-h-[70vh]
                      bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl
                      overflow-hidden
                      transition-all duration-500 ease-out origin-bottom-right
                      ${showRightPanel 
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
                    `}
                  >
                    {projectBriefing && (
                      <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">Project Brief</span>
                          </div>
                          <button 
                            onClick={() => setShowRightPanel(false)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-[#a1a1aa]" />
                          </button>
                        </div>
                        
                        {/* Panel Content */}
                        <div className="overflow-y-auto flex-1">
                          <ProjectReferencePanel 
                            briefing={projectBriefing} 
                            currentWeek={gameState?.week || briefingWeek} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showDecisionModal && selectedActionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-xl border border-white/10 max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-white mb-2">{selectedActionData.name}</h3>
            <p className="text-sm text-[#a1a1aa] mb-6">{selectedActionData.description}</p>
            <div className="space-y-3 mb-6">
              {selectedActionData.choices.map((choice) => (
                <button key={choice.id} onClick={() => handleDecision(choice)} className="w-full text-left p-4 rounded-lg border border-white/10 hover:bg-white/5">
                  <span className="block text-sm font-semibold text-white">{choice.label}</span>
                  <span className="block text-xs text-[#a1a1aa]">{choice.description}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowDecisionModal(false)} className="w-full py-2 text-sm text-[#a1a1aa]">Cancel</button>
          </div>
        </div>
      )}

      {isCompleted && score && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-xl border border-white/10 max-w-md w-full p-8 text-center">
            <Trophy className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Simulation Complete!</h2>
            <div className="bg-white/5 rounded-lg p-4 mb-6"><div className="text-3xl font-bold text-white">{score.overall}%</div><div className="text-sm text-emerald-400">{score.grade}</div></div>
            <div className="flex gap-3">
              <button onClick={restartSimulation} className="flex-1 bg-blue-500 py-3 rounded-lg">Try Again</button>
              <button onClick={() => navigate('/simulations')} className="flex-1 bg-white/5 py-3 rounded-lg">Back</button>
            </div>
          </div>
        </div>
      )}

      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      </>
    );
  };

  return (
    <NotificationProvider>
      <SimulationContent />
    </NotificationProvider>
  );
};

export default SimulationPage;
