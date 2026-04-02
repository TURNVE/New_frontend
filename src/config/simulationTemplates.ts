/**
 * Simulation Template Configuration
 * 
 * Defines unique properties for each simulation template:
 * - Logo/Branding
 * - Company details
 * - Budget
 * - Unique Briefing (that drives the simulation)
 * - Tasks
 * - Difficulty
 */

import type { ProjectBriefingData } from '../components/simulation/ProjectReferencePanel';
import type { KPI } from '../components/simulation/KPICard';
import type { SuccessCriterion } from '../components/simulation/SuccessCriteriaList';

export interface SimulationTask {
  id: string;
  type: string;
  title: string;
  description: string;
  requirements: string[];
}

export interface SimulationTemplate {
  id: string;
  route: string;
  name: string;
  companyName: string;
  industry: string;
  archetype: 'crisis' | 'growth' | 'platform' | 'zero_to_one';
  
  // Company branding
  logo: string;
  primaryColor: string;
  
  // Company details
  description: string;
  founded: string;
  employees: string;
  headquarters: string;
  
  // Financial
  budget: number;
  fundingStatus: string;
  
  // Challenge
  challenge: string;
  challengeDetails: string;
  
  // Unique Briefing - drives simulation behavior
  briefing: ProjectBriefingData;
  
  // Tasks
  tasks: SimulationTask[];
  
  // Difficulty
  difficulty: 'intro' | 'intermediate' | 'advanced';
  durationHours: number;
  
  // Thresholds
  passThreshold: number;
  strongPassThreshold: number;
}

// Helper to create KPIs
const createKPIs = (overrides: Partial<KPI>[]): KPI[] => [
  {
    id: 'team-morale',
    label: 'Team Morale',
    value: 45,
    maxValue: 100,
    trend: { direction: 'up' as const, value: '+5%', color: 'green' },
    status: 'warning',
    goal: 'Keep above 60%',
    progress: 45,
    ...overrides[0]
  },
  {
    id: 'budget',
    label: 'Budget',
    value: 78,
    maxValue: 100,
    trend: { direction: 'down' as const, value: '-3%', color: 'red' },
    status: 'good',
    goal: 'Stay under 100%',
    progress: 78,
    ...overrides[1]
  },
  {
    id: 'timeline',
    label: 'Timeline',
    value: 32,
    maxValue: 100,
    status: 'critical',
    goal: 'Meet all deadlines',
    progress: 32,
    ...overrides[2]
  },
  {
    id: 'stakeholder',
    label: 'Stakeholder Sat.',
    value: 55,
    maxValue: 100,
    trend: { direction: 'up' as const, value: '+10%', color: 'green' },
    status: 'warning',
    goal: 'Keep above 70%',
    progress: 55,
    ...overrides[3]
  },
  {
    id: 'quality',
    label: 'Quality',
    value: 82,
    maxValue: 100,
    status: 'good',
    goal: 'Maintain above 80%',
    progress: 82,
    ...overrides[4]
  },
  {
    id: 'risk',
    label: 'Risk Level',
    value: 25,
    maxValue: 100,
    trend: { direction: 'down' as const, value: '-5%', color: 'green' },
    status: 'good',
    goal: 'Keep below 30%',
    progress: 25,
    ...overrides[5]
  }
];

