import type { ArtifactDefinition, ArtifactEvaluationCriteria } from '../../evaluation/AIEvaluationTypes';

// ============================================================================
// WEB-DEV-01 ARTIFACT DEFINITIONS
// Engineering artifacts required for the checkout performance simulation
// ============================================================================

// ============================================================================
// ARTIFACT 1: SYSTEM DIAGNOSIS REPORT
// Phase 1 - Investigation
// ============================================================================

const diagnosisCriteria: ArtifactEvaluationCriteria = {
  depth: {
    weight: 0.25,
    description: 'Specificity of hypotheses - are they precise enough to act on?',
  },
  evidenceLinkage: {
    weight: 0.25,
    description: 'Each hypothesis must cite specific evidence (logs, metrics, observations)',
  },
  crossArtifactConsistency: {
    weight: 0.15,
    description: 'N/A for first artifact',
  },
  engineeringRealism: {
    weight: 0.20,
    description: 'Shows understanding of actual system behavior and performance characteristics',
  },
  constraintRespect: {
    weight: 0.15,
    description: 'Acknowledges constraints and limitations of diagnosis',
  },
};

export const artifactDiagnosis: ArtifactDefinition = {
  id: 'artifact-diagnosis',
  name: 'SYSTEM_DIAGNOSIS_REPORT.md',
  description: 'A technical diagnosis document identifying root causes of checkout performance issues. Must be specific enough to guide engineering decisions.',
  phaseDue: 1,
  required: true,
  canRevise: true,
  submitWork: true,
  showInCorner: true,
  sections: [
    {
      id: 'hypotheses',
      name: 'Root Cause Hypotheses',
      description: 'List 2-4 specific hypotheses about what is causing the performance issues',
      type: 'list',
      placeholder: '1. Missing indexes on frequently queried columns\n2. N+1 query pattern in checkout flow\n3. ...',
      required: true,
    },
    {
      id: 'confidence',
      name: 'Confidence Level',
      description: 'Rate your confidence in each hypothesis (0-1) and explain why',
      type: 'rating',
      placeholder: 'Hypothesis 1: 0.7 - Based on EXPLAIN ANALYZE showing sequential scans',
      required: true,
    },
    {
      id: 'evidence',
      name: 'Evidence References',
      description: 'What data supports each hypothesis? Cite specific logs, metrics, or observations',
      type: 'text',
      placeholder: 'Query logs show avg 850ms latency, DB CPU at 85%...',
      required: true,
    },
    {
      id: 'unknowns',
      name: 'Unknowns & Gaps',
      description: 'What dont you know? What would you investigate if you had more time?',
      type: 'text',
      placeholder: 'Limited visibility into Redis utilization...',
      required: true,
      maxLength: 500,
    },
  ],
  evaluationCriteria: diagnosisCriteria,
};

// ============================================================================
// ARTIFACT 2: TECH DECISION DOCUMENT
// Phase 2 - Architecture Decision
// ============================================================================

const techDecisionCriteria: ArtifactEvaluationCriteria = {
  depth: {
    weight: 0.20,
    description: 'Clear reasoning for why this approach over alternatives',
  },
  evidenceLinkage: {
    weight: 0.15,
    description: 'Evidence from diagnosis should inform the decision',
  },
  crossArtifactConsistency: {
    weight: 0.25,
    description: 'Must align with diagnosis - if diagnosis says caching is issue, decision should address it',
  },
  engineeringRealism: {
    weight: 0.20,
    description: 'Realistic timeline, resource requirements, and implementation complexity',
  },
  constraintRespect: {
    weight: 0.20,
    description: 'Explicitly addresses: budget, timeline, backward compatibility, team capacity',
  },
};

