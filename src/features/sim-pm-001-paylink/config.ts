/**
 * PayLink Simulation — Configuration
 *
 * ID: sim-pm-001
 * Archetype: Crisis Management (72-Hour Launch Crisis)
 *
 * ─────────────────────────────────────────────────────────────
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL PAYLINK OUTPUTS.
 * ─────────────────────────────────────────────────────────────
 */

import type {
    SimulationConfig,
    WeeklySignal,
    WeeklyEvent,
    WeeklyActionItem,
} from '../../shared/simulation/types';

// ─── Per-Week Signals ─────────────────────────────────────────
// ─── Per-Week Signals ─────────────────────────────────────────
const WEEKLY_SIGNALS: WeeklySignal[] = [
    // Week 1: The Crisis Emerges
    {
        id: 'sig-w1-1', week: 1, source: 'Compliance Team', sourceInitials: 'CT',
        sourceColor: 'bg-red-500/20 text-red-400',
        message: 'PCI-DSS audit flagged 3 critical gaps in the payment tokenisation layer. Legal is reviewing.',
        severity: 'critical', tags: ['compliance', 'legal'],
    },
    {
        id: 'sig-w1-2', week: 1, source: 'Engineering', sourceInitials: 'EN',
        sourceColor: 'bg-purple-500/20 text-purple-400',
        message: 'Staging environment shows 12% transaction failure rate under 500 concurrent users.',
        severity: 'critical', tags: ['technical', 'performance'],
    },
    {
        id: 'sig-w1-3', week: 1, source: 'Executive Office', sourceInitials: 'EO',
        sourceColor: 'bg-amber-500/20 text-amber-400',
        message: 'CEO Marcus Johnson confirms the board presentation is Friday. No delays permitted.',
        severity: 'warning', tags: ['executive', 'deadline'],
    },
    {
        id: 'sig-w1-4', week: 1, source: 'Customer Support', sourceInitials: 'CS',
        sourceColor: 'bg-blue-500/20 text-blue-400',
        message: 'Beta users are reporting slow checkout times (4s+). Conversion dropping.',
        severity: 'warning', tags: ['product', 'ux'],
    },

    // Week 2: The Pressure Mounts
    {
        id: 'sig-w2-1', week: 2, source: 'Compliance Team', sourceInitials: 'CT',
        sourceColor: 'bg-red-500/20 text-red-400',
        message: 'Compliance Lead David Park has formally escalated. Internal audit is questioning our risk controls.',
        severity: 'critical', tags: ['compliance', 'escalation'],
    },
    {
        id: 'sig-w2-2', week: 2, source: 'Engineering', sourceInitials: 'EN',
        sourceColor: 'bg-purple-500/20 text-purple-400',
        message: 'Hot-fix PR for concurrent user lag is 60% done. Sarah Chen estimates 18 more hours of dev.',
        severity: 'warning', tags: ['technical'],
    },
    {
        id: 'sig-w2-3', week: 2, source: 'Marketing', sourceInitials: 'MK',
        sourceColor: 'bg-emerald-500/20 text-emerald-400',
        message: 'Launch morning press coverage is locked. Retraction would cost $50k in agency fees.',
        severity: 'warning', tags: ['marketing', 'budget'],
    },
    {
        id: 'sig-w2-4', week: 2, source: 'HR', sourceInitials: 'HR',
        sourceColor: 'bg-gray-500/20 text-gray-400',
        message: 'Core backend team is reporting 14-hour days. Burnout risk is nearing critical.',
        severity: 'warning', tags: ['team', 'morale'],
    },

    // Week 3: The Moment of Truth
    {
        id: 'sig-w3-1', week: 3, source: 'Engineering', sourceInitials: 'EN',
        sourceColor: 'bg-purple-500/20 text-purple-400',
        message: 'Hot-fix deployed to canary. Transaction failure rate dropped to 2.8%. Load testing passing.',
        severity: 'info', tags: ['technical', 'resolved'],
    },
    {
        id: 'sig-w3-2', week: 3, source: 'Compliance Team', sourceInitials: 'CT',
        sourceColor: 'bg-emerald-500/20 text-emerald-400',
        message: 'Final remediation plan approved. Final clearance granted for GA launch.',
        severity: 'success', tags: ['compliance'],
    },
    {
        id: 'sig-w3-3', week: 3, source: 'CEO Office', sourceInitials: 'CE',
        sourceColor: 'bg-amber-500/20 text-amber-400',
        message: 'Marcus is on the call. The board is ready for the Go/No-Go confirmation.',
        severity: 'critical', tags: ['executive', 'urgent'],
    },
];

