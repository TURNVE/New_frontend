/**
 * NovaPay Simulation Configuration
 * 
 * Scenario: User hired as PM at NovaPay (fintech startup)
 * Project: Redesign onboarding flow to reduce drop-off from 72% to under 40%
 */

export type Phase = 'discovery' | 'definition' | 'delivery' | 'launch';

export interface PhaseConfig {
  id: Phase;
  name: string;
  description: string;
  weeks: [number, number];
  deliverable: string;
  primaryAvatar: string;
}

export const PHASES: PhaseConfig[] = [
  {
    id: 'discovery',
    name: 'Discovery',
    description: 'Research the problem, chat with stakeholders, gather data',
    weeks: [1, 2],
    deliverable: 'Discovery Summary',
    primaryAvatar: 'ceo'
  },
  {
    id: 'definition',
    name: 'Definition',
    description: 'Write PRD, get sign-offs from team',
    weeks: [3, 4],
    deliverable: 'PRD + Roadmap',
    primaryAvatar: 'cto'
  },
  {
    id: 'delivery',
    name: 'Delivery',
    description: 'Manage build, handle blockers, communicate updates',
    weeks: [5, 6],
    deliverable: 'Risk Log + Update',
    primaryAvatar: 'developer'
  },
  {
    id: 'launch',
    name: 'Launch',
    description: 'Execute launch, run retrospective',
    weeks: [7, 8],
    deliverable: 'Launch Plan + Retro',
    primaryAvatar: 'ceo'
  }
];

export interface CompanyContext {
  name: string;
  industry: string;
  description: string;
  project: {
    title: string;
    description: string;
    targetMetric: string;
    currentMetric: string;
    deadline: string;
  };
  budget: number;
  teamSize: number;
}

export const NOVAPAY_CONTEXT: CompanyContext = {
  name: 'NovaPay',
  industry: 'Fintech',
  description: 'A fintech startup revolutionizing digital payments for small businesses',
  project: {
    title: 'Onboarding Redesign',
    description: 'Redesign the onboarding flow to reduce drop-off from 72% to under 40% in 8 weeks',
    targetMetric: '<40%',
    currentMetric: '72%',
    deadline: '8 weeks'
  },
  budget: 250000,
  teamSize: 5
};

export interface KPIState {
  budget: number;
  initialBudget: number;
  progress: number;
  teamMorale: number;
  stakeholderTrust: number;
  riskLevel: number;
}

export const INITIAL_KPIS: KPIState = {
  budget: 250000,
  initialBudget: 250000,
  progress: 0,
  teamMorale: 65,
  stakeholderTrust: 50,
  riskLevel: 30
};
