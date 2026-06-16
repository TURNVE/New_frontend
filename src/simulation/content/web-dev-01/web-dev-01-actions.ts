import type { ScenarioAction } from '../../core/SimulationEngine';

// ============================================================================
// WEB-DEV-01 ACTIONS
// Decision-forcing actions that simulate real engineering work
// ============================================================================

export const webDev01Actions: Record<string, ScenarioAction> = {
  // ============================================================================
  // PHASE 1: INVESTIGATION ACTIONS
  // ============================================================================

  analyze_logs: {
    id: 'analyze_logs',
    name: 'Analyze System Logs',
    description: 'Review available logs from the checkout service. WARNING: Logs may be incomplete and contain contradictory information.',
    category: 'technical',
    urgency: 'high',
    choices: [
      {
        id: 'deep-log-analysis',
        label: 'Deep dive all logs (2 hours)',
        description: 'Comprehensive analysis of all available logs. Time-consuming but thorough.',
        effects: {
          progress: 5,
          customMetrics: { log_insight: 25, contradiction_found: 1 },
        },
        feedback: 'Found: Query time spike at 14:23 correlates with DB CPU spike. But APM logs show different timestamp - possible clock skew. Log gap of 15 minutes during peak.',
        risk: 3,
        timeCost: 2,
      },
      {
        id: 'quick-log-scan',
        label: 'Quick scan obvious patterns (30 min)',
        description: 'Fast scan for obvious issues. May miss subtle signals.',
        effects: {
          progress: 3,
          customMetrics: { log_insight: 10 },
        },
        feedback: 'CPU spike detected at 2PM. Query latency elevated. Looks straightforward - seems like database is under load.',
        risk: 6,
        timeCost: 0.5,
      },
      {
        id: 'focused-scan',
        label: 'Focus on error logs only (1 hour)',
        description: 'Only look at error messages and exceptions.',
        effects: {
          progress: 4,
          customMetrics: { error_insight: 15 },
        },
        feedback: 'Found 23 timeout errors, 8 connection pool exhaustion events. Connection issues seem prevalent.',
        risk: 4,
        timeCost: 1,
      },
    ],
  },

  review_queries: {
    id: 'review_queries',
    name: 'Review Slow Query Reports',
    description: 'Analyze the slow query log and EXPLAIN ANALYZE results from the checkout service.',
    category: 'technical',
    urgency: 'high',
    choices: [
      {
        id: 'comprehensive-query-analysis',
        label: 'Full query analysis (3 hours)',
        description: 'Run EXPLAIN ANALYZE on top 20 queries. Comprehensive but time-intensive.',
        effects: {
          progress: 8,
          customMetrics: { query_insight: 35 },
          budget: -5,
        },
        feedback: 'Key finding: 8 queries doing sequential scans on transactions table. 3 queries have N+1 pattern. 60% of queries would benefit from composite index.',
        risk: 2,
        timeCost: 3,
      },
      {
        id: 'top-queries-only',
        label: 'Focus on top 5 slowest (1.5 hours)',
        description: 'Only analyze the slowest queries to save time.',
        effects: {
          progress: 5,
          customMetrics: { query_insight: 20 },
        },
        feedback: 'Top 5 queries: 4 are missing indexes, 1 has N+1 pattern. Quick wins available.',
        risk: 4,
        timeCost: 1.5,
      },
    ],
  },

  check_infrastructure: {
    id: 'check_infrastructure',
    name: 'Check Infrastructure Configuration',
    description: 'Review Kubernetes configs, connection pool settings, Redis utilization, and other infrastructure.',
    category: 'technical',
    urgency: 'medium',
    choices: [
      {
        id: 'deep-infra-review',
        label: 'Deep infrastructure review (2 hours)',
        description: 'Thorough review of all infrastructure components.',
        effects: {
          progress: 6,
          customMetrics: { infra_insight: 25 },
        },
        feedback: 'Redis cluster has 8GB available - not being used for checkout! Connection pool set to 20, fixed size. pgBouncer not configured.',
        risk: 3,
        timeCost: 2,
      },
      {
        id: 'quick-infra-check',
        label: 'Quick infrastructure spot-check (1 hour)',
        description: 'Brief review of key configurations.',
        effects: {
          progress: 3,
          customMetrics: { infra_insight: 10 },
        },
        feedback: 'Connection pool appears undersized. Redis available but not utilized.',
        risk: 5,
        timeCost: 1,
      },
    ],
  },

  interview_devops: {
    id: 'interview_devops',
    name: 'Interview DevOps Engineer',
    description: 'Talk to the DevOps team who manages the infrastructure. They have institutional knowledge.',
    category: 'communication',
    urgency: 'medium',
    choices: [
      {
        id: 'full-interview',
        label: 'Full interview (1 hour)',
        description: 'In-depth conversation about system history and concerns.',
        effects: {
          progress: 5,
          customMetrics: { devops_insight: 30 },
          stakeholderSatisfaction: { devops: 10 },
        },
        feedback: 'DevOps has been warning about DB performance for months. They suggest Redis caching would help - they already have cluster running. They prefer caching over indexing (easier to rollback).',
        risk: 2,
        timeCost: 1,
      },
      {
        id: 'quick-chat',
        label: 'Quick chat (30 min)',
        description: 'Brief conversation to get key insights.',
        effects: {
          progress: 3,
          customMetrics: { devops_insight: 15 },
        },
        feedback: 'DevOps says "we told you so" about DB performance. Redis is there if you want to use it.',
        risk: 4,
        timeCost: 0.5,
      },
    ],
  },

  // ============================================================================
  // PHASE 2: ARCHITECTURE DECISION
  // ============================================================================

  choose_fix_approach: {
    id: 'choose_fix_approach',
    name: 'Choose ONE Major Fix',
    description: 'You can only implement ONE major system change due to time constraints. Choose wisely - this decision will be evaluated against your diagnosis.',
    category: 'process',
    urgency: 'critical',
    choices: [
      {
        id: 'fix-indexing',
        label: 'Database Indexing',
        description: 'Add missing indexes on frequently queried columns. Lower risk, proven approach.',
        effects: {
          progress: 10,
          customMetrics: { fix_choice: 'indexing', expected_latency_reduction: 30 },
          budget: -15,
        },
        feedback: 'Indexing approach selected. Expected: 25-35% latency reduction. Lower risk but limited scope.',
        risk: 3,
        timeCost: 0,
      },
      {
        id: 'fix-caching',
        label: 'Redis Caching Layer',
        description: 'Implement caching for product, pricing, and cart data. Higher potential impact but more complex.',
        effects: {
          progress: 12,
          customMetrics: { fix_choice: 'caching', expected_latency_reduction: 40 },
          budget: -25,
        },
        feedback: 'Caching selected. Expected: 35-45% latency reduction. Redis already available - quick win.',
        risk: 5,
        timeCost: 0,
      },
      {
        id: 'fix-query-optimization',
        label: 'Query Rewriting / N+1 Fix',
        description: 'Rewrite queries to eliminate N+1 patterns and optimize data fetching.',
        effects: {
          progress: 10,
          customMetrics: { fix_choice: 'query_optimization', expected_latency_reduction: 25 },
          budget: -10,
        },
        feedback: 'Query optimization selected. Expected: 20-30% latency reduction from reducing query count.',
        risk: 4,
        timeCost: 0,
      },
      {
        id: 'fix-connection-pool',
        label: 'Connection Pool Redesign',
        description: 'Fix connection pool configuration and add pgBouncer.',
        effects: {
          progress: 8,
          customMetrics: { fix_choice: 'connection_pool', expected_latency_reduction: 15 },
          budget: -20,
        },
        feedback: 'Connection pool fix selected. Expected: 15-20% improvement, better stability under load.',
        risk: 4,
        timeCost: 0,
      },
    ],
  },

  estimate_impact: {
    id: 'estimate_impact',
    name: 'Estimate Impact with Data',
    description: 'Create a more detailed impact estimate before finalizing decision.',
    category: 'technical',
    urgency: 'medium',
    choices: [
      {
        id: 'detailed-estimate',
        label: 'Detailed impact analysis',
        description: 'Create detailed projections with benchmarks.',
        effects: {
          progress: 5,
          customMetrics: { impact_analysis_quality: 30 },
        },
        feedback: 'Based on industry benchmarks: indexing = 25-35%, caching = 35-45%, query fix = 20-30%. Caching has highest potential.',
        risk: 2,
        timeCost: 1,
      },
      {
        id: 'quick-estimate',
        label: 'Quick estimate',
        description: 'Rough projection based on best guess.',
        effects: {
          progress: 3,
          customMetrics: { impact_analysis_quality: 15 },
        },
        feedback: 'Rough guess: 20-40% improvement depending on approach.',
        risk: 4,
        timeCost: 0.5,
      },
    ],
  },

  present_to_cto: {
    id: 'present_to_cto',
    name: 'Present Decision to CTO',
    description: 'Get CTO buy-in on your approach before implementation.',
    category: 'communication',
    urgency: 'high',
    choices: [
      {
        id: 'full-presentation',
        label: 'Full presentation with data',
        description: 'Present complete analysis with evidence.',
        effects: {
          progress: 5,
          stakeholderSatisfaction: { cto: 15 },
          customMetrics: { cto_buy_in: 90 },
        },
        feedback: 'CTO impressed by thorough analysis. "This aligns with what I was hoping to see. Proceed."',
        risk: 2,
        timeCost: 1,
      },
      {
        id: 'brief-update',
        label: 'Brief update',
        description: 'Quick sync with CTO.',
        effects: {
          progress: 3,
          stakeholderSatisfaction: { cto: 5 },
          customMetrics: { cto_buy_in: 70 },
        },
        feedback: 'CTO accepts decision but asks to see more detailed plan before Phase 3.',
        risk: 3,
        timeCost: 0.5,
      },
    ],
  },

  // ============================================================================
  // PHASE 3: IMPLEMENTATION
  // ============================================================================

  implement_fix: {
    id: 'implement_fix',
    name: 'Implement Your Fix',
    description: 'Build the solution. You choose the trade-off between speed and safety.',
    category: 'technical',
    urgency: 'high',
    submitWork: true,
    choices: [
      {
        id: 'thorough-impl',
        label: 'Thorough implementation (3 hours)',
        description: 'Complete implementation with tests, error handling, and full rollback plan.',
        effects: {
          progress: 15,
          customMetrics: { impl_quality: 40, bug_risk: 10 },
          teamMorale: 5,
        },
        feedback: 'Implementation complete with comprehensive tests. Rollback plan documented. Ready for review.',
        risk: 2,
        timeCost: 3,
      },
      {
        id: 'standard-impl',
        label: 'Standard implementation (2 hours)',
        description: 'Solid implementation with basic tests.',
        effects: {
          progress: 12,
          customMetrics: { impl_quality: 30, bug_risk: 25 },
        },
        feedback: 'Implementation done. Basic tests pass. Rollback procedure documented.',
        risk: 4,
        timeCost: 2,
      },
      {
        id: 'fast-impl',
        label: 'Fast implementation (1 hour)',
        description: 'Quick fix, minimal tests. Higher risk of bugs.',
        effects: {
          progress: 10,
          customMetrics: { impl_quality: 15, bug_risk: 50 },
          teamMorale: -5,
        },
        feedback: 'Done quickly. Skipped some tests. Need to be careful during load testing.',
        risk: 7,
        timeCost: 1,
      },
    ],
  },

  write_tests: {
    id: 'write_tests',
    name: 'Write Tests',
    description: 'Add tests for your implementation.',
    category: 'technical',
    urgency: 'medium',
    choices: [
      {
        id: 'comprehensive-tests',
        label: 'Comprehensive test suite',
        description: 'Unit tests, integration tests, and load tests.',
        effects: {
          progress: 8,
          customMetrics: { test_coverage: 80 },
          budget: -5,
        },
        feedback: 'Excellent test coverage. 85% of code paths covered. Load tests included.',
        risk: 1,
        timeCost: 2,
      },
      {
        id: 'basic-tests',
        label: 'Basic tests only',
        description: 'Just the essential tests to verify functionality.',
        effects: {
          progress: 5,
          customMetrics: { test_coverage: 50 },
        },
        feedback: 'Basic tests pass. Need more coverage for production.',
        risk: 4,
        timeCost: 1,
      },
      {
        id: 'skip-tests',
        label: 'Skip tests, move fast',
        description: 'No tests - just ship it.',
        effects: {
          progress: 3,
          customMetrics: { test_coverage: 0, bug_risk: 30 },
        },
        feedback: 'Moving fast. No tests - this may bite us later.',
        risk: 8,
        timeCost: 0,
      },
    ],
  },

  document_rollback: {
    id: 'document_rollback',
    name: 'Document Rollback Procedure',
    description: 'Critical for zero-downtime requirement. How do you undo this change?',
    category: 'process',
    urgency: 'high',
    choices: [
      {
        id: 'detailed-rollback',
        label: 'Detailed rollback plan',
        description: 'Step-by-step rollback with verification.',
        effects: {
          progress: 5,
          customMetrics: { rollback_quality: 40 },
          stakeholderSatisfaction: { cto: 10 },
        },
        feedback: 'Complete rollback documentation: 1) Disable feature flag, 2) Roll back K8s, 3) Clear cache if needed. Verified to work.',
        risk: 1,
        timeCost: 1,
      },
      {
        id: 'basic-rollback',
        label: 'Basic rollback notes',
        description: 'Rough notes on how to roll back.',
        effects: {
          progress: 3,
          customMetrics: { rollback_quality: 20 },
        },
        feedback: 'Basic rollback: roll back the deployment. Not fully tested.',
        risk: 5,
        timeCost: 0.5,
      },
    ],
  },

  // ============================================================================
  // PHASE 4: LOAD REALITY
  // ============================================================================

  run_load_test: {
    id: 'run_load_test',
    name: 'Run Load Test',
    description: 'Execute load test to validate your changes under realistic peak conditions.',
    category: 'technical',
    urgency: 'high',
    choices: [
      {
        id: 'full-load-test',
        label: 'Full load test (10x traffic)',
        description: 'Comprehensive test at 10x normal traffic.',
        effects: {
          progress: 10,
          customMetrics: { load_test_quality: 40, actual_improvement: 35 },
        },
        feedback: 'Load test complete. Latency: 850ms -> 520ms (39% improvement). Still some issues at P99. Transaction success improved from 96.8% to 98.5%.',
        risk: 2,
        timeCost: 2,
      },
      {
        id: 'moderate-load-test',
        label: 'Moderate load test (5x traffic)',
        description: 'Test at 5x normal traffic.',
        effects: {
          progress: 8,
          customMetrics: { load_test_quality: 25, actual_improvement: 30 },
        },
        feedback: 'Test complete. 30% improvement seen. P99 still high. Not enough data on extreme load.',
        risk: 3,
        timeCost: 1.5,
      },
    ],
  },

  analyze_results: {
    id: 'analyze_results',
    name: 'Analyze Test Results',
    description: 'Interpret the load test data honestly. What worked? What did not?',
    category: 'technical',
    urgency: 'high',
    choices: [
      {
        id: 'thorough-analysis',
        label: 'Thorough results analysis',
        description: 'Deep dive into all metrics and anomalies.',
        effects: {
          progress: 8,
          customMetrics: { analysis_depth: 35 },
        },
        feedback: 'Latency improved 39% - good but not target 45%. P99 still 1200ms. Query count reduced from 15 to 6. New issue: Redis memory usage higher than expected.',
        risk: 2,
        timeCost: 1,
      },
      {
        id: 'quick-analysis',
        label: 'Quick analysis',
        description: 'Summary view of results.',
        effects: {
          progress: 5,
          customMetrics: { analysis_depth: 15 },
        },
        feedback: 'Results look good overall. 35-40% improvement. Ready to proceed.',
        risk: 4,
        timeCost: 0.5,
      },
    ],
  },

  iterate_or_accept: {
    id: 'iterate_or_accept',
    name: 'Decide: Iterate or Accept',
    description: 'The results are in. Do you try to improve more or accept current state?',
    category: 'process',
    urgency: 'high',
    choices: [
      {
        id: 'iterate',
        label: 'Try to improve further',
        description: 'Attempt additional optimizations before launch.',
        effects: {
          progress: 10,
          customMetrics: { second_iteration: true },
          budget: -10,
        },
        feedback: 'Attempting additional optimizations. May exceed timeline but worth it for better results.',
        risk: 5,
        timeCost: 2,
      },
      {
        id: 'accept',
        label: 'Accept current results',
        description: 'Ship with current improvements. Document what did not meet target.',
        effects: {
          progress: 8,
          customMetrics: { second_iteration: false },
        },
        feedback: 'Accepting current results. 39% improvement is good, though below 45% target. Will document in analysis.',
        risk: 3,
        timeCost: 0,
      },
    ],
  },

  // ============================================================================
  // PHASE 5: STAKEHOLDER PRESSURE
  // ============================================================================

  update_cto: {
    id: 'update_cto',
    name: 'Update CTO',
    description: 'Send technical update to CTO. Be honest about progress and challenges.',
    category: 'communication',
    urgency: 'high',
    choices: [
      {
        id: 'honest-update',
        label: 'Honest detailed update',
        description: 'Full transparency on results, good and bad.',
        effects: {
          progress: 5,
          stakeholderSatisfaction: { cto: 10 },
          customMetrics: { cto_trust: 85 },
        },
        feedback: 'CTO appreciates the honesty. "Good progress. I understand the challenges. Keep me posted."',
        risk: 1,
        timeCost: 1,
      },
      {
        id: 'optimistic-update',
        label: 'Optimistic update',
        description: 'Focus on positives, downplay issues.',
        effects: {
          progress: 3,
          stakeholderSatisfaction: { cto: 0 },
          customMetrics: { cto_trust: 60 },
        },
        feedback: 'CTO seems skeptical. "What about the P99 numbers? I want the full picture next time."',
        risk: 4,
        timeCost: 0.5,
      },
    ],
  },

  respond_to_cfo: {
    id: 'respond_to_cfo',
    name: 'Respond to CFO Questions',
    description: 'CFO is asking about budget and ROI. Address their concerns.',
    category: 'communication',
    urgency: 'high',
    choices: [
      {
        id: 'data-driven-response',
        label: 'Data-driven response',
        description: 'Concrete numbers on ROI and budget utilization.',
        effects: {
          progress: 5,
          stakeholderSatisfaction: { cfo: 15 },
          customMetrics: { cfo_buy_in: 80 },
        },
        feedback: 'CFO satisfied. "Good - you are staying within budget and showing results. Keep it up."',
        risk: 2,
        timeCost: 1,
      },
      {
        id: 'vague-response',
        label: 'Vague response',
        description: 'Avoid specific numbers.',
        effects: {
          progress: 2,
          stakeholderSatisfaction: { cfo: -10 },
          customMetrics: { cfo_buy_in: 50 },
        },
        feedback: 'CFO unhappy: "I need concrete numbers, not vague promises."',
        risk: 5,
        timeCost: 0.5,
      },
    ],
  },

  align_with_pm: {
    id: 'align_with_pm',
    name: 'Align with PM',
    description: 'PM wants to know impact on roadmap and features.',
    category: 'communication',
    urgency: 'medium',
    choices: [
      {
        id: 'full-alignment',
        label: 'Full alignment meeting',
        description: 'Comprehensive sync on scope and timeline.',
        effects: {
          progress: 4,
          stakeholderSatisfaction: { product: 10 },
        },
        feedback: 'PM aligned. "The performance work is on track. We can proceed with the payment features as planned."',
        risk: 2,
        timeCost: 1,
      },
      {
        id: 'quick-note',
        label: 'Quick note',
        description: 'Brief update to PM.',
        effects: {
          progress: 2,
        },
        feedback: 'PM acknowledged. Still some concerns about timeline but manageable.',
        risk: 3,
        timeCost: 0.5,
      },
    ],
  },

  // ============================================================================
  // PHASE 6: LAUNCH DECISION
  // ============================================================================

  make_launch_decision: {
    id: 'make_launch_decision',
    name: 'Make Launch Decision',
    description: 'Final Go/No-Go decision. Your career depends on this.',
    category: 'process',
    urgency: 'critical',
    choices: [
      {
        id: 'ship',
        label: 'SHIP - Go full production',
        description: 'Full rollout to all traffic.',
        effects: {
          progress: 20,
          customMetrics: { launch_decision: 'ship' },
        },
        feedback: 'SHIP chosen. Full confidence in the implementation. Rollback plan ready.',
        risk: 6,
        timeCost: 0,
      },
      {
        id: 'partial',
        label: 'PARTIAL - 5% rollout first',
        description: 'Start with 5% traffic, monitor closely.',
        effects: {
          progress: 15,
          customMetrics: { launch_decision: 'partial' },
        },
        feedback: 'PARTIAL chosen. Conservative approach - start small, scale if successful.',
        risk: 3,
        timeCost: 0,
      },
      {
        id: 'delay',
        label: 'DELAY - Not ready yet',
        description: 'Need more time to get it right.',
        effects: {
          progress: 5,
          stakeholderSatisfaction: { cto: -5 },
          customMetrics: { launch_decision: 'delay' },
        },
        feedback: 'DELAY chosen. Extra week needed for improvements. Risk of missing deadline but safety first.',
        risk: 2,
        timeCost: 0,
      },
    ],
  },

  prepare_rollback: {
    id: 'prepare_rollback',
    name: 'Prepare Rollback Procedures',
    description: 'Ensure rollback is ready just in case.',
    category: 'process',
    urgency: 'high',
    choices: [
      {
        id: 'verified-rollback',
        label: 'Tested rollback procedure',
        description: 'Full rollback test - know it works.',
        effects: {
          progress: 5,
          customMetrics: { rollback_verified: true },
        },
        feedback: 'Rollback tested and verified. Can restore previous state in <5 minutes.',
        risk: 1,
        timeCost: 1,
      },
      {
        id: 'documented-rollback',
        label: 'Documented only',
        description: 'Written procedure but not tested.',
        effects: {
          progress: 3,
          customMetrics: { rollback_verified: false },
        },
        feedback: 'Rollback documented but untested. Should work but not verified.',
        risk: 4,
        timeCost: 0.5,
      },
    ],
  },

  // ============================================================================
  // PHASE 7: OUTCOME
  // ============================================================================

  review_final_results: {
    id: 'review_final_results',
    name: 'Review Final Results',
    description: 'Review simulation outcome and learn from the experience.',
    category: 'process',
    urgency: 'low',
    choices: [
      {
        id: 'full-review',
        label: 'Complete review',
        description: 'Thorough analysis of what worked and what did not.',
        effects: {
          progress: 10,
        },
        feedback: 'Simulation complete. Final latency: 520ms (39% improvement). Success rate: 98.5%. Key learning: diagnosis accuracy matters.',
        risk: 0,
        timeCost: 1,
      },
    ],
  },
};

export default webDev01Actions;