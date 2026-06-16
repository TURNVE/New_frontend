// Utility functions for the PM simulation

import type { Metric, Stakeholder } from '../core/SimulationEngine';

export interface SignalEntry {
  id: string;
  priority: string;
  source: string;
  message: string;
  timestamp: Date;
}

export interface GameStateShape {
  product: { currentMetrics: Metric[] };
  stakeholders: Stakeholder[];
  signals: SignalEntry[];
}

export const calculateImpact = (
  decision: string,
  currentMetrics: Metric[],
  stakeholders: Stakeholder[]
): {
  metricsChange: Record<string, number>,
  stakeholderSatisfactionChange: Record<string, number>
} => {
  const metricsChange: Record<string, number> = {};
  const stakeholderSatisfactionChange: Record<string, number> = {};

  // Define impact rules based on decision
  switch (decision.toLowerCase()) {
    case 'investigate-onboarding':
      metricsChange['activation-rate'] = +2.5;
      metricsChange['onboarding-completion'] = +3.0;
      stakeholderSatisfactionChange['support'] = +5;
      stakeholderSatisfactionChange['engineering'] = +3;
      break;
    
    case 'add-new-feature':
      metricsChange['signups'] = +8.0;
      metricsChange['activation-rate'] = -1.5; // New features initially complicate onboarding
      stakeholderSatisfactionChange['sales'] = +10;
      stakeholderSatisfactionChange['engineering'] = -5; // Increased workload
      stakeholderSatisfactionChange['design'] = -3; // Scope creep concern
      break;
      
    case 'ignore-issue':
      metricsChange['activation-rate'] = -2.0; // Degrades further without intervention
      stakeholderSatisfactionChange['support'] = -10;
      stakeholderSatisfactionChange['leadership'] = -15;
      break;
      
    case 'team-meeting':
      stakeholderSatisfactionChange['all'] = +2; // Better communication improves satisfaction
      break;
      
    default:
      // Neutral small changes as time passes
      Object.keys(metricsChange).forEach(key => {
        metricsChange[key] += (Math.random() * 2) - 1; // -1 to +1
      });
      Object.keys(stakeholderSatisfactionChange).forEach(key => {
        stakeholderSatisfactionChange[key] += (Math.random() * 4) - 2; // -2 to +2
      });
  }

  return { metricsChange, stakeholderSatisfactionChange };
};

export interface TriggerResult {
  type: string;
  message: string;
  severity: string;
}

export interface SimulationContext {
  metricDrop?: number;
  developmentFocus?: string;
  request?: { complexity?: number; scope?: number };
  activationRate?: number;
  performanceScore?: number;
}

export const generateConsequence = (decision: string, context: SimulationContext): string => {
  switch (decision.toLowerCase()) {
    case 'investigate-onboarding':
      return 'After user research, you discover that the workspace setup step has 46% drop-off rate. Design team proposes simplified 3-step onboarding.';
    
    case 'add-new-feature':
      return 'Sales team is happy but engineering reports that the complex integration increased bug reports by 25%. Support team receives 15% more tickets.';
    
    case 'ignore-issue':
      return 'Without action, activation rate drops further to 32%. CEO schedules emergency meeting. Support team overwhelmed with complaints.';
    
    case 'monitor-situation':
      return 'Monitoring continues showing worsening trends. Time is being lost on potentially fixing the issue.';
    
    case 'team-meeting':
      return 'Cross-team meeting reveals underlying architecture limitations. Engineering suggests refactoring could solve multiple issues.';
    
    default:
      return 'Decision acknowledged.';
  }
};

export const checkTriggers = (gameState: GameStateShape): TriggerResult[] => {
  const triggers: TriggerResult[] = [];

  // Check for specific conditions that trigger events
  const activationRateMetric = gameState.product.currentMetrics.find(
    (m) => m.id === 'activation-rate'
  );

  if (activationRateMetric && activationRateMetric.currentValue < 35) {
    triggers.push({
      type: 'critical-low-activation',
      message: 'Activation rate is critically low',
      severity: 'high'
    });
  }

  if (gameState.signals.some((s) => s.priority === 'high' && s.source === 'leadership')) {
    triggers.push({
      type: 'ceo-pressure',
      message: 'Increased leadership attention due to performance',
      severity: 'medium'
    });
  }

  return triggers;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};