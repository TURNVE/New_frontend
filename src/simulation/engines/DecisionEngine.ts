import { GameState } from '../core/SimulationEngine';

type ImpactType = 'stakeholder' | 'reputational' | 'financial' | 'time' | 'ethics' | 'operational';
type DecisionQualityScore = number; // Range: 0-1

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  estimatedImpact: Record<string, number>; // e.g., { stakeholderTrust: 5, risk: -10, budget: -500 }
  confidence: number; // Confidence in prediction (0-1 range)
  requires: string[]; // Dependencies this option needs
  conflicts: string[]; // Other options this conflicts with
  ethicalWeight: number; // Ethical considerations (0-1)
}

export interface DecisionInstance {
  id: string;
  phaseId: string;
  timestamp: number; // Game time when decision was made
  options: DecisionOption[];
  selectedOptionId?: string;
  reason?: string;
  effectiveness?: number; // How well the decision worked out (post-facto evaluation)
  impacts?: Record<ImpactType, number>;
  stakeholderReactions?: Record<string, number>; // How stakeholders reacted
  unintendedConsequences?: string[];
  timePressureScore?: number; // How much pressure influenced the decision
}

export interface DecisionEffect {
  updatedMetrics: Record<string, number>;
  affectedStakeholders: Record<string, number>;
  newRisk: number;
  ethicalScoreChange: number;
  confidenceLevel: number;
  pressureFactors: number;
}

export class DecisionEngine {
  private decisionHistory: DecisionInstance[] = [];
  private pendingDecisions: DecisionInstance[] = [];

  constructor() {}

  update(gameState: GameState): DecisionEffect {
    const effect: DecisionEffect = {
      updatedMetrics: {},
      affectedStakeholders: {},
      newRisk: 0,
      ethicalScoreChange: 0,
      confidenceLevel: 0.5, // Default confidence for automatic processing
      pressureFactors: 0
    };

    // Update pending decisions based on current state
    for (const decision of this.pendingDecisions) {
      // Calculate current pressure score
      const pressureScore = this.calculateTimePressureScore(gameState);
      decision.timePressureScore = pressureScore;
      
      // Factor in stress levels affecting decision making
      const stressFactor = this.calculateStressFactors(gameState);
    
      // Apply any automatic decisions if thresholds are crossed
      if (pressureScore > 0.8 && !decision.selectedOptionId) { // High pressure
        // Simulate time-delayed decision making
        const selectedId = this.applyHeuristicDecision(decision.options, stressFactor, gameState);
        this.recordDecision(decision.id, selectedId, `Forced decision under time pressure`);
      }
    }

    // Clean up resolved decisions
    this.pendingDecisions = this.pendingDecisions.filter(d => !d.selectedOptionId);

    return effect;
  }