// ============================================================================
// PM-001: PayLink - 72-Hour Crisis (URGENT, RED)
// ============================================================================
const paylinkBriefing: ProjectBriefingData = {
  id: 'sim-pm-001',
  title: '72-Hour Launch Crisis - PayLink',
  description: 'Launch day crisis management at fintech startup',
  totalWeeks: 3, // 72 hours compressed
  clientName: 'PayLink',
  projectType: 'Crisis Management',
  budget: 250000,
  teamSize: 8,
  kpis: createKPIs([]),
  successCriteria: [
    { id: '1', description: 'Complete crisis assessment within 6 hours', completed: false, weekDue: 1, priority: 'high' },
    { id: '2', description: 'Present recommendation to CEO', completed: false, weekDue: 1, priority: 'high' },
    { id: '3', description: 'Make final Go/No-Go decision', completed: false, weekDue: 2, priority: 'high' },
    { id: '4', description: 'Maintain stakeholder alignment', completed: false, priority: 'medium' },
    { id: '5', description: 'Document lessons learned', completed: false, weekDue: 3, priority: 'low' }
  ],
  timelinePhases: [
    { id: 'phase1', name: 'Crisis Assessment', status: 'active', description: 'Identify and prioritize issues' },
    { id: 'phase2', name: 'Stakeholder Briefing', status: 'pending', description: 'Communicate findings' },
    { id: 'phase3', name: 'Decision', status: 'pending', description: 'Final Go/No-Go' }
  ],
  stakeholders: [
    { id: 'ceo', name: 'Marcus Johnson', role: 'CEO', department: 'Executive', influence: 10, satisfaction: 40, communicationStyle: 'direct', concerns: ['timeline', 'revenue'], priorities: ['launch_on_time'] },
    { id: 'cto', name: 'Sarah Chen', role: 'CTO', department: 'Engineering', influence: 9, satisfaction: 55, communicationStyle: 'analytical', concerns: ['technical_debt', 'stability'], priorities: ['system_reliability'] },
    { id: 'compliance', name: 'David Park', role: 'Compliance Lead', department: 'Legal', influence: 8, satisfaction: 30, communicationStyle: 'formal', concerns: ['regulatory', 'audit'], priorities: ['compliance'] }
  ],
  keyDecisions: [],
  currentRisks: [
    { id: 'r1', title: 'Compliance issues not resolved', severity: 'critical', likelihood: 'high' },
    { id: 'r2', title: 'Technical debt could cause failures', severity: 'high', likelihood: 'medium' },
    { id: 'r3', title: 'CEO pushing for immediate launch', severity: 'high', likelihood: 'certain' }
  ],
  marketContext: 'Fintech - High competition, regulatory scrutiny',
  technicalStack: 'React, Node.js, PostgreSQL, AWS'
};

// ============================================================================
// PM-002: ShopEase - BNPL Growth Bet (STRATEGIC, PURPLE)
// ============================================================================
const shopeaseBriefing: ProjectBriefingData = {
  id: 'sim-pm-002',
  title: 'The Growth Bet - ShopEase BNPL',
  description: 'Evaluate and launch Buy Now Pay Later feature',
  totalWeeks: 8,
  clientName: 'ShopEase',
  projectType: 'Growth Strategy',
  budget: 500000,
  teamSize: 12,
  kpis: createKPIs([]),
  successCriteria: [
    { id: '1', description: 'Complete product brief', completed: false, weekDue: 2, priority: 'high' },
    { id: '2', description: 'Build financial model with sensitivity analysis', completed: false, weekDue: 4, priority: 'high' },
    { id: '3', description: 'Complete risk assessment', completed: false, weekDue: 5, priority: 'high' },
    { id: '4', description: 'Define MVP scope', completed: false, weekDue: 6, priority: 'medium' },
    { id: '5', description: 'Submit final recommendation', completed: false, weekDue: 8, priority: 'high' }
  ],
  timelinePhases: [
    { id: 'phase1', name: 'Problem Framing', status: 'active', description: 'Define product opportunity' },
    { id: 'phase2', name: 'Business Modeling', status: 'pending', description: 'Build financial projections' },
    { id: 'phase3', name: 'Risk Assessment', status: 'pending', description: 'Evaluate risks' },
    { id: 'phase4', name: 'Decision', status: 'pending', description: 'Final recommendation' }
  ],
  stakeholders: [
    { id: 'ceo', name: 'Lisa Wang', role: 'CEO', department: 'Executive', influence: 10, satisfaction: 60, communicationStyle: 'direct', concerns: ['growth', 'competition'], priorities: ['revenue_growth'] },
    { id: 'cfo', name: 'Tom Miller', role: 'CFO', department: 'Finance', influence: 9, satisfaction: 50, communicationStyle: 'analytical', concerns: ['cash_flow', 'defaults'], priorities: ['financial_health'] },
    { id: 'compliance', name: 'Rachel Kim', role: 'Compliance Lead', department: 'Legal', influence: 8, satisfaction: 40, communicationStyle: 'formal', concerns: ['regulatory', 'consumer_protection'], priorities: ['compliance'] }
  ],
  keyDecisions: [],
  currentRisks: [
    { id: 'r1', title: 'High default rates could erode margins', severity: 'high', likelihood: 'medium' },
    { id: 'r2', title: 'Regulatory scrutiny of BNPL products', severity: 'critical', likelihood: 'medium' },
    { id: 'r3', title: 'Cash flow strain from financing', severity: 'high', likelihood: 'high' }
  ],
  marketContext: 'E-commerce - Competitive, growing BNPL market',
  technicalStack: 'React, Python/Django, PostgreSQL, Stripe'
};