// ─── Per-Week Events ──────────────────────────────────────────
const WEEKLY_EVENTS: WeeklyEvent[] = [
    // Week 1
    {
        id: 'evt-w1-1', week: 1, type: 'meeting',
        timeInWeek: 300,
        title: 'Immediate Risk Briefing',
        description: 'Prepare your assessment memo. We need a clear summary of PCI gaps and the staging outage.',
        from: 'CEO Marcus Johnson', fromInitials: 'MJ', fromColor: 'bg-amber-500/20 text-amber-400',
        priority: 'high', requiresAction: true, actionId: 'action-w1-memo',
    },
    {
        id: 'evt-w1-2', week: 1, type: 'meeting',
        timeInWeek: 900,
        title: 'Emergency Triage Session',
        description: 'Join Sarah (CTO) to decide where to burn engineering hours: patches or compliance.',
        from: 'CTO Sarah Chen', fromInitials: 'SC', fromColor: 'bg-purple-500/20 text-purple-400',
        priority: 'urgent', requiresAction: true, actionId: 'action-w1-triage',
    },
    {
        id: 'evt-w1-3', week: 1, type: 'meeting',
        timeInWeek: 1600,
        title: 'Investor Alignment Sync',
        description: 'Key investors heard about the audit fail. They need reassurances before the Friday board meet.',
        from: 'Marcus Johnson', fromInitials: 'MJ', fromColor: 'bg-blue-500/20 text-blue-400',
        priority: 'high', requiresAction: true, actionId: 'action-w1-investors',
    },

    // Week 2
    {
        id: 'evt-w2-1', week: 2, type: 'request',
        title: 'Compliance Escalation Notice',
        description: 'David Park (Legal) has issued a formal warning. We need a decision on the launch blocker.',
        from: 'Compliance Lead', fromInitials: 'DP', fromColor: 'bg-red-500/20 text-red-400',
        priority: 'urgent', requiresAction: true, actionId: 'action-w2-compliance',
    },
    {
        id: 'evt-w2-2', week: 2, type: 'meeting',
        timeInWeek: 800,
        title: 'Team Morale Check-in',
        description: 'Engineering is burning out. Sarah wants to know how we can keep morale high during the final push.',
        from: 'CTO Sarah Chen', fromInitials: 'SC', fromColor: 'bg-purple-500/20 text-purple-400',
        priority: 'high', requiresAction: true, actionId: 'action-w2-morale',
    },

    // Week 3
    {
        id: 'evt-w3-1', week: 3, type: 'request',
        title: 'Final Launch Briefing Due',
        description: 'Submit your Go/No-Go recommendation. Include constraints, risks, and your rationale.',
        from: 'CEO Office', fromInitials: 'CE', fromColor: 'bg-amber-500/20 text-amber-400',
        priority: 'urgent', requiresAction: true, actionId: 'action-w3-final',
    },
    {
        id: 'evt-w3-2', week: 3, type: 'meeting',
        timeInWeek: 1200,
        title: 'Post-Decision Press Strategy',
        description: 'Marketing needs to know the final decision to align the PR launch sequence.',
        from: 'Marketing Team', fromInitials: 'MT', fromColor: 'bg-emerald-500/20 text-emerald-400',
        priority: 'high', requiresAction: true, actionId: 'action-w3-pr',
    },
];

