/**
 * PM-001: PayLink - 72-Hour Launch Crisis
 * Complete simulation content with evaluation rubrics, stakeholder challenges, and guidance
 */

import type { WeeklySignal, WeeklyEvent, WeeklyActionItem, ActionChoice } from '../../shared/simulation/types';

// ============================================================
// EVALUATION RUBRICS
// Each task has specific scoring criteria (0-100)
// ============================================================

export const pm001EvaluationRubrics = {
  crisis_assessment: {
    criteria: [
      { id: 'completeness', label: 'Completeness', weight: 0.3, description: 'All critical issues identified' },
      { id: 'severity_accuracy', label: 'Severity Accuracy', weight: 0.25, description: 'Correct prioritization of threats' },
      { id: 'clarity', label: 'Clarity', weight: 0.25, description: 'Clear, actionable language' },
      { id: 'timeliness', label: 'Timeliness', weight: 0.2, description: 'Completed within 6-hour window' },
    ],
    examples: {
      excellent: 'Identified compliance, technical debt, and CEO pressure. Ranked compliance as critical (regulatory risk), technical debt as high (system failure), CEO pressure as high (relationship risk). Provided specific evidence for each.',
      poor: 'Listed "some issues" without specifics. Did not prioritize or provide evidence.',
    },
  },
  stakeholder_comms: {
    criteria: [
      { id: 'recommendation_clarity', label: 'Recommendation Clarity', weight: 0.3, description: 'Clear, unambiguous recommendation' },
      { id: 'data_support', label: 'Data Support', weight: 0.3, description: 'Evidence-backed justification' },
      { id: 'risk_acknowledgment', label: 'Risk Acknowledgment', weight: 0.25, description: 'Explicit tradeoffs discussed' },
      { id: 'tone', label: 'Tone', weight: 0.15, description: 'Appropriate for CEO audience' },
    ],
    examples: {
      excellent: 'Recommendation: "Delay launch 2 weeks." Supported with: compliance checklist gaps (3 critical), failure rate projections (15% without fixes), revenue impact analysis ($50K delay vs $500K failure cost).',
      poor: 'Suggested "maybe we should consider waiting" without data or clear reasoning.',
    },
  },
  decision_memo: {
    criteria: [
      { id: 'decision_clarity', label: 'Decision Clarity', weight: 0.35, description: 'Unambiguous Go/No-Go decision' },
      { id: 'contingency_plan', label: 'Contingency Plan', weight: 0.3, description: 'Detailed backup strategy' },
      { id: 'stakeholder_alignment', label: 'Stakeholder Alignment', weight: 0.25, description: 'Addresses all stakeholder concerns' },
      { id: 'execution_readiness', label: 'Execution Readiness', weight: 0.1, description: 'Clear next steps defined' },
    ],
    examples: {
      excellent: 'Decision: NO-GO for Friday launch. Contingency: Phased rollout starting Week 3 with 10% traffic, full launch Week 5. Alignment: CEO briefed on $500K risk, CTO committed to 2-week fix sprint, Compliance provided checklist.',
      poor: 'Undecided or "launch anyway" without addressing compliance gaps.',
    },
  },
};

// ============================================================
// WEEKLY SIGNALS (Week-by-week incoming information)
// ============================================================

export const pm001WeeklySignals: WeeklySignal[] = [
  {
    id: 'pm001-sig-w1-01',
    week: 1,
    source: 'David Park',
    sourceInitials: 'DP',
    sourceColor: 'bg-red-500/20 text-red-400',
    message: 'COMPLIANCE ALERT: Found 3 critical gaps in payment flow. Cannot approve launch without fixes. Details in compliance report.',
    severity: 'critical',
    tags: ['compliance', 'launch-blocker'],
  },
  {
    id: 'pm001-sig-w1-02',
    week: 1,
    source: 'Sarah Chen',
    sourceInitials: 'SC',
    sourceColor: 'bg-purple-500/20 text-purple-400',
    message: 'Engineering flagged payment retry logic has 40% failure rate under load. This is technical debt from Q1 rush.',
    severity: 'warning',
    tags: ['technical-debt', 'engineering'],
  },
  {
    id: 'pm001-sig-w1-03',
    week: 1,
    source: 'Marcus Johnson',
    sourceInitials: 'MJ',
    sourceColor: 'bg-primary/20 text-primary',
    message: 'We committed to investors for Q4 launch. Delay is NOT an option. What do you need to make this happen?',
    severity: 'critical',
    tags: ['leadership', 'pressure'],
  },
  {
    id: 'pm001-sig-w2-01',
    week: 2,
    source: 'Customer Support',
    sourceInitials: 'CS',
    sourceColor: 'bg-blue-500/20 text-blue-400',
    message: 'Beta users reporting confusion on new checkout flow. 23% abandonment rate in testing.',
    severity: 'warning',
    tags: ['ux', 'beta-feedback'],
  },
  {
    id: 'pm001-sig-w3-01',
    week: 3,
    source: 'Marcus Johnson',
    sourceInitials: 'MJ',
    sourceColor: 'bg-primary/20 text-primary',
    message: 'Board meeting in 2 weeks. Need to show progress. Can we do a soft launch to limited users?',
    severity: 'info',
    tags: ['leadership', 'compromise'],
  },
];

