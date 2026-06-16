import type { Scenario, Phase, ScenarioAction, TimelineEvent, StakeholderConfig } from '../core/SimulationEngine';
import type { GroundTruthState } from '../evaluation/GroundTruthEngine';

export const PM_01_ID = 'pm-01';

// ============================================================================
// PHASE 1 & 2: GROUND TRUTH (World State)
// ============================================================================

export const pm01GroundTruth: GroundTruthState = {
  rootCauses: {
    'rc-1': {
      id: 'rc-1',
      name: 'Implementation Gap - customers cant realize value',
      weight: 0.35,
      observableSignals: ['Low time-to-value', 'Support ticket themes around setup'],
      hiddenSignals: ['First-time user flow completion rates', 'Playbook adoption rates'],
    },
    'rc-2': {
      id: 'rc-2',
      name: 'Competitive Pressure - 2 new entrants with simpler UX',
      weight: 0.25,
      observableSignals: ['Win/loss analysis', 'Competitor feature parity'],
      hiddenSignals: ['Competitor pricing changes', 'User survey responses'],
    },
    'rc-3': {
      id: 'rc-3',
      name: 'Mid-Market Squeeze - too complex for SMB, too small for enterprise',
      weight: 0.20,
      observableSignals: ['Customer segment analysis', 'Support complexity'],
      hiddenSignals: ['Customer advisory board feedback', 'Pricing elasticity data'],
    },
    'rc-4': {
      id: 'rc-4',
      name: 'Sales Expectations Misalignment - selling to wrong ICP',
      weight: 0.12,
      observableSignals: ['Deal analysis', 'Founder exit signals'],
      hiddenSignals: ['Sales methodology compliance', 'Territory analysis'],
    },
    'rc-5': {
      id: 'rc-5',
      name: 'Pricing Friction - 40% of churn cited price concerns',
      weight: 0.08,
      observableSignals: ['Exit survey data', 'Plan downgrade rates'],
      hiddenSignals: ['Price perception surveys', 'Feature confusion'],
    },
  },
  constraints: {
    'eng-capacity': {
      id: 'eng-capacity',
      name: 'Engineering capacity',
      severity: 80,
      affectedStakeholders: ['engineering', 'cto'],
      isBlocker: true,
    },
    'budget': {
      id: 'budget',
      name: 'Budget constraint - $150K remaining for quarter',
      severity: 90,
      affectedStakeholders: ['cfo', 'ceo'],
      isBlocker: true,
    },
    'time': {
      id: 'time',
      name: 'Board pitch in 8 weeks',
      severity: 85,
      affectedStakeholders: ['ceo', 'cfo', 'board'],
      isBlocker: true,
    },
    'legal-pricing': {
      id: 'legal-pricing',
      name: 'Cannot change pricing without 30-day notice',
      severity: 50,
      affectedStakeholders: ['legal', 'cfo'],
      isBlocker: false,
    },
    'tech-debt': {
      id: 'tech-debt',
      name: 'Platform stability at risk if > 2 major new features',
      severity: 60,
      affectedStakeholders: ['cto', 'engineering'],
      isBlocker: false,
    },
  },
  causalGraph: [
    { from: 'rc-1', to: 'time-to-value', strength: 0.9 },
    { from: 'rc-1', to: 'churn', strength: 0.7 },
    { from: 'rc-1', to: 'support-tickets', strength: 0.8 },
    { from: 'rc-2', to: 'win-rate', strength: 0.6 },
    { from: 'rc-2', to: 'sales-cycle', strength: 0.5 },
    { from: 'rc-3', to: 'customer-size', strength: 0.8 },
    { from: 'rc-4', to: 'deal-quality', strength: 0.7 },
  ],
  hiddenState: {
    stakeholderPrivateConcerns: {
      ceo: ['Wants to prove growth story for Series C', 'Fears being fired by board'],
      cfo: ['Wants to keep cash runway > 18 months', 'Fears running out of money'],
      vp_sales: ['Wants to blame product for missed quotas', 'Fears being replaced'],
      vp_cs: ['Wants to reduce team workload', 'Fears team burnout'],
      cto: ['Wants to protect engineering morale', 'Fears system collapse'],
    },
    unrevealedData: {
      win_rate: 'Actually a sales issue, not product - Sales pitching wrong customer size',
      time_to_value: 'Increased from 21 to 45 days - key signal of implementation gap',
    },
    systemVulnerabilities: [
      'Onboarding flow has 60% drop-off at step 3',
      'No customer success playbooks exist',
      'Support team at 120% capacity',
    ],
  },
};

// ============================================================================
// PHASE 3: SIMULATION STRUCTURE (8 PHASES)
// ============================================================================

export interface Pm01PhaseDetail {
  id: string;
  name: string;
  phaseNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  objective: string;
  situationContext: string;
  availableActions: string[];
  requiredArtifacts: string[];
  timeConstraints: string;
  unlockConditions: string;
  embeddedTension: string;
  qualityThresholds: {
    minProgress: number;
    maxRisk: number;
    minTrust: number;
    artifactQuality: number;
  };
}

export const pm01PhaseStructure: Pm01PhaseDetail[] = [
  {
    id: 'phase-1', name: 'Situation Assessment', phaseNumber: 1,
    objective: 'Understand current state and identify initial hypotheses',
    situationContext: 'You are new to this problem. CEO is anxious. Historical data shows conflicting signals.',
    availableActions: ['review_metrics', 'talk_to_stakeholders', 'analyze_churn'],
    requiredArtifacts: ['Initial Metrics Dashboard Summary', 'Stakeholder Concern List'],
    timeConstraints: 'Week 1 only - Board expects update by end of week',
    unlockConditions: 'Complete initial stakeholder interviews and metric review',
    embeddedTension: 'Speed vs Accuracy - CEO wants answers now, but premature conclusions could lead to wrong solution',
    qualityThresholds: { minProgress: 15, maxRisk: 35, minTrust: 40, artifactQuality: 50 },
  },
  {
    id: 'phase-2', name: 'Hypothesis Formation', phaseNumber: 2,
    objective: 'Form testable hypotheses about root causes based on gathered evidence',
    situationContext: 'You have conflicting data from different departments.',
    availableActions: ['prioritize_hypotheses', 'design_validation', 'allocate_budget'],
    requiredArtifacts: ['Root Cause Hypothesis Document', 'Validation Plan'],
    timeConstraints: 'Week 2 - Must have clear direction before deep investigation',
    unlockConditions: 'At least 2 hypotheses identified with supporting evidence',
    embeddedTension: 'Alignment vs Decisiveness - Must balance stakeholder buy-in with making firm decisions',
    qualityThresholds: { minProgress: 30, maxRisk: 40, minTrust: 45, artifactQuality: 60 },
  },
  {
    id: 'phase-3', name: 'Discovery', phaseNumber: 3,
    objective: 'Conduct deep investigation to validate or invalidate hypotheses',
    situationContext: 'Multiple plausible causes exist. Budget is limited ($150K).',
    availableActions: ['run_analysis', 'customer_interviews', 'competitive_research'],
    requiredArtifacts: ['Churn Analysis Spreadsheet', 'Customer Interview Summary', 'Competitive Matrix'],
    timeConstraints: 'Weeks 3-4 - 2 weeks to complete validation',
    unlockConditions: 'Validation approach approved by at least 2 stakeholders',
    embeddedTension: 'Depth vs Speed - Comprehensive validation takes time but shallow work leads to wrong root cause',
    qualityThresholds: { minProgress: 50, maxRisk: 45, minTrust: 50, artifactQuality: 70 },
  },
  {
    id: 'phase-4', name: 'Diagnosis', phaseNumber: 4,
    objective: 'Confirm the true root cause with supporting evidence',
    situationContext: 'You have validation data. Must connect dots to form coherent diagnosis.',
    availableActions: ['root_cause_confirmation', 'evidence_synthesis', 'stakeholder_presentation'],
    requiredArtifacts: ['Final Diagnosis Report', 'Evidence Supporting Documentation'],
    timeConstraints: 'Week 5 - Must have confirmed diagnosis before strategy phase',
    unlockConditions: 'Root cause identified with >70% confidence from validated evidence',
    embeddedTension: 'Certainty vs Action - Waiting for 100% certainty wastes time, but acting on incomplete data is risky',
    qualityThresholds: { minProgress: 65, maxRisk: 45, minTrust: 55, artifactQuality: 75 },
  },
  {
    id: 'phase-5', name: 'Strategy', phaseNumber: 5,
    objective: 'Design solution approach based on confirmed root cause',
    situationContext: 'Root cause confirmed. Engineering can only do 1 major feature.',
    availableActions: ['solution_design', 'alternative_evaluation', 'resource_planning'],
    requiredArtifacts: ['Strategy Memo', 'Solution Options Analysis', 'Resource Requirements Doc'],
    timeConstraints: 'Week 6 - Strategy must be defined before planning',
    unlockConditions: 'At least 2 solution options evaluated with tradeoffs documented',
    embeddedTension: 'Ideal vs Practical - Best technical solution may not be politically feasible',
    qualityThresholds: { minProgress: 75, maxRisk: 40, minTrust: 60, artifactQuality: 75 },
  },
  {
    id: 'phase-6', name: 'Planning', phaseNumber: 6,
    objective: 'Create detailed execution plan with timeline and contingency',
    situationContext: 'Solution chosen. Need detailed roadmap. Key engineer just quit.',
    availableActions: ['roadmap_creation', 'risk_planning', 'contingency_development'],
    requiredArtifacts: ['Execution Roadmap', 'Risk Mitigation Plan', 'Contingency Playbook'],
    timeConstraints: 'Week 7 - Planning complete before stakeholder alignment',
    unlockConditions: 'Roadmap with milestones and success criteria defined',
    embeddedTension: 'Ambition vs Reality - Aggressive timelines build confidence but risk failure',
    qualityThresholds: { minProgress: 85, maxRisk: 35, minTrust: 65, artifactQuality: 80 },
  },
  {
    id: 'phase-7', name: 'Stakeholder Alignment', phaseNumber: 7,
    objective: 'Secure explicit buy-in from all key stakeholders',
    situationContext: 'Plan ready. Must get CFO budget approval, CEO sign-off.',
    availableActions: ['executive_pitch', 'cfo_negotiation', 'eng_communication'],
    requiredArtifacts: ['Executive Presentation Deck', 'Budget Request', 'Stakeholder Sign-off Emails'],
    timeConstraints: 'Week 8 - Must have alignment before board presentation',
    unlockConditions: 'At least 4 of 5 stakeholders explicitly committed',
    embeddedTension: 'Consensus vs Speed - Getting everyone aligned takes time but delays hurt board prep',
    qualityThresholds: { minProgress: 90, maxRisk: 30, minTrust: 70, artifactQuality: 85 },
  },
  {
    id: 'phase-8', name: 'Launch / Decision Point', phaseNumber: 8,
    objective: 'Make final Go/No-Go decision and present to board',
    situationContext: 'Critical board meeting. All work culminates here.',
    availableActions: ['board_preparation', 'final_recommendation', 'contingency_prep'],
    requiredArtifacts: ['Board Presentation', 'Final Recommendation Memo', 'Success Metrics Dashboard'],
    timeConstraints: 'Week 9 - Board meeting is the hard deadline',
    unlockConditions: 'Board presentation complete, all artifacts submitted',
    embeddedTension: 'Confidence vs Humility - Overconfident recommendations damage credibility if wrong',
    qualityThresholds: { minProgress: 100, maxRisk: 25, minTrust: 75, artifactQuality: 90 },
  },
];

