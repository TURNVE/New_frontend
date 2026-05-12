/**
 * WEB-DEV-01: Checkout Performance Under Fire
 * Complete simulation content with evaluation rubrics, stakeholder challenges, and guidance
 */

import type { WeeklySignal, WeeklyEvent, WeeklyActionItem } from '../../shared/simulation/types';

// ============================================================
// EVALUATION RUBRICS
// ============================================================

export const webdev01EvaluationRubrics = {
  diagnosis: {
    criteria: [
      { id: 'data_gathering', label: 'Data Gathering', weight: 0.3, description: 'Collected all relevant metrics and logs' },
      { id: 'hypothesis_quality', label: 'Hypothesis Quality', weight: 0.35, description: 'Plausible, testable hypothesis' },
      { id: 'prioritization', label: 'Prioritization', weight: 0.25, description: 'Focused on highest-impact issues' },
      { id: 'clarity', label: 'Clarity', weight: 0.1, description: 'Clear communication of findings' },
    ],
    examples: {
      excellent: 'Analyzed p99 latency graphs, identified database query N+1 pattern in cart service, reviewed slow query logs showing 2.1s avg on checkout_items retrieval. Hypothesis: Missing index on checkout_items.cart_id causing full table scans.',
      poor: 'Noticed things are slow. Maybe database? Need to investigate more.',
    },
  },
  root_cause_doc: {
    criteria: [
      { id: 'evidence_based', label: 'Evidence-Based', weight: 0.4, description: 'Conclusions supported by data' },
      { id: 'approach_soundness', label: 'Approach Soundness', weight: 0.35, description: 'Recommended approach addresses root cause' },
      { id: 'risk_awareness', label: 'Risk Awareness', weight: 0.25, description: 'Identified implementation risks' },
    ],
    examples: {
      excellent: 'Root cause: N+1 queries in cart service. Evidence: 150ms → 2.3s latency correlation with cart size, slow query log showing 500ms avg per item lookup. Recommendation: Add composite index (cart_id, created_at) + Redis caching layer. Risks: Cache invalidation complexity, index build time on production.',
      poor: 'The system is slow because of bad code. We should rewrite it.',
    },
  },
  architecture_decision: {
    criteria: [
      { id: 'tradeoff_analysis', label: 'Tradeoff Analysis', weight: 0.35, description: 'Compared multiple approaches' },
      { id: 'budget_accuracy', label: 'Budget Accuracy', weight: 0.25, description: 'Realistic cost estimate' },
      { id: 'timeline_feasibility', label: 'Timeline Feasibility', weight: 0.25, description: 'Achievable before Black Friday' },
      { id: 'stakeholder_alignment', label: 'Stakeholder Alignment', weight: 0.15, description: 'Addresses CTO/CFO concerns' },
    ],
    examples: {
      excellent: 'Evaluated 3 approaches: 1) Quick fix (add index only): $5K, 1 week, 30% improvement. 2) Caching layer: $35K, 3 weeks, 60% improvement. 3) Full rewrite: $150K, 12 weeks, 80% improvement. Recommendation: Option 2 - balances impact vs timeline. Addresses CTO reliability concern and CFO budget constraint.',
      poor: 'We should cache everything. It will be fast and not cost much.',
    },
  },
  caching_implementation: {
    criteria: [
      { id: 'cache_strategy', label: 'Cache Strategy', weight: 0.35, description: 'Appropriate caching pattern selected' },
      { id: 'invalidation_plan', label: 'Invalidation Plan', weight: 0.3, description: 'Clear cache invalidation logic' },
      { id: 'fallback_logic', label: 'Fallback Logic', weight: 0.25, description: 'Graceful degradation on cache miss' },
      { id: 'monitoring', label: 'Monitoring', weight: 0.1, description: 'Cache hit rate, latency tracking' },
    ],
    examples: {
      excellent: 'Implemented cache-aside pattern with Redis. Key structure: cart:{user_id}:items. TTL: 5 minutes. Invalidation: on cart update/delete. Fallback: direct DB query on cache miss. Monitoring: cache hit rate target >80%, p99 latency alert at 1.5s.',
      poor: 'Added Redis caching. Should be faster now.',
    },
  },
  db_optimization: {
    criteria: [
      { id: 'query_analysis', label: 'Query Analysis', weight: 0.35, description: 'Identified slow queries correctly' },
      { id: 'index_strategy', label: 'Index Strategy', weight: 0.35, description: 'Appropriate indexes added' },
      { id: 'connection_pooling', label: 'Connection Pooling', weight: 0.2, description: 'Optimized DB connections' },
      { id: 'testing', label: 'Testing', weight: 0.1, description: 'Verified improvements' },
    ],
    examples: {
      excellent: 'Added composite index on checkout_items(cart_id, created_at). Query time: 450ms → 12ms. Added connection pool (min: 10, max: 50). Implemented query result caching for static product data. EXPLAIN ANALYZE shows index scan vs sequential scan.',
      poor: 'Added some indexes. Database is faster.',
    },
  },
  load_testing: {
    criteria: [
      { id: 'load_simulation', label: 'Load Simulation', weight: 0.35, description: 'Realistic Black Friday traffic' },
      { id: 'latency_targets', label: 'Latency Targets', weight: 0.3, description: 'Met p99 < 2s goal' },
      { id: 'failure_testing', label: 'Failure Testing', weight: 0.25, description: 'Tested failure modes' },
      { id: 'analysis', label: 'Analysis', weight: 0.1, description: 'Clear interpretation of results' },
    ],
    examples: {
      excellent: 'Simulated 5x normal traffic (25K req/min) using k6. Results: p50: 450ms, p95: 890ms, p99: 1.2s. Target met (<2s). Tested Redis failure mode: graceful degradation to DB with 1.8s p99. Bottleneck identified: payment gateway API (external).',
      poor: 'Ran load test. Seems okay.',
    },
  },
  production_rollout: {
    criteria: [
      { id: 'canary_strategy', label: 'Canary Strategy', weight: 0.35, description: 'Gradual rollout plan' },
      { id: 'rollback_plan', label: 'Rollback Plan', weight: 0.35, description: 'Clear rollback triggers' },
      { id: 'monitoring', label: 'Monitoring', weight: 0.2, description: 'Real-time metrics dashboards' },
      { id: 'communication', label: 'Communication', weight: 0.1, description: 'Stakeholder updates' },
    ],
    examples: {
      excellent: 'Canary rollout: 5% → 25% → 50% → 100% over 48 hours. Rollback triggers: p99 latency >2s for 10min, error rate >1%, cache hit rate <50%. Monitoring: Grafana dashboard with latency, error rate, cache metrics. Communication: Slack updates at each phase.',
      poor: 'Deployed to production. Hope it works.',
    },
  },
  go_no_go: {
    criteria: [
      { id: 'recommendation_clarity', label: 'Recommendation Clarity', weight: 0.35, description: 'Clear Go/No-Go decision' },
      { id: 'data_support', label: 'Data Support', weight: 0.3, description: 'Evidence-backed justification' },
      { id: 'risk_acknowledgment', label: 'Risk Acknowledgment', weight: 0.25, description: 'Remaining risks documented' },
      { id: 'contingency', label: 'Contingency', weight: 0.1, description: 'Black Friday monitoring plan' },
    ],
    examples: {
      excellent: 'GO for Black Friday. Evidence: p99 latency 1.2s (target <2s), success rate 99.4% (target >99%), handled 5x load in testing. Remaining risks: Payment gateway external dependency, unknown traffic patterns. Contingency: On-call rotation, feature flag to disable non-essential features, auto-scaling enabled.',
      poor: 'I think we are ready. Should be fine.',
    },
  },
};