// ============================================================================
// PM-003: TechCore - Infrastructure Rebuild (COMPLEX, BLUE)
// ============================================================================
const techcoreBriefing: ProjectBriefingData = {
  id: 'sim-pm-003',
  title: 'The Core Rebuild - TechCore',
  description: 'Migrate legacy payment infrastructure',
  totalWeeks: 12,
  clientName: 'TechCore Systems',
  projectType: 'Platform Engineering',
  budget: 1200000,
  teamSize: 15,
  kpis: createKPIs([]),
  successCriteria: [
    { id: '1', description: 'Propose new system architecture', completed: false, weekDue: 3, priority: 'high' },
    { id: '2', description: 'Create migration strategy', completed: false, weekDue: 5, priority: 'high' },
    { id: '3', description: 'Document risk mitigation plan', completed: false, weekDue: 7, priority: 'high' },
    { id: '4', description: 'Get executive buy-in', completed: false, weekDue: 9, priority: 'high' },
    { id: '5', description: 'Begin Phase 1 migration', completed: false, weekDue: 12, priority: 'medium' }
  ],
  timelinePhases: [
    { id: 'phase1', name: 'System Design', status: 'active', description: 'Architect new payment system' },
    { id: 'phase2', name: 'Migration Strategy', status: 'pending', description: 'Plan transition approach' },
    { id: 'phase3', name: 'Risk Planning', status: 'pending', description: 'Address all risks' },
    { id: 'phase4', name: 'Executive Alignment', status: 'pending', description: 'Get buy-in' }
  ],
  stakeholders: [
    { id: 'cto', name: 'James Wilson', role: 'CTO', department: 'Engineering', influence: 10, satisfaction: 70, communicationStyle: 'analytical', concerns: ['architecture', 'technical_debt'], priorities: ['long_term_stability'] },
    { id: 'cfo', name: 'Maria Garcia', role: 'CFO', department: 'Finance', influence: 9, satisfaction: 60, communicationStyle: 'direct', concerns: ['cost', 'downtime'], priorities: ['budget_control'] },
    { id: 'cpo', name: 'Andrew Lee', role: 'CPO', department: 'Product', influence: 8, satisfaction: 55, communicationStyle: 'collaborative', concerns: ['feature_parity', 'migration_time'], priorities: ['business_continuity'] }
  ],
  keyDecisions: [],
  currentRisks: [
    { id: 'r1', title: 'Migration downtime could cost $100K/hour', severity: 'critical', likelihood: 'medium' },
    { id: 'r2', title: 'Data integrity issues during transition', severity: 'high', likelihood: 'medium' },
    { id: 'r3', title: 'Engineering resistance to rewrite', severity: 'medium', likelihood: 'high' }
  ],
  marketContext: 'Enterprise SaaS - Mission-critical, Fortune 500 clients',
  technicalStack: 'Java, Oracle DB, Kafka, Kubernetes'
};

// ============================================================================
// PM-004: NewWave - New Product Discovery (AMBIGUOUS, TEAL)
// ============================================================================
const newwaveBriefing: ProjectBriefingData = {
  id: 'sim-pm-004',
  title: 'The New Frontier - NewWave',
  description: 'Find product-market fit for new revenue stream',
  totalWeeks: 6,
  clientName: 'NewWave',
  projectType: 'Product Discovery',
  budget: 150000,
  teamSize: 5,
  kpis: createKPIs([]),
  successCriteria: [
    { id: '1', description: 'Identify 3 potential market opportunities', completed: false, weekDue: 1, priority: 'high' },
    { id: '2', description: 'Conduct user research (10+ interviews)', completed: false, weekDue: 3, priority: 'high' },
    { id: '3', description: 'Define MVP concept', completed: false, weekDue: 4, priority: 'high' },
    { id: '4', description: 'Create go-to-market plan', completed: false, weekDue: 5, priority: 'high' },
    { id: '5', description: 'Present business case to CEO', completed: false, weekDue: 6, priority: 'high' }
  ],
  timelinePhases: [
    { id: 'phase1', name: 'Opportunity Analysis', status: 'active', description: 'Identify market opportunities' },
    { id: 'phase2', name: 'User Discovery', status: 'pending', description: 'Research validate opportunities' },
    { id: 'phase3', name: 'MVP Definition', status: 'pending', description: 'Define minimum viable product' },
    { id: 'phase4', name: 'GTM Strategy', status: 'pending', description: 'Plan launch approach' }
  ],
  stakeholders: [
    { id: 'ceo', name: 'Emma Rodriguez', role: 'CEO', department: 'Executive', influence: 10, satisfaction: 50, communicationStyle: 'direct', concerns: ['revenue', 'runway'], priorities: ['quick_wins'] },
    { id: 'founder', name: 'Mike Chen', role: 'Founder', department: 'Leadership', influence: 10, satisfaction: 60, communicationStyle: 'visionary', concerns: ['product_direction', 'market_fit'], priorities: ['innovation'] }
  ],
  keyDecisions: [],
  currentRisks: [
    { id: 'r1', title: 'No clear problem definition', severity: 'critical', likelihood: 'certain' },
    { id: 'r2', title: 'Limited runway (3 months)', severity: 'critical', likelihood: 'certain' },
    { id: 'r3', title: 'Market may not need our solution', severity: 'high', likelihood: 'medium' }
  ],
  marketContext: 'EdTech - Growing, competitive, evolving',
  technicalStack: 'React Native, Firebase, AWS'
};