// ============================================================================
// PHASE 4: ARTIFACT SYSTEM
// ============================================================================

export interface ArtifactType {
  id: string;
  name: string;
  purpose: string;
  requiredSections: string[];
  depthRequirements: string;
  evidenceRequirements: string;
  commonFailureModes: string[];
  evaluationCriteria: {
    claimExtraction: string;
    evidenceLinking: string;
    internalConsistency: string;
    crossArtifactCoherence: string;
    metricValidation: string;
  };
  consequenceHooks: string[];
  submissionRules: {
    canSubmit: string;
    canRevise: boolean;
    lowQualityPenalty: string;
  };
}

export const pm01ArtifactSystem: ArtifactType[] = [
  {
    id: 'artifact-churn-analysis',
    name: 'Churn Analysis Spreadsheet',
    purpose: 'Deep-dive analysis of customer churn patterns to identify root causes',
    requiredSections: ['Executive Summary', 'Churn by Segment', 'Churn by Tenure', 'Exit Survey Synthesis', 'Key Findings', 'Recommended Actions'],
    depthRequirements: 'Must show actual numbers, not just trends. Must segment by at least 3 dimensions.',
    evidenceRequirements: 'All claims must reference specific data points.',
    commonFailureModes: ['Only looking at overall churn rate', 'Ignoring timing patterns', 'Drawing conclusions without statistical significance'],
    evaluationCriteria: {
      claimExtraction: 'Extract specific claims about which segment/churn factor is most critical',
      evidenceLinking: 'Each claim must have data table reference',
      internalConsistency: 'Summary must match detailed findings',
      crossArtifactCoherence: 'Must align with stakeholder interview findings',
      metricValidation: 'Churn rate calculations must be mathematically correct'
    },
    consequenceHooks: ['IF wrong segment identified → stakeholder trust drops 10%', 'IF no evidence cited → validation requirement triggered'],
    submissionRules: { canSubmit: 'After Phase 3', canRevise: true, lowQualityPenalty: 'Trust -10' },
  },
  {
    id: 'artifact-hypothesis-doc',
    name: 'Root Cause Hypothesis Document',
    purpose: 'Formal documentation of hypotheses about root causes with supporting evidence',
    requiredSections: ['Problem Statement', 'Hypothesis List (at least 3)', 'Evidence For/Against', 'Validation Approach', 'Priority Ranking', 'Resource Requirements'],
    depthRequirements: 'Each hypothesis must have distinct evidence. Must acknowledge counter-evidence.',
    evidenceRequirements: 'Quantitative data required for top 2 hypotheses.',
    commonFailureModes: ['Only one hypothesis', 'No validation plan', 'Hypotheses overlap'],
    evaluationCriteria: {
      claimExtraction: 'Identify primary and secondary hypotheses',
      evidenceLinking: 'Evidence must directly support or contradict specific hypothesis',
      internalConsistency: 'Priority ranking must match evidence strength',
      crossArtifactCoherence: 'Must incorporate metrics and stakeholder concerns',
      metricValidation: 'Must use relevant metrics, not vanity metrics'
    },
    consequenceHooks: ['IF single hypothesis → triggers "consider alternatives" event', 'IF no validation plan → budget freeze'],
    submissionRules: { canSubmit: 'After Phase 2', canRevise: true, lowQualityPenalty: 'Progress blocked' },
  },
  {
    id: 'artifact-strategy-memo',
    name: 'Strategy Memo',
    purpose: 'Executive-level document proposing solution approach with rationale',
    requiredSections: ['Situation Summary', 'Confirmed Root Cause', 'Solution Options (at least 3)', 'Pros/Cons', 'Recommended Approach', 'Tradeoffs and Risks', 'Resource Requirements', 'Timeline'],
    depthRequirements: 'Must present genuine alternatives. Must acknowledge tradeoffs.',
    evidenceRequirements: 'Root cause confirmation must cite Phase 3 evidence.',
    commonFailureModes: ['Only recommending one option', 'Ignoring tradeoffs', 'No contingency mentioned'],
    evaluationCriteria: {
      claimExtraction: 'Extract final recommendation and key supporting arguments',
      evidenceLinking: 'Each solution option must reference root cause analysis',
      internalConsistency: 'Timeline must match resource availability',
      crossArtifactCoherence: 'Must build on diagnosis document',
      metricValidation: 'Expected outcomes must use measurable metrics'
    },
    consequenceHooks: ['IF unrealistic expectations → triggers CFO review', 'IF no contingency → triggers risk event'],
    submissionRules: { canSubmit: 'After Phase 5', canRevise: false, lowQualityPenalty: 'Cannot proceed' },
  },
  {
    id: 'artifact-board-deck',
    name: 'Executive Presentation Deck',
    purpose: 'Board-ready presentation summarizing situation, solution, and request',
    requiredSections: ['Title + Situation', 'The Problem', 'Root Cause', 'Our Solution', 'Financial Impact', 'Resource Request', 'Timeline', 'Risk Mitigation', 'Ask', 'Appendix'],
    depthRequirements: 'Must be compelling narrative, not just data dump.',
    evidenceRequirements: 'All charts must have source noted.',
    commonFailureModes: ['Too many slides', 'No clear "ask"', 'Defensive tone', 'Technical jargon'],
    evaluationCriteria: {
      claimExtraction: 'Extract core narrative and key ask',
      evidenceLinking: 'Each claim must have backup in appendix',
      internalConsistency: 'Financials must match strategy memo',
      crossArtifactCoherence: 'Must synthesize all previous artifacts',
      metricValidation: 'Must show correct metric calculations'
    },
    consequenceHooks: ['IF no clear ask → board defers decision', 'IF unrealistic projections → CFO objects'],
    submissionRules: { canSubmit: 'After Phase 7', canRevise: true, lowQualityPenalty: 'Board delayed' },
  },
  {
    id: 'artifact-roadmap',
    name: 'Execution Roadmap',
    purpose: 'Detailed implementation plan with milestones and dependencies',
    requiredSections: ['Timeline Overview', 'Phase Breakdown', 'Milestones with Dates', 'Dependencies', 'Resource Allocation', 'Risk Mitigation', 'Success Metrics', 'Contingency Triggers'],
    depthRequirements: 'Must show critical path. Must identify dependencies between items.',
    evidenceRequirements: 'Timeline must be realistic.',
    commonFailureModes: ['No dependencies shown', 'No contingency', 'Resource allocation exceeds capacity'],
    evaluationCriteria: {
      claimExtraction: 'Extract key milestones and decision points',
      evidenceLinking: 'Timeline must account for constraints',
      internalConsistency: 'Resources must not exceed availability',
      crossArtifactCoherence: 'Must match strategy memo approach',
      metricValidation: 'Success metrics must be measurable'
    },
    consequenceHooks: ['IF unrealistic timeline → triggers scope negotiation', 'IF no contingency → extra risk buffer required'],
    submissionRules: { canSubmit: 'After Phase 6', canRevise: true, lowQualityPenalty: 'Alignment blocked' },
  },
  {
    id: 'artifact-stakeholder-comms',
    name: 'Stakeholder Communication',
    purpose: 'Regular updates to keep stakeholders informed and aligned',
    requiredSections: ['Status Update Template', 'Key Messages', 'Action Items', 'Decisions Needed', 'Risks/Blockers'],
    depthRequirements: 'Must be tailored to each stakeholder.',
    evidenceRequirements: 'Must cite data when making claims about progress.',
    commonFailureModes: ['One-size-fits-all message', 'No action items', 'Hiding problems'],
    evaluationCriteria: {
      claimExtraction: 'Extract key decisions needed from stakeholder',
      evidenceLinking: 'Progress claims must reference metrics',
      internalConsistency: 'Tone must match stakeholder style',
      crossArtifactCoherence: 'Must align with board narrative',
      metricValidation: 'Progress must use correct metrics'
    },
    consequenceHooks: ['IF hiding problems → trust drops significantly', 'IF wrong stakeholder focus → engagement drops'],
    submissionRules: { canSubmit: 'Any time after Phase 1', canRevise: false, lowQualityPenalty: 'Trust -5' },
  },
];

