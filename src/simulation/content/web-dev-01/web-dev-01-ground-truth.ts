import type { GroundTruthState } from '../../evaluation/GroundTruthEngine';

// ============================================================================
// WEB-DEV-01: CHECKOUT PERFORMANCE UNDER FIRE
// Ground Truth - Hidden from user
// ============================================================================

export const WEB_DEV_01_ID = 'web-dev-01';

// ============================================================================
// ROOT CAUSES (Hidden from user - Ground Truth)
// These are the ACTUAL causes of the checkout performance issues
// ============================================================================

export const webDev01RootCauses = {
  'rc-missing-indexes': {
    id: 'rc-missing-indexes',
    name: 'Missing database indexes on frequently queried columns',
    weight: 0.30,
    observableSignals: [
      'EXPLAIN ANALYZE shows sequential scans on transactions table',
      'Query latency spikes during peak hours correlate with high row counts',
      'DB CPU at 85% during peak, mostly waiting on I/O',
    ],
    hiddenSignals: [
      'Only 2 of 12 frequently-used queries have proper indexes',
      'Composite index on (user_id, status) would cover 60% of queries',
      'Partial index for recent orders would reduce scan by 40%',
    ],
  },
  'rc-n-plus-1': {
    id: 'rc-n-plus-1',
    name: 'N+1 query pattern in checkout flow',
    weight: 0.25,
    observableSignals: [
      'Checkout API makes 15+ DB calls per transaction',
      'Each item in cart triggers separate inventory query',
      'Sequential loading of payment methods',
    ],
    hiddenSignals: [
      'Eager loading cart items with inventory would reduce to 3 queries',
      'Payment methods fetched individually instead of batch',
      'Customer object loaded separately for each validation step',
    ],
  },
  'rc-no-caching': {
    id: 'rc-no-caching',
    name: 'No caching layer for frequently accessed data',
    weight: 0.20,
    observableSignals: [
      'Product details queried on every page load',
      'Pricing recalculated for each view even when unchanged',
      'Inventory checks hit DB every time',
    ],
    hiddenSignals: [
      'Product catalog changes rarely (< 1/hour) - perfect for Redis',
      'TTL of 5 minutes on pricing would save 80% of queries',
      'Customer session data already in Redis but not utilized',
    ],
  },
  'rc-connection-pool': {
    id: 'rc-connection-pool',
    name: 'Database connection pool misconfiguration',
    weight: 0.15,
    observableSignals: [
      'Connection pool exhausted at 500 RPS',
      'New connections take 200ms to establish during peak',
      'Pool size fixed at 20, should scale with load',
    ],
    hiddenSignals: [
      'pgBouncer not configured, direct connections only',
      'Idle connections not recycled properly',
      'Connection timeout set too high, blocking requests',
    ],
  },
  'rc-serialization': {
    id: 'rc-serialization',
    name: 'Inefficient JSON serialization in Node.js',
    weight: 0.10,
    observableSignals: [
      'Response serialization takes 15ms per request',
      'Large cart objects cause GC pauses',
    ],
    hiddenSignals: [
      'Using JSON.stringify instead of faster alternatives',
      'No stream-based response for large payloads',
      'Unnecessary nested object creation',
    ],
  },
};

// ============================================================================
// CONSTRAINTS (Fixed - cannot change)
// ============================================================================