// ============================================================
// WEEKLY EVENTS (Scheduled occurrences - meetings, deadlines, etc.)
// ============================================================

export const pm001WeeklyEvents: WeeklyEvent[] = [
  {
    id: 'pm001-evt-w1-ceo-brief',
    week: 1,
    type: 'meeting',
    title: 'Emergency CEO Briefing',
    description: 'Marcus wants an immediate briefing on the compliance issues and your recommendation.',
    from: 'Marcus Johnson (CEO)',
    fromInitials: 'MJ',
    fromColor: 'bg-primary/20 text-primary',
    priority: 'urgent',
    requiresAction: true,
    actionId: 'pm001-w1-ceo-briefing',
    timeInWeek: 300, // 5 minutes into the week
  },
  {
    id: 'pm001-evt-w1-compliance-deadline',
    week: 1,
    type: 'notification',
    title: 'Compliance Review Deadline',
    description: 'David Park needs your crisis assessment by end of week to begin remediation planning.',
    from: 'David Park',
    fromInitials: 'DP',
    fromColor: 'bg-red-500/20 text-red-400',
    priority: 'high',
    requiresAction: false,
    timeInWeek: 1500, // 25 minutes into the week (5 min before week end)
  },
  {
    id: 'pm001-evt-w2-tech-review',
    week: 2,
    type: 'meeting',
    title: 'Technical Deep Dive',
    description: 'Sarah Chen wants to walk you through the technical debt issues and proposed fixes.',
    from: 'Sarah Chen',
    fromInitials: 'SC',
    fromColor: 'bg-purple-500/20 text-purple-400',
    priority: 'high',
    requiresAction: true,
    actionId: 'pm001-w2-tech-review',
    timeInWeek: 600,
  },
  {
    id: 'pm001-evt-w3-board-prep',
    week: 3,
    type: 'meeting',
    title: 'Board Update Preparation',
    description: 'Prepare launch status update for Marcus ahead of board meeting.',
    from: 'Marcus Johnson',
    fromInitials: 'MJ',
    fromColor: 'bg-primary/20 text-primary',
    priority: 'normal',
    requiresAction: true,
    actionId: 'pm001-w3-board-update',
    timeInWeek: 900,
  },
];

// ============================================================
// WEEKLY ACTIONS (User tasks with clear objectives)
// ============================================================