// ============================================================================
// REMAINING CONTENT (Stakeholders, Phases, Actions, Timeline, Initial State, Scenario)
// ============================================================================

export const pm01Stakeholders: StakeholderConfig[] = [
  { id: 'ceo', name: 'Marcus Johnson', role: 'CEO', department: 'Executive', influence: 10, initialSatisfaction: 40, communicationStyle: 'direct', concerns: ['growth', 'funding'], priorities: ['series_c'], relationships: [] },
  { id: 'cfo', name: 'Diana Chen', role: 'CFO', department: 'Finance', influence: 9, initialSatisfaction: 50, communicationStyle: 'formal', concerns: ['profitability', 'runway'], priorities: ['18_month_runway'], relationships: [] },
  { id: 'vp_sales', name: 'Tom Rodriguez', role: 'VP Sales', department: 'Sales', influence: 8, initialSatisfaction: 35, communicationStyle: 'direct', concerns: ['quota', 'product_gaps'], priorities: ['close_deals'], relationships: [] },
  { id: 'vp_cs', name: 'Rachel Kim', role: 'VP CS', department: 'Customer Success', influence: 7, initialSatisfaction: 45, communicationStyle: 'diplomatic', concerns: ['support_load', 'churn'], priorities: ['reduce_churn'], relationships: [] },
  { id: 'cto', name: 'James Park', role: 'CTO', department: 'Engineering', influence: 8, initialSatisfaction: 55, communicationStyle: 'formal', concerns: ['tech_debt', 'stability'], priorities: ['pay_down_debt'], relationships: [] },
];

export const pm01Phases: Phase[] = [
  { id: 'phase-1', name: 'Situation Assessment', description: 'Understand the current state and gather initial data', duration: 1, objectives: ['Review all available metrics', 'Identify initial hypotheses', 'Set up stakeholder channels'], availableActions: ['review_metrics', 'talk_to_stakeholders', 'analyze_churn'], successCriteria: { minProgress: 10, maxRisk: 30, minTrust: 40 } },
  { id: 'phase-2', name: 'Hypothesis Formation', description: 'Develop theories about root causes based on evidence', duration: 1, objectives: ['Synthesize initial findings', 'Prioritize root cause hypotheses', 'Design validation approach'], availableActions: ['prioritize_hypotheses', 'design_validation', 'allocate_budget'], successCriteria: { minProgress: 25, maxRisk: 40, minTrust: 45 } },
];

export const pm01Actions: Record<string, ScenarioAction> = {
  review_metrics: {
    id: 'review_metrics', name: 'Review All Metrics', description: 'Analyze available data',
    category: 'resource', urgency: 'high',
    choices: [
      { id: 'review-all', label: 'Full metric deep-dive', description: 'Spend time analyzing all metrics', effects: { progress: 5, customMetrics: { data_understanding: 20 } }, feedback: 'You see NPS stable but time-to-value doubled.', risk: 2, timeCost: 1 },
      { id: 'review-focused', label: 'Focus on churn', description: 'Prioritize understanding churn spike', effects: { progress: 4, customMetrics: { churn_understanding: 25 } }, feedback: 'Churn up across all segments.', risk: 3, timeCost: 1 },
      { id: 'review-quick', label: 'Quick dashboard review', description: 'Brief overview', effects: { progress: 3 }, feedback: 'Dashboard confirms growth flat, churn up.', risk: 5, timeCost: 0.5 },
    ],
  },
  talk_to_stakeholders: {
    id: 'talk_to_stakeholders', name: 'Talk to Stakeholders', description: 'Meet with key stakeholders',
    category: 'communication', urgency: 'high',
    choices: [
      { id: 'talk-all', label: 'Meet all stakeholders', description: '1:1s with CEO, CFO, VP Sales, VP CS, CTO', effects: { progress: 5, stakeholderSatisfaction: { ceo: 5, cfo: 5, vp_sales: 5, vp_cs: 5, cto: 5 } }, feedback: 'Everyone has different theory.', risk: 2, timeCost: 1 },
      { id: 'talk-ceo-cs', label: 'Focus on CEO and VP CS', description: 'Leadership + customer-facing', effects: { progress: 4, stakeholderSatisfaction: { ceo: 8, vp_cs: 10 } }, feedback: 'VP CS: We have no playbooks.', risk: 3, timeCost: 1 },
      { id: 'talk-sales', label: 'Start with VP Sales', description: 'Sales perspective on product gaps', effects: { progress: 3, stakeholderSatisfaction: { vp_sales: 10 } }, feedback: '4 of 5 lost deals were wrong customer fit.', risk: 4, timeCost: 0.5 },
    ],
  },
  analyze_churn: {
    id: 'analyze_churn', name: 'Analyze Churn Data', description: 'Deep dive into why customers leave',
    category: 'technical', urgency: 'high',
    choices: [
      { id: 'churn-exit', label: 'Exit survey analysis', description: 'Analyze why customers left', effects: { progress: 5, customMetrics: { exit_survey_insights: 30 } }, feedback: '60% mention "didnt get value".', risk: 2, timeCost: 1 },
      { id: 'churn-segment', label: 'Analyze by segment', description: 'See if churn is concentrated', effects: { progress: 4, customMetrics: { segment_analysis: 25 } }, feedback: 'Churn highest in mid-market.', risk: 3, timeCost: 1 },
      { id: 'churn-timing', label: 'Analyze timing', description: 'When do customers churn?', effects: { progress: 3, customMetrics: { timing_analysis: 20 } }, feedback: 'Most churn in first 60 days.', risk: 3, timeCost: 0.5 },
    ],
  },
  prioritize_hypotheses: {
    id: 'prioritize_hypotheses', name: 'Prioritize Hypotheses', description: 'Rank theories about root causes',
    category: 'process', urgency: 'medium',
    choices: [
      { id: 'prioritize-rc1', label: 'Prioritize RC-1 (Implementation)', description: 'Put implementation at top of list', effects: { progress: 10, customMetrics: { hypothesis_strength_rc1: 40 }, stakeholderSatisfaction: { vp_cs: 10 } }, feedback: 'Good call. Time-to-value supports this.', risk: 3, timeCost: 0 },
      { id: 'prioritize-rc2', label: 'Prioritize RC-2 (Competitive)', description: 'Focus on competitor threats', effects: { progress: 10, customMetrics: { hypothesis_strength_rc2: 40 }, stakeholderSatisfaction: { vp_sales: 10 } }, feedback: 'VP Sales supports but data is nuanced.', risk: 5, timeCost: 0 },
      { id: 'prioritize-rc3', label: 'Prioritize RC-3 (Mid-Market)', description: 'Focus on market positioning', effects: { progress: 10, customMetrics: { hypothesis_strength_rc3: 40 } }, feedback: 'Plausible but data doesnt support yet.', risk: 6, timeCost: 0 },
    ],
  },
  design_validation: {
    id: 'design_validation', name: 'Design Validation', description: 'Plan how to test hypotheses',
    category: 'process', urgency: 'medium',
    choices: [
      { id: 'validate-comp', label: 'Comprehensive ($50K)', description: 'Full validation study', effects: { budget: -50000, progress: 8, customMetrics: { validation_depth: 40 } }, feedback: 'Expensive but thorough.', risk: 2, timeCost: 2 },
      { id: 'validate-focus', label: 'Focused ($25K)', description: 'Deep dive on top hypothesis', effects: { budget: -25000, progress: 6, customMetrics: { validation_depth: 30 } }, feedback: 'You confirm RC-1 but dont eliminate others.', risk: 4, timeCost: 1 },
      { id: 'validate-light', label: 'Quick pulse check', description: 'Light touch validation', effects: { progress: 4, customMetrics: { validation_depth: 15 } }, feedback: 'Quick but limited evidence.', risk: 6, timeCost: 0.5 },
    ],
  },
  allocate_budget: {
    id: 'allocate_budget', name: 'Allocate Budget', description: 'Decide how to spend $150K',
    category: 'resource', urgency: 'medium',
    choices: [
      { id: 'budget-research', label: 'Invest in research ($50K)', description: 'Fund customer interviews', effects: { budget: -50000, progress: 5, customMetrics: { research_investment: 50 }, stakeholderSatisfaction: { cfo: -5 } }, feedback: 'CFO questions spend but approves.', risk: 4, timeCost: 0 },
      { id: 'budget-reserve', label: 'Conserve budget', description: 'Save for implementation', effects: { progress: 2, customMetrics: { research_investment: 0 } }, feedback: 'CFO appreciates. But may lack data.', risk: 5, timeCost: 0 },
      { id: 'budget-balanced', label: 'Balanced ($25K)', description: 'Moderate investment', effects: { budget: -25000, progress: 4, customMetrics: { research_investment: 25 }, stakeholderSatisfaction: { cfo: 5 } }, feedback: 'Reasonable balance.', risk: 3, timeCost: 0 },
    ],
  },
};

