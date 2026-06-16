export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ActionCategory = 'resource' | 'communication' | 'technical' | 'process';
export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type EventType = 'crisis' | 'opportunity' | 'milestone' | 'stakeholder_change';
export type CommunicationStyle = 'formal' | 'casual' | 'direct' | 'diplomatic' | 'analytical';
export type RelationshipType = 'ally' | 'neutral' | 'adversary';
export type GameSpeed = 1 | 2 | 5;

export interface Condition {
  metric?: { id: string; operator: 'gt' | 'lt' | 'eq'; value: number };
  phase?: string;
  decisionMade?: string;
  weekReached?: number;
  minWeek?: number;
  maxWeek?: number;
  minProgress?: number;
}

export interface StateEffects {
  budget?: number;
  teamMorale?: number;
  riskLevel?: number;
  stakeholderTrust?: number;
  progress?: number;
  stakeholderSatisfaction?: Record<string, number>;
  customMetrics?: Record<string, number | string | boolean>;
  // Brand simulation specific metrics
  metaCampaignActive?: boolean;
  roas?: number;
}

export interface ActionChoice {
  id: string;
  label: string;
  description: string;
  effects: StateEffects;
  feedback: string;
  risk: number;
  timeCost: number;
}

export interface ScenarioAction {
  id: string;
  name: string;
  description: string;
  category: ActionCategory;
  urgency: Urgency;
  choices: ActionChoice[];
  unlockCondition?: Condition;
  submitWork?: boolean;
  showInCorner?: boolean;
  showStats?: boolean;
  [key: string]: unknown;
}

export interface Phase {
  id: string;
  name: string;
  description?: string;
  duration: number;
  objectives: string[];
  availableActions: string[];
  requiredDecisions?: string[];
  successCriteria: {
    minProgress?: number;
    maxRisk?: number;
    minTrust?: number;
  };
}

export interface StakeholderConfig {
  id: string;
  name: string;
  role: string;
  department: string;
  influence: number;
  initialSatisfaction: number;
  communicationStyle: CommunicationStyle;
  concerns: string[];
  priorities: string[];
  relationships: { stakeholderId: string; type: RelationshipType }[];
}

export interface TimelineEvent {
  week: number;
  type: EventType;
  title: string;
  description: string;
  impact: StateEffects;
  choices?: ActionChoice[];
  triggered?: boolean;
}

export interface Scenario {
  id: string;
  key?: string;
  name: string;
  description: string;
  industry: string;
  difficulty: Difficulty;
  durationWeeks: number;
  teamSize: number;
  budget: number;
  learningObjectives?: string[];
  skillsAssessed?: string[];
  caseStudyUrl?: string;
  initialState: GameState;
  phases: Phase[];
  actions: Record<string, ScenarioAction>;
  timelineEvents: TimelineEvent[];
  stakeholders: StakeholderConfig[];
}

export interface Metric {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  historicalData: number[];
}

export interface Signal {
  id: string;
  source: 'data' | 'support' | 'leadership' | 'sales';
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  influence: number;
  satisfaction: number;
  communicationStyle: CommunicationStyle;
  concerns: string[];
  priorities: string[];
}

export interface Decision {
  id: string;
  phaseId: string;
  actionId: string;
  choiceId: string;
  description: string;
  impact: {
    metrics: Record<string, number>;
    stakeholderSatisfaction: Record<string, number>;
    tradeoffs: string[];
  };
  timestamp: Date;
  week: number;
  feedback?: string;
}

export interface GameState {
  week: number;
  totalWeeks: number;
  currentPhaseId: string;
  phaseProgress: number;

  budget: number;
  initialBudget: number;
  teamMorale: number;
  riskLevel: number;
  stakeholderTrust: number;
  progress: number;

  company: {
    name: string;
    mission: string;
  };

  metrics: Record<string, number>;

  stakeholders: Stakeholder[];
  signals: Signal[];
  decisionsMade: Decision[];

  timeline: Date;
  startedAt: Date;
  timeLeft: number; // Seconds remaining for the total project
  simulationInstanceId: string;
  triggeredEventIds: string[];
}

export interface ScoreResult {
  execution: number;
  riskManagement: number;
  stakeholderManagement: number;
  budgetManagement: number;
  teamLeadership: number;
  overall: number;
  grade: string;
}

export interface ActionResult {
  success: boolean;
  newState: GameState;
  feedback: string;
  effects: StateEffects;
  phaseChanged: boolean;
  newPhase?: Phase;
  eventTriggered?: TimelineEvent;
}

export interface ConditionResult {
  satisfied: boolean;
  actualValue?: number;
  expectedValue?: number;
}