export const artifactTechDecision: ArtifactDefinition = {
  id: 'artifact-tech-decision',
  name: 'TECH_DECISION_DOC.md',
  description: 'Document explaining your architectural decision for what to fix. Must explain WHY this approach over alternatives.',
  phaseDue: 2,
  required: true,
  canRevise: false,
  submitWork: true,
  showInCorner: true,
  sections: [
    {
      id: 'decision',
      name: 'Decision',
      description: 'What are you choosing to implement? (One major change only)',
      type: 'text',
      placeholder: 'Implement Redis caching layer for product and pricing data',
      required: true,
    },
    {
      id: 'alternativesRejected',
      name: 'Alternatives Rejected',
      description: 'What other options did you consider? Why were they rejected?',
      type: 'list',
      placeholder: '- Database indexing: Would help but doesnt address repeated queries\n- Query rewrite: Too risky for timeline',
      required: true,
    },
    {
      id: 'expectedImpact',
      name: 'Expected Impact',
      description: 'What improvement do you expect? Be specific with numbers',
      type: 'text',
      placeholder: 'Expected 30-40% latency reduction based on similar implementations',
      required: true,
    },
    {
      id: 'risks',
      name: 'Risks & Mitigations',
      description: 'What could go wrong? How will you mitigate?',
      type: 'list',
      placeholder: '- Cache invalidation complexity\n- Redis connection issues\n- Backward compatibility',
      required: true,
    },
    {
      id: 'timeline',
      name: 'Implementation Timeline',
      description: 'Rough estimate of how long this will take',
      type: 'text',
      placeholder: '2 weeks for implementation, 1 week for testing',
      required: true,
    },
  ],
  evaluationCriteria: techDecisionCriteria,
};

// ============================================================================
// ARTIFACT 3: CODE IMPLEMENTATION
// Phase 3 - Implementation
// ============================================================================

const codeCriteria: ArtifactEvaluationCriteria = {
  depth: {
    weight: 0.15,
    description: 'N/A for code - covered by engineering realism',
  },
  evidenceLinkage: {
    weight: 0.10,
    description: 'Code should match the stated purpose and decision',
  },
  crossArtifactConsistency: {
    weight: 0.25,
    description: 'Code must implement what was decided in tech decision document',
  },
  engineeringRealism: {
    weight: 0.35,
    description: 'Is this valid, production-ready code? Would it actually solve the problem?',
  },
  constraintRespect: {
    weight: 0.15,
    description: 'Does code maintain backward compatibility? Include proper error handling?',
  },
};

export const artifactCode: ArtifactDefinition = {
  id: 'artifact-code',
  name: 'Implementation Code',
  description: 'Real code or configuration that implements your decision. Can be SQL, TypeScript, YAML, or other appropriate format.',
  phaseDue: 3,
  required: true,
  canRevise: true,
  submitWork: true,
  showInCorner: false,
  sections: [
    {
      id: 'language',
      name: 'Code Language',
      description: 'What language is this code in?',
      type: 'text',
      placeholder: 'sql, typescript, yaml, etc.',
      required: true,
    },
    {
      id: 'purpose',
      name: 'Purpose',
      description: 'What does this code do? How does it address the performance issue?',
      type: 'text',
      placeholder: 'Creates composite index on user_id and status for transaction queries',
      required: true,
    },
    {
      id: 'code',
      name: 'Code Snippet',
      description: 'Paste your actual code here',
      type: 'code',
      placeholder: 'CREATE INDEX idx_user_status...',
      required: true,
    },
    {
      id: 'notes',
      name: 'Implementation Notes',
      description: 'Any additional context about this implementation',
      type: 'text',
      placeholder: 'This index should be created concurrently...',
      required: false,
    },
  ],
  evaluationCriteria: codeCriteria,
};

// ============================================================================
// ARTIFACT 4: PULL REQUEST DESCRIPTION
// Phase 3 - Implementation
// ============================================================================

const prCriteria: ArtifactEvaluationCriteria = {
  depth: {
    weight: 0.15,
    description: 'Clear explanation of what changed and why',
  },
  evidenceLinkage: {
    weight: 0.10,
    description: 'References to diagnosis and decision documents',
  },
  crossArtifactConsistency: {
    weight: 0.20,
    description: 'PR description should match the code submitted',
  },
  engineeringRealism: {
    weight: 0.20,
    description: 'Professional PR with proper risk assessment',
  },
  constraintRespect: {
    weight: 0.35,
    description: 'MUST include rollback plan - critical for zero-downtime requirement',
  },
};