// ============================================================
// WEEKLY SIGNALS
// ============================================================

export const webdev01WeeklySignals: WeeklySignal[] = [
  {
    id: 'wd01-sig-w1-01',
    week: 1,
    source: 'Alex Kim',
    sourceInitials: 'AK',
    sourceColor: 'bg-red-500/20 text-red-400',
    message: 'P1 INCIDENT: Checkout timeout rate hit 8% in last hour. 3 customer escalations. Need immediate action.',
    severity: 'critical',
    tags: ['incident', 'production'],
  },
  {
    id: 'wd01-sig-w1-02',
    week: 1,
    source: 'Sarah Chen',
    sourceInitials: 'SC',
    sourceColor: 'bg-purple-500/20 text-purple-400',
    message: 'Checkout latency trending wrong: 2.3s avg (was 1.4s three months ago). Black Friday is 8 weeks out. We need to fix this NOW.',
    severity: 'critical',
    tags: ['performance', 'leadership'],
  },
  {
    id: 'wd01-sig-w1-03',
    week: 1,
    source: 'Diana Rodriguez',
    sourceInitials: 'DR',
    sourceColor: 'bg-primary/20 text-primary',
    message: 'CFO reminder: $85K budget cap is firm. Last performance project went 40% over. I need weekly budget updates.',
    severity: 'warning',
    tags: ['budget', 'finance'],
  },
  {
    id: 'wd01-sig-w2-01',
    week: 2,
    source: 'Mike Johnson',
    sourceInitials: 'MJ',
    sourceColor: 'bg-blue-500/20 text-blue-400',
    message: 'Product team concerned: Any checkout optimization cannot break existing features. We have Black Friday promotions planned.',
    severity: 'warning',
    tags: ['product', 'requirements'],
  },
  {
    id: 'wd01-sig-w3-01',
    week: 3,
    source: 'Alex Kim',
    sourceInitials: 'AK',
    sourceColor: 'bg-purple-500/20 text-purple-400',
    message: 'DevOps flagging: Database CPU at 78% during peak. If we add caching, need to plan for Redis cluster setup.',
    severity: 'info',
    tags: ['infrastructure'],
  },
  {
    id: 'wd01-sig-w5-01',
    week: 5,
    source: 'Sarah Chen',
    sourceInitials: 'SC',
    sourceColor: 'bg-purple-500/20 text-purple-400',
    message: 'Saw your DB optimization results - impressive 450ms → 12ms! But we need to verify this holds under load. When is load test scheduled?',
    severity: 'info',
    tags: ['leadership', 'progress'],
  },
  {
    id: 'wd01-sig-w7-01',
    week: 7,
    source: 'Mike Johnson',
    sourceInitials: 'MJ',
    sourceColor: 'bg-blue-500/20 text-blue-400',
    message: 'Marketing just launched Black Friday ad campaign. Traffic could start increasing early. Are we ready?',
    severity: 'warning',
    tags: ['product', 'timeline'],
  },
];