// ============================================================================
// TEMPLATES MAP
// ============================================================================
export const simulationTemplates: Record<string, SimulationTemplate> = {
  'sim-pm-001': {
    id: 'sim-pm-001',
    route: '/simulation/sim-pm-001',
    name: '72-Hour Launch Crisis',
    companyName: 'PayLink',
    industry: 'Fintech/Payments',
    archetype: 'crisis',
    
    // PayLink branding - urgent, red
    logo: '/logos/paylink.svg',
    primaryColor: '#ef4444',
    
    description: 'A fintech startup revolutionizing digital payments for small businesses.',
    founded: '2022',
    employees: '45',
    headquarters: 'San Francisco, CA',
    
    budget: 250000,
    fundingStatus: 'Series A ($8M)',
    
    challenge: 'Launch Day Meltdown',
    challengeDetails: `You are the Senior PM at PayLink. Launch day for your new payment feature is in 72 hours.
Suddenly, compliance flags critical issues, technical debt surfaces, and the CEO is pushing for immediate launch despite risks.
    
The clock is ticking. Every decision counts.`,
    
    briefing: paylinkBriefing,
    
    tasks: [
      { id: 't1', type: 'crisis_assessment', title: 'Initial Crisis Assessment', description: 'Analyze the current situation and identify all critical issues.', requirements: ['List all immediate threats', 'Assess severity of each', 'Prioritize response'] },
      { id: 't2', type: 'stakeholder_comms', title: 'CEO Briefing', description: 'Communicate findings to the CEO and recommend a course of action.', requirements: ['Clear recommendation', 'Data-backed justification', 'Risk acknowledgment'] },
      { id: 't3', type: 'decision_memo', title: 'Go/No-Go Decision', description: 'Make the final call on launch timing.', requirements: ['Clear decision', 'Contingency plan', 'Stakeholder alignment'] }
    ],
    
    difficulty: 'advanced',
    durationHours: 72,
    passThreshold: 60,
    strongPassThreshold: 85
  },
  
  'sim-pm-002': {
    id: 'sim-pm-002',
    route: '/simulation/sim-pm-002',
    name: 'The Growth Bet',
    companyName: 'ShopEase',
    industry: 'E-commerce',
    archetype: 'growth',
    
    // ShopEase branding - energetic, purple
    logo: '/logos/shopease.svg',
    primaryColor: '#8b5cf6',
    
    description: 'A rapidly growing e-commerce platform serving 2M+ consumers.',
    founded: '2020',
    employees: '120',
    headquarters: 'Austin, TX',
    
    budget: 500000,
    fundingStatus: 'Series B ($25M)',
    
    challenge: 'The BNPL Decision',
    challengeDetails: `You are the PM at ShopEase. Revenue has plateaued for 3 quarters. The board demands +40% growth.
The CEO proposes launching BNPL (Buy Now, Pay Later). This is NOT just a feature - it impacts risk, compliance, cash flow, and company survival.
    
Build the case - or the case against.`,
    
    briefing: shopeaseBriefing,
    
    tasks: [
      { id: 't1', type: 'product_brief', title: 'Product Brief', description: 'Define the BNPL product opportunity.', requirements: ['Problem statement', 'Target users', 'Success metrics', 'Initial risks'] },
      { id: 't2', type: 'financial_model', title: 'Unit Economics', description: 'Build financial projections with realistic assumptions.', requirements: ['Revenue projections', 'Default risk analysis', 'CAC vs LTV', 'Sensitivity analysis'] },
      { id: 't3', type: 'risk_assessment', title: 'Risk Review', description: 'Assess all risks and propose mitigations.', requirements: ['Fraud risk', 'Regulatory exposure', 'Worst-case scenarios', 'Mitigation strategies'] },
      { id: 't4', type: 'decision_memo', title: 'Final Recommendation', description: 'Submit your final recommendation with justification.', requirements: ['Clear decision', 'Data support', 'Risk acknowledgment', 'Tradeoffs explicit'] }
    ],
    
    difficulty: 'intermediate',
    durationHours: 48,
    passThreshold: 60,
    strongPassThreshold: 80
  },
  
  'sim-pm-003': {
    id: 'sim-pm-003',
    route: '/simulation/sim-pm-003',
    name: 'The Core Rebuild',
    companyName: 'TechCore Systems',
    industry: 'Enterprise SaaS',
    archetype: 'platform',
    
    // TechCore branding - stable, blue
    logo: '/logos/techcore.svg',
    primaryColor: '#3b82f6',
    
    description: 'Enterprise SaaS company serving Fortune 500 clients with mission-critical software.',
    founded: '2015',
    employees: '350',
    headquarters: 'Seattle, WA',
    
    budget: 1200000,
    fundingStatus: 'Profitable (Bootstrapped)',
    
    challenge: 'The Infrastructure Dilemma',
    challengeDetails: `You are the Platform PM at TechCore. The legacy payment infrastructure is failing.
Engineering wants a complete rewrite (18 months). But the business cannot tolerate downtime - each hour of outage costs $100K+.
    
How do you migrate safely while keeping the business running?`,
    
    briefing: techcoreBriefing,
    
    tasks: [
      { id: 't1', type: 'architecture_proposal', title: 'System Design', description: 'Propose a new architecture for the payment system.', requirements: ['High-level design', 'Scalability considerations', 'Security requirements'] },
      { id: 't2', type: 'migration_plan', title: 'Migration Strategy', description: 'Plan the transition from legacy to new system.', requirements: ['Phased approach', 'Rollback strategy', 'Timeline with milestones'] },
      { id: 't3', type: 'risk_mitigation', title: 'Risk Plan', description: 'Address all risks associated with the migration.', requirements: ['Technical risks', 'Business risks', 'Mitigation strategies', 'Contingencies'] },
      { id: 't4', type: 'stakeholder_alignment', title: 'Executive Alignment', description: 'Get leadership buy-in for your plan.', requirements: ['Clear communication', 'Tradeoff explanation', 'Resource requirements'] }
    ],
    
    difficulty: 'advanced',
    durationHours: 60,
    passThreshold: 65,
    strongPassThreshold: 85
  },
  
  'sim-pm-004': {
    id: 'sim-pm-004',
    route: '/simulation/sim-pm-004',
    name: 'The New Frontier',
    companyName: 'NewWave',
    industry: 'EdTech',
    archetype: 'zero_to_one',
    
    // NewWave branding - fresh, teal
    logo: '/logos/newwave.svg',
    primaryColor: '#14b8a6',
    
    description: 'An emerging EdTech startup focused on personalized learning.',
    founded: '2023',
    employees: '18',
    headquarters: 'Denver, CO',
    
    budget: 150000,
    fundingStatus: 'Seed ($3M)',
    
    challenge: 'Finding Product-Market Fit',
    challengeDetails: `You are the founding PM at NewWave. The CEO says: "We need a new revenue stream. Figure it out."
No problem defined. No users interviewed. Just ambiguity and 3 months of runway.
    
How do you find the right opportunity when you don't know what you don't know?`,
    
    briefing: newwaveBriefing,
    
    tasks: [
      { id: 't1', type: 'opportunity_analysis', title: 'Market Opportunity', description: 'Identify potential market opportunities.', requirements: ['Market size estimation', 'Competition analysis', 'Initial hypothesis'] },
      { id: 't2', type: 'user_research', title: 'User Discovery', description: 'Conduct user research to validate opportunities.', requirements: ['Interview methodology', 'Key insights', 'Pivot/refine hypothesis'] },
      { id: 't3', type: 'mvp_concept', title: 'MVP Definition', description: 'Define the minimum viable product.', requirements: ['Core feature set', 'Target users', 'Success criteria'] },
      { id: 't4', type: 'gtm_plan', title: 'Go-to-Market Strategy', description: 'Plan how to launch and acquire users.', requirements: ['Channels', 'Messaging', 'Launch timeline', 'Success metrics'] }
    ],
    
    difficulty: 'intermediate',
    durationHours: 40,
    passThreshold: 55,
    strongPassThreshold: 80
  }
};

/**
 * Get simulation by route ID
 */
export function getSimulationByRoute(routeId: string): SimulationTemplate | undefined {
  return simulationTemplates[routeId];
}

/**
 * Get all simulation routes
 */
export function getAllSimulationRoutes(): string[] {
  return Object.keys(simulationTemplates);
}

/**
 * Get briefing for a simulation
 */
export function getBriefingForSimulation(routeId: string): ProjectBriefingData | undefined {
  const template = simulationTemplates[routeId];
  return template?.briefing;
}