export const artifactPR: ArtifactDefinition = {
  id: 'artifact-pr',
  name: 'PULL_REQUEST.md',
  description: 'PR description that would accompany your code change in a real project. Must include rollback plan.',
  phaseDue: 3,
  required: true,
  canRevise: false,
  submitWork: true,
  showInCorner: true,
  sections: [
    {
      id: 'whatChanged',
      name: 'What Changed',
      description: 'Brief summary of what this PR does',
      type: 'text',
      placeholder: 'Added Redis caching for product and pricing data with 5-minute TTL',
      required: true,
    },
    {
      id: 'why',
      name: 'Why',
      description: 'Business/technical justification - what problem does this solve?',
      type: 'text',
      placeholder: 'Checkout latency currently 850ms. Caching will reduce redundant queries.',
      required: true,
    },
    {
      id: 'riskAreas',
      name: 'Risk Areas',
      description: 'What could go wrong? What should reviewers pay attention to?',
      type: 'list',
      placeholder: '- Cache invalidation timing\n- Redis connection failures\n- Memory usage under load',
      required: true,
    },
    {
      id: 'rollbackPlan',
      name: 'Rollback Plan',
      description: 'How do you undo this change if something goes wrong? (REQUIRED)',
      type: 'text',
      placeholder: '1. Disable feature flag\n2. Roll back K8s deployment\n3. Clear Redis cache if needed',
      required: true,
    },
  ],
  evaluationCriteria: prCriteria,
};

// ============================================================================
// ARTIFACT 5: PERFORMANCE ANALYSIS
// Phase 4 - Load Reality
// ============================================================================

const perfAnalysisCriteria: ArtifactEvaluationCriteria = {
  depth: {
    weight: 0.20,
    description: 'Thorough analysis of what worked vs what did not',
  },
  evidenceLinkage: {
    weight: 0.25,
    description: 'Specific metrics and data to support conclusions',
  },
  crossArtifactConsistency: {
    weight: 0.15,
    description: 'Does analysis align with previous decisions and expectations?',
  },
  engineeringRealism: {
    weight: 0.20,
    description: 'Honest assessment of results - not overselling success',
  },
  constraintRespect: {
    weight: 0.20,
    description: 'Did you stay within budget/timeline? What are the resource implications?',
  },
};

export const artifactPerfAnalysis: ArtifactDefinition = {
  id: 'artifact-perf-analysis',
  name: 'PERFORMANCE_ANALYSIS.md',
  description: 'Analysis of load test results. Be honest about what worked and what did not.',
  phaseDue: 4,
  required: true,
  canRevise: false,
  submitWork: true,
  showInCorner: true,
  sections: [
    {
      id: 'improvements',
      name: 'What Improved',
      description: 'What metrics got better? By how much?',
      type: 'list',
      placeholder: '- Latency: 850ms -> 520ms (39% improvement)\n- Query count: 15 -> 6 per checkout',
      required: true,
    },
    {
      id: 'didNotImprove',
      name: 'What Did Not Improve',
      description: 'What did not work as expected? Be honest.',
      type: 'list',
      placeholder: '- P99 latency still at 1200ms (target was 800ms)\n- Connection pool issues remain',
      required: true,
    },
    {
      id: 'newBottlenecks',
      name: 'New Issues Discovered',
      description: 'Did load testing reveal any new problems?',
      type: 'list',
      placeholder: '- Redis memory usage higher than expected\n- Cache invalidation race condition',
      required: true,
    },
    {
      id: 'nextSteps',
      name: 'Next Steps',
      description: 'What would you do next to further improve?',
      type: 'text',
      placeholder: 'Would recommend adding connection pooling + additional indexes',
      required: true,
    },
  ],
  evaluationCriteria: perfAnalysisCriteria,
};

// ============================================================================
// ARTIFACT 6: STAKEHOLDER COMMUNICATIONS
// Phase 5 - Stakeholder Pressure
// ============================================================================

const commsCriteria: ArtifactEvaluationCriteria = {
  depth: {
    weight: 0.15,
    description: 'Substance of communication - are you actually addressing concerns?',
  },
  evidenceLinkage: {
    weight: 0.15,
    description: 'Using data to support your statements',
  },
  crossArtifactConsistency: {
    weight: 0.15,
    description: 'Consistent message across all stakeholders',
  },
  engineeringRealism: {
    weight: 0.15,
    description: 'Professional, appropriate tone for each audience',
  },
  constraintRespect: {
    weight: 0.40,
    description: 'No vague language - be specific and definitive. Honesty over optimism.',
  },
};

