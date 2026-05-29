/**
 * NewWave Simulation — Configuration
 *
 * ID: sim-pm-004
 * Archetype: Zero-to-One (Product Discovery in Ambiguity)
 */

import type { SimulationConfig } from '../../shared/simulation/types';

export const NEWWAVE_CONFIG: SimulationConfig = {
    id: 'sim-pm-004',
    name: 'The New Frontier',

    companyName: 'NewWave',
    industry: 'EdTech',
    archetype: 'zero_to_one',
    logo: '/logos/newwave.svg',
    primaryColor: '#14b8a6',   // Teal — fresh, discovery

    description: 'An emerging EdTech startup focused on personalized learning for working professionals.',
    founded: '2023',
    employees: '18',
    headquarters: 'Denver, CO',

    budget: 150_000,
    fundingStatus: 'Seed ($3M)',

    challenge: 'Finding Product-Market Fit',
    challengeDetails: `You are the founding PM at NewWave. The CEO says: "We need a new revenue stream. Figure it out."
No problem defined. No users interviewed. Just ambiguity and 3 months of runway.

How do you find the right opportunity when you don't know what you don't know?`,

    totalWeeks: 6,
    teamSize: 5,
    durationHours: 40,
    difficulty: 'intermediate',
    passThreshold: 55,
    strongPassThreshold: 80,
    projectType: 'Product Discovery',
    marketContext: 'EdTech — Post-pandemic learning fatigue, AI-disrupted certification market. B2B corporate training growing +35% YoY.',
    technicalStack: 'React Native, Firebase, AWS Amplify',

    kpis: [
        { id: 'hypothesis', label: 'Hypotheses Validated', value: 0, maxValue: 5, status: 'critical', goal: 'Validate at least 3 hypotheses', progress: 0 },
        { id: 'interviews', label: 'User Interviews', value: 0, maxValue: 10, status: 'critical', goal: 'Conduct 10+ interviews', progress: 0 },
        { id: 'budget', label: 'Research Budget', value: 100, maxValue: 100, trend: { direction: 'down', value: '-5%', color: 'yellow' }, status: 'good', goal: 'Allocate budget wisely', progress: 100 },
        { id: 'runway', label: 'Runway Remaining', value: 90, maxValue: 100, trend: { direction: 'down', value: '-10 days', color: 'red' }, status: 'warning', goal: 'Find PMF before 90 days', progress: 90 },
        { id: 'pmf', label: 'PMF Signal Strength', value: 0, maxValue: 100, status: 'critical', goal: 'Achieve 40% would-be-disappointed score', progress: 0 },
        { id: 'stakeholder', label: 'CEO Confidence', value: 40, maxValue: 100, status: 'warning', goal: 'Reach 75% CEO confidence', progress: 40 },
    ],

    stakeholders: [
        { id: 'ceo', name: 'Emma Rodriguez', role: 'CEO', department: 'Executive', influence: 10, satisfaction: 50, communicationStyle: 'direct', concerns: ['revenue', 'runway'], priorities: ['quick_wins'] },
        { id: 'founder', name: 'Mike Chen', role: 'Founder / CTO', department: 'Leadership', influence: 10, satisfaction: 60, communicationStyle: 'visionary', concerns: ['product_direction', 'market_fit'], priorities: ['innovation'] },
        { id: 'advisor', name: 'Sarah Lin', role: 'Board Advisor', department: 'Board', influence: 6, satisfaction: 55, communicationStyle: 'analytical', concerns: ['focus', 'prioritization'], priorities: ['resource_efficiency'] },
    ],

    successCriteria: [
        { id: 'sc-1', description: 'Identify 3 distinct market opportunity hypotheses', completed: false, weekDue: 1, priority: 'high' },
        { id: 'sc-2', description: 'Conduct 10+ structured user interviews with target persona', completed: false, weekDue: 3, priority: 'high' },
        { id: 'sc-3', description: 'Pivot or double down on primary hypothesis with data', completed: false, weekDue: 3, priority: 'high' },
        { id: 'sc-4', description: 'Define MVP concept with measurable success criteria', completed: false, weekDue: 4, priority: 'high' },
        { id: 'sc-5', description: 'Create go-to-market plan with channel strategy', completed: false, weekDue: 5, priority: 'high' },
        { id: 'sc-6', description: 'Present business case to CEO with funding ask', completed: false, weekDue: 6, priority: 'high' },
    ],

    timelinePhases: [
        { id: 'phase1', name: 'Opportunity Mapping', status: 'active', description: 'Generate and rank market opportunity hypotheses.' },
        { id: 'phase2', name: 'User Discovery', status: 'pending', description: 'Validate or invalidate hypotheses via interviews and experiments.' },
        { id: 'phase3', name: 'MVP Definition', status: 'pending', description: 'Design the minimum viable product for the validated opportunity.' },
        { id: 'phase4', name: 'Go-to-Market Strategy', status: 'pending', description: 'Plan acquisition, positioning, and launch sequencing.' },
    ],

    currentRisks: [
        { id: 'r1', title: 'No clear problem definition — building in a vacuum', severity: 'critical', likelihood: 'certain' },
        { id: 'r2', title: 'Limited runway — 90 days before next funding is needed', severity: 'critical', likelihood: 'certain' },
        { id: 'r3', title: 'CEO may not accept a pivot away from original vision', severity: 'high', likelihood: 'medium' },
        { id: 'r4', title: 'B2B vs B2C decision affects entire technical architecture', severity: 'high', likelihood: 'certain' },
    ],

    tasks: [
        { id: 't1', type: 'opportunity_analysis', title: 'Market Opportunity Scan', description: 'Identify potential market opportunities using secondary research and frameworks.', requirements: ['Market size estimation (TAM/SAM/SOM)', 'Competition mapping', 'Initial hypothesis ranking'] },
        { id: 't2', type: 'user_research', title: 'User Discovery Sprint', description: 'Conduct structured user interviews to validate hypotheses.', requirements: ['Interview methodology doc', 'Synthesis of key insights', 'Hypothesis validation/invalidation decision'] },
        { id: 't3', type: 'mvp_concept', title: 'MVP Definition', description: 'Define the minimum viable product for the top validated opportunity.', requirements: ['Core feature set (scope)', 'Target user persona', 'Success criteria for MVP', 'Build/buy/partner decision'] },
        { id: 't4', type: 'gtm_plan', title: 'Go-to-Market Strategy', description: 'Plan launch approach and initial user acquisition.', requirements: ['Acquisition channels', 'Positioning and messaging', 'Launch timeline', 'Success metrics'] },
    ],

    actions: [
        {
            id: 'initial_direction',
            name: 'Week 1: How do you determine where to focus?',
            description: 'No brief exists. No market research has been done. The CEO said "figure it out." Where do you start?',
            choices: [
                { id: 'desk_research', label: 'Secondary Research First', description: 'Spend Week 1 on market research. Reports, competitor analysis, trend data. Build a hypothesis list before talking to users.', impact: { riskLevel: 0.35 } },
                { id: 'founder_interviews', label: 'Interview the CEO and Founder First', description: 'Spend Day 1-2 deeply interviewing internal stakeholders to extract their vision and constraints before going external.', impact: { riskLevel: 0.30 } },
                { id: 'user_blitz', label: 'Jump Straight to User Interviews', description: '5 user calls in Week 1. Talk to potential customers with open-ended questions before forming hypotheses.', impact: { riskLevel: 0.40 } },
            ],
        },
        {
            id: 'pivot_decision',
            name: 'Your interviews reveal surprising data',
            description: 'Week 3: User research shows ZERO interest in your top hypothesis (B2C tutoring app). But 3 interviewees independently mentioned they\'d pay for "AI-assisted corporate training" for their teams.',
            weekAvailable: 3,
            choices: [
                { id: 'pivot_b2b', label: 'Pivot Hard to B2B Corporate Training', description: 'Invalidate your original hypothesis. Redirect all resources to the B2B signal. Higher ACV, longer sales cycle.', impact: { riskLevel: 0.35, teamMorale: 60 } },
                { id: 'validate_more', label: 'Run 5 More Interviews Before Pivoting', description: 'The signal is real but small. Spend another week getting more B2B data before committing the pivot.', impact: { riskLevel: 0.30, teamMorale: 65 } },
                { id: 'stick_original', label: 'Stay the Course — B2C Was the Plan', description: 'Three interviews is not enough data. Continue validating the original B2C hypothesis with more research.', impact: { riskLevel: 0.50, teamMorale: 55 } },
            ],
        },
        {
            id: 'ceo_presentation',
            name: 'Week 6: Present your findings and funding ask to the CEO',
            description: 'Final week. You\'ve done the research. Now Emma (CEO) needs to hear your recommendation and decide whether to continue investing in this direction.',
            weekAvailable: 6,
            choices: [
                { id: 'confident_pitch', label: 'Bold Pitch — "We Found It. Fund the MVP."', description: 'Present a decisive recommendation with a $200K MVP ask. Show conviction based on your research.', impact: { teamMorale: 70 } },
                { id: 'options_pitch', label: 'Present 3 Options with Trade-offs', description: 'Give the CEO structured options (Option A/B/C) and let her decide with full information.', impact: { teamMorale: 60 } },
                { id: 'need_more_time', label: '"We Need 2 More Weeks of Research"', description: 'Acknowledge remaining uncertainty and request more time before committing. Risk: CEO may lose confidence.', impact: { teamMorale: 45 } },
            ],
        },
    ],
};

export default NEWWAVE_CONFIG;
