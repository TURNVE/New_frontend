import type { Scenario, Phase, TimelineEvent, StakeholderConfig } from '../../core/SimulationEngine';
import { webDev01GroundTruth, webDev01InitialState, webDev01PhaseDetails } from './web-dev-01-ground-truth';
import { webDev01Artifacts } from './web-dev-01-artifacts';
import webDev01Actions from './web-dev-01-actions';

// ============================================================================
// WEB-DEV-01: CHECKOUT PERFORMANCE UNDER FIRE
// Complete scenario for Shopify Plus E-commerce Checkout Optimization
// ============================================================================

export const WEB_DEV_01_ID = 'web-dev-01';

// Convert phase details to Phase format for SimulationEngine
export const webDev01Phases: Phase[] = webDev01PhaseDetails.map(phase => ({
  id: phase.id,
  name: phase.name,
  description: phase.objective,
  duration: 1, // Each phase is roughly 1 week
  objectives: phase.requiredArtifacts,
  availableActions: phase.availableActions,
  successCriteria: {
    minProgress: phase.qualityThresholds.minProgress,
    maxRisk: phase.qualityThresholds.maxRisk / 100, // Convert from 0-100 to 0-1
    minTrust: phase.qualityThresholds.minTrust,
  },
}));

// Stakeholders for the scenario
export const webDev01Stakeholders: StakeholderConfig[] = [
  {
    id: 'cto',
    name: 'Sarah Chen',
    role: 'CTO',
    department: 'Engineering',
    influence: 10,
    initialSatisfaction: 70,
    communicationStyle: 'direct',
    concerns: ['system_reliability', 'timeline', 'technical_debt'],
    priorities: ['black_friday_success', 'zero_downtime'],
    relationships: [],
  },
  {
    id: 'cfo',
    name: 'Diana Rodriguez',
    role: 'CFO',
    department: 'Finance',
    influence: 9,
    initialSatisfaction: 65,
    communicationStyle: 'formal',
    concerns: ['budget_adherence', 'roi'],
    priorities: ['stay_within_budget', 'prove_roi'],
    relationships: [],
  },
  {
    id: 'product',
    name: 'Mike Johnson',
    role: 'VP Product',
    department: 'Product',
    influence: 8,
    initialSatisfaction: 60,
    communicationStyle: 'casual',
    concerns: ['roadmap_impact', 'feature_parity'],
    priorities: ['minimize_delays', 'ship_features'],
    relationships: [],
  },
  {
    id: 'devops',
    name: 'Alex Kim',
    role: 'DevOps Lead',
    department: 'Infrastructure',
    influence: 7,
    initialSatisfaction: 55,
    communicationStyle: 'direct',
    concerns: ['infrastructure_stability', 'rollback_capability'],
    priorities: ['reliability', 'easy_rollback'],
    relationships: [],
  },
];

// Timeline events that occur during simulation
export const webDev01TimelineEvents: TimelineEvent[] = [
  {
    week: 2,
    type: 'milestone',
    title: 'CTO Review',
    description: 'CTO wants to see your diagnosis and proposed approach',
    impact: {
      stakeholderTrust: 5,
    },
    triggered: false,
  },
  {
    week: 3,
    type: 'opportunity',
    title: 'Redis Cluster Available',
    description: 'DevOps confirms Redis cluster has 8GB available - ready for caching implementation',
    impact: {
      customMetrics: { redis_available: 1 },
    },
    triggered: false,
  },
  {
    week: 4,
    type: 'milestone',
    title: 'Implementation Complete',
    description: 'Code should be ready for testing',
    impact: {
      progress: 10,
    },
    triggered: false,
  },
  {
    week: 5,
    type: 'opportunity',
    title: 'Load Test Results',
    description: 'Performance test results are in - analyze them carefully',
    impact: {
      customMetrics: { load_test_complete: 1 },
    },
    triggered: false,
  },
  {
    week: 6,
    type: 'stakeholder_change',
    title: 'CFO Budget Review',
    description: 'CFO asks for budget utilization update and ROI projection',
    impact: {
      stakeholderTrust: -5,
    },
    triggered: false,
  },
  {
    week: 7,
    type: 'milestone',
    title: 'Launch Decision',
    description: 'Final Go/No-Go decision required',
    impact: {
      progress: 15,
    },
    triggered: false,
  },
  {
    week: 8,
    type: 'milestone',
    title: 'Simulation Complete',
    description: 'Results are finalized',
    impact: {},
    triggered: false,
  },
];

// Main scenario object
export const webDev01Scenario: Scenario = {
  id: WEB_DEV_01_ID,
  name: 'Checkout Performance Under Fire',
  description: `Lead the optimization of Shopify Plus checkout microservice for Black Friday. 
  You are a Senior Backend Engineer tasked with reducing checkout latency by 45% and increasing 
  transaction success rate by 5%. Constraints: zero-downtime migration, $85K budget, 
  Node.js/PostgreSQL/Redis/Kubernetes stack only.`,
  industry: 'E-commerce / Technology',
  difficulty: 'advanced',
  durationWeeks: 8,
  teamSize: 3,
  budget: 85,
  learningObjectives: [
    'Diagnose ambiguous performance issues with incomplete data',
    'Make architectural decisions under constraints',
    'Implement production-ready code with proper rollback',
    'Analyze load test results honestly',
    'Communicate technical progress to stakeholders',
    'Make high-stakes launch decisions under uncertainty',
  ],
  skillsAssessed: [
    'Technical diagnosis and root cause analysis',
    'System architecture decision-making',
    'Production engineering (code, testing, rollback)',
    'Data analysis and interpretation',
    'Stakeholder communication',
    'Decision-making under pressure',
  ],
  initialState: webDev01InitialState as any,
  phases: webDev01Phases,
  actions: webDev01Actions,
  timelineEvents: webDev01TimelineEvents,
  stakeholders: webDev01Stakeholders,
};

export default webDev01Scenario;