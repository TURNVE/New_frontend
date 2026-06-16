import { useCallback, useEffect, useState, useRef } from 'react';
import { useSimulation, UseSimulationReturn } from '@/hooks/useSimulation';
import { pm01Scenario, pm01PhaseStructure, pm01ArtifactSystem } from '@/simulation/content/pm-01';
import type { ArtifactType } from '@/simulation/content/pm-01';
import type { Scenario, GameState, ScoreResult, ActionResult, Phase, TimelineEvent, ScenarioAction, GameSpeed } from '@/simulation/core/SimulationEngine';

export interface ThinkingMetrics {
  coherenceScore: number;
  calibrationScore: number;
  contradictionCount: number;
  reasoningDepthScore: number;
}

export interface ArtifactSubmission {
  id: string;
  type: string;
  content: Record<string, string>;
  qualityScore: number;
  submittedAt: Date;
}

export interface PM01State {
  currentPhaseNumber: number;
  week: number;
  progress: number;
  budget: number;
  teamMorale: number;
  riskLevel: number;
  thinkingMetrics: ThinkingMetrics;
  artifacts: ArtifactSubmission[];
  decisionLog: Array<{
    phase: number;
    actionId: string;
    choiceId: string;
    timestamp: Date;
  }>;
  stakeholderTrust: Record<string, number>;
  metrics: Record<string, number>;
  currentEvent: TimelineEvent | null;
  isCompleted: boolean;
  isFired: boolean;
  timeRemaining: number; // in seconds
  endingState: 'successful_turnaround' | 'partial_recovery' | 'failure_collapse' | null;
}

export interface UsePM01EngineReturn {
  pm01State: PM01State;
  currentPhaseDetail: { phaseNumber: number; name: string; objective: string; embeddedTension: string; availableActions: string[]; requiredArtifacts: string[]; qualityThresholds: { minProgress: number; maxRisk: number; minTrust: number; artifactQuality: number } } | null;
  availableArtifacts: string[];
  pendingArtifacts: string[];
  nextPhaseUnlock: string | null;
  
  // Event & Notification System
  activeEvent: SimulationEvent | null;
  notifications: NotificationItem[];
  tasks: TaskItem[];
  upcomingEvents: SimulationEvent[];
  isFired: boolean;
  timeRemaining: number;
  
  // PM-01 specific actions
  makeDecision: (actionId: string, choiceId: string) => Promise<ActionResult>;
  submitArtifact: (artifactId: string, content: Record<string, string>) => Promise<{ qualityScore: number; feedback: string }>;
  advancePhase: () => Promise<{ success: boolean; message: string }>;
  resolveEvent: (eventId: string) => void;
  dismissNotification: (id: string) => void;
  completeTask: (taskId: string) => void;
  
  // AI Feedback
  generateExecutiveFeedback: (stakeholderId: string) => Promise<string>;
  generateCoachingInsight: () => Promise<string>;
  
  // Utility
  getPhaseProgress: () => number;
  getQualityThresholds: () => { minProgress: number; maxRisk: number; minTrust: number; artifactQuality: number } | null;
  calculateFinalScore: () => number;
  getEndingState: () => 'successful_turnaround' | 'partial_recovery' | 'failure_collapse' | null;
  
  // Re-exported from useSimulation
  gameState: GameState | null;
  scenario: Scenario | null;
  currentPhase: Phase | null;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  score: ScoreResult | null;
  availableActions: ScenarioAction[];
  lastActionResult: ActionResult | null;
  isCompleted: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  setSpeed: (speed: GameSpeed) => void;
  restartSimulation: () => void;
  loadScenario: (scenario: Scenario) => void;
  saveState: (reason?: string) => Promise<void>;
  loadState: (sessionId: string) => Promise<boolean>;
  isDirty: boolean;
}

export interface SimulationEvent {
  id: string;
  name: string;
  type: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  impact: Record<string, number>;
  notificationStyle: 'immediate' | 'delayed' | 'ambiguous';
  resolved: boolean;
  triggeredAt: number;
  requiresAction?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'email' | 'slack' | 'alert' | 'deadline' | 'stakeholder';
  title: string;
  message: string;
  from?: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: number;
  dependencies: string[];
  phase: number;
}