export const webDev01Constraints = {
  'zero-downtime': {
    id: 'zero-downtime',
    name: 'Zero-downtime migration required',
    severity: 95,
    description: 'Cannot have any service interruption during Black Friday migration',
    affectedStakeholders: ['cto', 'cfo', 'product'],
    isBlocker: true,
  },
  'backward-compat': {
    id: 'backward-compat',
    name: 'Must maintain full backward compatibility with existing payment APIs',
    severity: 90,
    description: 'Payment gateway integrations cannot change - only internal optimizations allowed',
    affectedStakeholders: ['cto', 'product'],
    isBlocker: true,
  },
  'budget-85k': {
    id: 'budget-85k',
    name: 'Budget: $85K for infrastructure and dev costs',
    severity: 85,
    description: 'Total spend cannot exceed $85K - includes infrastructure, tools, contractor hours',
    affectedStakeholders: ['cfo', 'cto'],
    isBlocker: true,
  },
  'stack-node': {
    id: 'stack-node',
    name: 'Stack: Node.js, PostgreSQL, Redis, Kubernetes only',
    severity: 75,
    description: 'Cannot introduce new technologies outside approved stack',
    affectedStakeholders: ['cto'],
    isBlocker: false,
  },
  'single-major-fix': {
    id: 'single-major-fix',
    name: 'Can only implement ONE major system change due to time constraint',
    severity: 80,
    description: '8 weeks to Black Friday - must prioritize single highest-impact fix',
    affectedStakeholders: ['cto', 'product'],
    isBlocker: true,
  },
};

// ============================================================================
// HIDDEN STATE (Unrevealed data + system vulnerabilities)
// ============================================================================

export const webDev01HiddenState = {
  stakeholderPrivateConcerns: {
    cto: [
      'Wants to prove technical leadership before board review',
      'Concerned about career if Black Friday fails',
      'Prefers "safe" indexing over risky caching implementation',
    ],
    cfo: [
      'Wants to minimize infra spend to preserve runway',
      'Skeptical about Redis costs - wants concrete ROI',
      'Will question any spend over $15K',
    ],
    product: [
      'Pushing for feature freeze so checkout work can proceed',
      'Worried that performance work will delay roadmap',
      'Needs checkout reliability to launch new payment features',
    ],
    devops: [
      'Has been warning about DB performance for months',
      'Prefers caching over indexing (easier to rollback)',
      'Concerned about K8s resource limits during peak',
    ],
  },

  unrevealedData: {
    log_gap: 'APM logs show 15-minute gap during peak - data incomplete',
    cpu_misleading: 'CPU spike is symptom not cause - storage I/O is real bottleneck',
    redis_available: 'Redis cluster already exists with 8GB available - not being used for checkout',
    team_capacity: 'Team of 3 can realistically only complete 2 workstreams, not 3',
    budget_pressure: '$85K must cover: 2 engineers (8 weeks) + infra + contingency',
  },

  systemVulnerabilities: [
    'No circuit breaker on payment API calls - cascade failure risk',
    'No request tracing - cannot correlate checkout failures',
    'No synthetic monitoring for checkout flow',
    'Rollback procedure untested for 6 months',
    'Alert thresholds too high - only fires after failure',
  ],
};

// ============================================================================
// CAUSAL GRAPH (How root causes connect to symptoms)
// ============================================================================

export const webDev01CausalGraph = [
  { from: 'rc-missing-indexes', to: 'query_latency', strength: 0.90 },
  { from: 'rc-missing-indexes', to: 'db_cpu', strength: 0.70 },
  { from: 'rc-n-plus-1', to: 'query_count', strength: 0.85 },
  { from: 'rc-n-plus-1', to: 'connection_usage', strength: 0.60 },
  { from: 'rc-no-caching', to: 'query_redundancy', strength: 0.80 },
  { from: 'rc-no-caching', to: 'api_latency', strength: 0.65 },
  { from: 'rc-connection-pool', to: 'connection_exhaustion', strength: 0.75 },
  { from: 'rc-connection-pool', to: 'failed_requests', strength: 0.50 },
  { from: 'rc-serialization', to: 'api_latency', strength: 0.40 },
  { from: 'rc-serialization', to: 'gc_pauses', strength: 0.60 },
];

// ============================================================================
// FULL GROUND TRUTH STATE
// ============================================================================

export const webDev01GroundTruth: GroundTruthState = {
  rootCauses: webDev01RootCauses,
  constraints: webDev01Constraints,
  causalGraph: webDev01CausalGraph,
  hiddenState: webDev01HiddenState,
};

// ============================================================================
// INITIAL METRICS (What user sees vs reality)
// ============================================================================