export const pm001WeeklyActions: WeeklyActionItem[] = [
  // === WEEK 1: Crisis Assessment Phase ===
  {
    id: 'pm001-w1-triage',
    week: 1,
    title: 'Crisis Triage: Assess All Issues',
    description: 'Review the compliance report, engineering assessment, and business impact. Create a comprehensive list of all issues with severity ratings.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'urgent',
    dueWeek: 1,
    prdTitle: 'Crisis Assessment Document',
    prdFields: [
      { id: 'issues', label: 'List all critical issues', type: 'textarea', placeholder: 'e.g., "Compliance Gap #1: PCI-DSS requirement 4.1 not met - card data transmitted unencrypted"', required: true },
      { id: 'severity', label: 'Severity ranking (1=Critical, 3=Low)', type: 'textarea', placeholder: 'Rank each issue by business impact', required: true },
      { id: 'evidence', label: 'Supporting evidence', type: 'textarea', placeholder: 'Link to reports, metrics, or testimonials', required: true },
    ],
  },
  {
    id: 'pm001-w1-ceo-briefing',
    week: 1,
    title: 'CEO Briefing: Present Findings',
    description: 'Communicate your assessment to Marcus. Be direct about risks and provide a clear recommendation.',
    category: 'decision',
    actionType: 'choice',
    priority: 'urgent',
    dueWeek: 1,
    choices: [
      {
        id: 'recommend-delay',
        label: 'Recommend 2-week delay',
        description: 'Prioritize compliance and stability. Risk: CEO frustration, investor concerns. Benefit: Avoid regulatory penalties and system failures.',
      },
      {
        id: 'recommend-phased',
        label: 'Recommend phased launch (10% traffic)',
        description: 'Limited rollout to test compliance fixes. Risk: Slower revenue. Benefit: Real-world testing with controlled exposure.',
      },
      {
        id: 'recommend-launch',
        label: 'Recommend launch as planned',
        description: 'Proceed with Friday launch. Risk: Compliance violations, system failures. Benefit: Meet investor commitments.',
      },
    ],
  },
  {
    id: 'pm001-w1-stakeholder-align',
    week: 1,
    title: 'Stakeholder Alignment Check',
    description: 'Meet with Sarah (CTO) and David (Compliance) to validate your assessment and get their buy-in.',
    category: 'task',
    actionType: 'task',
    priority: 'high',
    dueWeek: 1,
    taskChecklist: [
      { id: 'meet-cto', label: 'Meet with Sarah Chen to review technical risks', required: true },
      { id: 'meet-compliance', label: 'Meet with David Park to understand compliance gaps', required: true },
      { id: 'document-alignment', label: 'Document areas of agreement/disagreement', required: true },
    ],
  },

  // === WEEK 2: Decision Phase ===
  {
    id: 'pm001-w2-decision-memo',
    week: 2,
    title: 'Submit Go/No-Go Decision',
    description: 'Make the final call. Document your decision with justification, contingency plan, and stakeholder alignment status.',
    category: 'decision',
    actionType: 'decision_text',
    priority: 'urgent',
    dueWeek: 2,
    decisionPrompt: 'Write your Go/No-Go decision memo (minimum 200 words). Include: 1) Clear decision, 2) Data-backed justification, 3) Contingency plan, 4) Stakeholder alignment status.',
    decisionPlaceholder: 'DECISION: [Go/No-Go]...\n\nJUSTIFICATION:\n- Compliance Status: ...\n- Technical Readiness: ...\n- Business Impact: ...\n\nCONTINGENCY PLAN:\n- If we encounter X: ...\n- Rollback strategy: ...\n\nSTAKEHOLDER ALIGNMENT:\n- CEO: ...\n- CTO: ...\n- Compliance: ...',
  },
  {
    id: 'pm001-w2-fix-plan',
    week: 2,
    title: 'Define Remediation Plan (if No-Go)',
    description: 'If you chose No-Go, outline the specific fixes needed. If Go, outline monitoring plan.',
    category: 'task',
    actionType: 'task',
    priority: 'high',
    dueWeek: 2,
    taskChecklist: [
      { id: 'fix-list', label: 'List all fixes required', required: false },
      { id: 'timeline', label: 'Estimate timeline for each fix', required: false },
      { id: 'owners', label: 'Assign ownership for each fix', required: false },
      { id: 'monitoring', label: 'Define success metrics', required: false },
    ],
  },

  // === WEEK 3: Execution Phase ===
  {
    id: 'pm001-w3-board-update',
    week: 3,
    title: 'Board Update Preparation',
    description: 'Marcus needs an update for the board. Prepare a 1-page summary of launch status.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'normal',
    dueWeek: 3,
    prdTitle: 'Board Update Summary',
    prdFields: [
      { id: 'status', label: 'Current Launch Status', type: 'select', options: ['On Track', 'At Risk', 'Delayed', 'Cancelled'], required: true },
      { id: 'summary', label: 'Executive Summary (3 sentences max)', type: 'textarea', placeholder: 'Key updates for board members', required: true },
      { id: 'risks', label: 'Top 3 Risks', type: 'textarea', required: true },
    ],
  },
  {
    id: 'pm001-w3-lessons-learned',
    week: 3,
    title: 'Document Lessons Learned',
    description: 'Capture insights from this crisis to improve future launches.',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'low',
    dueWeek: 3,
    prdTitle: 'Lessons Learned Document',
    prdFields: [
      { id: 'what-went-wrong', label: 'What went wrong?', type: 'textarea', required: true },
      { id: 'what-went-right', label: 'What went well?', type: 'textarea', required: true },
      { id: 'process-improvements', label: 'Recommended process improvements', type: 'textarea', required: true },
    ],
  },
];

// ============================================================
// STAKEHOLDER CHALLENGES
// Contextual challenges based on user decisions
// ============================================================