// ─── Per-Week Rich Action Items ────────────────────────────────
const WEEKLY_ACTIONS: WeeklyActionItem[] = [
    // Week 1 Actions
    {
        id: 'action-w1-memo',
        week: 1,
        dueWeek: 1,
        title: 'Draft Assessment Memo',
        description: 'Document the 3 PCI gaps and 12% failure rate before the CEO goes to the Board.',
        category: 'document',
        actionType: 'decision_text',
        priority: 'high',
        decisionPrompt: 'Key Risk Summary for the Board',
        decisionPlaceholder: 'Identify top 3 risks and proposed mitigations...',
    },
    {
        id: 'action-w1-triage',
        week: 1,
        dueWeek: 1,
        title: 'Crisis Triage Decision',
        description: 'Resources are thin. Do we fix the crashes or the legal gaps first?',
        category: 'decision',
        actionType: 'choice',
        priority: 'urgent',
        choices: [
            { id: 'lead-compliance', label: 'Prioritize Compliance', description: 'Ensure legal safety first. Risks delaying launch.', impact: { riskLevel: 0.50 } },
            { id: 'fix-payments', label: 'Prioritize Payments', description: 'Patch the engine. Risks compliance breach.', impact: { riskLevel: 0.65, budget: -10000 } },
        ],
    },
    {
        id: 'action-w1-investors',
        week: 1,
        dueWeek: 1,
        title: 'Manage Investor Anxiety',
        description: 'Investors are nervous about the audit rumors. Define how we communicate the delay or risk.',
        category: 'decision',
        actionType: 'choice',
        priority: 'high',
        choices: [
            { id: 'inv-transparent', label: 'Extreme Transparency', description: 'Tell them everything. Risks panic but builds trust.', impact: { teamMorale: 5 } },
            { id: 'inv-contain', label: 'Containment Strategy', description: 'Minimal viable disclosure. Risks legal blowback.', impact: { riskLevel: 0.75 } },
        ],
    },
    {
        id: 'action-w1-alignment',
        week: 1,
        dueWeek: 1,
        title: 'Internal Team Alignment',
        description: 'Sync the product and eng teams on the new triage priorities.',
        category: 'task',
        actionType: 'task',
        priority: 'normal',
        taskChecklist: [
            { id: 't1', label: 'Send triage summary to CTO', required: true },
            { id: 't2', label: 'Update Jira priority for payment patches', required: true },
            { id: 't3', label: 'Schedule legal check-in for next week', required: false },
        ],
    },

    // Week 2 Actions
    {
        id: 'action-w2-compliance',
        week: 2,
        dueWeek: 2,
        title: 'Resolve Compliance Conflict',
        description: 'David is blocking. He wants a full audit re-run. CEO says launch or die.',
        category: 'decision',
        actionType: 'choice',
        priority: 'urgent',
        choices: [
            { id: 'delay-audit', label: 'Halt: Full Audit Re-run', description: 'Conservative path. 2-week delay guaranteed.', impact: { riskLevel: 0.20, teamMorale: -20 } },
            { id: 'bypass-audit', label: 'Bypass: Conditional Launch', description: 'Aggressive path. Launch with known risks.', impact: { riskLevel: 0.85, budget: -50000 } },
        ],
    },
    {
        id: 'action-w2-prd',
        week: 2,
        dueWeek: 2,
        title: 'Emergency PRD: Safety Gates',
        description: 'Define the circuit-breakers for the transaction engine to prevent total failure.',
        category: 'document',
        actionType: 'submit_prd',
        priority: 'high',
        prdTitle: 'Safety Gate v1.2 Specifications',
        prdFields: [
            { id: 'logic', label: 'Circuit Breaker Logic', type: 'textarea', required: true, placeholder: 'Describe when payments should be auto-disabled.' },
            { id: 'limit', label: 'Failure Rate Limit (%)', type: 'select', options: ['0.5%', '1.0%', '2.0%'], required: true },
            { id: 'backup', label: 'Secondary Provider', type: 'text', required: true, placeholder: 'Fallback gateway name...' },
        ],
    },
    {
        id: 'action-w2-morale',
        week: 2,
        dueWeek: 2,
        title: 'Combat Team Burnout',
        description: 'The team has worked 3 weekends. How do we keep them going until the launch?',
        category: 'decision',
        actionType: 'choice',
        priority: 'high',
        choices: [
            { id: 'incentives', label: 'Cash Bonuses & R&R', description: 'Immediate reward for sacrifice.', impact: { budget: -25000, teamMorale: 15 } },
            { id: 'scope-cut', label: 'Aggressive Scope Cut', description: 'Remove non-critical features to reduce load.', impact: { teamMorale: 20, riskLevel: -5 } },
        ],
    },

    // Week 3 Actions
    {
        id: 'action-w3-final',
        week: 3,
        dueWeek: 3,
        title: 'Final Go / No-Go Decision',
        description: 'The final board deck is printing. What is your final recommendation?',
        category: 'decision',
        actionType: 'decision_text',
        priority: 'urgent',
        decisionPrompt: 'Final Strategic Recommendation',
        decisionPlaceholder: 'RECOMMENDATION (Go/No-Go):\n...\n\nCRITICAL RISKS REMAINING:\n...\n\nIMMEDIATE NEXT STEPS:\n...',
    },
    {
        id: 'action-w3-pr',
        week: 3,
        dueWeek: 3,
        title: 'Align Launch PR Strategy',
        description: 'Finalize the public narrative. How do we explain the performance if it stammers?',
        category: 'decision',
        actionType: 'choice',
        priority: 'high',
        choices: [
            { id: 'pr-honest', label: 'The "Beta-First" Narrative', description: 'Position as a controlled release. Lowers expectations.', impact: { riskLevel: -10 } },
            { id: 'pr-bold', label: 'The "Revolutionary" Narrative', description: 'Full hype mode. High risk, high reward.', impact: { riskLevel: 10 } },
        ],
    },
    {
        id: 'action-w3-rollback',
        week: 3,
        dueWeek: 3,
        title: 'Draft Rollback Workflow',
        description: 'Submit the step-by-step plan for if we launch and the site goes down.',
        category: 'document',
        actionType: 'decision_text',
        priority: 'high',
        decisionPrompt: 'Contingency & Rollback Plan',
        decisionPlaceholder: 'Trigger Points for Rollback:\n1. ...\n2. ...\n\nRecovery Sequence:\n...',
    },
];