export const webDev01InitialMetrics = {
  // What user sees (表面的)
  visible: {
    checkoutLatency: 850, // ms - BAD
    transactionSuccessRate: 96.8, // % - OK
    p99Latency: 2200, // ms - VERY BAD
    dbCpuUtilization: 85, // % - BAD
    errorRateDuringPeak: 3.2, // % - BAD
  },
  
  // Hidden metrics (truth)
  hidden: {
    avgQueriesPerCheckout: 15.3,
    cacheHitRate: 0, // No caching!
    connectionPoolUtilization: 95,
    indexCoverage: 17, // Only 2 of 12 queries indexed
    n1QueryCount: 8, // Number of N+1 patterns
  },

  // Target (what success looks like)
  targets: {
    latencyReduction: 45, // % - From 850ms to ~470ms
    successRateImprovement: 5, // % - From 96.8% to 99.99%+
    p99LatencyTarget: 800, // ms
  },
};

// ============================================================================
// INITIAL STATE (Game starting point)
// ============================================================================

export const webDev01InitialState = {
  week: 1,
  totalWeeks: 8,
  currentPhaseId: 'phase-1',
  phaseProgress: 0,
  progress: 0,
  
  budget: 85,
  initialBudget: 85,
  teamMorale: 70,
  riskLevel: 30, // 0-100 scale in this scenario (not 0-1)
  stakeholderTrust: 65,
  
  company: {
    name: 'Shopify Plus',
    mission: 'Enterprise e-commerce platform',
  },
  
  metrics: {
    checkoutLatency: 850,
    transactionSuccessRate: 96.8,
    p99Latency: 2200,
    dbCpuUtilization: 85,
    errorRateDuringPeak: 3.2,
    queryCount: 15,
    cacheHitRate: 0,
  },
  
  stakeholders: [],
  signals: [],
  decisionsMade: [],
  timeline: new Date(),
  startedAt: new Date(),
  timeLeft: 90 * 60, // 1hr 30mins in seconds
  simulationInstanceId: '',
  triggeredEventIds: [],
};

// ============================================================================
// PHASE STRUCTURE
// ============================================================================