// ============================================================
// WEEKLY EVENTS
// ============================================================

export const webdev01WeeklyEvents: WeeklyEvent[] = [
  {
    id: 'wd01-evt-w1-kickoff',
    week: 1,
    type: 'meeting',
    title: 'Emergency Performance Review',
    description: 'Sarah Chen called an emergency meeting to discuss checkout latency crisis.',
    from: 'Sarah Chen',
    fromInitials: 'SC',
    fromColor: 'bg-purple-500/20 text-purple-400',
    priority: 'urgent',
    requiresAction: true,
    actionId: 'wd01-w1-kickoff',
    timeInWeek: 180,
  },
  {
    id: 'wd01-evt-w1-incident-review',
    week: 1,
    type: 'notification',
    title: 'P1 Incident Review Required',
    description: 'Post-incident review document due within 24 hours of P1 resolution.',
    from: 'Alex Kim',
    fromInitials: 'AK',
    fromColor: 'bg-red-500/20 text-red-400',
    priority: 'high',
    requiresAction: false,
    timeInWeek: 1200,
  },
  {
    id: 'wd01-evt-w2-budget-check',
    week: 2,
    type: 'meeting',
    title: 'Budget Review with CFO',
    description: 'Diana Rodriguez wants to review your proposed approach and budget estimate.',
    from: 'Diana Rodriguez',
    fromInitials: 'DR',
    fromColor: 'bg-primary/20 text-primary',
    priority: 'high',
    requiresAction: true,
    actionId: 'wd01-w2-budget-review',
    timeInWeek: 600,
  },
  {
    id: 'wd01-evt-w4-caching-demo',
    week: 4,
    type: 'meeting',
    title: 'Caching Layer Demo',
    description: 'Show Sarah and Alex the Redis caching implementation and fallback logic.',
    from: 'Sarah Chen',
    fromInitials: 'SC',
    fromColor: 'bg-purple-500/20 text-purple-400',
    priority: 'normal',
    requiresAction: true,
    actionId: 'wd01-w4-caching-demo',
    timeInWeek: 900,
  },
  {
    id: 'wd01-evt-w6-load-test-results',
    week: 6,
    type: 'meeting',
    title: 'Load Test Results Review',
    description: 'Present load testing results to Sarah and Mike. Go/No-Go recommendation for production rollout.',
    from: 'Sarah Chen',
    fromInitials: 'SC',
    fromColor: 'bg-purple-500/20 text-purple-400',
    priority: 'high',
    requiresAction: true,
    actionId: 'wd01-w6-load-test-review',
    timeInWeek: 1000,
  },
  {
    id: 'wd01-evt-w8-black-friday-readiness',
    week: 8,
    type: 'meeting',
    title: 'Black Friday Readiness Review',
    description: 'Final Go/No-Go decision with all stakeholders. Sarah, Diana, Mike, and Alex attending.',
    from: 'Sarah Chen',
    fromInitials: 'SC',
    fromColor: 'bg-purple-500/20 text-purple-400',
    priority: 'urgent',
    requiresAction: true,
    actionId: 'wd01-w8-final-review',
    timeInWeek: 500,
  },
];