export const PAYLINK_CONFIG: SimulationConfig = {
    id: 'sim-pm-001',
    name: '72-Hour Launch Crisis',

    // ── Company Identity ───────────────────────────────────────
    companyName: 'PayLink',
    industry: 'Fintech / Payments',
    archetype: 'crisis',
    logo: '/logos/paylink.svg',
    primaryColor: '#ef4444',

    // ── Company Details ────────────────────────────────────────
    description: 'A fintech startup revolutionizing digital payments for small businesses.',
    founded: '2022',
    employees: '45',
    headquarters: 'San Francisco, CA',

    // ── Financial ─────────────────────────────────────────────
    budget: 250000,
    fundingStatus: 'Series A (Pre-IPO Prep)',

    // ── Challenge ─────────────────────────────────────────────
    challenge: '72 hours to prevent a pre-launch explosion.',
    challengeDetails: 'PayLink is set to launch on Friday. Marcus (CEO) is presenting to the Board. If we fail, trust is lost forever. Engineering is burning out, and Compliance is blocking the release.',
    totalWeeks: 3,
    teamSize: 8,
    durationHours: 72,
    difficulty: 'advanced',
    passThreshold: 60,
    strongPassThreshold: 85,
    projectType: 'Crisis Management',
    marketContext: 'Fintech — High competition, regulatory scrutiny.',
    technicalStack: 'React, Node.js, PostgreSQL, AWS',

    // ── KPIs ──────────────────────────────────────────────────
    kpis: [
        { id: 'morale', label: 'Team Morale', value: 45, maxValue: 100, status: 'warning', goal: '> 70', progress: 45 },
        { id: 'budget', label: 'Budget Utilisation', value: 78, maxValue: 100, status: 'good', goal: '< 100', progress: 78 },
        { id: 'compliance', label: 'Compliance Score', value: 22, maxValue: 100, status: 'critical', goal: '> 80', progress: 22 },
        { id: 'risk', label: 'Risk Level', value: 75, maxValue: 100, status: 'critical', goal: '< 20', progress: 75 },
    ],

    // ── Stakeholders ──────────────────────────────────────────
    stakeholders: [
        { id: 'ceo', name: 'Marcus Johnson', role: 'CEO', department: 'Executive', influence: 10, satisfaction: 40, communicationStyle: 'direct', concerns: ['timeline'], priorities: ['launch'] },
        { id: 'cto', name: 'Sarah Chen', role: 'CTO', department: 'Engineering', influence: 9, satisfaction: 55, communicationStyle: 'analytical', concerns: ['stability'], priorities: ['reliability'] },
        { id: 'compliance', name: 'David Park', role: 'Compliance Lead', department: 'Legal', influence: 8, satisfaction: 30, communicationStyle: 'formal', concerns: ['audit'], priorities: ['compliance'] },
    ],

    // ── Success Criteria ──────────────────────────────────────
    successCriteria: [
        { id: 'sc-1', description: 'Complete Week 1 Crisis Assessment', completed: false, weekDue: 1, priority: 'high' },
        { id: 'sc-2', description: 'Resolve Week 2 Compliance Conflict', completed: false, weekDue: 2, priority: 'high' },
        { id: 'sc-3', description: 'Final Go/No-Go Decision Submitted', completed: false, weekDue: 3, priority: 'high' },
        { id: 'sc-4', description: 'Reach Compliance Score > 70%', completed: false, weekDue: 3, priority: 'medium' },
    ],

    // ── Roadmap (3 Weeks, 3 Wins per Week) ─────────────────────
    timelinePhases: [
        // Week 1: Survival
        { id: 'w1-p1', name: 'Crisis Triage', status: 'active', description: 'Map all critical vulnerabilities and establish immediate engineering priorities.', actionId: 'action-w1-triage' },
        { id: 'w1-p2', week: 1, name: 'Risk Mapping', status: 'pending', description: 'Identify and document the 3 top architectural risks for board visibility.', actionId: 'action-w1-memo' },
        { id: 'w1-p3', week: 1, name: 'Investor Buy-in', status: 'pending', description: 'Secure consensus from primary investors on the emergency path forward.', actionId: 'action-w1-investors' },

        // Week 2: Fortification
        { id: 'w2-p1', name: 'Compliance Patching', status: 'pending', description: 'Resolve critical data privacy gaps to prevent a legal launch block.', actionId: 'action-w2-compliance' },
        { id: 'w2-p2', week: 2, name: 'Stabilization MVP', status: 'pending', description: 'Deploy payment circuit-breakers to ensure 99.9% uptime during load.', actionId: 'action-w2-prd' },
        { id: 'w2-p3', week: 2, name: 'Operational Capacity', status: 'pending', description: 'Align internal teams on launch-day playbooks and burnout mitigation.', actionId: 'action-w2-morale' },

        // Week 3: Execution
        { id: 'w3-p1', name: 'Final Decision', status: 'pending', description: 'Submit the formal Go/No-Go recommendation to the CEO and Board.', actionId: 'action-w3-final' },
        { id: 'w3-p2', week: 3, name: 'Internal Hype', status: 'pending', description: 'Execute the internal and external communication strategy for GA.', actionId: 'action-w3-pr' },
        { id: 'w3-p3', week: 3, name: 'Rollback Readiness', status: 'pending', description: 'Secure the fail-safe workflow to protect brand equity in case of failure.', actionId: 'action-w3-rollback' },
    ],

    // ── Content (ALL editable outputs live here) ──────────────
    currentRisks: [
        { id: 'risk-1', title: 'Audit Failure', severity: 'critical', likelihood: 'high' },
        { id: 'risk-2', title: 'Service Downtime', severity: 'high', likelihood: 'medium' },
    ],
    tasks: [],
    actions: [],

    // ── Rich Content ──────────────────────────────────────────
    weeklySignals: WEEKLY_SIGNALS,
    weeklyEvents: WEEKLY_EVENTS,
    weeklyActions: WEEKLY_ACTIONS,
};

export default PAYLINK_CONFIG;
