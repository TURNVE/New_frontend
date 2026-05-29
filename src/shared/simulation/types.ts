/**
 * TURNVE Simulation — Canonical Type Definitions
 *
 * All types for the simulation system are defined here.
 * Import from this file only. Never duplicate these types elsewhere.
 */

// ============================================================
// KPI & Metrics
// ============================================================

export type TrendDirection = 'up' | 'down' | 'stable';
export type StatusLevel = 'good' | 'warning' | 'critical';
export type ColorToken = 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'teal';

export interface Trend {
    direction: TrendDirection;
    value: string;
    color: 'green' | 'red' | 'yellow';
}

export interface KPI {
    id: string;
    label: string;
    value: number;
    maxValue: number;
    trend?: Trend;
    status: StatusLevel;
    goal: string;
    progress: number;
}

// ============================================================
// Stakeholders
// ============================================================

export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    department: string;
    influence: number;       // 1-10
    satisfaction: number;    // 0-100
    communicationStyle: 'direct' | 'analytical' | 'formal' | 'collaborative' | 'visionary';
    concerns: string[];
    priorities: string[];
}

// ============================================================
// Risks
// ============================================================

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskLikelihood = 'low' | 'medium' | 'high' | 'certain';

export interface Risk {
    id: string;
    title: string;
    severity: RiskSeverity;
    likelihood: RiskLikelihood;
}

// ============================================================
// Success Criteria
// ============================================================

export interface SuccessCriterion {
    id: string;
    description: string;
    completed: boolean;
    weekDue?: number;
    priority: 'high' | 'medium' | 'low';
}

// ============================================================
// Timeline
// ============================================================

export type PhaseStatus = 'active' | 'pending' | 'completed';

export interface TimelinePhase {
    id: string;
    name: string;
    status: PhaseStatus;
    description: string;
    actionId?: string;
    week?: number;
}

// ============================================================
// Tasks & Decisions
// ============================================================

export interface SimulationTask {
    id: string;
    type: string;
    title: string;
    description: string;
    requirements: string[];
}

export interface ActionChoice {
    id: string;
    label: string;
    description: string;
    impact?: Partial<GameStateSnapshot>;
}

export interface ScenarioAction {
    id: string;
    name: string;
    description: string;
    choices: ActionChoice[];
    weekAvailable?: number;
    triggerCondition?: (state: GameStateSnapshot) => boolean;
}

// ============================================================
// Weekly Signals & Events (per-week content)
// ============================================================

export type SignalSeverity = 'info' | 'warning' | 'critical' | 'success';
export type EventType = 'signal' | 'notification' | 'request' | 'meeting';
export type ActionType =
    | 'choice'           // Presents multiple option buttons
    | 'decision_text'    // User must type a decision memo
    | 'submit_prd'       // User fills a PRD form and submits
    | 'acknowledge'      // Simple acknowledge/dismiss
    | 'approval'         // Approve or reject with reason
    | 'task';            // Complete a task with checklist

export interface WeeklySignal {
    id: string;
    week: number;
    source: string;           // Name/team sending this
    sourceInitials: string;   // 2-letter abbreviation
    sourceColor: string;      // Tailwind color classes
    message: string;
    severity: SignalSeverity;
    tags?: string[];
}

export interface WeeklyEvent {
    id: string;
    week: number;
    type: EventType;
    title: string;
    description: string;
    from: string;
    fromInitials: string;
    fromColor: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    requiresAction?: boolean;
    actionId?: string;         // Links to a ScenarioAction or WeeklyActionItem
    timeInWeek?: number;       // Time in seconds from start of week (0 to 1800 for 30m week)
}

// ── Rich Action Items (shown in Strategic Actions panel) ──────
export interface PRDField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: string[];       // for select
    required?: boolean;
}

export interface WorkplaceMaterial {
    id: string;
    title: string;
    source: string;
    content: string[];
}

export interface OutputTemplateItem {
    id: string;
    label: string;
    guidance?: string;
}

export interface TaskScoringCriterion {
    id: string;
    label: string;
    points: number;
    description: string;
}

export interface ActionReviewResult {
    score: number;
    maxScore: number;
    percentage: number;
    level: 'needs_revision' | 'developing' | 'job_ready' | 'strong';
    strengths: string[];
    gaps: string[];
    revisionPrompt: string;
    stakeholderReaction: string;
    requiresRevision: boolean;
}

export interface WeeklyActionItem {
    id: string;
    week: number;
    title: string;
    description: string;
    category: 'decision' | 'document' | 'review' | 'approval' | 'task' | 'notification';
    actionType: ActionType;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    dueWeek?: number;         // If set and past, moves to backlog

    // For 'choice' actionType
    choices?: ActionChoice[];

    // For 'decision_text' actionType
    decisionPrompt?: string;
    decisionPlaceholder?: string;

    // For 'submit_prd' actionType
    prdTitle?: string;
    prdFields?: PRDField[];

    // For 'task' actionType
    taskChecklist?: { id: string; label: string; required?: boolean }[];

    // For 'approval' actionType
    approvalContext?: string;
    approvalOptions?: { id: string; label: string; requiresReason?: boolean }[];

