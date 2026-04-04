/**
 * ShopEase Simulation — Configuration
 *
 * ID: sim-pm-002
 * Archetype: Growth Strategy (The BNPL Decision)
 *
 * ─────────────────────────────────────────────────────────────
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL SHOPEASE OUTPUTS.
 * ─────────────────────────────────────────────────────────────
 */

import type { SimulationConfig } from '../../shared/simulation/types';

export const SHOPEASE_CONFIG: SimulationConfig = {
    id: 'sim-pm-002',
    name: 'The Growth Bet',

    companyName: 'ShopEase',
    industry: 'E-commerce',
    archetype: 'growth',
    logo: '/logos/shopease.svg',
    primaryColor: '#8b5cf6',   // Purple — strategic ambition

    description: 'A rapidly growing e-commerce platform serving 2M+ consumers across Southeast Asia.',
    founded: '2020',
    employees: '120',
    headquarters: 'Austin, TX',

    budget: 500_000,
    fundingStatus: 'Series B ($25M)',

    challenge: 'The BNPL Decision',
    challengeDetails: `You are the PM at ShopEase. Revenue has plateaued for 3 quarters. The board demands +40% growth.
The CEO proposes launching BNPL (Buy Now, Pay Later). This is NOT just a feature — it impacts risk, compliance, cash flow, and company survival.

Build the case — or the case against.`,

    totalWeeks: 8,
    teamSize: 12,
    durationHours: 48,
    difficulty: 'intermediate',
    passThreshold: 60,
    strongPassThreshold: 80,
    projectType: 'Growth Strategy',
    marketContext: 'E-commerce — Competitive, growing BNPL market. Klarna, Affirm, Afterpay are consolidating. Window is 12 months.',
    technicalStack: 'React, Python/Django, PostgreSQL, Stripe, Plaid',

    kpis: [
        { id: 'gmv', label: 'GMV Growth', value: 5, maxValue: 40, trend: { direction: 'up', value: '+5%', color: 'yellow' }, status: 'warning', goal: 'Reach +40% GMV by Q4', progress: 12 },
        { id: 'default-rate', label: 'Default Risk', value: 0, maxValue: 100, status: 'good', goal: 'Model below 3.5% default rate', progress: 0 },
        { id: 'budget', label: 'Budget', value: 78, maxValue: 100, trend: { direction: 'down', value: '-5%', color: 'red' }, status: 'good', goal: 'Stay within $500K', progress: 78 },
        { id: 'regulatory', label: 'Regulatory Clarity', value: 40, maxValue: 100, trend: { direction: 'up', value: 'In review', color: 'yellow' }, status: 'warning', goal: 'Achieve legal clearance', progress: 40 },
        { id: 'stakeholder', label: 'Board Confidence', value: 55, maxValue: 100, status: 'warning', goal: 'Reach 75% board confidence', progress: 55 },
        { id: 'timeline', label: 'Research Completion', value: 10, maxValue: 100, status: 'critical', goal: 'Complete model by Week 4', progress: 10 },
    ],

    stakeholders: [
        { id: 'ceo', name: 'Lisa Wang', role: 'CEO', department: 'Executive', influence: 10, satisfaction: 60, communicationStyle: 'direct', concerns: ['growth', 'competition'], priorities: ['revenue_growth'] },
        { id: 'cfo', name: 'Tom Miller', role: 'CFO', department: 'Finance', influence: 9, satisfaction: 50, communicationStyle: 'analytical', concerns: ['cash_flow', 'defaults'], priorities: ['financial_health'] },
        { id: 'compliance', name: 'Rachel Kim', role: 'Compliance Lead', department: 'Legal', influence: 8, satisfaction: 40, communicationStyle: 'formal', concerns: ['regulatory', 'consumer_protection'], priorities: ['compliance'] },
        { id: 'engineering', name: 'Alex Torres', role: 'Head of Engineering', department: 'Tech', influence: 7, satisfaction: 65, communicationStyle: 'analytical', concerns: ['build_complexity', 'timeline'], priorities: ['technical_feasibility'] },
    ],

    successCriteria: [
        { id: 'sc-1', description: 'Complete product brief with problem statement and target users', completed: false, weekDue: 2, priority: 'high' },
        { id: 'sc-2', description: 'Build financial model with default risk and sensitivity analysis', completed: false, weekDue: 4, priority: 'high' },
        { id: 'sc-3', description: 'Complete risk assessment covering fraud, regulatory, and cash flow', completed: false, weekDue: 5, priority: 'high' },
        { id: 'sc-4', description: 'Define MVP scope with phased rollout plan', completed: false, weekDue: 6, priority: 'medium' },
        { id: 'sc-5', description: 'Submit final recommendation (Go/No-Go/Conditional)', completed: false, weekDue: 8, priority: 'high' },
    ],

    timelinePhases: [
        { id: 'phase1', name: 'Problem Framing', status: 'active', description: 'Define the product opportunity and market context.' },
        { id: 'phase2', name: 'Business Modeling', status: 'pending', description: 'Build financial projections with realistic assumptions.' },
        { id: 'phase3', name: 'Risk Assessment', status: 'pending', description: 'Evaluate all risk vectors — financial, regulatory, operational.' },
        { id: 'phase4', name: 'Final Recommendation', status: 'pending', description: 'Present a Go/No-Go/Conditional recommendation to the Board.' },
    ],

    currentRisks: [
        { id: 'r1', title: 'High default rates could erode 60-day margins', severity: 'high', likelihood: 'medium' },
        { id: 'r2', title: 'CFPB regulatory scrutiny of BNPL increasing', severity: 'critical', likelihood: 'medium' },
        { id: 'r3', title: 'Cash flow strain from financing receivables', severity: 'high', likelihood: 'high' },
        { id: 'r4', title: 'Klarna launching in target market Q3', severity: 'medium', likelihood: 'certain' },
    ],

    tasks: [
        { id: 't1', type: 'product_brief', title: 'Product Brief', description: 'Define the BNPL product opportunity clearly.', requirements: ['Problem statement', 'Target users', 'Success metrics', 'Initial risks'] },
        { id: 't2', type: 'financial_model', title: 'Unit Economics Model', description: 'Build financial projections with realistic assumptions.', requirements: ['Revenue projections', 'Default risk analysis', 'CAC vs LTV', 'Sensitivity analysis'] },
        { id: 't3', type: 'risk_assessment', title: 'Risk Review', description: 'Assess all risk vectors and propose mitigations.', requirements: ['Fraud risk', 'Regulatory exposure', 'Worst-case scenarios', 'Mitigation strategies'] },
        { id: 't4', type: 'decision_memo', title: 'Final Recommendation', description: 'Submit your final Go/No-Go recommendation with justification.', requirements: ['Clear decision', 'Data support', 'Risk acknowledgment', 'Trade-offs explicit'] },
    ],

    actions: [
        {
            id: 'scope_decision',
            name: 'How do you scope the BNPL research?',
            description: 'You have 2 weeks to produce a complete business model. Where do you focus first?',
            choices: [
                { id: 'unit_economics_first', label: 'Start with the Financial Model', description: 'Build the unit economics first. Default rate, LTV/CAC, and margin sensitivity before anything else.', impact: { riskLevel: 0.30 } },
                { id: 'regulatory_first', label: 'Get Legal Clarity First', description: 'Block-book time with Compliance before modeling. Understand what can and cannot be built.', impact: { riskLevel: 0.25 } },
                { id: 'competitor_first', label: 'Benchmark Klarna and Affirm', description: 'Conduct competitor product teardown. Model their unit economics as a proxy for ours.', impact: { riskLevel: 0.35 } },
            ],
        },
        {
            id: 'cfo_challenge',
            name: 'The CFO challenges your default rate assumptions',
            description: 'Tom (CFO) says your 2.8% default assumption is "too optimistic" and demands you model at 5% and 8% scenarios. This changes your recommendation.',
            weekAvailable: 4,
            choices: [
                { id: 'accept_challenge', label: 'Accept — Model at 5% and 8%', description: 'Rebuild the model with CFO-mandated scenarios. Present the full risk spectrum.', impact: { budget: 495_000 } },
                { id: 'defend_assumption', label: 'Defend 2.8% with Data', description: 'Present industry benchmark data defending your projections. Push back constructively.', impact: { budget: 498_000 } },
                { id: 'propose_pilot', label: 'Propose Pilot to Validate Assumptions', description: 'Recommend a 60-day, 5,000-user pilot to get real default data before full commitment.', impact: { budget: 490_000 } },
            ],
        },
        {
            id: 'final_recommendation',
            name: 'Board Presentation: What is your recommendation?',
            description: 'Week 8. The board is assembled. All the data is in. What do you recommend?',
            weekAvailable: 8,
            choices: [
                { id: 'go', label: 'Full Go — Launch BNPL in Q3', description: 'Recommend full launch with your proposed risk framework. High reward, high risk.', impact: { teamMorale: 70 } },
                { id: 'conditional_go', label: 'Conditional Go — Pilot First', description: 'Recommend a 3-month controlled pilot capped at $2M exposure. Validate before scaling.', impact: { teamMorale: 65 } },
                { id: 'no_go', label: 'No-Go — Pursue Alternative Growth', description: 'Recommend against BNPL. Present 3 alternative growth strategies with lower risk.', impact: { teamMorale: 60 } },
            ],
        },
    ],
};

export default SHOPEASE_CONFIG;