export const pm01TimelineEvents: TimelineEvent[] = [
  { week: 2, type: 'stakeholder_change', title: 'Board Member Requests Update', description: 'Board member emails CEO about growth metrics.', impact: { stakeholderSatisfaction: { ceo: -5 } }, triggered: false },
  { week: 4, type: 'opportunity', title: 'Enterprise Deal Opportunity', description: 'Large enterprise wants to partner. Worth $2M ARR.', impact: {}, triggered: false },
  { week: 6, type: 'crisis', title: 'Key Engineer Quits', description: 'Senior engineer hands in notice.', impact: { teamMorale: -15, progress: -5 }, triggered: false },
  { week: 8, type: 'milestone', title: 'Board Meeting', description: 'Critical board meeting.', impact: {}, triggered: false },
];

export const pm01InitialState = {
  week: 1, totalWeeks: 12, currentPhaseId: 'phase-1', phaseProgress: 0, progress: 0,
  budget: 150000, initialBudget: 150000, teamMorale: 65, riskLevel: 25, stakeholderTrust: 45,
  company: { name: 'ScaleFlow', mission: 'Workflow automation for mid-market' },
  metrics: { arr: 8.2, monthlyChurn: 5.2, nrr: 105, nps: 42, timeToValue: 45, winRate: 28 },
  stakeholders: [
    { id: 'ceo', name: 'Marcus Johnson', role: 'CEO', department: 'Executive', influence: 10, satisfaction: 40, communicationStyle: 'direct' as const, concerns: ['growth'], priorities: ['series_c'] },
    { id: 'cfo', name: 'Diana Chen', role: 'CFO', department: 'Finance', influence: 9, satisfaction: 50, communicationStyle: 'formal' as const, concerns: ['profitability'], priorities: ['runway'] },
    { id: 'vp_sales', name: 'Tom Rodriguez', role: 'VP Sales', department: 'Sales', influence: 8, satisfaction: 35, communicationStyle: 'direct' as const, concerns: ['quota'], priorities: ['deals'] },
    { id: 'vp_cs', name: 'Rachel Kim', role: 'VP CS', department: 'CS', influence: 7, satisfaction: 45, communicationStyle: 'diplomatic' as const, concerns: ['churn'], priorities: ['retention'] },
    { id: 'cto', name: 'James Park', role: 'CTO', department: 'Engineering', influence: 8, satisfaction: 55, communicationStyle: 'formal' as const, concerns: ['tech_debt'], priorities: ['stability'] },
  ],
  signals: [], decisionsMade: [], timeline: new Date(), startedAt: new Date(),
  timeLeft: 0, simulationInstanceId: 'pm01-default', triggeredEventIds: [],
};

// ============================================================================
// PHASE 4: ENHANCED ARTIFACT SYSTEM (10+ Consequence Rules)
// ============================================================================

export interface ArtifactEvaluationRule {
  id: string;
  artifactIds: string[];
  condition: string;
  consequence: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const pm01ArtifactConsequenceRules: ArtifactEvaluationRule[] = [
  // Financial unrealistic assumptions
  { id: 'rule-1', artifactIds: ['artifact-strategy-memo', 'artifact-board-deck'], condition: 'IF revenue projections > 150% of historical growth', consequence: 'CFO rejects budget request, trust -20', severity: 'critical' },
  { id: 'rule-2', artifactIds: ['artifact-strategy-memo'], condition: 'IF cost estimates ignore hidden costs', consequence: 'Budget overrun in execution phase', severity: 'high' },
  
  // Risks missing
  { id: 'rule-3', artifactIds: ['artifact-strategy-memo', 'artifact-roadmap'], condition: 'IF no risks documented', consequence: 'Crisis event triggered when risk materializes', severity: 'high' },
  { id: 'rule-4', artifactIds: ['artifact-board-deck'], condition: 'IF dependencies not identified', consequence: 'Board delays approval until dependencies clarified', severity: 'medium' },
  
  // Vanity metrics
  { id: 'rule-5', artifactIds: ['artifact-churn-analysis'], condition: 'IF only using vanity metrics (page views, users)', consequence: 'No real insight gained, must redo analysis', severity: 'medium' },
  { id: 'rule-6', artifactIds: ['artifact-strategy-memo'], condition: 'IF success metrics not tied to business outcomes', consequence: 'Stakeholders dismiss as irrelevant', severity: 'medium' },
  
  // Communication issues
  { id: 'rule-7', artifactIds: ['artifact-stakeholder-comms'], condition: 'IF vague language used (things, stuff, hopefully)', consequence: 'Stakeholder trust drops -5 per vague email', severity: 'low' },
  { id: 'rule-8', artifactIds: ['artifact-board-deck'], condition: 'IF no clear "ask"', consequence: 'Board defers decision, timeline +2 weeks', severity: 'high' },
  
  // Prioritization issues
  { id: 'rule-9', artifactIds: ['artifact-roadmap'], condition: 'IF prioritization inconsistent with strategy', consequence: 'Engineering pushback, execution delays', severity: 'high' },
  { id: 'rule-10', artifactIds: ['artifact-strategy-memo'], condition: 'IF trying to do everything (no tradeoffs)', consequence: 'Resource exhaustion, quality drops', severity: 'critical' },
  
  // Evidence issues
  { id: 'rule-11', artifactIds: ['artifact-hypothesis-doc'], condition: 'IF no evidence for primary hypothesis', consequence: 'Cannot proceed to strategy phase', severity: 'high' },
  { id: 'rule-12', artifactIds: ['artifact-churn-analysis'], condition: 'IF sample size too small (<30)', consequence: 'Statistical significance questioned, findings rejected', severity: 'medium' },
];

// ============================================================================
// PHASE 5: THINKING & REASONING LAYER
// ============================================================================

export interface ThinkingMetrics {
  coherenceScore: number;        // 0-1: How consistent is the narrative
  calibrationScore: number;      // 0-1: Confidence matches evidence
  contradictionCount: number;    // How many self-contradictions
  reasoningDepthScore: number;   // 0-1: Surface vs deep reasoning
}

export const pm01ThinkingSystem = {
  // Track claims per phase
  claimTracking: {
    phase1: [] as string[],
    phase2: [] as string[],
    phase3: [] as string[],
    phase4: [] as string[],
    phase5: [] as string[],
    phase6: [] as string[],
    phase7: [] as string[],
    phase8: [] as string[],
  },
  
  // Causal chain linking
  causalChains: [] as { cause: string; effect: string; phase: number; artifactId: string }[],
  
  // Coherence scoring model
  coherenceScoring: {
    claimsLinkedAcrossPhases: 0.3,
    resolvedContradictions: 0.25,
    evidenceBackedReasoning: 0.25,
    acknowledgedUncertainties: 0.2,
  },
  
  // Belief vs Reality
  beliefReality: {
    confidenceLevels: ['speculative', 'confident', 'highly_confident', 'certain'] as const,
    evidenceQualityRanking: ['anecdotal', 'qualitative', 'quantitative', 'definitive'] as const,
    
    calibrationLogic: (confidence: string, evidence: string) => {
      const confIndex = { speculative: 0, confident: 1, highly_confident: 2, certain: 3 };
      const evidIndex = { anecdotal: 0, qualitative: 1, quantitative: 2, definitive: 3 };
      const diff = confIndex[confidence as keyof typeof confIndex] - evidIndex[evidence as keyof typeof evidIndex];
      if (diff > 1) return 'overconfident';
      if (diff < -1) return 'underconfident';
      return 'calibrated';
    },
    
    miscalibrationDetection: {
      overconfidence: 'High certainty with weak evidence → penalty to credibility',
      underconfidence: 'Strong evidence but low confidence → missed opportunity bonus',
    },
  },
  
  // Stress testing
  stressTesting: {
    newDataIntroduction: {
      adaptiveThinking: 'User updates beliefs based on new evidence',
      rigidThinking: 'User ignores contradictory evidence',
    },
    outcomes: {
      adaptive: { trustBonus: 5, progressBonus: 10, learningUnlocked: true },
      rigid: { trustPenalty: -10, crisisTriggered: true, pathLocked: true },
    },
  },
};

// ============================================================================
// PHASE 6: DECISION SYSTEM
// ============================================================================

export interface DecisionRecord {
  id: string;
  type: 'explicit' | 'implicit';
  description: string;
  phase: number;
  intendedOutcome: string;
  metricsAffected: string[];
  stakeholdersImpacted: string[];
  timeCost: number;
  budgetCost: number;
}

export const pm01DecisionSystem = {
  // Decision Types
  explicitDecisions: [
    { id: 'launch-go', name: 'Go/No-Go Launch', impact: 'critical' },
    { id: 'feature-prioritization', name: 'Feature Priority', impact: 'high' },
    { id: 'resource-allocation', name: 'Budget Allocation', impact: 'high' },
    { id: 'stakeholder-strategy', name: 'Stakeholder Approach', impact: 'medium' },
  ],
  
  implicitDecisions: [
    { id: 'investigation-avoidance', name: 'Not investigating certain areas', tracking: 'what user ignores' },
    { id: 'delay-patterns', name: 'Delaying certain actions', tracking: 'patterns of postponement' },
    { id: 'stakeholder-avoidance', name: 'Not engaging certain stakeholders', tracking: 'who user avoids' },
  ],
  
  // Hard constraints
  constraints: {
    resourceLimit: 'Only ONE major initiative allowed this quarter',
    timeLimit: 'Cannot investigate everything - must prioritize',
    dependencyConstraint: 'Requires CFO approval for budgets > $50K',
    stakeholderConstraint: 'CEO must approve any strategy change',
  },
  
  // Tradeoff enforcement
  tradeoffs: [
    { choosing: 'feature-speed', prevents: 'feature-quality', explanation: 'Fast delivery reduces polish' },
    { choosing: 'research-depth', prevents: 'execution-speed', explanation: 'Thorough research takes time' },
    { choosing: 'enterprise-pivot', prevents: 'mid-market-focus', explanation: 'Shifting to enterprise abandons core' },
    { choosing: 'cost-reduction', prevents: 'team-morale', explanation: 'Cutting costs often hurts morale' },
    { choosing: 'aggressive-timeline', prevents: 'risk-mitigation', explanation: 'Fast timelines skip planning' },
  ],
  
  // Decision memory with callbacks
  decisionMemory: [] as DecisionRecord[],
  
  getCallbacks: (phase: number) => {
    return [
      { trigger: 'phase-4', callback: 'You chose X in Phase 2, which caused Y now', type: 'delayed_effect' },
      { trigger: 'phase-6', callback: 'Your prioritization in Phase 3 is now affecting execution', type: 'cumulative' },
    ];
  },
  
  // Failure detection
  failureDetection: {
    poorQuality: 'Decision made without evidence or analysis',
    avoidance: '3+ decisions deferred or avoided in single phase',
    overloaded: 'Trying to pursue >3 initiatives simultaneously',
  },
};

// ============================================================================
// PHASE 7: CONSEQUENCE SYSTEM
// ============================================================================

export const pm01ConsequenceSystem = {
  // Immediate effects
  immediate: {
    metricShifts: {
      budget: { direction: 'decrease', range: [5000, 100000] },
      teamMorale: { direction: 'varies', range: [-20, 15] },
      stakeholderTrust: { direction: 'varies', range: [-15, 10] },
      progress: { direction: 'increase', range: [5, 25] },
    },
    stakeholderReactions: {
      positive: ['Approves budget', 'Offers additional help', 'Becomes ally'],
      negative: ['Rejects proposal', 'Blocks resource', 'Escalates to CEO'],
      neutral: ['Takes under advisement', 'Requests more info'],
    },
    resourceConsumption: {
      timePerAction: { min: 0.5, max: 2 },
      budgetPerAction: { min: 0, max: 75000 },
    },
  },
  
  // Delayed effects
  delayed: {
    crisisTriggers: [
      { trigger: 'risk-ignored', condition: 'High risk item not addressed', effect: 'Crisis event at Week 6', probability: 0.7 },
      { trigger: 'stakeholder-unaligned', condition: 'Key stakeholder not bought in', effect: 'Board presentation fails', probability: 0.6 },
      { trigger: 'budget-mismanaged', condition: 'Overspent in early phases', effect: 'No resources for execution', probability: 0.8 },
    ],
    compounding: [
      { early: 'Shallow analysis', late: 'Wrong strategy', multiplier: 2.5 },
      { early: 'Ignored stakeholder', late: 'Blocked at board', multiplier: 1.8 },
      { early: 'Vague communication', late: 'Trust erosion', multiplier: 1.5 },
    ],
    narrativeCallbacks: [
      'Your Phase 2 hypothesis about [X] was never validated',
      'You chose to skip [X] in Phase 3, which led to [Y]',
      'Despite claiming [X] in your strategy, your roadmap shows [Y]',
    ],
  },
  
  // Artifact → Consequence mapping
  artifactMapping: {
    'artifact-churn-analysis': {
      poorAnalysis: 'Wrong root cause → strategy invalid → execution failure',
      ignoredData: 'Missed signal → crisis unmitigated',
    },
    'artifact-strategy-memo': {
      risksMissing: 'Undocumented risk → crisis event',
      noTradeoffs: 'Tried to do everything → resource exhaustion',
    },
    'artifact-stakeholder-comms': {
      vagueCommunication: 'Stakeholder mistrust → approval blocked',
      avoidancePattern: 'Some stakeholders become adversaries',
    },
  },
};

// ============================================================================
// PHASE 8: ENHANCED STAKEHOLDER SYSTEM
// ============================================================================

export interface StakeholderDetail {
  id: string;
  name: string;
  role: string;
  