export const pm001StakeholderChallenges = {
  ceo: {
    'vague-recommendation': {
      trigger: ['hopefully', 'maybe', 'might', 'probably', 'we think'],
      challenge: {
        stakeholderId: 'ceo',
        channel: 'slack',
        subject: 'Need clarity on your recommendation',
        message: 'I need a clear answer, not hedging. Are we launching Friday or not? What exactly do you recommend and why?',
        context: 'Vague language in CEO briefing',
        timeoutMinutes: 10,
      },
    },
    'no-data-support': {
      triggerKeywords: ['believe', 'feel', 'think'],
      missingKeywords: ['data', 'analysis', 'evidence', 'metrics', 'cost'],
      challenge: {
        stakeholderId: 'ceo',
        channel: 'meeting',
        subject: 'Where is the data?',
        message: 'You are asking me to delay launch without hard numbers. What is the actual cost of delay vs. cost of failure? I need specifics.',
        context: 'CEO briefing lacks data support',
        timeoutMinutes: 15,
      },
    },
    'launch-without-compliance': {
      condition: (decisions: any[]) => {
        const ceoBriefing = decisions.find(d => d.actionId === 'pm001-w1-ceo-briefing');
        return ceoBriefing?.choiceId === 'recommend-launch';
      },
      challenge: {
        stakeholderId: 'ceo',
        channel: 'meeting',
        subject: 'Compliance is a hard no',
        message: 'David Park just escalated to me. If we launch without compliance sign-off, we face regulatory fines up to $500K. Do you still recommend launch?',
        context: 'Recommending launch without addressing compliance',
        timeoutMinutes: 5,
      },
    },
  },
  cto: {
    'contradicts-tech-assessment': {
      triggerKeywords: ['quick fix', 'simple change', 'minor update'],
      challenge: {
        stakeholderId: 'cto',
        channel: 'slack',
        subject: 'Technical reality check',
        message: 'I reviewed your assessment. There is no "quick fix" for technical debt that has been building for 6 months. This is a 2-week minimum effort. Can you adjust your recommendation?',
        context: 'Underestimating technical complexity',
        timeoutMinutes: 20,
      },
    },
    'ignores-cto-input': {
      condition: (decisions: any[]) => {
        const stakeholderAlign = decisions.find(d => d.actionId === 'pm001-w1-stakeholder-align');
        return !stakeholderAlign; // Skipped the alignment meeting
      },
      challenge: {
        stakeholderId: 'cto',
        channel: 'email',
        subject: 'Concerned about lack of alignment',
        message: 'I noticed we did not meet to discuss technical risks. I want to ensure you have all the information before making your recommendation. Can we schedule time today?',
        context: 'Did not meet with CTO for alignment',
        timeoutMinutes: 30,
      },
    },
  },
  compliance: {
    'unclear-compliance-status': {
      triggerKeywords: ['mostly compliant', 'mostly ready', 'almost there'],
      challenge: {
        stakeholderId: 'compliance',
        channel: 'email',
        subject: 'Compliance is binary',
        message: 'There is no "mostly compliant". We either meet PCI-DSS requirements or we do not. Currently, we do not. Launch without compliance sign-off exposes the company to regulatory action.',
        context: 'Ambiguous compliance status',
        timeoutMinutes: 15,
      },
    },
  },
};

// ============================================================
// IN-CONTEXT GUIDANCE (Hints shown to users)
// ============================================================

export const pm001Guidance = {
  week1: {
    opening: `You are the Senior PM at PayLink. Launch day is in 72 hours. Compliance just flagged critical issues, the CTO found technical debt, and the CEO is pushing to launch anyway.`,
    hints: [
      'Start by reading the compliance report and engineering assessment thoroughly',
      'Prioritize issues by business impact, not technical complexity',
      'Remember: Compliance in fintech is not optional - regulatory fines can exceed $500K',
      'The CEO cares about investor relationships and revenue - frame your recommendation accordingly',
    ],
    stakeholderTips: {
      ceo: 'Be direct and data-driven. Marcus values honesty but needs business justification.',
      cto: 'Sarah is analytical - she wants to see you understand the technical tradeoffs.',
      compliance: 'David is formal and risk-averse. Show him you take compliance seriously.',
    },
  },
  week2: {
    opening: `You have completed your assessment. Now you must make the final Go/No-Go decision. This will impact the company's future.`,
    hints: [
      'Your decision should follow logically from your Week 1 assessment',
      'Include a contingency plan - what if your decision proves wrong?',
      'Address all stakeholder concerns explicitly',
      'A "No-Go" decision requires a clear remediation plan',
    ],
  },
  week3: {
    opening: `The immediate crisis has passed. Now focus on execution and learning from this experience.`,
    hints: [
      'Document lessons learned while they are fresh',
      'Consider process improvements to prevent future crises',
      'Think about how to rebuild team trust if the decision was contentious',
    ],
  },
};