export const artifactComms: ArtifactDefinition = {
  id: 'artifact-comms',
  name: 'Stakeholder Communications',
  description: 'Communications to CTO, CFO, and PM. Be specific, honest, and definitive.',
  phaseDue: 5,
  required: true,
  canRevise: false,
  submitWork: true,
  showInCorner: true,
  sections: [
    {
      id: 'ctoUpdate',
      name: 'CTO Update',
      description: 'Technical update to CTO - be honest about progress and challenges',
      type: 'text',
      placeholder: 'Sarah,\n\nProgress: Caching layer deployed, seeing 35% latency improvement...\n\nChallenges: P99 still above target...\n\nNext: Need to address connection pooling...',
      required: true,
    },
    {
      id: 'cfoResponse',
      name: 'CFO Response',
      description: 'Response to CFO budget questions',
      type: 'text',
      placeholder: 'Diana,\n\nCurrent spend: $32K of $85K budget...\n\nROI: Based on load tests, expect 40% reduction in DB costs...',
      required: true,
    },
    {
      id: 'pmAlignment',
      name: 'PM Alignment',
      description: 'Update to PM on scope and timeline impact',
      type: 'text',
      placeholder: 'The caching work is on track. Minimal impact to roadmap...',
      required: true,
    },
  ],
  evaluationCriteria: commsCriteria,
};

// ============================================================================
// ARTIFACT 7: LAUNCH DECISION
// Phase 6 - Launch Decision
// ============================================================================

const launchDecisionCriteria: ArtifactEvaluationCriteria = {
  depth: {
    weight: 0.20,
    description: 'Clear reasoning for the decision',
  },
  evidenceLinkage: {
    weight: 0.20,
    description: 'Based on data and analysis, not gut feel',
  },
  crossArtifactConsistency: {
    weight: 0.15,
    description: 'Consistent with everything learned throughout simulation',
  },
  engineeringRealism: {
    weight: 0.20,
    description: 'Realistic assessment of risks and准备好了吗',
  },
  constraintRespect: {
    weight: 0.25,
    description: 'Accepts ownership of decision and its consequences',
  },
};

export const artifactLaunchDecision: ArtifactDefinition = {
  id: 'artifact-launch-decision',
  name: 'LAUNCH_DECISION.md',
  description: 'Final Go/No-Go decision with justification. Own your decision.',
  phaseDue: 6,
  required: true,
  canRevise: false,
  submitWork: true,
  showInCorner: true,
  sections: [
    {
      id: 'decision',
      name: 'Decision',
      description: 'Ship, Delay, or Partial Rollout?',
      type: 'text',
      placeholder: 'SHIP / DELAY / PARTIAL (5% traffic)',
      required: true,
    },
    {
      id: 'justification',
      name: 'Justification',
      description: 'Why this decision? What data supports it?',
      type: 'text',
      placeholder: 'Latency improved 35% (target was 45%) but reliability improved to 99.2%...',
      required: true,
    },
    {
      id: 'risksAccepted',
      name: 'Risks Accepted',
      description: 'What risks are you accepting with this decision?',
      type: 'list',
      placeholder: '- May not hit 45% latency target\n- P99 still above desired threshold\n- Could need quick hotfix during BF',
      required: true,
    },
    {
      id: 'contingencies',
      name: 'Contingencies',
      description: 'What will you do if things go wrong?',
      type: 'list',
      placeholder: '- Immediate rollback procedure ready\n- On-call team briefed\n- Emergency zoom link with CTO',
      required: true,
    },
  ],
  evaluationCriteria: launchDecisionCriteria,
};

// ============================================================================
// ALL ARTIFACTS INDEX
// ============================================================================

export const webDev01Artifacts: ArtifactDefinition[] = [
  artifactDiagnosis,
  artifactTechDecision,
  artifactCode,
  artifactPR,
  artifactPerfAnalysis,
  artifactComms,
  artifactLaunchDecision,
];

export const getArtifactById = (id: string): ArtifactDefinition | undefined => {
  return webDev01Artifacts.find(a => a.id === id);
};

export const getArtifactsByPhase = (phase: number): ArtifactDefinition[] => {
  return webDev01Artifacts.filter(a => a.phaseDue === phase);
};

export default webDev01Artifacts;