const DEFAULT_STAKEHOLDERS: StakeholderConfig[] = [
  {
    id: 'cto',
    name: 'Sarah Chen',
    role: 'CTO',
    department: 'Executive',
    influence: 10,
    initialSatisfaction: 75,
    communicationStyle: 'direct',
    concerns: ['System reliability', 'Time to market', 'Technical debt'],
    priorities: ['Ship on time', 'Quality code', 'Innovation'],
    relationships: []
  },
  {
    id: 'product',
    name: 'Marcus Johnson',
    role: 'VP Product',
    department: 'Product',
    influence: 8,
    initialSatisfaction: 70,
    communicationStyle: 'formal',
    concerns: ['Feature scope', 'User feedback', 'Competition'],
    priorities: ['User satisfaction', 'Feature completeness', 'Market timing'],
    relationships: []
  },
  {
    id: 'cfo',
    name: 'Emily Rodriguez',
    role: 'CFO',
    department: 'Finance',
    influence: 9,
    initialSatisfaction: 65,
    communicationStyle: 'diplomatic',
    concerns: ['Budget adherence', 'ROI', 'Resource allocation'],
    priorities: ['Cost efficiency', 'Predictable spending', 'Financial returns'],
    relationships: []
  }
];

const DEFAULT_SCENARIO: Scenario = {
  id: 'default',
  name: 'Default Simulation',
  description: 'A basic project management simulation',
  industry: 'Technology',
  difficulty: 'intermediate',
  durationWeeks: 12,
  teamSize: 4,
  budget: 150,
  initialState: createDefaultGameState('TechCorp', 12, 150),
  phases: [
    {
      id: 'phase-1',
      name: 'Planning',
      description: 'Initial planning and scoping',
      duration: 4,
      objectives: ['Define project scope', 'Assemble team', 'Create timeline'],
      availableActions: ['team_hiring', 'scope_definition', 'timeline_planning'],
      successCriteria: { minProgress: 25, maxRisk: 0.5 }
    },
    {
      id: 'phase-2',
      name: 'Execution',
      description: 'Main implementation phase',
      duration: 6,
      objectives: ['Deliver features', 'Manage stakeholders', 'Track progress'],
      availableActions: ['sprint_planning', 'stakeholder_update', 'risk_mitigation'],
      successCriteria: { minProgress: 70, maxRisk: 0.4 }
    },
    {
      id: 'phase-3',
      name: 'Completion',
      description: 'Final delivery and handoff',
      duration: 2,
      objectives: ['Launch product', 'Document lessons', 'Handoff to operations'],
      availableActions: ['launch_preparation', 'documentation', 'team_retrospective'],
      successCriteria: { minProgress: 95, maxRisk: 0.3 }
    }
  ],
  actions: {
    team_hiring: {
      id: 'team_hiring',
      name: 'Hire Team Members',
      description: 'Recruit additional team members for the project',
      category: 'resource',
      urgency: 'high',
      choices: [
        {
          id: 'senior_hire',
          label: 'Hire Senior Engineer',
          description: 'Invest in experienced talent',
          effects: { budget: -30, teamMorale: 10, riskLevel: -0.1 },
          feedback: 'Excellent hire! The senior engineer will help mentor the team and reduce technical risk.',
          risk: 0.2,
          timeCost: 1
        },
        {
          id: 'junior_hire',
          label: 'Hire Junior Engineers',
          description: 'Grow the team with junior talent',
          effects: { budget: -15, teamMorale: 5, riskLevel: 0.1 },
          feedback: 'Good capacity boost. Expect a learning curve but budget remains healthy.',
          risk: 0.5,
          timeCost: 1
        },
        {
          id: 'contractor',
          label: 'Use Contractors',
          description: 'Bring in external help temporarily',
          effects: { budget: -25, teamMorale: -5, riskLevel: 0.05 },
          feedback: 'Quick capacity gained. Watch for knowledge transfer and team cohesion issues.',
          risk: 0.4,
          timeCost: 0
        }
      ]
    },
    scope_definition: {
      id: 'scope_definition',
      name: 'Define Project Scope',
      description: 'Clarify what will and won\'t be delivered',
      category: 'process',
      urgency: 'high',
      choices: [
        {
          id: 'ambitious',
          label: 'Ambitious Scope',
          description: 'Maximize features and value delivered',
          effects: { progress: 15, riskLevel: 0.2, stakeholderTrust: 5 },
          feedback: 'Stakeholders are excited but you\'ve taken on significant scope risk.',
          risk: 0.7,
          timeCost: 2
        },
        {
          id: 'realistic',
          label: 'Realistic Scope',
          description: 'Focus on achievable, high-value deliverables',
          effects: { progress: 10, riskLevel: -0.1, stakeholderTrust: 10 },
          feedback: 'Balanced approach. Good chance of success with solid stakeholder alignment.',
          risk: 0.3,
          timeCost: 1
        },
        {
          id: 'conservative',
          label: 'Conservative Scope',
          description: 'Minimize risk with limited initial scope',
          effects: { progress: 5, riskLevel: -0.2, stakeholderTrust: 0 },
          feedback: 'Safe choice but stakeholders may want more. Consider planning for Phase 2.',
          risk: 0.2,
          timeCost: 1
        }
      ]
    },
    timeline_planning: {
      id: 'timeline_planning',
      name: 'Plan Timeline',
      description: 'Create project schedule and milestones',
      category: 'process',
      urgency: 'medium',
      choices: [
        {
          id: 'aggressive',
          label: 'Aggressive Timeline',
          description: 'Push for fastest possible delivery',
          effects: { progress: 10, riskLevel: 0.25, teamMorale: -10 },
          feedback: 'Team is stressed but making good progress. Watch for burnout.',
          risk: 0.7,
          timeCost: 0
        },
        {
          id: 'balanced',
          label: 'Balanced Timeline',
          description: 'Realistic schedule with buffer',
          effects: { progress: 8, riskLevel: -0.05, teamMorale: 5 },
          feedback: 'Good pace. Team has energy while making steady progress.',
          risk: 0.3,
          timeCost: 0
        },
        {
          id: 'relaxed',
          label: 'Relaxed Timeline',
          description: 'Plenty of buffer for unforeseen issues',
          effects: { progress: 5, riskLevel: -0.15, teamMorale: 10 },
          feedback: 'Team is comfortable but you\'re leaving value on the table.',
          risk: 0.15,
          timeCost: 0
        }
      ]
    },
    sprint_planning: {
      id: 'sprint_planning',
      name: 'Sprint Planning',
      description: 'Plan the upcoming sprint work',
      category: 'process',
      urgency: 'medium',
      choices: [
        {
          id: 'feature_focus',
          label: 'Feature Focus',
          description: 'Prioritize feature delivery',
          effects: { progress: 12, riskLevel: 0.1, stakeholderTrust: 5 },
          feedback: 'Good feature progress. Remember to address technical debt.',
          risk: 0.4,
          timeCost: 1
        },
        {
          id: 'quality_focus',
          label: 'Quality Focus',
          description: 'Prioritize code quality and testing',
          effects: { progress: 8, riskLevel: -0.15, stakeholderTrust: 0 },
          feedback: 'Tech debt reduced. Slightly slower progress but more stable.',
          risk: 0.25,
          timeCost: 1
        }
      ]
    },
    stakeholder_update: {
      id: 'stakeholder_update',
      name: 'Stakeholder Update',
      description: 'Communicate with stakeholders',
      category: 'communication',
      urgency: 'medium',
      choices: [
        {
          id: 'detailed',
          label: 'Detailed Update',
          description: 'Comprehensive status report',
          effects: { stakeholderTrust: 15, progress: -2, riskLevel: -0.1 },
          feedback: 'Stakeholders appreciate the transparency. Great relationship building.',
          risk: 0.1,
          timeCost: 2
        },
        {
          id: 'brief',
          label: 'Brief Update',
          description: 'Quick check-in',
          effects: { stakeholderTrust: 5, progress: 0, riskLevel: 0 },
          feedback: 'Kept them informed. Consider more detail next time.',
          risk: 0.2,
          timeCost: 0
        },
        {
          id: 'skip',
          label: 'Skip Update',
          description: 'Focus on delivery instead',
          effects: { stakeholderTrust: -10, progress: 5, riskLevel: 0.1 },
          feedback: 'Progress made but stakeholders are wondering what\'s happening.',
          risk: 0.5,
          timeCost: 0
        }
      ]
    },
    risk_mitigation: {
      id: 'risk_mitigation',
      name: 'Risk Mitigation',
      description: 'Address identified project risks',
      category: 'process',
      urgency: 'high',
      choices: [
        {
          id: 'proactive',
          label: 'Proactive Mitigation',
          description: 'Address risks before they materialize',
          effects: { riskLevel: -0.2, budget: -15, stakeholderTrust: 10 },
          feedback: 'Excellent risk management. Prevention paid off!',
          risk: 0.2,
          timeCost: 2
        },
        {
          id: 'reactive',
          label: 'Reactive Response',
          description: 'Deal with risks as they occur',
          effects: { riskLevel: -0.1, budget: -5, stakeholderTrust: 0 },
          feedback: 'Managed ok but some damage done. Proactive is better.',
          risk: 0.5,
          timeCost: 1
        }
      ]
    }
  },
  timelineEvents: [
    {
      week: 3,
      type: 'crisis',
      title: 'Key Team Member Leaves',
      description: 'A senior engineer has resigned unexpectedly',
      impact: { teamMorale: -15, riskLevel: 0.15, progress: -5 }
    },
    {
      week: 6,
      type: 'opportunity',
      title: 'Budget Increase',
      description: 'Executive leadership approved additional funding',
      impact: { budget: 25, stakeholderTrust: 10 }
    },
    {
      week: 9,
      type: 'milestone',
      title: 'Beta Release',
      description: 'Beta version ready for user testing',
      impact: { progress: 10, stakeholderTrust: 5 }
    }
  ],
  stakeholders: DEFAULT_STAKEHOLDERS,
};