  // Hidden agendas
  hiddenAgenda: {
    whatTheySay: string;
    whatTheyWant: string;
    whatTheyFear: string;
  };
  
  // Constraints
  constraints: {
    riskTolerance: 'low' | 'medium' | 'high';
    budgetAuthority: number;
    vetoPower: boolean;
    escalationPath: string[];
  };
  
  // Dynamic behavior
  dynamic: {
    trustEvolution: { start: number; changePerAction: number };
    conflictTracking: string[];
    allianceFormation: string[];
  };
  
  // Interaction channels
  channels: {
    email: { style: string; responseTime: string };
    slack: { style: string; responseTime: string };
    meetings: { frequency: string; prepRequired: boolean };
    board: { involvement: boolean; influence: number };
  };
}

export const pm01StakeholderSystem: StakeholderDetail[] = [
  {
    id: 'ceo', name: 'Marcus Johnson', role: 'CEO',
    hiddenAgenda: {
      whatTheySay: 'We need 40% growth for Series C',
      whatTheyWant: 'Prove growth story to secure next round',
      whatTheyFear: 'Being fired by board if growth doesnt recover',
    },
    constraints: {
      riskTolerance: 'high', budgetAuthority: 200000, vetoPower: true,
      escalationPath: ['board'],
    },
    dynamic: {
      trustEvolution: { start: 40, changePerAction: 3 },
      conflictTracking: ['cfo'], // CFO conflicts with growth focus
      allianceFormation: ['vp_sales'],
    },
    channels: {
      email: { style: 'direct, brief', responseTime: 'same_day' },
      slack: { style: 'occasional', responseTime: 'hours' },
      meetings: { frequency: 'weekly', prepRequired: true },
      board: { involvement: true, influence: 10 },
    },
  },
  {
    id: 'cfo', name: 'Diana Chen', role: 'CFO',
    hiddenAgenda: {
      whatTheySay: 'Focus on profitability and runway',
      whatTheyWant: '18+ months runway, path to profitability',
      whatTheyFear: 'Running out of cash before next round',
    },
    constraints: {
      riskTolerance: 'low', budgetAuthority: 100000, vetoPower: true,
      escalationPath: ['ceo', 'board'],
    },
    dynamic: {
      trustEvolution: { start: 50, changePerAction: 2 },
      conflictTracking: ['ceo', 'vp_sales'],
      allianceFormation: ['cto'],
    },
    channels: {
      email: { style: 'formal, detailed', responseTime: '1-2_days' },
      slack: { style: 'rare', responseTime: 'days' },
      meetings: { frequency: 'bi-weekly', prepRequired: true },
      board: { involvement: true, influence: 9 },
    },
  },
  {
    id: 'vp_sales', name: 'Tom Rodriguez', role: 'VP Sales',
    hiddenAgenda: {
      whatTheySay: 'We need more features to close deals',
      whatTheyWant: 'Blame product for missed quotas, protect job',
      whatTheyFear: 'Being replaced if sales dont improve',
    },
    constraints: {
      riskTolerance: 'medium', budgetAuthority: 0, vetoPower: false,
      escalationPath: ['ceo'],
    },
    dynamic: {
      trustEvolution: { start: 35, changePerAction: 4 },
      conflictTracking: ['cfo', 'cto'],
      allianceFormation: ['ceo'],
    },
    channels: {
      email: { style: 'urgent, persuasive', responseTime: 'same_day' },
      slack: { style: 'frequent', responseTime: 'minutes' },
      meetings: { frequency: 'weekly', prepRequired: false },
      board: { involvement: false, influence: 6 },
    },
  },
  {
    id: 'vp_cs', name: 'Rachel Kim', role: 'VP Customer Success',
    hiddenAgenda: {
      whatTheySay: 'We need better onboarding and playbooks',
      whatTheyWant: 'Reduce team workload, improve customer outcomes',
      whatTheyFear: 'Team burnout, churn blame',
    },
    constraints: {
      riskTolerance: 'low', budgetAuthority: 25000, vetoPower: false,
      escalationPath: ['cpo'],
    },
    dynamic: {
      trustEvolution: { start: 45, changePerAction: 3 },
      conflictTracking: [],
      allianceFormation: ['cto'],
    },
    channels: {
      email: { style: 'collaborative', responseTime: 'same_day' },
      slack: { style: 'active', responseTime: 'hours' },
      meetings: { frequency: 'weekly', prepRequired: false },
      board: { involvement: false, influence: 5 },
    },
  },
  {
    id: 'cto', name: 'James Park', role: 'CTO',
    hiddenAgenda: {
      whatTheySay: 'We need to pay down technical debt',
      whatTheyWant: 'Protect engineering morale, platform stability',
      whatTheyFear: 'System collapse, engineering exodus',
    },
    constraints: {
      riskTolerance: 'low', budgetAuthority: 50000, vetoPower: false,
      escalationPath: ['ceo'],
    },
    dynamic: {
      trustEvolution: { start: 55, changePerAction: 2 },
      conflictTracking: ['vp_sales'],
      allianceFormation: ['cfo', 'vp_cs'],
    },
    channels: {
      email: { style: 'analytical', responseTime: '1_day' },
      slack: { style: 'technical', responseTime: 'hours' },
      meetings: { frequency: 'weekly', prepRequired: true },
      board: { involvement: false, influence: 7 },
    },
  },
];

// ============================================================================
// RE-EXPORT WITH ALL SYSTEMS
// ============================================================================

export const pm01Scenario: Scenario = {
  id: PM_01_ID, name: 'The Growth Stall - Breaking Through the Plateau',
  description: 'A Series B SaaS company has hit a growth plateau. You are the Senior PM tasked with identifying the root cause and proposing a solution before the board meeting in 8 weeks.',
  industry: 'B2B SaaS', difficulty: 'advanced', durationWeeks: 12, teamSize: 12, budget: 150000,
  learningObjectives: ['Diagnose ambiguous problems', 'Prioritize root cause analysis', 'Balance short-term vs long-term', 'Manage stakeholder interests', 'Present to board'],
  skillsAssessed: ['Causal reasoning', 'Prioritization', 'Stakeholder alignment', 'Data synthesis', 'Strategic thinking'],
  initialState: pm01InitialState, phases: pm01Phases, actions: pm01Actions, timelineEvents: pm01TimelineEvents, stakeholders: pm01Stakeholders,
};

export default pm01Scenario;

// ============================================================================
// PHASE 9: EVENT & CRISIS SYSTEM
// ============================================================================

export interface SimulationEvent {
  id: string;
  name: string;
  type: 'data_inconsistency' | 'stakeholder_conflict' | 'market_shift' | 'competitor_move' | 'regulatory_change' | 'technical_outage';
  triggerType: 'time' | 'decision' | 'artifact';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  phaseTrigger: number;
  description: string;
  impact: {
    metrics: Record<string, number>;
    stakeholderTrust: Record<string, number>;
    budget: number;
    progress: number;
  };
  notificationStyle: 'immediate' | 'delayed' | 'ambiguous';
  escalationPotential: boolean;
  resolvedBy?: string[];
}

export const pm01EventSystem: SimulationEvent[] = [
  // Time-based events
  { id: 'evt-1', name: 'Board Member Queries Growth', type: 'stakeholder_conflict', triggerType: 'time', severity: 'minor', phaseTrigger: 2, description: 'A board member emails CEO questioning growth metrics', impact: { metrics: {}, stakeholderTrust: { ceo: -5 }, budget: 0, progress: 0 }, notificationStyle: 'immediate', escalationPotential: true, resolvedBy: ['stakeholder_comms'] },
  { id: 'evt-2', name: 'Competitor Launches Feature', type: 'competitor_move', triggerType: 'time', severity: 'moderate', phaseTrigger: 4, description: 'Competitor B launches mid-market feature at 50% price', impact: { metrics: { winRate: -10 }, stakeholderTrust: { vp_sales: -5 }, budget: 0, progress: -5 }, notificationStyle: 'immediate', escalationPotential: true, resolvedBy: ['strategy_memo'] },
  { id: 'evt-3', name: 'Quarterly Review Deadline', type: 'stakeholder_conflict', triggerType: 'time', severity: 'moderate', phaseTrigger: 6, description: 'CFO requests detailed budget review before next quarter', impact: { metrics: {}, stakeholderTrust: { cfo: -5 }, budget: 0, progress: 0 }, notificationStyle: 'delayed', escalationPotential: false, resolvedBy: ['budget_allocation'] },
  { id: 'evt-4', name: 'Technical Debt Crisis', type: 'technical_outage', triggerType: 'time', severity: 'major', phaseTrigger: 7, description: 'Platform experiences 2-hour outage during peak usage', impact: { metrics: { nps: -15 }, stakeholderTrust: { cto: -10 }, budget: -25000, progress: -10 }, notificationStyle: 'immediate', escalationPotential: true, resolvedBy: ['technical_fix'] },
  
  // Decision-based events
  { id: 'evt-5', name: 'Enterprise Deal Distraction', type: 'market_shift', triggerType: 'decision', severity: 'moderate', phaseTrigger: 4, description: '$2M enterprise opportunity appears - can derail mid-market focus', impact: { metrics: { arr: 20 }, stakeholderTrust: {}, budget: -50000, progress: 0 }, notificationStyle: 'immediate', escalationPotential: false, resolvedBy: ['strategic_choice'] },
  { id: 'evt-6', name: 'Ignored Risk Materializes', type: 'stakeholder_conflict', triggerType: 'artifact', severity: 'major', phaseTrigger: 6, description: 'Risk you did not document in strategy memo actually occurs', impact: { metrics: { churn: 10 }, stakeholderTrust: { cfo: -15 }, budget: -30000, progress: -15 }, notificationStyle: 'delayed', escalationPotential: true, resolvedBy: ['crisis_response'] },
  { id: 'evt-7', name: 'Budget Mismanagement', type: 'data_inconsistency', triggerType: 'decision', severity: 'critical', phaseTrigger: 6, description: 'Overspent in early phases leaves no budget for execution', impact: { metrics: {}, stakeholderTrust: { cfo: -20 }, budget: -100000, progress: -20 }, notificationStyle: 'delayed', escalationPotential: true },
  { id: 'evt-8', name: 'Stakeholder Blocked', type: 'stakeholder_conflict', triggerType: 'decision', severity: 'major', phaseTrigger: 7, description: 'Key stakeholder you avoided now blocks your proposal', impact: { metrics: {}, stakeholderTrust: {}, budget: 0, progress: -25 }, notificationStyle: 'immediate', escalationPotential: true, resolvedBy: ['stakeholder_alignment'] },
  
  // Artifact-based events
  { id: 'evt-9', name: 'Analysis Quality Questioned', type: 'data_inconsistency', triggerType: 'artifact', severity: 'moderate', phaseTrigger: 5, description: 'Your churn analysis is found to have sample size issues', impact: { metrics: {}, stakeholderTrust: { ceo: -10 }, budget: 0, progress: -5 }, notificationStyle: 'ambiguous', escalationPotential: false, resolvedBy: ['reanalysis'] },
  { id: 'evt-10', name: 'Weak Strategy Memo', type: 'stakeholder_conflict', triggerType: 'artifact', severity: 'major', phaseTrigger: 6, description: 'Strategy memo lacks tradeoffs - CEO loses confidence', impact: { metrics: {}, stakeholderTrust: { ceo: -15 }, budget: 0, progress: -10 }, notificationStyle: 'delayed', escalationPotential: true },
  { id: 'evt-11', name: 'Vague Communication Backfires', type: 'stakeholder_conflict', triggerType: 'artifact', severity: 'minor', phaseTrigger: 5, description: 'Stakeholders frustrated by vague email language', impact: { metrics: {}, stakeholderTrust: { cfo: -5, vp_sales: -5 }, budget: 0, progress: 0 }, notificationStyle: 'ambiguous', escalationPotential: false },
  { id: 'evt-12', name: 'Data Reveals Hidden Pattern', type: 'data_inconsistency', triggerType: 'time', severity: 'minor', phaseTrigger: 3, description: 'New data available - reveals time-to-value is key signal', impact: { metrics: {}, stakeholderTrust: {}, budget: 0, progress: 5 }, notificationStyle: 'ambiguous', escalationPotential: false },
];

// Crisis Escalation Rules
export const pm01CrisisEscalation = {
  minorToModerate: { trigger: '2+ unresolved minor events', effect: 'Moderate event triggered', probability: 0.6 },
  moderateToMajor: { trigger: '1 moderate + 1 minor unresolved', effect: 'Major crisis triggered', probability: 0.5 },
  compoundCrisis: { trigger: '3+ events in same phase', effect: 'Critical crisis triggered', probability: 0.8 },
  stakeholderEscalation: { trigger: 'Stakeholder trust < 30', effect: 'Auto-triggers blocking action', probability: 1.0 },
};

// ============================================================================
// PHASE 10: TIME & PRESSURE SYSTEM
// ============================================================================

export const pm01TimePressureSystem = {
  totalDuration: { weeks: 9, realTimeMinutes: 45 },
  
  countdownMechanics: {
    boardMeetingDeadline: { week: 9, hardDeadline: true, warningAt: 7 },
    phaseDeadlines: [
      { phase: 1, week: 1, soft: true },
      { phase: 2, week: 2, soft: true },
      { phase: 3, week: 4, soft: false },
      { phase: 4, week: 5, soft: false },
      { phase: 5, week: 6, soft: false },
      { phase: 6, week: 7, soft: false },
      { phase: 7, week: 8, soft: false },
      { phase: 8, week: 9, hardDeadline: true },
    ],
    timeDecay: { effect: 'Each week of delay reduces solution effectiveness by 5%' },
  },
  
  actionLimits: {
    maxDecisionsPerPhase: 3,
    maxArtifactsPerPhase: 2,
    mandatoryPrioritization: 'Cannot take all actions - must choose',
    tradeoffEnforcement: 'Choosing X prevents Y (see pm01DecisionSystem.tradeoffs)',
  },
  
  informationUnlocks: {
    phase2: ['Hidden stakeholder concerns', 'Unrevealed data hints'],
    phase4: ['Competitive intelligence', 'Customer interview deep-dives'],
    phase6: ['Financial projections', 'Board member priorities'],
    phase8: ['Final stakeholder positions', 'Market forecast'],
  },
  
  userFeedback: {
    timerWarnings: ['Week 6: 3 weeks until board meeting', 'Week 8: 1 week remaining'],
    pendingAlerts: ['Unanswered stakeholder concerns', 'Artifacts still required'],
    softVsHard: { soft: 'Flexible but affects trust', hard: 'Cannot proceed without' },
  },
};

// ============================================================================
// PHASE 11: METRICS & SIMULATION ENGINE
// ============================================================================

export interface MetricDefinition {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  driver: string;
  weight: number;
}

export const pm01MetricsSystem: Record<string, MetricDefinition> = {
  arr: { id: 'arr', name: 'Annual Recurring Revenue', currentValue: 8.2, targetValue: 9.8, unit: '$M', driver: 'root_cause_resolution', weight: 0.25 },
  monthlyChurn: { id: 'monthlyChurn', name: 'Monthly Churn Rate', currentValue: 5.2, targetValue: 3.0, unit: '%', driver: 'implementation_gap', weight: 0.20 },
  nrr: { id: 'nrr', name: 'Net Revenue Retention', currentValue: 105, targetValue: 120, unit: '%', driver: 'customer_value', weight: 0.15 },
  nps: { id: 'nps', name: 'Net Promoter Score', currentValue: 42, targetValue: 50, unit: 'points', driver: 'satisfaction', weight: 0.10 },
  timeToValue: { id: 'timeToValue', name: 'Time to Value', currentValue: 45, targetValue: 25, unit: 'days', driver: 'implementation_gap', weight: 0.15 },
  winRate: { id: 'winRate', name: 'Sales Win Rate', currentValue: 28, targetValue: 40, unit: '%', driver: 'competitive_position', weight: 0.10 },
  teamMorale: { id: 'teamMorale', name: 'Team Morale', currentValue: 65, targetValue: 75, unit: '%', driver: 'leadership', weight: 0.05 },
};

export const pm01SimulationEngine = {
  // Metric evolution over time
  metricEvolution: {
    linear: ['arr', 'nrr'],
    exponential: ['churn (if unchecked)'],
    threshold: ['stakeholder_trust (triggers blocks at <30)'],
  },
  
  // Non-linear effects
  nonLinear: {
    compounding: { earlyPoorDecisions: 'Multiply negative effects by 2.5x later' },
    momentum: { goodProgress: 'Each phase of success compounds (+5% per phase)' },
    collapse: { trustBelow30: 'Auto-fails stakeholder alignment' },
  },
  
  // Tradeoffs between metrics
  tradeoffs: [
    { focus: 'speed', affects: 'quality', direction: 'inverse' },
    { focus: 'growth', affects: 'profitability', direction: 'inverse' },
    { focus: 'features', affects: 'stability', direction: 'inverse' },
    { focus: 'enterprise', affects: 'mid_market_focus', direction: 'inverse' },
  ],
  
  // Ground truth linkage
  groundTruthImpact: {
    'rc-1': { metrics: ['timeToValue', 'monthlyChurn', 'nrr'], strength: 0.85 },
    'rc-2': { metrics: ['winRate', 'arr'], strength: 0.60 },
    'rc-3': { metrics: ['monthlyChurn', 'winRate'], strength: 0.50 },
    'rc-4': { metrics: ['winRate', 'arr'], strength: 0.40 },
    'rc-5': { metrics: ['monthlyChurn', 'nrr'], strength: 0.30 },
  },
  
  // Decision impact mapping
  decisionImpact: {
    'prioritize-rc1': { metrics: { timeToValue: -5, monthlyChurn: -1 }, phaseDelay: 3 },
    'prioritize-rc2': { metrics: { winRate: +5 }, phaseDelay: 2 },
    'budget-research': { metrics: { progress: +10 }, cost: 50000 },
    'enterprise-yes': { metrics: { arr: +20 }, risk: 'mid_market_neglect' },
  },
};

// ============================================================================
// PHASE 12: EVALUATION SYSTEM
// ============================================================================

export interface ScoringDimension {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  evaluationCriteria: string[];
}

export const pm01EvaluationSystem = {
  scoringDimensions: [
    { id: 'strategic_thinking', name: 'Strategic Thinking', weight: 0.20, maxScore: 100, evaluationCriteria: ['Root cause accuracy', 'Solution appropriateness', 'Long-term vs short-term balance'] },
    { id: 'analytical_depth', name: 'Analytical Depth', weight: 0.20, maxScore: 100, evaluationCriteria: ['Evidence quality', 'Data segmentation', 'Statistical validity'] },
    { id: 'execution_quality', name: 'Execution Quality', weight: 0.15, maxScore: 100, evaluationCriteria: ['Roadmap feasibility', 'Timeline realism', 'Resource allocation'] },
    { id: 'stakeholder_mgmt', name: 'Stakeholder Management', weight: 0.15, maxScore: 100, evaluationCriteria: ['Trust maintenance', 'Communication quality', 'Alignment achieved'] },
    { id: 'decision_quality', name: 'Decision Quality', weight: 0.15, maxScore: 100, evaluationCriteria: ['Tradeoff acknowledgment', 'Evidence-based choices', 'Consistency'] },
    { id: 'calibration', name: 'Calibration', weight: 0.15, maxScore: 100, evaluationCriteria: ['Confidence matches evidence', 'Acknowledged uncertainties', 'Updated beliefs with new data'] },
  ] as ScoringDimension[],
  
  // Failure conditions
  failureConditions: [
    { id: 'stakeholder_veto', condition: 'Any key stakeholder trust < 20', outcome: 'Auto-fail: Cannot proceed to board' },
    { id: 'budget_exhausted', condition: 'Budget drops below $10K before phase 7', outcome: 'Auto-fail: Cannot execute solution' },
    { id: 'metric_collapse', condition: 'Any core metric drops below 50% of target', outcome: 'Severe penalty + recovery required' },
    { id: 'deadline_missed', condition: 'Phase 8 deadline missed', outcome: 'Board presentation delayed or fails' },
    { id: 'overextension', condition: 'Trying to do >3 major initiatives', outcome: 'Resource exhaustion + quality collapse' },
  ],
  
  // Input sources for evaluation
  evaluationInputs: {
    artifacts: ['Quality scores from pm01ArtifactSystem', 'Consequence rule triggers'],
    decisions: ['Decision quality from pm01DecisionSystem', 'Tradeoff acknowledgment'],
    interactions: ['Stakeholder trust evolution', 'Communication pattern analysis'],
    consistency: ['Claim tracking from pm01ThinkingSystem', 'Cross-phase coherence'],
  },
  
  // Score calculation
  calculateScore: (dimensionScores: Record<string, number>) => {
    let total = 0;
    pm01EvaluationSystem.scoringDimensions.forEach(dim => {
      total += dimensionScores[dim.id] * dim.weight;
    });
    return Math.round(total);
  },
  
  getGrade: (score: number): string => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'Proficient';
    if (score >= 60) return 'Developing';
    if (score >= 50) return 'Marginal';
    return 'Below Expectations';
  },
};