// ============================================================
// WEEKLY ACTIONS
// ============================================================

export const webdev01WeeklyActions: WeeklyActionItem[] = [
  // === WEEK 1: Diagnosis Phase ===
  {
    id: 'wd01-w1-analyze-metrics',
    week: 1,
    title: 'Analyze Performance Metrics',
    description: 'Review checkout latency graphs, error rates, and system metrics from the past 3 months.',
    category: 'task',
    actionType: 'submit_prd',
    priority: 'urgent',
    dueWeek: 1,
    prdTitle: 'Performance Analysis Summary',
    prdFields: [
      { id: 'latency-trend', label: 'Describe latency trend (include specific numbers)', type: 'textarea', placeholder: 'e.g., "p99 latency increased from 1.4s to 2.3s (65%) over past 3 months"', required: true },
      { id: 'error-correlation', label: 'Error rate correlation', type: 'textarea', placeholder: 'How do errors correlate with latency spikes?', required: true },
      { id: 'peak-traffic', label: 'Peak traffic patterns', type: 'textarea', placeholder: 'When does the system experience highest load?', required: true },
    ],
  },
  {
    id: 'wd01-w1-review-logs',
    week: 1,
    title: 'Review Slow Query Logs',
    description: 'Identify the slowest database queries in the checkout flow.',
    category: 'task',
    actionType: 'submit_prd',
    priority: 'urgent',
    dueWeek: 1,
    prdTitle: 'Slow Query Analysis',
    prdFields: [
      { id: 'top-queries', label: 'Top 5 slowest queries', type: 'textarea', required: true },
      { id: 'query-pattern', label: 'Identified patterns (N+1, missing index, etc.)', type: 'textarea', required: true },
      { id: 'recommendation', label: 'Immediate fix recommendation', type: 'textarea', required: true },
    ],
  },
  {
    id: 'wd01-w1-diagnosis-doc',
    week: 1,
    title: 'Submit Initial Diagnosis',
    description: 'Document your hypothesis about the root cause of checkout latency.',
    category: 'document',
    actionType: 'decision_text',
    priority: 'urgent',
    dueWeek: 1,
    decisionPrompt: 'Write your initial diagnosis (minimum 150 words). Include: 1) Observed symptoms, 2) Data reviewed, 3) Your hypothesis about root cause, 4) What you need to investigate next.',
    decisionPlaceholder: 'OBSERVED SYMPTOMS:\n- Checkout latency: ...\n- Error rate: ...\n\nDATA REVIEWED:\n- Metrics: ...\n- Logs: ...\n\nHYPOTHESIS:\nMy hypothesis is that...\n\nNEXT INVESTIGATION STEPS:\n1. ...\n2. ...',
  },

  // === WEEK 2: Root Cause Analysis ===
  {
    id: 'wd01-w2-root-cause',
    week: 2,
    title: 'Submit Root Cause Analysis',
    description: 'Present definitive root cause with evidence. This will drive your architecture decision.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'urgent',
    dueWeek: 2,
    prdTitle: 'Root Cause Analysis Document',
    prdFields: [
      { id: 'root-cause', label: 'Definitive root cause', type: 'textarea', placeholder: 'Be specific: what component, what pattern, what triggered it', required: true },
      { id: 'evidence', label: 'Supporting evidence', type: 'textarea', placeholder: 'Metrics, logs, code references', required: true },
      { id: 'recommended-approach', label: 'Recommended fix approach', type: 'select', options: ['Quick fix (index only)', 'Caching layer', 'Service refactor', 'Full rewrite'], required: true },
      { id: 'risks', label: 'Implementation risks', type: 'textarea', required: true },
    ],
  },

  // === WEEK 3: Architecture Decision ===
  {
    id: 'wd01-w3-architecture-decision',
    week: 3,
    title: 'Architecture Decision Record',
    description: 'Present your solution approach to Sarah (CTO) for approval.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'urgent',
    dueWeek: 3,
    prdTitle: 'Architecture Decision Record',
    prdFields: [
      { id: 'options-considered', label: 'Options considered (at least 3)', type: 'textarea', required: true },
      { id: 'tradeoffs', label: 'Tradeoff analysis for each option', type: 'textarea', required: true },
      { id: 'chosen-approach', label: 'Chosen approach with justification', type: 'textarea', required: true },
      { id: 'budget-estimate', label: 'Budget estimate', type: 'text', placeholder: '$ amount', required: true },
      { id: 'timeline', label: 'Timeline (weeks)', type: 'text', placeholder: 'Number of weeks', required: true },
    ],
  },

  // === WEEK 4: Implementation - Caching ===
  {
    id: 'wd01-w4-caching-design',
    week: 4,
    title: 'Caching Layer Design',
    description: 'Design the Redis caching layer with invalidation strategy.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'high',
    dueWeek: 4,
    prdTitle: 'Caching Implementation Plan',
    prdFields: [
      { id: 'cache-pattern', label: 'Caching pattern (cache-aside, write-through, etc.)', type: 'select', options: ['cache-aside', 'write-through', 'write-behind', 'refresh-ahead'], required: true },
      { id: 'key-structure', label: 'Cache key structure', type: 'text', placeholder: 'e.g., "cart:{user_id}:items"', required: true },
      { id: 'ttl', label: 'TTL strategy', type: 'text', placeholder: 'How long to cache?', required: true },
      { id: 'invalidation', label: 'Cache invalidation strategy', type: 'textarea', required: true },
      { id: 'fallback', label: 'Fallback on cache miss/failure', type: 'textarea', required: true },
    ],
  },

  // === WEEK 5: Database Optimization ===
  {
    id: 'wd01-w5-db-optimization',
    week: 5,
    title: 'Database Optimization Plan',
    description: 'Plan query optimizations and index additions.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'high',
    dueWeek: 5,
    prdTitle: 'Database Optimization Plan',
    prdFields: [
      { id: 'slow-queries', label: 'Queries to optimize', type: 'textarea', required: true },
      { id: 'index-plan', label: 'Indexes to add (with EXPLAIN analysis)', type: 'textarea', required: true },
      { id: 'connection-pool', label: 'Connection pool configuration', type: 'text', placeholder: 'min/max connections', required: true },
      { id: 'rollback', label: 'Rollback plan if index causes issues', type: 'textarea', required: true },
    ],
  },

  // === WEEK 6: Load Testing ===
  {
    id: 'wd01-w6-load-test-plan',
    week: 6,
    title: 'Load Testing Plan',
    description: 'Define load testing scenarios and success criteria.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'high',
    dueWeek: 6,
    prdTitle: 'Load Testing Plan',
    prdFields: [
      { id: 'scenarios', label: 'Test scenarios (normal, 2x, 5x, failure modes)', type: 'textarea', required: true },
      { id: 'success-criteria', label: 'Success criteria (p50, p95, p99 targets)', type: 'textarea', required: true },
      { id: 'tools', label: 'Testing tools (k6, Artillery, etc.)', type: 'text', required: true },
      { id: 'environment', label: 'Testing environment setup', type: 'textarea', required: true },
    ],
  },

  // === WEEK 7: Production Rollout ===
  {
    id: 'wd01-w7-rollout-plan',
    week: 7,
    title: 'Production Rollout Plan',
    description: 'Plan zero-downtime deployment with canary rollout.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'urgent',
    dueWeek: 7,
    prdTitle: 'Production Rollout Plan',
    prdFields: [
      { id: 'rollout-stages', label: 'Rollout stages (%, duration)', type: 'textarea', placeholder: 'e.g., "5% for 6h → 25% for 12h → 50% for 24h → 100%"', required: true },
      { id: 'rollback-triggers', label: 'Rollback triggers (specific metrics)', type: 'textarea', required: true },
      { id: 'monitoring', label: 'Monitoring dashboards and alerts', type: 'textarea', required: true },
      { id: 'communication', label: 'Stakeholder communication plan', type: 'textarea', required: true },
    ],
  },

  // === WEEK 8: Go/No-Go Decision ===
  {
    id: 'wd01-w8-go-no-go',
    week: 8,
    title: 'Black Friday Go/No-Go Decision',
    description: 'Make final recommendation for Black Friday launch readiness.',
    category: 'decision',
    actionType: 'decision_text',
    priority: 'urgent',
    dueWeek: 8,
    decisionPrompt: 'Write your Go/No-Go recommendation for Black Friday (minimum 200 words). Include: 1) Clear decision, 2) Performance metrics achieved, 3) Remaining risks, 4) Black Friday monitoring plan.',
    decisionPlaceholder: 'DECISION: [GO/NO-GO] for Black Friday\n\nPERFORMANCE METRICS ACHIEVED:\n- p99 latency: ...\n- Success rate: ...\n- Load test results: ...\n\nREMAINING RISKS:\n- ...\n\nBLACK FRIDAY MONITORING PLAN:\n- On-call rotation: ...\n- Dashboards: ...\n- Escalation procedure: ...',
  },
];