function createDefaultGameState(companyName: string, weeks: number, budget: number): GameState {
  const now = new Date();
  return {
    week: 1,
    totalWeeks: weeks,
    currentPhaseId: 'phase-1',
    phaseProgress: 0,
    budget: budget,
    initialBudget: budget,
    teamMorale: 75,
    riskLevel: 0.3,
    stakeholderTrust: 70,
    progress: 0,
    company: {
      name: companyName,
      mission: 'Deliver exceptional value to customers'
    },
    metrics: {
      velocity: 35,
      quality: 85,
      engagement: 80
    },
    stakeholders: DEFAULT_STAKEHOLDERS.map(s => ({
      id: s.id,
      name: s.name,
      role: s.role,
      department: s.department,
      influence: s.influence,
      satisfaction: s.initialSatisfaction,
      communicationStyle: s.communicationStyle,
      concerns: s.concerns,
      priorities: s.priorities
    })),
    signals: [],
    decisionsMade: [],
    timeline: now,
    startedAt: now,
    timeLeft: 90 * 60,
    simulationInstanceId: 'default-instance',
    triggeredEventIds: []
  };
}

export class SimulationEngine {
  private gameState: GameState;
  private scenario: Scenario;
  private running: boolean;
  private paused: boolean;
  private speed: GameSpeed;
  private tickInterval: ReturnType<typeof setInterval> | null;
  private onStateChange: ((state: GameState) => void) | null;
  private onPhaseChange: ((phase: Phase) => void) | null;
  private onEvent: ((event: TimelineEvent) => void) | null;
  private onScoreUpdate: ((score: ScoreResult) => void) | null;

