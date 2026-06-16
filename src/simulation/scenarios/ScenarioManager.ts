import { GameState, Metric, Stakeholder, Signal, CommunicationStyle } from '../core/SimulationEngine';

export interface StakeholderConfigData {
  name: string;
  [key: string]: string | number | string[] | undefined;
}

export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  company: {
    name: string;
    mission: string;
    currentQuarter: number;
  };
  product: {
    name: string;
    initialMetrics: Metric[];
  };
  initialSignals: {
    source: string;
    message: string;
    priority: string;
  }[];
  stakeholders: Record<string, StakeholderConfigData>;
  challenges: string[];
  objectives: string[];
}

export class ScenarioManager {
  scenarios: Map<string, ScenarioConfig>;

  constructor() {
    this.scenarios = new Map();

    // Register the PM simulation scenario described in your document
    this.registerScenario(this.createPMSimulationScenario());
  }

  registerScenario(scenario: ScenarioConfig): void {
    this.scenarios.set(scenario.id, scenario);
  }

  getScenario(id: string): ScenarioConfig | undefined {
    return this.scenarios.get(id);
  }

  createGameStateFromScenario(scenarioId: string): GameState | null {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      return null;
    }

    const now = new Date();
    const instanceId = `sim-${now.getTime()}-${Math.random().toString(36).substr(2, 9)}`;

    const metrics: Record<string, number> = {};
    scenario.product.initialMetrics.forEach((m) => {
      metrics[m.id] = m.currentValue;
    });

    const stakeholders: Stakeholder[] = [
      {
        id: 'eng-lead-01',
        name: 'Sarah Johnson',
        role: 'Engineering Lead',
        department: 'Engineering',
        influence: 8,
        satisfaction: 75,
        communicationStyle: 'direct' as CommunicationStyle,
        concerns: ['technical excellence', 'system reliability'],
        priorities: ['development velocity', 'code quality'],
      },
      {
        id: 'designer-01',
        name: 'Michael Chen',
        role: 'Product Designer',
        department: 'Design',
        influence: 6,
        satisfaction: 75,
        communicationStyle: 'collaborative' as CommunicationStyle,
        concerns: ['user experience', 'interface quality'],
        priorities: ['brand consistency', 'usability metrics'],
      },
      {
        id: 'support-01',
        name: 'Emma Rodriguez',
        role: 'Customer Success',
        department: 'Support',
        influence: 5,
        satisfaction: 75,
        communicationStyle: 'diplomatic' as CommunicationStyle,
        concerns: ['user satisfaction', 'issue resolution speed'],
        priorities: ['ticket volume', 'customer success'],
      },
      {
        id: 'sales-01',
        name: 'David Kim',
        role: 'Head of Sales',
        department: 'Sales',
        influence: 7,
        satisfaction: 75,
        communicationStyle: 'direct' as CommunicationStyle,
        concerns: ['revenue targets', 'customer acquisition'],
        priorities: ['feature requests', 'competitive advantage'],
      },
      {
        id: 'leadership-01',
        name: 'Alex Thompson',
        role: 'VP of Product',
        department: 'Executive',
        influence: 10,
        satisfaction: 75,
        communicationStyle: 'formal' as CommunicationStyle,
        concerns: ['strategic goals', 'business growth'],
        priorities: ['market position', 'investor relations'],
      },
    ];

    const signals: Signal[] = scenario.initialSignals.map((signal, index) => ({
      id: `initial-signal-${index}`,
      source: signal.source as Signal['source'],
      message: signal.message,
      priority: signal.priority as Signal['priority'],
      timestamp: new Date(),
    }));

    const gameState: GameState = {
      week: 1,
      totalWeeks: 12,
      currentPhaseId: 'phase-1',
      phaseProgress: 0,
      budget: 150,
      initialBudget: 150,
      teamMorale: 75,
      riskLevel: 0.3,
      stakeholderTrust: 70,
      progress: 0,
      company: {
        name: scenario.company.name,
        mission: scenario.company.mission,
      },
      metrics,
      stakeholders,
      signals,
      decisionsMade: [],
      timeline: now,
      startedAt: now,
      timeLeft: 90 * 60,
      simulationInstanceId: instanceId,
      triggeredEventIds: [],
    };

    return gameState;
  }

  createPMSimulationScenario(): ScenarioConfig {
    return {
      id: 'pm-simulation-scenario',
      name: 'Team Productivity Platform Simulator',
      description: 'Simulate a day in the life of a Product Manager at a growing startup',
      company: {
        name: 'FlowDesk',
        mission: 'Enable seamless collaboration for remote teams',
        currentQuarter: 2
      },
      product: {
        name: 'Team productivity SaaS',
        initialMetrics: [
          {
            id: 'activation-rate',
            name: 'Activation Rate',
            currentValue: 38,
            targetValue: 55,
            trend: 'decreasing',
            historicalData: [40, 39, 38.5, 38]
          },
          {
            id: 'signups',
            name: 'Signups',
            currentValue: 1200,
            targetValue: 1500,
            trend: 'increasing',
            historicalData: [1100, 1150, 1180, 1200]
          },
          {
            id: 'onboarding-completion',
            name: 'Onboarding Completion',
            currentValue: 52,
            targetValue: 70,
            trend: 'decreasing',
            historicalData: [60, 58, 55, 52]
          },
          {
            id: 'daily-active-users',
            name: 'Daily Active Users',
            currentValue: 3200,
            targetValue: 4000,
            trend: 'stable',
            historicalData: [3100, 3150, 3200, 3200]
          }
        ]
      },
      initialSignals: [
        {
          source: 'data',
          message: 'Activation rate dropped from 38% to 34% this week',
          priority: 'high'
        },
        {
          source: 'support',
          message: 'Users complain that onboarding is confusing, especially workspace setup step',
          priority: 'medium'
        },
        {
          source: 'leadership',
          message: 'We need growth this quarter - activation rate needs to improve significantly',
          priority: 'high'
        }
      ],
      stakeholders: {
        engineering: {
          name: 'Sarah Johnson',
          capacity: 10,
          concerns: ['system stability', 'technical debt']
        },
        design: {
          name: 'Michael Chen',
          workload: 4,
          stylePreference: 'minimalist'
        },
        support: {
          name: 'Emma Rodriguez',
          supportTickets: 12,
          userSentiment: 'negative'
        },
        sales: {
          name: 'David Kim',
          quarterlyTarget: 1000000,
          keyRequests: ['Advanced reporting', 'Custom integrations']
        },
        leadership: {
          name: 'Alex Thompson',
          strategicPriority: 'growth',
          satisfaction: 'concerned'
        }
      },
      challenges: [
        'Low activation rate despite growing signups',
        'Confusing onboarding process causing user abandonment',
        'Competing priorities from different stakeholders'
      ],
      objectives: [
        'Increase activation rate from 34% to 55%',
        'Reduce onboarding friction points',
        'Balance stakeholder needs while achieving growth targets'
      ]
    };
  }

  getAllScenarios(): ScenarioConfig[] {
    return Array.from(this.scenarios.values());
  }
}