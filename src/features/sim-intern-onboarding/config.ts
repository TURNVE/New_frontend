/**
 * Intern Onboarding Simulation — Configuration
 * 
 * ID: sim-intern-001
 * Archetype: Intern Onboarding
 * 
 * This is the single source of truth for intern onboarding content.
 */

import type { SimulationConfig } from '../../shared/simulation/types';
import { 
    INTERN_WEEKLY_SIGNALS, 
    INTERN_WEEKLY_EVENTS, 
    INTERN_WEEKLY_ACTIONS 
} from './intern-content';

export const INTERN_ONBOARDING_CONFIG: SimulationConfig = {
    id: 'sim-intern-001',
    name: 'TechCorp Intern Onboarding',

    // Company branding
    companyName: 'TechCorp',
    industry: 'Technology',
    archetype: 'zero_to_one',
    logo: 'TC',
    primaryColor: '#8b5cf6', // Purple

    // Company metadata
    description: 'A fast-growing tech startup building innovative products.',
    founded: '2019',
    employees: '50-100',
    headquarters: 'San Francisco, CA',

    // Financial
    budget: 500000,
    fundingStatus: 'Series A',

    // Challenge (shown on start screen)
    challenge: 'Complete your internship onboarding and prove yourself!',
    challengeDetails: 'Start as an intern, learn the company, meet the team, and earn your promotion to Junior Product Manager.',

    // Simulation engine config
    totalWeeks: 3,
    teamSize: 6,
    durationHours: 1, // ~1 hour for complete onboarding
    difficulty: 'intro',
    passThreshold: 70,
    strongPassThreshold: 90,

    // KPIs
    kpis: [
        {
            id: 'kpi-onboarding',
            label: 'Onboarding Progress',
            value: 0,
            maxValue: 100,
            status: 'good',
            goal: 'Complete all onboarding tasks',
            progress: 0,
        },
    ],

    // Stakeholders
    stakeholders: [
        {
            id: 'stakeholder-marcus',
            name: 'Marcus Johnson',
            role: 'CEO',
            department: 'Executive',
            influence: 10,
            satisfaction: 100,
            communicationStyle: 'visionary',
            concerns: ['Company growth', 'Team performance'],
            priorities: ['Strategic vision', 'Revenue growth'],
        },
        {
            id: 'stakeholder-sarah',
            name: 'Sarah Chen',
            role: 'Product Manager',
            department: 'Product',
            influence: 8,
            satisfaction: 90,
            communicationStyle: 'collaborative',
            concerns: ['Team productivity', 'Product quality'],
            priorities: ['User satisfaction', 'Feature delivery'],
        },
        {
            id: 'stakeholder-lisa',
            name: 'Lisa Martinez',
            role: 'HR Manager',
            department: 'Human Resources',
            influence: 6,
            satisfaction: 95,
            communicationStyle: 'formal',
            concerns: ['Employee satisfaction', 'Onboarding'],
            priorities: ['Team culture', 'Employee retention'],
        },
    ],

    // Success Criteria
    successCriteria: [
        {
            id: 'sc-1',
            description: 'Read and acknowledge offer letter',
            completed: false,
            priority: 'high',
        },
        {
            id: 'sc-2',
            description: 'Meet your Product Manager',
            completed: false,
            priority: 'high',
        },
        {
            id: 'sc-3',
            description: 'Check calendar and see CEO availability',
            completed: false,
            priority: 'normal',
        },
        {
            id: 'sc-4',
            description: 'Accept meeting invitation from CEO',
            completed: false,
            priority: 'high',
        },
        {
            id: 'sc-5',
            description: 'Attend team introduction with HR',
            completed: false,
            priority: 'high',
        },
        {
            id: 'sc-6',
            description: 'Join CEO welcome meeting',
            completed: false,
            priority: 'high',
        },
        {
            id: 'sc-7',
            description: 'Complete first microtask',
            completed: false,
            priority: 'high',
        },
        {
            id: 'sc-8',
            description: 'Receive promotion to Junior PM',
            completed: false,
            priority: 'high',
        },
    ],

    // Timeline Phases
    timelinePhases: [
        {
            id: 'phase-day1',
            name: 'Day 1: Welcome & Orientation',
            status: 'active',
            description: 'Review offer letter and meet your manager',
            week: 1,
        },
        {
            id: 'phase-day2',
            name: 'Week 2: Team & Calendar',
            status: 'pending',
            description: 'Meet the team and accept CEO meeting',
            week: 2,
        },
        {
            id: 'phase-day3',
            name: 'Week 3: First Task & Promotion',
            status: 'pending',
            description: 'Complete your first task and get promoted',
            week: 3,
        },
    ],

    // Risks
    currentRisks: [
        {
            id: 'risk-1',
            title: 'Missing CEO meeting',
            severity: 'medium',
            likelihood: 'low',
        },
    ],

    // Tasks
    tasks: [
        {
            id: 'task-offer',
            type: 'document',
            title: 'Review Offer Letter',
            description: 'Read your official offer letter from TechCorp',
            requirements: ['Read all sections', 'Understand role'],
        },
    ],

    // Legacy actions
    actions: [],

    // Per-week content
    weeklySignals: INTERN_WEEKLY_SIGNALS,
    weeklyEvents: INTERN_WEEKLY_EVENTS,
    weeklyActions: INTERN_WEEKLY_ACTIONS,

    // Context
    marketContext: 'TechCorp is a growing startup in the SaaS space.',
    technicalStack: 'React, Node.js, PostgreSQL, AWS',
    projectType: 'Product Management',
};