  constructor(scenario?: Scenario) {
    this.scenario = scenario || DEFAULT_SCENARIO;
    this.gameState = this.initializeGame(this.scenario);
    this.running = false;
    this.paused = false;
    this.speed = 1;
    this.tickInterval = null;
    this.onStateChange = null;
    this.onPhaseChange = null;
    this.onEvent = null;
    this.onScoreUpdate = null;
  }

  private initializeGame(scenario: Scenario): GameState {
    const initialState = scenario.initialState;
    const now = new Date();

    return {
      ...initialState,
      week: 1,
      currentPhaseId: scenario.phases[0]?.id || 'phase-1',
      phaseProgress: 0,
      budget: scenario.budget,
      initialBudget: scenario.budget,
      teamMorale: 75,
      riskLevel: 0.3,
      stakeholderTrust: 70,
      progress: 0,
      signals: [],
      decisionsMade: [],
      timeline: now,
      startedAt: now,
      timeLeft: 90 * 60, // 1hr 30mins
      simulationInstanceId: `sim-${now.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
      triggeredEventIds: []
    };
  }

  loadScenario(scenario: Scenario): void {
    this.scenario = scenario;
    this.gameState = this.initializeGame(scenario);
    this.notifyStateChange();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.paused = false;

    // Trigger immediate check for Week 1 events/signals on start
    this.checkTimelineEvents();
    this.generateInitialSignals();

    const tickRate = 1000;
    this.tickInterval = setInterval(() => {
      if (!this.paused && this.running) {
        this.tick();
      }
    }, tickRate);

    this.notifyStateChange();
  }

  private generateInitialSignals(): void {
    const signalExists = this.gameState.signals.some(s => s.id.startsWith('signal-kickoff'));
    if (signalExists) return;

    const initialSignals: Signal[] = [
      {
        id: 'signal-kickoff-1',
        source: 'leadership',
        message: `Welcome to the ${this.scenario.name}! We're at a critical junction and rely on your leadership. Your immediate priorities are: 1. Assess current bottlenecks, 2. Align with key stakeholders, and 3. Set the roadmap for the next 4 weeks.`,
        priority: 'high',
        timestamp: new Date()
      }
    ];
    this.gameState.signals.push(...initialSignals);
  }

  stop(): void {
    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  setSpeed(speed: GameSpeed): void {
    this.speed = speed;
    if (this.running) {
      this.stop();
      this.start();
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  isPaused(): boolean {
    return this.paused;
  }

  getSpeed(): GameSpeed {
    return this.speed;
  }

  setOnStateChange(callback: (state: GameState) => void): void {
    this.onStateChange = callback;
  }

  setOnPhaseChange(callback: (phase: Phase) => void): void {
    this.onPhaseChange = callback;
  }

  setOnEvent(callback: (event: TimelineEvent) => void): void {
    this.onEvent = callback;
  }

  setOnScoreUpdate(callback: (score: ScoreResult) => void): void {
    this.onScoreUpdate = callback;
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.gameState);
    }
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.calculateScore());
    }
  }

  private notifyPhaseChange(phase: Phase): void {
    if (this.onPhaseChange) {
      this.onPhaseChange(phase);
    }
  }

  private notifyEvent(event: TimelineEvent): void {
    if (this.onEvent) {
      this.onEvent(event);
    }
  }

  tick(): void {
    if (this.gameState.timeLeft <= 0) {
      this.stop();
      return;
    }

    // Decrease time left every tick (1 second)
    this.gameState.timeLeft -= 1;

    // Check if we should generate a signal every minute (approx)
    if (this.gameState.timeLeft % 60 === 0) {
      this.generateSignal();
    }

    this.checkTimelineEvents();
    this.notifyStateChange();
  }

  private advanceTime(): void {
    const phase = this.getCurrentPhase();
    if (!phase) return;

    this.gameState.week += 1;
    this.gameState.timeline = new Date();

    const weekInPhase = this.gameState.week;
    const phaseDuration = phase.duration;
    this.gameState.phaseProgress = Math.min(100, (weekInPhase / phaseDuration) * 100);

    this.gameState.progress = Math.min(100, (this.gameState.week / this.gameState.totalWeeks) * 100);

    if (this.gameState.riskLevel > 0) {
      this.gameState.riskLevel = Math.min(1, this.gameState.riskLevel + 0.02);
    }

    if (this.gameState.teamMorale > 0) {
      this.gameState.teamMorale = Math.max(0, this.gameState.teamMorale - 0.5);
    }

    this.checkPhaseTransition();
  }

  private checkPhaseTransition(): void {
    const currentPhase = this.getCurrentPhase();
    if (!currentPhase) return;

    const weekInPhase = this.gameState.week;
    if (weekInPhase >= currentPhase.duration) {
      const currentPhaseIndex = this.scenario.phases.findIndex(p => p.id === currentPhase.id);
      const nextPhase = this.scenario.phases[currentPhaseIndex + 1];

      if (nextPhase) {
        this.gameState.currentPhaseId = nextPhase.id;
        this.gameState.phaseProgress = 0;
        this.notifyPhaseChange(nextPhase);
      }
    }
  }

  private checkTimelineEvents(): void {
    const events = this.scenario.timelineEvents.filter(
      e => e.week === this.gameState.week
    );

    events.forEach(event => {
      const eventId = `event-${event.week}-${event.title}`;
      if (!this.gameState.triggeredEventIds.includes(eventId)) {
        this.gameState.triggeredEventIds.push(eventId);
        this.applyStateEffects(event.impact);
        this.notifyEvent(event);
      }
    });
  }

  getCurrentPhase(): Phase | undefined {
    return this.scenario.phases.find(p => p.id === this.gameState.currentPhaseId);
  }

  getAvailableActions(): ScenarioAction[] {
    const phase = this.getCurrentPhase();
    if (!phase) return [];

    return phase.availableActions
      .map(actionId => this.scenario.actions[actionId])
      .filter(action => action && this.checkUnlockCondition(action.unlockCondition));
  }

  private checkUnlockCondition(condition?: Condition): boolean {
    if (!condition) return true;

    if (condition.phase && condition.phase !== this.gameState.currentPhaseId) {
      return false;
    }

    if (condition.weekReached && this.gameState.week < condition.weekReached) {
      return false;
    }

    if (condition.minWeek && this.gameState.week < condition.minWeek) {
      return false;
    }

    if (condition.maxWeek && this.gameState.week > condition.maxWeek) {
      return false;
    }

    if (condition.minProgress && this.gameState.progress < condition.minProgress) {
      return false;
    }

    if (condition.metric) {
      const metricValue = this.gameState.metrics[condition.metric.id] || 0;
      switch (condition.metric.operator) {
        case 'gt': return metricValue > condition.metric.value;
        case 'lt': return metricValue < condition.metric.value;
        case 'eq': return metricValue === condition.metric.value;
        default: return false;
      }
    }

    if (condition.decisionMade) {
      const decisionExists = this.gameState.decisionsMade.some(
        d => d.actionId === condition.decisionMade
      );
      if (!decisionExists) return false;
    }

    return true;
  }

  processAction(actionId: string, choiceId: string): ActionResult {
    const action = this.scenario.actions[actionId];
    if (!action) {
      return {
        success: false,
        newState: this.gameState,
        feedback: 'Invalid action',
        effects: {},
        phaseChanged: false
      };
    }

    const choice = action.choices.find(c => c.id === choiceId);
    if (!choice) {
      return {
        success: false,
        newState: this.gameState,
        feedback: 'Invalid choice',
        effects: {},
        phaseChanged: false
      };
    }

    const effects = choice.effects;
    this.applyStateEffects(effects);

    const previousPhaseId = this.gameState.currentPhaseId;
    this.checkPhaseTransition();
    const phaseChanged = this.gameState.currentPhaseId !== previousPhaseId;

    const decision: Decision = {
      id: `decision-${Date.now()}`,
      phaseId: this.gameState.currentPhaseId,
      actionId,
      choiceId,
      description: `${action.name}: ${choice.label}`,
      impact: {
        metrics: (effects.customMetrics || {}) as Record<string, number>,
        stakeholderSatisfaction: effects.stakeholderSatisfaction || {},
        tradeoffs: []
      },
      timestamp: new Date(),
      week: this.gameState.week,
      feedback: choice.feedback
    };

    this.gameState.decisionsMade.push(decision);

    const newPhase = phaseChanged ? this.getCurrentPhase() : undefined;
    let eventTriggered: TimelineEvent | undefined;

    const events = this.scenario.timelineEvents.filter(
      e => e.week === this.gameState.week
    );
    if (events.length > 0) {
      events.forEach(e => {
        const eventId = `event-${e.week}-${e.title}`;
        if (!this.gameState.triggeredEventIds.includes(eventId)) {
          this.gameState.triggeredEventIds.push(eventId);
          this.applyStateEffects(e.impact);
        }
      });
      eventTriggered = events[0];
    }

    this.notifyStateChange();

    return {
      success: true,
      newState: this.gameState,
      feedback: choice.feedback,
      effects,
      phaseChanged,
      newPhase,
      eventTriggered
    };
  }

  private applyStateEffects(effects: StateEffects): void {
    if (effects.budget !== undefined) {
      this.gameState.budget = Math.max(0, this.gameState.budget + effects.budget);
    }
    if (effects.teamMorale !== undefined) {
      this.gameState.teamMorale = Math.min(100, Math.max(0, this.gameState.teamMorale + effects.teamMorale));
    }
    if (effects.riskLevel !== undefined) {
      this.gameState.riskLevel = Math.min(1, Math.max(0, this.gameState.riskLevel + effects.riskLevel));
    }
    if (effects.stakeholderTrust !== undefined) {
      this.gameState.stakeholderTrust = Math.min(100, Math.max(0, this.gameState.stakeholderTrust + effects.stakeholderTrust));
    }
    if (effects.progress !== undefined) {
      this.gameState.progress = Math.min(100, Math.max(0, this.gameState.progress + effects.progress));
    }
    if (effects.customMetrics) {
      Object.entries(effects.customMetrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          this.gameState.metrics[key] = (this.gameState.metrics[key] || 0) + value;
        } else if (typeof value === 'string') {
          // Store string metrics as their length for numerical tracking
          this.gameState.metrics[key] = value.length;
        } else {
          // Convert boolean to 0 or 1
          this.gameState.metrics[key] = value ? 1 : 0;
        }
      });
    }
    if (effects.stakeholderSatisfaction) {
      Object.entries(effects.stakeholderSatisfaction).forEach(([stakeholderId, change]) => {
        const stakeholder = this.gameState.stakeholders.find(s => s.id === stakeholderId);
        if (stakeholder) {
          stakeholder.satisfaction = Math.min(100, Math.max(0, stakeholder.satisfaction + change));
        }
      });
    }
  }

  calculateScore(): ScoreResult {
    const state = this.gameState;

    const expectedProgress = (state.week / state.totalWeeks) * 100;
    const progressDiff = state.progress - expectedProgress;
    const execution = progressDiff >= 0
      ? Math.min(100, 70 + progressDiff * 2)
      : Math.max(30, 70 + progressDiff * 3);

    const riskManagement = Math.max(0, (1 - state.riskLevel) * 100);

    const avgStakeholderSatisfaction = state.stakeholders.length > 0
      ? state.stakeholders.reduce((sum, s) => sum + s.satisfaction, 0) / state.stakeholders.length
      : 50;
    const stakeholderManagement = avgStakeholderSatisfaction;

    const spent = state.initialBudget - state.budget;
    const spentPercentage = state.initialBudget > 0 ? (spent / state.initialBudget) * 100 : 0;
    const expectedSpent = (state.week / state.totalWeeks) * 100;
    const budgetDiff = spentPercentage - expectedSpent;
    let budgetManagement: number;
    if (Math.abs(budgetDiff) <= 10) {
      budgetManagement = 90;
    } else if (budgetDiff > 10) {
      budgetManagement = Math.max(40, 90 - (budgetDiff - 10) * 2);
    } else {
      budgetManagement = Math.max(60, 90 + budgetDiff);
    }

    const teamLeadership = Math.min(100, Math.max(20, state.teamMorale + 20));

    const overall = (
      execution * 0.25 +
      riskManagement * 0.20 +
      stakeholderManagement * 0.20 +
      budgetManagement * 0.20 +
      teamLeadership * 0.15
    );

    let grade: string;
    if (overall >= 90) grade = 'A';
    else if (overall >= 80) grade = 'B';
    else if (overall >= 70) grade = 'C';
    else if (overall >= 60) grade = 'D';
    else grade = 'F';

    return {
      execution: Math.round(execution * 10) / 10,
      riskManagement: Math.round(riskManagement * 10) / 10,
      stakeholderManagement: Math.round(stakeholderManagement * 10) / 10,
      budgetManagement: Math.round(budgetManagement * 10) / 10,
      teamLeadership: Math.round(teamLeadership * 10) / 10,
      overall: Math.round(overall * 10) / 10,
      grade
    };
  }

  getState(): GameState {
    return this.gameState;
  }

  getScenario(): Scenario {
    return this.scenario;
  }

  getUpcomingEvents(): TimelineEvent[] {
    return this.scenario.timelineEvents.filter(
      e => e.week > this.gameState.week && !e.triggered
    );
  }

  restart(): void {
    this.stop();
    this.gameState = this.initializeGame(this.scenario);
    this.notifyStateChange();
  }

  destroy(): void {
    this.stop();
    this.onStateChange = null;
    this.onPhaseChange = null;
    this.onEvent = null;
    this.onScoreUpdate = null;
  }

  private generateSignal(): void {
    if (Math.random() > 0.7) return;

    const signalTypes = [
      { source: 'data' as const, message: 'Metrics show a concerning trend', priority: 'high' as const },
      { source: 'support' as const, message: 'Multiple customer complaints received', priority: 'medium' as const },
      { source: 'leadership' as const, message: 'Strategic direction change requested', priority: 'high' as const },
      { source: 'sales' as const, message: 'Feature request from key customer', priority: 'medium' as const }
    ];

    const newSignal: Signal = {
      id: `signal-${Date.now()}`,
      ...signalTypes[Math.floor(Math.random() * signalTypes.length)],
      timestamp: new Date()
    };

    this.gameState.signals.push(newSignal);
    if (this.gameState.signals.length > 50) {
      this.gameState.signals = this.gameState.signals.slice(-50);
    }
  }
}