// ============================================================
// STAKEHOLDER CHALLENGES
// ============================================================

export const webdev01StakeholderChallenges = {
  cto: {
    'vague-diagnosis': {
      trigger: ['hopefully', 'maybe', 'might', 'probably', 'seems like'],
      challenge: {
        stakeholderId: 'cto',
        channel: 'slack',
        subject: 'Need specifics on diagnosis',
        message: 'Your diagnosis is too vague. "Maybe database" is not actionable. I need specific queries, specific components, specific evidence. Can you provide that?',
        context: 'Vague language in diagnosis',
        timeoutMinutes: 15,
      },
    },
    'underestimates-complexity': {
      triggerKeywords: ['quick fix', 'simple change', 'minor update', 'just add'],
      challenge: {
        stakeholderId: 'cto',
        channel: 'meeting',
        subject: 'Reality check on complexity',
        message: 'This is not a "quick fix". We are processing $50M annually. Any change to checkout requires thorough testing. Can you revise your timeline to be realistic?',
        context: 'Underestimating implementation complexity',
        timeoutMinutes: 20,
      },
    },
    'no-monitoring-plan': {
      condition: (decisions: any[]) => {
        const cachingDoc = decisions.find(d => d.actionId === 'wd01-w4-caching-design');
        return cachingDoc && !cachingDoc.rawContent?.toLowerCase().includes('monitor');
      },
      challenge: {
        stakeholderId: 'cto',
        channel: 'email',
        subject: 'How will we know if caching works?',
        message: 'I do not see monitoring defined in your caching plan. How will we measure success? What metrics will we track? What alerts will we set up?',
        context: 'Missing monitoring plan',
        timeoutMinutes: 30,
      },
    },
  },
  cfo: {
    'budget-overrun': {
      condition: (decisions: any[], state: any) => {
        const budgetEstimate = decisions.find(d => d.actionId === 'wd01-w3-architecture-decision');
        if (!budgetEstimate) return false;
        const match = budgetEstimate.rawContent?.match(/\$?(\d+)K?/);
        const estimated = match ? parseInt(match[1]) * 1000 : 0;
        return estimated > 85000;
      },
      challenge: {
        stakeholderId: 'cfo',
        channel: 'meeting',
        subject: 'Budget exceeded',
        message: 'Your estimate exceeds the $85K budget. I need you to either reduce scope or justify why we should exceed budget. What is your recommendation?',
        context: 'Budget estimate over $85K',
        timeoutMinutes: 25,
      },
    },
    'no-weekly-updates': {
      condition: (decisions: any[], state: any) => {
        return state.week > 3 && !decisions.some(d => d.actionId === 'weekly-budget-update');
      },
      challenge: {
        stakeholderId: 'cfo',
        channel: 'email',
        subject: 'Missing budget updates',
        message: 'I requested weekly budget updates. We are now in week {week} and I have not received any. Please provide current spend vs budget.',
        context: 'No budget updates provided',
        timeoutMinutes: 40,
      },
    },
  },
  product: {
    'breaks-feature-parity': {
      condition: (decisions: any[]) => {
        const archDecision = decisions.find(d => d.actionId === 'wd01-w3-architecture-decision');
        return archDecision && archDecision.rawContent?.toLowerCase().includes('remove') && archDecision.rawContent?.toLowerCase().includes('feature');
      },
      challenge: {
        stakeholderId: 'product',
        channel: 'slack',
        subject: 'Cannot remove features',
        message: 'You mentioned removing features as part of optimization. We have Black Friday promotions depending on those features. You cannot break feature parity.',
        context: 'Proposed feature removal',
        timeoutMinutes: 20,
      },
    },
  },
  devops: {
    'no-rollback-plan': {
      triggerKeywords: ['deploy', 'rollout', 'launch'],
      missingKeywords: ['rollback', 'roll back', 'revert', 'undo'],
      challenge: {
        stakeholderId: 'devops',
        channel: 'email',
        subject: 'Rollback plan required',
        message: 'Your rollout plan does not include a rollback strategy. What are the specific triggers? How do we revert? How long will rollback take?',
        context: 'Missing rollback plan',
        timeoutMinutes: 30,
      },
    },
  },
};

