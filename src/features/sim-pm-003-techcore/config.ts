/**
 * TechCore Simulation — Configuration
 *
 * ID: sim-pm-003
 * Archetype: Platform Engineering (Legacy Infrastructure Rebuild)
 */

import type { SimulationConfig } from '../../shared/simulation/types';

export const TECHCORE_CONFIG: SimulationConfig = {
    id: 'sim-pm-003',
    name: 'The Core Rebuild',

    companyName: 'TechCore Systems',
    industry: 'Enterprise SaaS',
    archetype: 'platform',
    logo: '/logos/techcore.svg',
    primaryColor: '#3b82f6',   // Blue — stable, technical

    description: 'Enterprise SaaS company serving Fortune 500 clients with mission-critical payment infrastructure.',
    founded: '2015',
    employees: '350',
    headquarters: 'Seattle, WA',

    budget: 1_200_000,
    fundingStatus: 'Profitable (Bootstrapped)',

    challenge: 'The Infrastructure Dilemma',
    challengeDetails: `You are the Platform PM at TechCore. The legacy payment infrastructure is failing.
Engineering wants a complete rewrite (18 months). But the business cannot tolerate downtime — each hour of outage costs $100K+.

How do you migrate safely while keeping the business running?`,

    totalWeeks: 12,
    teamSize: 15,
    durationHours: 60,
    difficulty: 'advanced',
    passThreshold: 65,
    strongPassThreshold: 85,
    projectType: 'Platform Engineering',
    marketContext: 'Enterprise SaaS — Mission-critical, Fortune 500 clients. 99.99% uptime SLA. Zero tolerance for data loss.',
    technicalStack: 'Java 11, Oracle DB, Apache Kafka, Kubernetes, Terraform',

    kpis: [
        { id: 'uptime', label: 'System Uptime', value: 97.2, maxValue: 99.99, status: 'critical', goal: 'Maintain 99.99% SLA', progress: 97 },
        { id: 'migration', label: 'Migration Progress', value: 0, maxValue: 100, status: 'critical', goal: 'Complete Phase 1 by Week 12', progress: 0 },
        { id: 'budget', label: 'Budget', value: 85, maxValue: 100, trend: { direction: 'down', value: '-2%', color: 'yellow' }, status: 'good', goal: 'Stay within $1.2M', progress: 85 },
        { id: 'stakeholder', label: 'Executive Buy-In', value: 55, maxValue: 100, status: 'warning', goal: 'Achieve unanimous C-suite alignment', progress: 55 },
        { id: 'risk', label: 'Migration Risk Score', value: 80, maxValue: 100, trend: { direction: 'up', value: '+10%', color: 'red' }, status: 'critical', goal: 'Reduce to below 35%', progress: 80 },
        { id: 'quality', label: 'Code Quality', value: 40, maxValue: 100, status: 'warning', goal: 'Achieve 80% test coverage on new system', progress: 40 },
    ],

    stakeholders: [
        { id: 'cto', name: 'James Wilson', role: 'CTO', department: 'Engineering', influence: 10, satisfaction: 70, communicationStyle: 'analytical', concerns: ['architecture', 'technical_debt'], priorities: ['long_term_stability'] },
        { id: 'cfo', name: 'Maria Garcia', role: 'CFO', department: 'Finance', influence: 9, satisfaction: 60, communicationStyle: 'direct', concerns: ['cost', 'downtime_risk'], priorities: ['budget_control'] },
        { id: 'cpo', name: 'Andrew Lee', role: 'CPO', department: 'Product', influence: 8, satisfaction: 55, communicationStyle: 'collaborative', concerns: ['feature_parity', 'migration_time'], priorities: ['business_continuity'] },
        { id: 'head_eng', name: 'Zoe Martinez', role: 'Head of Engineering', department: 'Engineering', influence: 7, satisfaction: 45, communicationStyle: 'analytical', concerns: ['team_bandwidth', 'tech_debt'], priorities: ['engineering_velocity'] },
    ],

    successCriteria: [
        { id: 'sc-1', description: 'Propose new system architecture (diagram + justification)', completed: false, weekDue: 3, priority: 'high' },
        { id: 'sc-2', description: 'Create phased migration strategy with rollback path', completed: false, weekDue: 5, priority: 'high' },
        { id: 'sc-3', description: 'Document risk mitigation plan (all P0 risks covered)', completed: false, weekDue: 7, priority: 'high' },
        { id: 'sc-4', description: 'Get unanimous C-suite buy-in on migration approach', completed: false, weekDue: 9, priority: 'high' },
        { id: 'sc-5', description: 'Begin Phase 1 migration with zero SLA breaches', completed: false, weekDue: 12, priority: 'medium' },
    ],

    timelinePhases: [
        { id: 'phase1', name: 'System Design', status: 'active', description: 'Architect the new payment system with modern, event-driven principles.' },
        { id: 'phase2', name: 'Migration Strategy', status: 'pending', description: 'Plan the strangler fig transition approach.' },
        { id: 'phase3', name: 'Risk Planning', status: 'pending', description: 'Address all P0 and P1 technical and business risks.' },
        { id: 'phase4', name: 'Executive Alignment', status: 'pending', description: 'Present and ratify the plan with the full leadership team.' },
    ],

    currentRisks: [
        { id: 'r1', title: 'Migration downtime could cost $100K/hour — SLA breach triggers penalties', severity: 'critical', likelihood: 'medium' },
        { id: 'r2', title: 'Data integrity issues during Oracle-to-Postgres migration', severity: 'high', likelihood: 'medium' },
        { id: 'r3', title: 'Engineering resistance to rewrite — 4 senior engineers considering leaving', severity: 'medium', likelihood: 'high' },
        { id: 'r4', title: '18-month timeline creates 2 budget cycles of uncertainty', severity: 'high', likelihood: 'certain' },
    ],

    tasks: [
        { id: 't1', type: 'architecture_proposal', title: 'System Design Document', description: 'Propose the new architecture for the payment infrastructure.', requirements: ['High-level design diagram', 'Scalability considerations', 'Security requirements', 'Tech stack justification'] },
        { id: 't2', type: 'migration_plan', title: 'Migration Strategy', description: 'Plan the transition from legacy to new system using strangler fig pattern.', requirements: ['Phased approach with clear gates', 'Rollback strategy per phase', 'Timeline with milestones'] },
        { id: 't3', type: 'risk_mitigation', title: 'Risk Mitigation Plan', description: 'Address all risks associated with the migration.', requirements: ['Technical risks', 'Business risks', 'Mitigation strategies', 'Contingencies'] },
        { id: 't4', type: 'stakeholder_alignment', title: 'Executive Alignment Presentation', description: 'Secure leadership buy-in for your migration approach.', requirements: ['Clear communication', 'Trade-off explanation', 'Resource requirements', 'Success metrics'] },
    ],

    actions: [
        {
            id: 'architecture_decision',
            name: 'What migration approach do you recommend?',
            description: 'Engineering is split. Full rewrite (big-bang) vs strangler fig (incremental). Each has major implications for timeline and risk.',
            choices: [
                { id: 'strangler_fig', label: 'Strangler Fig — Incremental Migration', description: 'Route new traffic to the new system progressively. Legacy stays live as fallback. Slower but safer.', impact: { riskLevel: 0.35 } },
                { id: 'big_bang', label: 'Big-Bang Rewrite', description: 'Rebuild everything, switch over in a planned maintenance window. Faster if successful. Catastrophic if not.', impact: { riskLevel: 0.70 } },
                { id: 'parallel_run', label: 'Parallel Run — 90 Days', description: 'Run both systems simultaneously, comparing outputs. Only cut over when 99.99% parity is confirmed.', impact: { riskLevel: 0.25, budget: 1_150_000 } },
            ],
        },
        {
            id: 'cfo_budget_challenge',
            name: 'CFO: "This cannot exceed $1.2M. What gets cut?"',
            description: 'Maria (CFO) has reviewed the project budget and initial estimates are $1.6M. She is not approving the overrun. You need to negotiate scope.',
            weekAvailable: 4,
            choices: [
                { id: 'cut_phase3', label: 'Defer Phase 3 to Next Budget Cycle', description: 'Deliver Phase 1 and 2 within budget. Propose Phase 3 in the next annual planning cycle.', impact: { budget: 1_190_000 } },
                { id: 'reduce_team', label: 'Reduce Team Size, Extend Timeline', description: 'Cut 3 contractors. Extend timeline by 6 months. Stay within budget by spreading cost.', impact: { budget: 1_180_000, teamMorale: 55 } },
                { id: 'negotiate_overrun', label: 'Make the Case for $1.6M', description: 'Present the cost of NOT migrating — downtime penalties, tech debt interest, attrition. Fight for the full budget.', impact: { budget: 1_200_000 } },
            ],
        },
    ],
};

export default TECHCORE_CONFIG;