export function createDefaultScenario(): Scenario {
  return { ...DEFAULT_SCENARIO };
}

// Simulation-specific events
function getSimulationEvents(simulationId: string, totalWeeks: number): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  if (simulationId === 'sim-pm-001' || simulationId === 'pm-01') {
    // PayLink - 72-Hour Crisis (3 weeks = 72 hours)
    events.push(
      { week: 1, type: 'crisis', title: 'Compliance Alert', description: 'Critical compliance issues discovered in payment flow. Security audit flagged 3 major vulnerabilities.', impact: { riskLevel: 0.25, stakeholderTrust: -15 } },
      { week: 1, type: 'crisis', title: 'CEO Pressure', description: 'CEO Marcus Johnson demands immediate launch: "We cannot miss this window. Figure it out."', impact: { teamMorale: -10, riskLevel: 0.1 } },
      { week: 2, type: 'crisis', title: 'Technical Debt Explosion', description: 'Legacy auth system collapsing. CTO Sarah Chen warns: "This will take 2 weeks to fix properly."', impact: { progress: -10, budget: -20 } },
      { week: 2, type: 'opportunity', title: 'Quick Fix Option', description: 'Engineering proposes a 48-hour patch. Not perfect, but could work.', impact: { riskLevel: -0.1, progress: 5 } },
      { week: 3, type: 'milestone', title: 'Final Decision Point', description: 'All stakeholders assembled. Launch window in 24 hours. Go/No-Go required.', impact: { stakeholderTrust: 10 } }
    );
  } else if (simulationId === 'sim-pm-002') {
    // ShopEase - BNPL Growth Bet
    events.push(
      { week: 1, type: 'opportunity', title: 'Board Pressure', description: 'Board demands +40% growth. "BNPL could be our answer," says CEO.', impact: { stakeholderTrust: 5 } },
      { week: 2, type: 'crisis', title: 'Competitor Launch', description: 'Affirm just launched BNPL for your core market. First-mover advantage slipping.', impact: { riskLevel: 0.2, stakeholderTrust: -10 } },
      { week: 3, type: 'crisis', title: 'Risk Analysis', description: 'Default rates in BNPL average 5-8%. With your user base, that\'s $2M+ annual risk.', impact: { riskLevel: 0.15, budget: -30 } },
      { week: 4, type: 'opportunity', title: 'Partnership Offer', description: 'Klarna offers white-label partnership. Faster to market, but 30% revenue share.', impact: { progress: 10, riskLevel: -0.1 } },
      { week: 6, type: 'milestone', title: 'Financial Model Review', description: 'Unit economics presentation to CFO. Need clear path to profitability.', impact: { stakeholderTrust: 10 } },
      { week: 8, type: 'milestone', title: 'Final Recommendation', description: 'Board meeting. Present your BNPL strategy: build, partner, or pass?', impact: { progress: 20 } }
    );
  } else if (simulationId === 'sim-pm-003') {
    // TechCore - Platform Rebuild
    events.push(
      { week: 2, type: 'crisis', title: 'Legacy System Failure', description: 'Main monolith crashed at 3AM. 4-hour downtime. Customers furious.', impact: { teamMorale: -15, stakeholderTrust: -20 } },
      { week: 4, type: 'crisis', title: 'Migration Risk', description: 'Data migration complexity 3x higher than estimated. Need 6 more weeks minimum.', impact: { riskLevel: 0.2, progress: -10 } },
      { week: 6, type: 'opportunity', title: 'Cloud Credits', description: 'AWS offered $200K in credits if we commit to 3-year contract.', impact: { budget: 200, riskLevel: -0.05 } },
      { week: 8, type: 'milestone', title: 'Phase 1 Complete', description: 'Authentication microservice live. First 10K users migrated successfully.', impact: { progress: 15, teamMorale: 10 } },
      { week: 10, type: 'crisis', title: 'Performance Regression', description: 'New system 40% slower than legacy. Customers complaining.', impact: { riskLevel: 0.25, stakeholderTrust: -15 } },
      { week: 12, type: 'milestone', title: 'Platform Launch', description: 'Full migration complete. 100% traffic on new platform.', impact: { progress: 30, stakeholderTrust: 20 } }
    );
  } else if (simulationId === 'sim-pm-004') {
    // NewWave - Zero-to-One
    events.push(
      { week: 1, type: 'opportunity', title: 'Customer Discovery', description: 'Interviewed 20 potential users. Strong pain point identified!', impact: { progress: 10, stakeholderTrust: 5 } },
      { week: 2, type: 'crisis', title: 'Pivot Signal', description: '3 enterprise customers willing to pay 10x for a different feature. Pivot opportunity?', impact: { riskLevel: 0.15 } },
      { week: 3, type: 'crisis', title: 'Technical Feasibility', description: 'Lead engineer: "This requires ML we don\'t have expertise for." Need to hire or simplify.', impact: { riskLevel: 0.2, budget: -25 } },
      { week: 4, type: 'opportunity', title: 'Design Breakthrough', description: 'Designer prototyped a simpler solution that solves 80% of the problem. 2 weeks to build.', impact: { progress: 15, riskLevel: -0.1 } },
      { week: 5, type: 'milestone', title: 'MVP Ready', description: 'Prototype validated with 5 beta users. 4 said they\'d pay.', impact: { progress: 20, stakeholderTrust: 15 } },
      { week: 6, type: 'milestone', title: 'Investor Demo', description: 'Demo day with 3 potential investors. Strong interest from one.', impact: { progress: 10 } }
    );
  } else {
    // Default events
    events.push(
      { week: Math.ceil(totalWeeks * 0.25), type: 'crisis', title: 'Key Team Member Leaves', description: 'A senior engineer has resigned unexpectedly', impact: { teamMorale: -15, riskLevel: 0.15, progress: -5 } },
      { week: Math.ceil(totalWeeks * 0.5), type: 'opportunity', title: 'Budget Increase', description: 'Executive leadership approved additional funding', impact: { budget: 25, stakeholderTrust: 10 } },
      { week: Math.ceil(totalWeeks * 0.75), type: 'milestone', title: 'Beta Release', description: 'Beta version ready for user testing', impact: { progress: 10, stakeholderTrust: 5 } }
    );
  }

  return events;
}