// ============================================================================
// PHASE 13: NARRATIVE FEEDBACK SYSTEM
// ============================================================================

export interface ExecutiveFeedback {
  stakeholderId: string;
  style: 'praise' | 'critique' | 'neutral' | 'urgent';
  message: string;
  references: string[]; // artifacts, decisions
  suggestions?: string[];
}

export const pm01NarrativeSystem = {
  // Executive reviews
  executiveReviews: {
    ceo: (phase: number, score: number): ExecutiveFeedback => ({
      stakeholderId: 'ceo',
      style: score > 70 ? 'praise' : score > 50 ? 'neutral' : 'urgent',
      message: score > 70 ? 'Your analysis is compelling. Lets get board ready.' : score > 50 ? 'I need more confidence in your recommendation.' : 'Were running out of time. What exactly is the plan?',
      references: ['artifact-strategy-memo', 'artifact-board-deck'],
    }),
    cfo: (phase: number, budgetUsed: number): ExecutiveFeedback => ({
      stakeholderId: 'cfo',
      style: budgetUsed < 100000 ? 'praise' : budgetUsed < 130000 ? 'neutral' : 'urgent',
      message: budgetUsed < 100000 ? 'Disciplined budget management.' : budgetUsed < 130000 ? 'Budget is tight. Ensure ROI.' : 'Youve used most of the budget. Explain your allocation.',
      references: ['budget_allocation'],
    }),
    vp_sales: (phase: number, winRateChange: number): ExecutiveFeedback => ({
      stakeholderId: 'vp_sales',
      style: winRateChange > 0 ? 'praise' : winRateChange === 0 ? 'neutral' : 'urgent',
      message: winRateChange > 0 ? 'The product improvements are helping close deals.' : winRateChange === 0 ? 'We still need more to win.' : 'Were losing too many deals. What happened?',
      references: ['winRate'],
    }),
  },
  
  // Narrative callbacks
  narrativeCallbacks: [
    { trigger: 'phase_4', template: 'Your Phase 2 hypothesis about {hypothesis} was never fully validated. This is affecting your confidence now.' },
    { trigger: 'phase_6', template: 'You chose to skip {skipped_action} in Phase 3, which led to {consequence}.' },
    { trigger: 'phase_8', template: 'Despite claiming {claimed_strategy} in your strategy memo, your roadmap shows {actual_focus}.' },
  ],
  
  // Personalized critique
  personalizedCritique: {
    repeatedMistakes: ['If user ignores stakeholder 3x → "You consistently avoid engaging with..."'],
    strengthReinforcement: ['If user excels in analysis → "Your analytical rigor is exceptional..."'],
    weaknessIdentification: ['If user has low calibration → "Your confidence seems misaligned with evidence..."'],
  },
  
  // Coaching insights
  coachingInsights: [
    { condition: 'low_evidence', advice: 'Your claims need more supporting data. Consider deeper analysis before proceeding.' },
    { condition: 'stakeholder_avoidance', advice: 'Engaging earlier with {stakeholder} would have prevented their current resistance.' },
    { condition: 'overextension', advice: 'Focus on fewer initiatives with more depth. Quality beats quantity here.' },
    { condition: 'good_progress', advice: 'Strong work. Maintain this trajectory and ensure stakeholder alignment before board.' },
  ],
  
  // Feedback timing
  feedbackTiming: {
    immediate: ['Major decisions', 'Stakeholder interactions', 'Crisis events'],
    delayed: ['Artifact quality assessment', 'Consistency evaluation', 'Phase transitions'],
    phaseEnd: ['Executive reviews', 'Score updates', 'Coaching recommendations'],
  },
};