    // Product Management workplace simulation metadata
    workplaceScenario?: string;
    workplaceMaterials?: WorkplaceMaterial[];
    learnerInstruction?: string;
    outputTemplate?: OutputTemplateItem[];
    expectedAnswerGuide?: string[];
    scoringRubric?: TaskScoringCriterion[];
    feedbackCriteria?: string[];
    artifactType?: 'prd' | 'roadmap' | 'stakeholder_update' | 'retrospective' | 'risk_assessment' | 'user_research' | 'metrics_report' | 'decision_log' | 'project_charter';
}

// ============================================================
// Simulation Config (Per-Simulation Contract)
// ============================================================

export type SimulationArchetype = 'crisis' | 'growth' | 'platform' | 'zero_to_one';
export type DifficultyLevel = 'intro' | 'intermediate' | 'advanced';

export interface SimulationConfig {
    id: string;
    name: string;

    // Company branding
    companyName: string;
    industry: string;
    archetype: SimulationArchetype;
    logo: string;
    primaryColor: string;

    // Company metadata
    description: string;
    founded: string;
    employees: string;
    headquarters: string;

    // Financial
    budget: number;
    fundingStatus: string;

    // Challenge (shown on start screen)
    challenge: string;
    challengeDetails: string;

    // Simulation engine config
    totalWeeks: number;
    teamSize: number;
    durationHours: number;
    difficulty: DifficultyLevel;
    passThreshold: number;       // 0-100 score to pass
    strongPassThreshold: number; // 0-100 score for distinction

    // Content (ALL editable outputs live here)
    kpis: KPI[];
    stakeholders: Stakeholder[];
    successCriteria: SuccessCriterion[];
    timelinePhases: TimelinePhase[];
    currentRisks: Risk[];
    tasks: SimulationTask[];
    actions: ScenarioAction[];  // Legacy decision events

    // NEW: rich per-week content
    weeklySignals?: WeeklySignal[];
    weeklyEvents?: WeeklyEvent[];
    weeklyActions?: WeeklyActionItem[];

    // Optional PM simulation metadata
    evaluationRubrics?: Record<string, TaskScoringCriterion[]>;
    promptEngine?: string;

    // Context text (drives AI/narrative generation)
    marketContext: string;
    technicalStack: string;
    projectType: string;
}

// ============================================================
// Game State (Runtime)
// ============================================================

export interface CompletedAction {
    actionId: string;
    week: number;
    result: Record<string, unknown>;
    review?: ActionReviewResult;
}

export interface BacklogActionItem extends WeeklyActionItem {
    addedToBacklogWeek: number;
    isOverdue: boolean;
}

export interface GameStateSnapshot {
    sessionId: string;
    simulationId: string;
    week: number;
    totalWeeks: number;
    timeLeft: number;         // seconds remaining in this week's timer
    budget: number;
    initialBudget: number;
    progress: number;         // 0-100
    phaseProgress: number;    // 0-100
    riskLevel: number;        // 0-1
    teamMorale: number;       // 0-100
    stakeholders: StakeholderState[];
    signals: Signal[];
    decisionsMade: DecisionRecord[];
    completedCriteria: string[];  // ids of completed SuccessCriteria
    artifacts: ArtifactRecord[];
    backlogItems: BacklogItem[];
    roadmapPhases: RoadmapPhase[];
    company?: { name: string };

    // NEW runtime fields
    completedActions: CompletedAction[];
    backlogActionItems: BacklogActionItem[];  // overdue/pending actions in backlog
    weeklySignalsShown: WeeklySignal[];       // signals visible for current week
    weeklyEventsShown: WeeklyEvent[];         // events visible for current week
    weeklyActionsForThisWeek: WeeklyActionItem[]; // actions available this week
    activeMeeting?: WeeklyEvent | null;       // Current incoming meeting call
    notifications?: string[];                 // Message IDs that triggered notification
}

export interface StakeholderState {
    id: string;
    name: string;
    role: string;
    satisfaction: number;
}

export interface Signal {
    id: string;
    source: 'data' | 'support' | 'leadership' | 'sales' | string;
    message: string;
    priority: 'high' | 'normal';
    week: number;
}

export interface DecisionRecord {
    id: string;
    actionId: string;
    choiceId: string;
    week: number;
    outcome: string;
    feedback: string;
}

export interface ArtifactRecord {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
    week: number;
    status?: 'draft' | 'generated' | 'exported' | 'archived';
    content?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface BacklogItem {
    id: string;
    title: string;
    description: string;
    priority: string;        // broad — compatible with pmtools BacklogItem
    status: string;          // broad — compatible with pmtools BacklogItem
    storyPoints?: number;    // pmtools field name
    points?: number;         // alias in shared/simulation code
    category?: string;
    assignee?: string;
}

export interface RoadmapPhase {
    id: string;
    name: string;
    startWeek: number;
    endWeek: number;
    items: RoadmapItem[];
}

export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    status: 'planned' | 'in-progress' | 'completed';
    startWeek: number;
    endWeek: number;
    category: string;
    progress: number;
}

// ============================================================
// Score
// ============================================================

export interface SimulationScore {
    overall: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    breakdown: {
        decisions: number;
        stakeholders: number;
        budget: number;
        timeline: number;
    };
}