export function createScenarioFromTemplate(template: {
  id: string;
  companyName: string;
  industry: string;
  difficulty: 'intro' | 'intermediate' | 'advanced';
  budget: number;
  briefing: {
    totalWeeks: number;
    teamSize?: number;
    stakeholders?: Array<{
      id: string;
      name: string;
      role: string;
      department: string;
      influence: number;
      satisfaction: number;
      communicationStyle: string;
      concerns: string[];
      priorities: string[];
    }>;
    timelinePhases?: Array<{ id: string; name: string; status: string; description: string }>;
    currentRisks?: Array<{ id: string; title: string; severity: string; likelihood: string }>;
  };
  tasks: Array<{ id: string; type: string; title: string; description: string; requirements: string[] }>;
}): Scenario {
  const stakeholders: StakeholderConfig[] = (template.briefing.stakeholders || (DEFAULT_STAKEHOLDERS as any)).map((s: any) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    department: s.department,
    influence: s.influence,
    initialSatisfaction: s.satisfaction !== undefined ? s.satisfaction : s.initialSatisfaction,
    communicationStyle: s.communicationStyle as CommunicationStyle,
    concerns: s.concerns,
    priorities: s.priorities,
    relationships: []
  }));

  const phases: Phase[] = (template.briefing.timelinePhases || DEFAULT_SCENARIO.phases).map((phase, idx, arr) => {
    // Distribute template tasks across phases
    const tasksPerPhase = Math.ceil(template.tasks.length / arr.length);
    const phaseTaskIds = template.tasks
      .slice(idx * tasksPerPhase, (idx + 1) * tasksPerPhase)
      .map(t => t.id);

    return {
      id: phase.id,
      name: phase.name,
      description: phase.description,
      duration: Math.ceil(template.briefing.totalWeeks / arr.length),
      objectives: [],
      availableActions: ['sprint_planning', 'stakeholder_update', 'risk_mitigation', ...phaseTaskIds],
      successCriteria: { minProgress: (idx + 1) * 20, maxRisk: 0.5 }
    };
  });

  const actions: Record<string, ScenarioAction> = {};
  template.tasks.forEach(task => {
    actions[task.id] = {
      id: task.id,
      name: task.title,
      description: task.description,
      category: 'process',
      urgency: task.type.includes('crisis') ? 'high' : 'medium',
      choices: [
        {
          id: `${task.id}-quality`,
          label: 'Comprehensive Quality Approach',
          description: `Deep dive into ${task.title.toLowerCase()} with focus on long-term stability.`,
          effects: { progress: 3, riskLevel: -0.1, stakeholderTrust: 8, budget: -15, teamMorale: 5 },
          feedback: `Expertly handled. The team appreciated the thoroughness, though it was resource-intensive.`,
          risk: 0.1,
          timeCost: 2
        },
        {
          id: `${task.id}-speed`,
          label: 'Rapid Execution Strategy',
          description: `Quickly address ${task.title.toLowerCase()} to maintain momentum.`,
          effects: { progress: 12, riskLevel: 0.05, stakeholderTrust: -5, budget: -5, teamMorale: -2 },
          feedback: `Momentum sustained, but some corners were cut. Key stakeholders expressed minor concerns about depth.`,
          risk: 0.4,
          timeCost: 1
        },
        {
          id: `${task.id}-delegation`,
          label: 'Strategic Delegation',
          description: `Assign senior leads to own ${task.title.toLowerCase()} while you oversee alignment.`,
          effects: { progress: 7, riskLevel: 0, stakeholderTrust: 3, teamMorale: 10 },
          feedback: `Empowering the team worked well! Morale is up, and work is progressing at a steady pace.`,
          risk: 0.2,
          timeCost: 0
        }
      ]
    };
  });

  // Use simulation-specific events based on template ID
  const timelineEvents: TimelineEvent[] = getSimulationEvents(template.id, template.briefing.totalWeeks);

  return {
    id: template.id,
    name: `${template.companyName} Simulation`,
    description: `PM simulation for ${template.companyName}`,
    industry: template.industry,
    difficulty: template.difficulty as Difficulty,
    durationWeeks: template.briefing.totalWeeks,
    teamSize: template.briefing.teamSize || 8,
    budget: Math.round(template.budget / 1000),
    initialState: createDefaultGameState(template.companyName, template.briefing.totalWeeks, Math.round(template.budget / 1000)),
    phases,
    actions: { ...DEFAULT_SCENARIO.actions, ...actions },
    timelineEvents,
    stakeholders
  };
}