// ============================================================================
// PHASE 14: USER EXPERIENCE FLOW
// ============================================================================

export const pm01UserExperienceFlow = {
  // Dashboard components
  dashboard: {
    realtimeKPIs: {
      displayMetrics: ['arr', 'monthlyChurn', 'nps', 'timeToValue', 'winRate'],
      refreshRate: 'on_every_action',
      showTrends: true,
      benchmarkComparison: 'vs target values',
    },
    phaseProgress: {
      currentPhase: true,
      progressBar: true,
      timeRemaining: true,
      qualityThresholds: true,
    },
    alerts: {
      pendingDecisions: 'highlighted with urgency',
      deadlineWarnings: 'at 1 week and 1 day remaining',
      stakeholderRequests: 'priority queue',
    },
  },
  
  // Notification system
  notifications: {
    channels: {
      email: { enabled: true, delay: 'immediate', style: 'realistic_inbox' },
      slack: { enabled: true, delay: 'phased', style: 'casual_channel' },
      inApp: { enabled: true, delay: 'instant', style: 'toast_alerts' },
    },
    eventDriven: ['New crisis event', 'Stakeholder request', 'Metric threshold breach'],
    scheduled: ['Daily digest', 'Phase transition reminder', 'Weekly summary'],
    stakeholderMessages: {
      ceo: { frequency: 'weekly', urgency: 'high' },
      cfo: { frequency: 'bi-weekly', urgency: 'medium' },
      vp_sales: { frequency: 'daily', urgency: 'medium' },
      vp_cs: { frequency: 'weekly', urgency: 'medium' },
      cto: { frequency: 'weekly', urgency: 'low' },
    },
  },
  
  // Task progression
  taskProgression: {
    activeTasks: {
      displayFormat: 'card_list',
      showDependencies: true,
      showDeadlines: true,
      completionIndicators: ['pending', 'in_progress', 'blocked', 'completed'],
    },
    visualIndicators: {
      onTrack: 'green_checkmark',
      atRisk: 'yellow_warning',
      delayed: 'red_alert',
      success: 'blue_banner',
    },
  },
  
  // Artifact submission checkpoints
  artifactCheckpoints: {
    reminders: {
      beforePhaseEnd: '24 hours warning',
      missingRequired: 'immediate_alert',
      nearDeadline: 'soft_warning',
    },
    validation: {
      requiredSections: 'auto_check',
      depthRequirements: 'prompt_for_justification',
      evidenceLinking: 'require_data_citations',
    },
    feedback: {
      onSubmit: 'immediate_acknowledgment',
      afterReview: 'detailed_quality_assessment',
      revisions: 'specific_improvement_requests',
    },
  },
  
  // Stakeholder interruptions
  stakeholderInterruptions: {
    randomMeetings: {
      trigger: 'random_event',
      frequency: '1-2 per phase',
      duration: '15-30 minutes',
      impact: 'pauses user action',
    },
    updateRequests: {
      ceo: { frequency: 'after major decision', urgency: 'high' },
      cfo: { frequency: 'budget changes', urgency: 'medium' },
      vp_sales: { frequency: 'weekly', urgency: 'low' },
    },
    feedbackImpact: {
      positive: 'trust_increase + progress_boost',
      negative: 'trust_decrease + additional_tasks',
      neutral: 'no_direct_impact',
    },
  },
};