  createDecision(options: DecisionOption[], phaseId: string, triggerReason: string = 'automated'): DecisionInstance {
    const decision: DecisionInstance = {
      id: `decision_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      phaseId,
      timestamp: Date.now(),
      options,
      reason: triggerReason
    };

    // Add to pending decisions so it can be tracked
    this.pendingDecisions.push(decision);
    
    return decision;
  }

  selectOption(decisionId: string, optionId: string, justification?: string): boolean {
    const decision = this.pendingDecisions.find(d => d.id === decisionId);
    if (!decision) return false;

    // Validate option selection
    const selectedOption = decision.options.find(opt => opt.id === optionId);
    if (!selectedOption) return false;
    
    decision.selectedOptionId = optionId;
    
    // Process the decision and move to history
    this.processSelectedOption(decision, selectedOption, justification || '');
    
    return true;
  }

  private processSelectedOption(decision: DecisionInstance, selectedOption: DecisionOption, justification: string): void {
    // Calculate the actual effects based on confidence/reality mismatch
    const realizedEffects: Record<string, number> = {};
    
    // Apply estimated impacts with randomness based on confidence
    for (const [key, value] of Object.entries(selectedOption.estimatedImpact)) {
      // Lower confidence means more deviation from estimated impact
      const confidence = selectedOption.confidence || 0.7; // Default to 70%
      const variance = 1 - confidence;
      const randomFactor = 1 + (Math.random() - 0.5) * 2 * variance; // Varies [-variance, +variance]
      realizedEffects[key] = value * randomFactor;
    }

    decision.effectiveness = this.calculateEffectiveness(selectedOption, realizedEffects, decision.timePressureScore || 0);
    decision.impacts = this.categorizeImpacts(realizedEffects);
    decision.stakeholderReactions = this.generateStakeholderReactions(realizedEffects);
    
    // Move to history instead of removing
    this.decisionHistory.push({ ...decision });
    
    // Remove from pending
    const index = this.pendingDecisions.findIndex(d => d.id === decision.id);
    if (index !== -1) {
      this.pendingDecisions.splice(index, 1);
    }
  }

  private recordDecision(decisionId: string, optionId: string, reason: string): void {
    const decision = this.pendingDecisions.find(d => d.id === decisionId);
    if (!decision) return;
    
    decision.selectedOptionId = optionId;
    const selectedOption = decision.options.find(opt => opt.id === optionId);
    if (selectedOption) {
      this.processSelectedOption(decision, selectedOption, reason);
    }
  }

  private applyHeuristicDecision(options: DecisionOption[], stressFactor: number, gameState: GameState): string {
    // Simple heuristic: In high-stress situations, pick safer options or those with known outcomes
    
    // Sort options by a combination of safety and estimated positive outcome
    const scoredOptions = options.map(option => {
      // Consider stress - when stressed, safer options score higher
      const safetyScore = 1 / (option.ethicalWeight + 0.1); // Avoid ethically questionable options when stressed
      const estimatedReward = Object.values(option.estimatedImpact).reduce((a, b) => a + b, 0);
      const confidenceBoost = option.confidence * 0.5; // Higher confidence adds to score
      
      // Apply stress modifier if applicable
      const stressModifier = stressFactor > 0.7 ? 0.7 : 1; // Stress reduces tendency to take risks
      
      const finalScore = (estimatedReward * confidenceBoost * stressModifier) - safetyScore;
      
      return { option, score: finalScore };
    });

    // Sort by descending score
    scoredOptions.sort((a, b) => b.score - a.score);
    
    // Return top option
    return scoredOptions[0].option.id;
  }

  private calculateEffectiveness(selectedOption: DecisionOption, realizedEffects: Record<string, number>, pressureScore: number): number {
    const estimatedSum = Object.values(selectedOption.estimatedImpact).reduce((a, b) => a + b, 0);
    const realizedSum = Object.values(realizedEffects).reduce((a, b) => a + b, 0);
    
    // Calculate effectiveness as difference between expected and actual (closer is better)
    // Also factor in pressure effects
    const expectedVsActualMatch = 1 - Math.abs(estimatedSum - realizedSum) / (Math.abs(estimatedSum) + 1);
    const pressureAdjustment = 1 - (pressureScore * 0.2); // Pressure negatively affects effectiveness
    
    // Weight by confidence of original estimate
    return Math.max(0, expectedVsActualMatch * selectedOption.confidence * pressureAdjustment);
  }

  private categorizeImpacts(effects: Record<string, number>): Record<ImpactType, number> {
    const categorized: Record<ImpactType, number> = {
      'stakeholder': 0,
      'reputational': 0,
      'financial': 0,
      'time': 0,
      'ethics': 0,
      'operational': 0
    };

    for (const [key, value] of Object.entries(effects)) {
      if (key.includes('stakeholder') || key.includes('trust')) categorized.stakeholder += value;
      else if (key.includes('reputation') || key.includes('brand') || key.includes('media')) categorized.reputational += value;
      else if (key.includes('budget') || key.includes('cost') || key.includes('finance')) categorized.financial += value;
      else if (key.includes('time') || key.includes('week') || key.includes('days')) categorized.time += value;
      else if (key.includes('operation') || key.includes('efficiency') || key.includes('performance')) categorized.operational += value;
      else categorized.operational += value; // fallback to operational
    }

    return categorized;
  }

  private generateStakeholderReactions(effects: Record<string, number>): Record<string, number> {
    const reactions: Record<string, number> = {};
    
    // Generate some simple stakeholder reactions based on impact
    // In a real system, this would draw from the game stakeholder model
    if (effects['budget'] && effects['budget'] < 0) {
      reactions['investors'] = effects['budget'] * -0.1;  // Investors unhappy about costs
    }
    if (effects['teamMorale']) {
      reactions['team'] = effects['teamMorale'] * 0.5;  // Team reaction to morale changes
    }
    
    return reactions;
  }

  private calculateTimePressureScore(gameState: GameState): number {
    // Calculate pressure based on time constraints
    const timeRemaining = gameState.totalWeeks - gameState.week;
    const proportionRemaining = timeRemaining / gameState.totalWeeks;
    
    // Pressure inversely correlates with time remaining
    // As deadline approaches, pressure increases exponentially
    let pressure = 1 - proportionRemaining;
    if (pressure > 0.7) {
      pressure = 0.7 + (pressure - 0.7) * 2; // Exponential increase beyond 0.7
    }
    
    return Math.min(1, pressure);
  }

  private calculateStressFactors(gameState: GameState): number {
    // Combine various stressors in the game environment
    const riskFactor = gameState.riskLevel; // 0-1 scale
    const stakeholderFactor = 1 - (gameState.stakeholderTrust / 100); // Higher dissatisfaction = higher stress
    const progressFactor = gameState.progress < 50 ? 0.3 : 0; // Early struggles
    
    return Math.min(1, riskFactor * 0.4 + stakeholderFactor * 0.4 + progressFactor * 0.2);
  }

  getCurrentPressureLevel(): number {
    if (this.pendingDecisions.length === 0) return 0;
    
    // Average the pressure scores of all pending decisions
    const totalPressure = this.pendingDecisions.reduce((sum, decision) => 
      sum + (decision.timePressureScore || 0), 0);
    
    return totalPressure / this.pendingDecisions.length;
  }

  getPendingDecisions(): DecisionInstance[] {
    return [...this.pendingDecisions];
  }

  getDecisionHistory(): DecisionInstance[] {
    return [...this.decisionHistory];
  }

  canResolveDecision(decisionId: string): boolean {
    const decision = this.pendingDecisions.find(d => d.id === decisionId);
    return !!(decision && decision.options.length > 0);
  }

  getRecommendedOption(decisionId: string, gameState: GameState): string | null {
    const decision = this.pendingDecisions.find(d => d.id === decisionId);
    if (!decision) return null;
    
    // Simple recommendation algorithm prioritizes high-confidence, high-reward options
    const bestOption = decision.options
      .sort((a, b) => {
        const aScore = Object.values(a.estimatedImpact).reduce((acc, val) => acc + val, 0) * a.confidence;
        const bScore = Object.values(b.estimatedImpact).reduce((acc, val) => acc + val, 0) * b.confidence;
        return bScore - aScore; // Higher scores first
      })[0];
      
    return bestOption ? bestOption.id : null;
  }
}