export const webDev01PhaseDetails = [
  {
    id: 'phase-1',
    name: 'Investigation',
    phaseNumber: 1,
    objective: 'Build a defensible diagnosis of the performance issues',
    situationContext: 'You have limited data: partial logs, slow query reports, and one incident summary. Your diagnosis must be specific enough to act on, but you cannot investigate everything.',
    availableActions: ['analyze_logs', 'review_queries', 'check_infrastructure', 'interview_devops'],
    requiredArtifacts: ['artifact-diagnosis'],
    timeConstraints: 'Week 1-2 only. CTO review at end of Week 2.',
    unlockConditions: 'Submit SYSTEM_DIAGNOSIS_REPORT.md with at least 2 hypotheses',
    embeddedTension: 'Time pressure vs depth - you cannot investigate everything, so you must prioritize',
    qualityThresholds: { minProgress: 12, maxRisk: 40, minTrust: 50 },
  },
  {
    id: 'phase-2',
    name: 'Architecture Decision',
    phaseNumber: 2,
    objective: 'Choose ONE major system change to implement',
    situationContext: 'Based on your diagnosis, you must now decide what to fix. But constraints limit you: only ONE major change, must maintain backward compatibility, must stay within budget.',
    availableActions: ['choose_fix_approach', 'estimate_impact', 'present_to_cto'],
    requiredArtifacts: ['artifact-tech-decision'],
    timeConstraints: 'Must decide before leaving Phase 2',
    unlockConditions: 'Submit TECH_DECISION_DOC.md with clear choice',
    embeddedTension: 'Ideal solution vs constraints - you cannot do everything',
    qualityThresholds: { minProgress: 25, maxRisk: 35, minTrust: 55 },
  },
  {
    id: 'phase-3',
    name: 'Implementation',
    phaseNumber: 3,
    objective: 'Implement your chosen solution with proper engineering practices',
    situationContext: 'Time to build. You must write real code/config, document it properly, and ensure it can be rolled back. Speed vs safety tradeoff is in your hands.',
    availableActions: ['implement_fix', 'write_tests', 'document_rollback'],
    requiredArtifacts: ['artifact-code', 'artifact-pr'],
    timeConstraints: 'Implementation must be complete before Phase 4',
    unlockConditions: 'Submit code artifact and PR description',
    embeddedTension: 'Speed vs safety - fast but risky, or thorough but slower',
    qualityThresholds: { minProgress: 45, maxRisk: 35, minTrust: 55 },
  },
  {
    id: 'phase-4',
    name: 'Load Reality',
    phaseNumber: 4,
    objective: 'Run load tests and analyze results',
    situationContext: 'Load test results are in. Some things improved, some did not. You must interpret the data honestly and decide what to do next.',
    availableActions: ['run_load_test', 'analyze_results', 'iterate_or_accept'],
    requiredArtifacts: ['artifact-perf-analysis'],
    timeConstraints: 'Must analyze before Phase 5',
    unlockConditions: 'Submit PERFORMANCE_ANALYSIS.md',
    embeddedTension: 'Reality vs expectations - what if it did not work as well?',
    qualityThresholds: { minProgress: 60, maxRisk: 40, minTrust: 50 },
  },
  {
    id: 'phase-5',
    name: 'Stakeholder Pressure',
    phaseNumber: 5,
    objective: 'Communicate progress and defend your decisions',
    situationContext: 'CTO, CFO, and PM all have questions. Your communication must be clear, honest, and build trust. Vague or defensive responses will hurt you.',
    availableActions: ['update_cto', 'respond_to_cfo', 'align_with_pm'],
    requiredArtifacts: ['artifact-comms'],
    timeConstraints: 'Must communicate before launch decision',
    unlockConditions: 'Submit stakeholder communications',
    embeddedTension: 'Honesty vs optimism - do you oversell or undersell?',
    qualityThresholds: { minProgress: 70, maxRisk: 35, minTrust: 60 },
  },
  {
    id: 'phase-6',
    name: 'Launch Decision',
    phaseNumber: 6,
    objective: 'Decide: ship, delay, or partial rollout',
    situationContext: 'All data is in. You must make the final call. The CEO is watching. Your career depends on this decision.',
    availableActions: ['make_launch_decision', 'prepare_rollback'],
    requiredArtifacts: ['artifact-launch-decision'],
    timeConstraints: 'Final decision point',
    unlockConditions: 'Submit LAUNCH_DECISION.md',
    embeddedTension: 'Risk vs reward - is it good enough to ship?',
    qualityThresholds: { minProgress: 85, maxRisk: 30, minTrust: 65 },
  },
  {
    id: 'phase-7',
    name: 'Outcome',
    phaseNumber: 7,
    objective: 'Review performance and document learnings',
    situationContext: 'Simulation complete. Your decisions and their consequences are now visible.',
    availableActions: ['review_final_results'],
    requiredArtifacts: [],
    timeConstraints: 'End of simulation',
    unlockConditions: 'None - simulation complete',
    embeddedTension: 'None - time to reflect',
    qualityThresholds: { minProgress: 100, maxRisk: 25, minTrust: 70 },
  },
];

// ============================================================================
// SUCCESS CRITERIA
// ============================================================================

export const webDev01SuccessCriteria = {
  // Primary KPIs
  latencyImprovement: { target: 45, weight: 0.30, description: 'Reduce checkout latency by 45%' },
  successRateImprovement: { target: 5, weight: 0.30, description: 'Increase successful transaction rate by 5%' },
  
  // Secondary KPIs  
  teamMorale: { target: 60, weight: 0.15, description: 'Maintain team morale above 60%' },
  budgetAdherence: { target: 85, weight: 0.15, description: 'Stay within $85K budget' },
  stakeholderTrust: { target: 70, weight: 0.10, description: 'Maintain stakeholder trust above 70%' },
};

export default webDev01GroundTruth;