// ============================================================================
// PHASE 15: COMPLETION & OUTCOMES
// ============================================================================

export type EndingState = 'successful_turnaround' | 'partial_recovery' | 'failure_collapse';

export const pm01CompletionSystem = {
  // Ending states with conditions
  endingStates: {
    successful_turnaround: {
      condition: 'Score >= 75 AND stakeholder_trust >= 70 AND metrics_improved',
      description: 'Company returns to growth trajectory',
      metrics: { arrGrowth: '>=20%', churnReduction: '>=30%', trustLevel: '>=70' },
    },
    partial_recovery: {
      condition: 'Score >= 50 AND stakeholder_trust >= 50 AND some_metrics_improved',
      description: 'Company stabilizes but challenges remain',
      metrics: { arrGrowth: '5-20%', churnReduction: '10-30%', trustLevel: '50-70' },
    },
    failure_collapse: {
      condition: 'Score < 50 OR stakeholder_trust < 30 OR critical_metric_collapse',
      description: 'Company fails to recover, leadership changes',
      metrics: { arrGrowth: '<5%', churnReduction: '<10%', trustLevel: '<50' },
    },
  },
  
  // Performance summary
  performanceSummary: {
    finalMetrics: {
      comparison: 'vs baseline AND vs target',
      highlight: 'biggest_improvements AND biggest_declines',
    },
    stakeholderTrust: {
      byStakeholder: true,
      overallAverage: true,
      criticalStakeholders: ['ceo', 'cfo'],
    },
    decisionImpact: {
      totalDecisions: true,
      goodDecisions: true,
      poorDecisions: true,
      missedOpportunities: true,
    },
    artifactQuality: {
      byType: true,
      overallScore: true,
      strengths: true,
      weaknesses: true,
    },
  },
  
  // Certification logic
  certification: {
    passThreshold: 60,
    skillGrading: {
      analytical: { dimension: 'analytical_depth', weight: 0.25 },
      strategic: { dimension: 'strategic_thinking', weight: 0.25 },
      execution: { dimension: 'execution_quality', weight: 0.20 },
      stakeholder: { dimension: 'stakeholder_mgmt', weight: 0.15 },
      decision: { dimension: 'decision_quality', weight: 0.15 },
    },
    feedbackReport: {
      strengths: 'top_3_scoring_areas',
      weaknesses: 'bottom_3_scoring_areas',
      recommendations: 'specific_improvement_actions',
      coaching: 'personalized_learning_path',
    },
  },
};

// ============================================================================
// PHASE 16: ANTI-LOOPHOLE SAFEGUARDS
// ============================================================================

export const pm01AntiLoopholeSafeguards = {
  // Artifact validation
  artifactValidation: {
    structureOnlyCheck: {
      enabled: true,
      penalty: 'rejection + trust -5',
      reason: 'Cannot pass on formatting alone',
    },
    depthRequirements: {
      enforcement: 'require_justification_for_claims',
      evidenceThreshold: 'minimum_2_supporting_data_points',
    },
    coherenceCheck: {
      crossArtifact: 'validate_consistency_between_artifacts',
      selfContradiction: 'flag_contradictory_statements',
    },
  },
  
  // Cross-phase consistency
  crossPhaseConsistency: {
    decisionProgression: {
      require: 'logical_justification_for_major_pivots',
      penalty: 'if_unexplained: trust -10 + score_penalty',
    },
    contradictionDetection: {
      track: 'claims across phases',
      action: 'demand_explanation_or_reject',
    },
    revisitingPriorChoices: {
      allowed: true,
      condition: 'must_explain_reason_for_change',
      penalty: 'if_no_justification: credibility -15',
    },
  },
  
  // Tradeoff enforcement
  tradeoffEnforcement: {
    mandatoryEvaluation: {
      check: 'before_any_priority_decision',
      require: 'acknowledge_what_is_being_sacrificed',
    },
    resourceConstraints: {
      hardLimit: 'cannot_exceed_budget',
      softLimit: 'warning_at_80%_budget_used',
    },
    opportunityCost: {
      display: 'show_what_is_forgone_with_each_choice',
      penalty: 'if_ignored: score_penalty',
    },
  },
  
  // Metric & stakeholder checks
  metricChecks: {
    vanityMetricRejection: {
      rule: 'must_tie_to_business_outcomes',
      examples: ['page_views_alone_not_enough', 'must_show_revenue_impact'],
    },
    overconfidencePenalty: {
      detection: 'high_confidence_weak_evidence',
      penalty: 'calibration_score_reduction',
    },
    stakeholderContradiction: {
      tracking: 'what_you_told_each_stakeholder',
      penalty: 'if_contradictory: trust_all_stakeholders -10',
    },
  },
  
  // Game integrity
  gameIntegrity: {
    eventTimingExploit: {
      prevention: 'randomize_event_triggers_within_range',
      penalty: 'if_pattern_detected: add_additional_challenges',
    },
    memorizationPrevention: {
      approach: 'procedural_generation_of_specifics',
      rule: 'core_scenario_same_but_details_vary',
    },
    genuineProblemSolving: {
      require: 'show_reasoning_in_artifacts',
      reject: 'keyword_stuffing_or_template_responses',
    },
  },
};