const INITIAL_PM01_STATE: PM01State = {
  currentPhaseNumber: 1,
  week: 1,
  progress: 0,
  budget: 150000,
  teamMorale: 65,
  riskLevel: 25,
  thinkingMetrics: {
    coherenceScore: 0.5,
    calibrationScore: 0.5,
    contradictionCount: 0,
    reasoningDepthScore: 0.5,
  },
  artifacts: [],
  decisionLog: [],
  stakeholderTrust: {
    ceo: 40,
    cfo: 50,
    vp_sales: 35,
    vp_cs: 45,
    cto: 55,
  },
  metrics: {
    arr: 8.2,
    monthlyChurn: 5.2,
    nrr: 105,
    nps: 42,
    timeToValue: 45,
    winRate: 28,
  },
  currentEvent: null,
  isCompleted: false,
  isFired: false,
  timeRemaining: 15 * 60, // 15 minutes in seconds for demo
  endingState: null,
};

export function usePM01Engine(): UsePM01EngineReturn {
  const sim = useSimulation(pm01Scenario);
  const [pm01State, setPm01State] = useState<PM01State>(INITIAL_PM01_STATE);
  
  const completedRef = useRef(pm01State.isCompleted);
  const firedRef = useRef(pm01State.isFired);
  
  useEffect(() => { completedRef.current = pm01State.isCompleted; }, [pm01State.isCompleted]);
  useEffect(() => { firedRef.current = pm01State.isFired; }, [pm01State.isFired]);

  // Derive pm01State values from sim.gameState to avoid duplicate state tracking
  useEffect(() => {
    if (!sim.gameState) return;
    setPm01State(prev => ({
      ...prev,
      week: sim.gameState?.week ?? prev.week,
      budget: sim.gameState?.budget ?? prev.budget,
      teamMorale: sim.gameState?.teamMorale ?? prev.teamMorale,
      riskLevel: sim.gameState?.riskLevel ?? prev.riskLevel,
      progress: sim.gameState?.progress ?? prev.progress,
    }));
  }, [sim.gameState?.week, sim.gameState?.budget, sim.gameState?.teamMorale, sim.gameState?.riskLevel, sim.gameState?.progress]);
  
  // Event system state
  const [activeEvent, setActiveEvent] = useState<SimulationEvent | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'task-1', title: 'Review initial metrics', description: 'Analyze ARR, churn, NPS data', status: 'pending', priority: 'high', phase: 1, dependencies: [] },
    { id: 'task-2', title: 'Interview stakeholders', description: 'Meet with CEO, CFO, VP Sales, VP CS, CTO', status: 'pending', priority: 'high', phase: 1, dependencies: ['task-1'] },
    { id: 'task-3', title: 'Identify root causes', description: 'Form hypotheses about growth stall', status: 'pending', priority: 'critical', phase: 1, dependencies: ['task-2'] },
    { id: 'task-4', title: 'Create metrics dashboard', description: 'Build initial metrics summary artifact', status: 'pending', priority: 'medium', phase: 1, dependencies: ['task-1'] },
    { id: 'task-5', title: 'Document stakeholder concerns', description: 'List concerns from each stakeholder', status: 'pending', priority: 'medium', phase: 1, dependencies: ['task-2'] },
  ]);
  
  // Initialize with notification
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications([
        {
          id: 'notif-1',
          type: 'email',
          title: 'CEO Request',
          message: 'Marcus wants an update on your diagnosis by end of week. The board is getting anxious.',
          from: 'Marcus Johnson (CEO)',
          urgency: 'high',
          timestamp: new Date(),
          read: false,
        },
        {
          id: 'notif-2',
          type: 'deadline',
          title: 'Phase 1 Deadline',
          message: 'You have 1 week remaining in Situation Assessment phase.',
          urgency: 'medium',
          timestamp: new Date(),
          read: false,
        },
      ]);
    }
  }, []);
  
  // Countdown timer - fires user when time runs out
  useEffect(() => {
    if (completedRef.current || firedRef.current) return;
    
    const timer = setInterval(() => {
      setPm01State(prev => {
        if (prev.timeRemaining <= 1) {
          return { ...prev, isFired: true, isCompleted: true, endingState: 'failure_collapse' };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Event trigger logic based on phase
  useEffect(() => {
    const phaseEvents: Record<number, SimulationEvent> = {
      2: {
        id: 'evt-1',
        name: 'Board Member Queries Growth',
        type: 'stakeholder_conflict',
        severity: 'minor',
        description: 'A board member emails CEO questioning growth metrics. CEO is now pressureing you for answers.',
        impact: { trust_ceo: -5 },
        notificationStyle: 'immediate',
        resolved: false,
        triggeredAt: 2,
        requiresAction: true,
      },
      4: {
        id: 'evt-2',
        name: 'Competitor Launches Feature',
        type: 'competitor_move',
        severity: 'moderate',
        description: 'Competitor B launches mid-market feature at 50% of our price. VP Sales is worried.',
        impact: { winRate: -10, trust_vp_sales: -5 },
        notificationStyle: 'immediate',
        resolved: false,
        triggeredAt: 4,
        requiresAction: true,
      },
      6: {
        id: 'evt-3',
        name: 'Quarterly Review Deadline',
        type: 'stakeholder_conflict',
        severity: 'moderate',
        description: 'CFO requests detailed budget review. She is skeptical of your spending so far.',
        impact: { trust_cfo: -5 },
        notificationStyle: 'delayed',
        resolved: false,
        triggeredAt: 6,
        requiresAction: false,
      },
      7: {
        id: 'evt-4',
        name: 'Technical Debt Crisis',
        type: 'technical_outage',
        severity: 'major',
        description: 'Platform experiences 2-hour outage during peak usage. NPS dropped significantly.',
        impact: { nps: -15, trust_cto: -10, budget: -25000 },
        notificationStyle: 'immediate',
        resolved: false,
        triggeredAt: 7,
        requiresAction: true,
      },
    };
    
    const event = phaseEvents[pm01State.currentPhaseNumber];
    if (event && !activeEvent) {
      setActiveEvent(event);
      setNotifications(prev => [{
        id: `evt-notif-${event.id}`,
        type: 'alert',
        title: event.name,
        message: event.description,
        urgency: event.severity === 'critical' || event.severity === 'major' ? 'high' : 'medium',
        timestamp: new Date(),
        read: false,
      }, ...prev]);
    }
  }, [pm01State.currentPhaseNumber, activeEvent]);
  
  const currentPhaseDetail = pm01Scenario.phases[pm01State.currentPhaseNumber - 1] 
    ? getPhaseStructure(pm01State.currentPhaseNumber)
    : null;
  
  function getPhaseStructure(phaseNum: number) {
    return pm01PhaseStructure.find((p) => p.phaseNumber === phaseNum) || null;
  }
  
  const availableArtifacts = currentPhaseDetail?.requiredArtifacts || [];
  const pendingArtifacts = availableArtifacts.filter(
    (artifact: string) => !pm01State.artifacts.some(a => a.type === artifact)
  );
  
  const nextPhaseUnlock = pm01State.currentPhaseNumber < 8 
    ? `Complete Phase ${pm01State.currentPhaseNumber} requirements` 
    : null;

  const makeDecision = useCallback(async (actionId: string, choiceId: string): Promise<ActionResult> => {
    const result = await sim.makeDecision(actionId, choiceId);
    
    setPm01State(prev => {
      const choice = sim.availableActions.find(a => a.id === actionId)?.choices.find(c => c.id === choiceId);
      
      return {
        ...prev,
        decisionLog: [...prev.decisionLog, {
          phase: prev.currentPhaseNumber,
          actionId,
          choiceId,
          timestamp: new Date(),
        }],
        budget: prev.budget - (choice?.effects?.budget || 0),
        progress: prev.progress + (choice?.effects?.progress || 0),
        teamMorale: Math.max(0, Math.min(100, prev.teamMorale + (choice?.effects?.teamMorale || 0))),
        riskLevel: Math.max(0, Math.min(100, prev.riskLevel + (choice?.effects?.riskLevel || 0))),
      };
    });
    
    return result;
  }, [sim]);

  const submitArtifact = useCallback(async (
    artifactId: string,
    content: Record<string, string>
  ): Promise<{ qualityScore: number; feedback: string }> => {
    const artifactType = pm01ArtifactSystem.find((a: ArtifactType) => a.id === artifactId);
    
    if (!artifactType) {
      return { qualityScore: 0, feedback: 'Unknown artifact type' };
    }
    
    let qualityScore = 50;
    
    if (content.requiredSections && artifactType.requiredSections) {
      const hasAllSections = artifactType.requiredSections.every(
        (section: string) => content[section.toLowerCase().replace(/\s/g, '')]
      );
      if (hasAllSections) qualityScore += 20;
    }
    
    if (content.evidence && content.evidence.length > 50) {
      qualityScore += 15;
    }
    
    if (content.claims && content.claims.length > 2) {
      qualityScore += 15;
    }
    
    qualityScore = Math.min(100, qualityScore);
    
    const feedback = qualityScore >= 75 
      ? 'Strong work. This artifact meets quality standards.' 
      : qualityScore >= 50 
        ? 'Acceptable but could be deeper. Consider adding more evidence.'
        : 'Needs significant improvement. Missing key elements.';
    
    setPm01State(prev => ({
      ...prev,
      artifacts: [...prev.artifacts, {
        id: `${artifactId}-${Date.now()}`,
        type: artifactId,
        content,
        qualityScore,
        submittedAt: new Date(),
      }],
    }));
    
    return { qualityScore, feedback };
  }, []);

  const advancePhase = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    const thresholds = getQualityThresholds();
    
    if (!thresholds) {
      return { success: false, message: 'Simulation not in valid phase' };
    }
    
    const currentArtifacts = pm01State.artifacts.filter(
      a => availableArtifacts.some(ta => a.type === ta)
    );
    const avgQuality = currentArtifacts.length > 0
      ? currentArtifacts.reduce((sum, a) => sum + a.qualityScore, 0) / currentArtifacts.length
      : 0;
    
    if (pm01State.progress < thresholds.minProgress) {
      return { success: false, message: `Progress too low. Required: ${thresholds.minProgress}%` };
    }
    
    if (pm01State.riskLevel > thresholds.maxRisk) {
      return { success: false, message: `Risk too high. Maximum: ${thresholds.maxRisk}%` };
    }
    
    if (avgQuality < thresholds.artifactQuality && currentArtifacts.length > 0) {
      return { success: false, message: `Artifact quality too low. Required: ${thresholds.artifactQuality}%` };
    }
    
    if (pm01State.currentPhaseNumber >= 8) {
      const finalScore = calculateFinalScore();
      let endingState: PM01State['endingState'];
      
      if (finalScore >= 75 && Object.values(pm01State.stakeholderTrust).every(t => t >= 70)) {
        endingState = 'successful_turnaround';
      } else if (finalScore >= 50 && Object.values(pm01State.stakeholderTrust).every(t => t >= 50)) {
        endingState = 'partial_recovery';
      } else {
        endingState = 'failure_collapse';
      }
      
      setPm01State(prev => ({ ...prev, isCompleted: true, endingState }));
      return { success: true, message: 'Simulation completed!' };
    }
    
    setPm01State(prev => ({
      ...prev,
      currentPhaseNumber: prev.currentPhaseNumber + 1,
      week: prev.currentPhaseNumber + 1,
    }));
    
    return { success: true, message: `Advanced to Phase ${pm01State.currentPhaseNumber + 1}` };
  }, [pm01State, availableArtifacts, getQualityThresholds, calculateFinalScore]);

  function calculateFinalScore(): number {
    const metricsScore = (pm01State.metrics.arr / 9.8) * 25 +
      ((5.2 - pm01State.metrics.monthlyChurn) / 2.2) * 20 +
      (pm01State.metrics.nrr / 120) * 15 +
      (pm01State.metrics.nps / 50) * 10 +
      ((45 - pm01State.metrics.timeToValue) / 20) * 15 +
      (pm01State.metrics.winRate / 40) * 10 +
      (pm01State.teamMorale / 75) * 5;
    
    const trustScore = Object.values(pm01State.stakeholderTrust).reduce((a, b) => a + b, 0) / 5;
    
    const artifactScore = pm01State.artifacts.length > 0
      ? pm01State.artifacts.reduce((sum, a) => sum + a.qualityScore, 0) / pm01State.artifacts.length
      : 50;
    
    return Math.min(100, (metricsScore * 0.4) + (trustScore * 0.3) + (artifactScore * 0.3));
  }

  function getQualityThresholds() {
    return currentPhaseDetail?.qualityThresholds || null;
  }

  function getPhaseProgress() {
    return pm01State.progress;
  }

  const generateExecutiveFeedback = useCallback(async (stakeholderId: string): Promise<string> => {
    const stakeholderTrust = pm01State.stakeholderTrust[stakeholderId] || 50;
    const recentDecisions = pm01State.decisionLog.slice(-3);
    
    const templates: Record<string, string[]> = {
      positive: [
        'Your analysis is compelling. The board will appreciate this depth.',
        'Strong work. Your recommendations align well with our goals.',
        'Excellent progress. Keep this momentum going.',
      ],
      neutral: [
        'I need more confidence in your recommendation.',
        'The data is interesting but incomplete. Elaborate more.',
        'This is a start but needs stronger justification.',
      ],
      urgent: [
        "We're running out of time. What exactly is the plan?",
        "I can't support this without more evidence.",
        "The board is losing patience. Step up your game.",
      ],
    };
    
    let category: 'positive' | 'neutral' | 'urgent';
    if (stakeholderTrust >= 70) category = 'positive';
    else if (stakeholderTrust >= 40) category = 'neutral';
    else category = 'urgent';
    
    const messages = templates[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [pm01State]);

  const generateCoachingInsight = useCallback(async (): Promise<string> => {
    const { thinkingMetrics } = pm01State;
    
    if (thinkingMetrics.coherenceScore < 0.4) {
      return 'Your reasoning across phases lacks consistency. Ensure your hypothesis in Phase 2 connects to your strategy in Phase 5.';
    }
    
    if (thinkingMetrics.calibrationScore < 0.4) {
      return 'Your confidence seems misaligned with evidence. Consider acknowledging uncertainties more explicitly.';
    }
    
    if (thinkingMetrics.contradictionCount > 2) {
      return 'You have made contradictory claims across phases. Review your earlier decisions and clarify your position.';
    }
    
    if (pm01State.progress < 30 && pm01State.week > 3) {
      return 'You are falling behind schedule. Focus on completing core requirements before exploring additional angles.';
    }
    
    return 'Good progress. Maintain focus on stakeholder alignment while advancing through the phases.';
  }, [pm01State]);

  const resolveEvent = useCallback((eventId: string) => {
    setActiveEvent(prev => {
      if (prev?.id === eventId) {
        setNotifications(n => n.map(notif => 
          notif.id.includes(eventId) ? { ...notif, read: true } : notif
        ));
        return null;
      }
      return prev;
    });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'completed' as const } : t
    ));
  }, []);

  function getEndingState(): 'successful_turnaround' | 'partial_recovery' | 'failure_collapse' | null {
    if (!pm01State.isCompleted) return null;
    return pm01State.endingState;
  }

  const upcomingEvents: SimulationEvent[] = [
    { id: 'evt-2', name: 'Competitor Launches Feature', type: 'competitor_move', severity: 'moderate', description: 'Competitor launches feature', impact: {}, notificationStyle: 'immediate', resolved: false, triggeredAt: 4 },
    { id: 'evt-3', name: 'Quarterly Review', type: 'stakeholder_conflict', severity: 'moderate', description: 'CFO review', impact: {}, notificationStyle: 'delayed', resolved: false, triggeredAt: 6 },
    { id: 'evt-4', name: 'Technical Debt Crisis', type: 'technical_outage', severity: 'major', description: 'Platform outage', impact: {}, notificationStyle: 'immediate', resolved: false, triggeredAt: 7 },
  ];

  return {
    pm01State,
    currentPhaseDetail,
    availableArtifacts,
    pendingArtifacts,
    nextPhaseUnlock,
    activeEvent,
    notifications,
    tasks,
    upcomingEvents,
    isFired: pm01State.isFired,
    timeRemaining: pm01State.timeRemaining,
    makeDecision,
    submitArtifact,
    advancePhase,
    resolveEvent,
    dismissNotification,
    completeTask,
    generateExecutiveFeedback,
    generateCoachingInsight,
    getPhaseProgress,
    getQualityThresholds,
    calculateFinalScore,
    getEndingState,
    gameState: sim.gameState,
    scenario: sim.scenario,
    currentPhase: sim.currentPhase,
    isRunning: sim.isRunning,
    isPaused: sim.isPaused,
    speed: sim.speed,
    score: sim.score,
    availableActions: sim.availableActions,
    lastActionResult: sim.lastActionResult,
    isCompleted: pm01State.isCompleted,
    startSimulation: sim.startSimulation,
    pauseSimulation: sim.pauseSimulation,
    resumeSimulation: sim.resumeSimulation,
    setSpeed: sim.setSpeed,
    restartSimulation: sim.restartSimulation,
    loadScenario: sim.loadScenario,
    saveState: sim.saveState,
    loadState: sim.loadState,
    isDirty: sim.isDirty,
  };
}

export default usePM01Engine;