// ============================================================
// IN-CONTEXT GUIDANCE
// ============================================================

export const webdev01Guidance = {
  week1: {
    opening: `You are a Senior Backend Engineer at TurnVe Commerce. Black Friday is 8 weeks away. Checkout latency has increased 65% to 2.3s, and transaction success rate dropped to 94.8%.`,
    hints: [
      'Start with the metrics dashboard - look for trends and correlations',
      'Review slow query logs - database is often the bottleneck',
      'Check error logs for timeout patterns',
      'Remember: You need evidence, not hunches. Document everything.',
    ],
    stakeholderTips: {
      cto: 'Sarah values data-driven analysis. Show her you understand the technical depth.',
      cfo: 'Diana cares about budget and ROI. Frame your recommendations in terms of cost/benefit.',
      product: 'Mike is worried about feature delays. Emphasize that performance IS a feature.',
      devops: 'Alex wants reliability and easy rollback. Include operational considerations.',
    },
  },
  week2: {
    opening: `You have gathered initial data. Now you must pinpoint the exact root cause. Your architecture decision in Week 3 depends on this analysis.`,
    hints: [
      'Correlate latency spikes with specific database queries',
      'Look for N+1 query patterns - common in e-commerce carts',
      'Check if caching is already in place and failing',
      'Consider external dependencies (payment gateway, inventory API)',
    ],
  },
  week3: {
    opening: `Time to make your architecture decision. This will determine the next 5 weeks of work. Balance performance gains against budget and timeline constraints.`,
    hints: [
      'Consider at least 3 different approaches',
      'Each option should have: cost, timeline, expected improvement',
      'Think about operational complexity, not just code changes',
      'The "perfect" solution is useless if it misses Black Friday',
    ],
  },
  week4_5: {
    opening: `Implementation phase. You are building the caching layer and optimizing the database. Focus on correctness first, then performance.`,
    hints: [
      'Cache invalidation is harder than caching - think through edge cases',
      'Test fallback paths - what happens when Redis is down?',
      'Use EXPLAIN ANALYZE to verify query improvements',
      'Document your changes for the team',
    ],
  },
  week6: {
    opening: `Load testing week. This is where you validate your optimizations under realistic Black Friday traffic.`,
    hints: [
      'Simulate 5x normal traffic (25K requests/minute)',
      'Test failure modes: Redis down, database slow, payment gateway timeout',
      'Measure p50, p95, p99 - p99 must be under 2s',
      'Document any bottlenecks discovered',
    ],
  },
  week7: {
    opening: `Production rollout week. Zero-downtime deployment is critical. Plan your canary stages carefully.`,
    hints: [
      'Start small: 5% of traffic for 6 hours minimum',
      'Define clear rollback triggers (latency, errors, cache hit rate)',
      'Monitor in real-time with dashboards',
      'Keep stakeholders informed at each stage',
    ],
  },
  week8: {
    opening: `Final week. Make your Go/No-Go recommendation for Black Friday. This decision impacts the entire company.`,
    hints: [
      'Base your decision on load test data, not feelings',
      'Acknowledge remaining risks honestly',
      'Have a Black Friday monitoring plan ready',
      'If No-Go, explain what is needed to reach Go',
    ],
  },
};
