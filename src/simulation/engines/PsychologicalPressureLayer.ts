import { GameState } from '../core/SimulationEngine';
import { TimeEngine } from './TimeEngine';
import { CrisisEngine } from './CrisisEngine';
import { StakeholderEngine } from './StakeholderEngine';
import { DecisionEngine } from './DecisionEngine';

// Psychological & Mental Health Layer
export interface PsychologicalState {
  stressLevel: number;      // 0-100 scale, accumulates over time
  decisionFatigue: number;  // How tired the user is from making decisions (0-100)
  cognitiveLoad: number;    // How much mental load they're currently under (0-100)
  morale: number;           // General emotional/mental morale (0-100, but can exceed bounds)
  focus: number;            // Ability to concentrate (0-100)
  anxiety: number;          // Current anxiety level (0-100)
  confidence: number;       // Self-rated ability to make good decisions (0-100)
  resilience: number;       // Emotional resilience to bouncing back (0-100)
  burnoutFactor: number;    // Accumulated fatigue from long sessions (0-100)
}

export interface PsychologicalEffect {
  stressImpacts: number;
  judgmentChanges: number;  // How judgment is affected due to psychological state
  reactionTimeChanges: number;  // Changes to how quickly user can respond
  motivationChanges: number;    // How motivated user is to continue
}

export class PsychologicalPressureLayer {
  private state: PsychologicalState;

  constructor() {
    this.state = {
      stressLevel: 30,
      decisionFatigue: 20,
      cognitiveLoad: 25,
      morale: 70,
      focus: 70,
      anxiety: 20,
      confidence: 60,
      resilience: 60,
      burnoutFactor: 0
    };
  }

  update(gameState: GameState, accumulatedPressure: number, decisionImpact: number): PsychologicalEffect {
    const effect: PsychologicalEffect = {
      stressImpacts: 0,
      judgmentChanges: 0,
      reactionTimeChanges: 0,
      motivationChanges: 0
    };

    // Update stress based on various pressures from the sim
    this.state.stressLevel = this.calculateStressUpdate(
      gameState,
      accumulatedPressure,
      decisionImpact,
      this.state.stressLevel
    );

    // Update decision fatigue from making decisions
    if (decisionImpact !== 0) {
      this.state.decisionFatigue = Math.min(100, this.state.decisionFatigue + 5);
    }

    // Cognitive load increases with crisis activity
    const crisisPressure = Math.max(0, gameState.riskLevel * 30);
    this.state.cognitiveLoad = Math.min(100, Math.max(10, crisisPressure + (this.state.cognitiveLoad * 0.1)));

    // Anxiety increases with high time pressure and risk
    const anxietyInput = (this.state.stressLevel * 0.4) + 
                        (gameState.riskLevel * 20) + 
                        (gameState.week / gameState.totalWeeks * 10);
    this.state.anxiety = Math.min(100, this.state.anxiety * 0.8 + anxietyInput * 0.2);

    // Morale changes based on success/failure patterns
    this.updateMorale(gameState);

    // Focus decreases when stress and anxiety are high
    this.state.focus = Math.max(10, 100 - (this.state.stressLevel * 0.5) - (this.state.anxiety * 0.3));

    // Confidence changes based on performance
    this.updateConfidence(gameState);

    // Burnout accumulates with sustained high pressure
    if (this.state.stressLevel > 60 && gameState.week > 1) {
      this.state.burnoutFactor = Math.min(100, this.state.burnoutFactor + 2);
    } else if (this.state.burnoutFactor > 0) {
      this.state.burnoutFactor = Math.max(0, this.state.burnoutFactor - 1);
    }

    // Calculate impact on decision quality
    effect.judgmentChanges = this.calculateJudgmentEffect();
    effect.reactionTimeChanges = this.calculateReactionTimeEffect();
    effect.motivationChanges = this.calculateMotivationEffect();
    
    return effect;
  }

  private calculateStressUpdate(
    gameState: GameState, 
    accumulatedPressure: number, 
    decisionImpact: number,
    currentStress: number
  ): number {
    // Multiple stressors contribute to stress levels:
    // 1. Time pressure
    const timePressure = Math.max(0, ((gameState.totalWeeks - gameState.week) / gameState.totalWeeks) * -60);
    // 2. Risk levels in the game
    const riskStress = gameState.riskLevel * 25;
    // 3. Stakeholder dissatisfaction (higher if more important stakeholders)
    const avgStakeholderStress = gameState.stakeholders.reduce((sum, s) => sum + (100 - s.satisfaction) * (s.influence / 100), 0) / gameState.stakeholders.length || 1;

    // Calculate weighted average of pressures with previous stress
    const newStress = (currentStress * 0.6) + 
                     (accumulatedPressure * 10) + 
                     riskStress + 
                     (avgStakeholderStress * 0.7) + 
                     Math.abs(decisionImpact) * 3;
    
    return Math.min(100, Math.max(0, newStress));
  }

  private updateMorale(gameState: GameState): void {
    // Morale changes based on success indicators
    const progressRate = gameState.progress;
    const teamMoraleFactor = gameState.teamMorale;
    const successIndicator = (progressRate + teamMoraleFactor) / 2;
    
    // Adjust morale based on whether expectations are being met
    const expectedRate = (gameState.week / gameState.totalWeeks) * 100;
    const achievementRatio = progressRate / Math.max(expectedRate, 1);
    
    const desiredChange = achievementRatio > 1.0 ?  
                          Math.min(5, (achievementRatio - 1.0) * 100) :  // Reward exceeding expectations 
                          Math.max(-5, (achievementRatio - 1.0) * 50);   // Penalty for below exp

    // Limit morale changes based on current level
    const stressAdjustment = 1 - (this.state.stressLevel / 150);  // More stress → more muted reactions
    this.state.morale = Math.min(100, Math.max(0, this.state.morale + (desiredChange * stressAdjustment)));
  }

  private updateConfidence(gameState: GameState): void {
    // Confidence is mostly based on how things seem to be going
    const performanceIndicator = (gameState.progress + gameState.stakeholderTrust + gameState.teamMorale) / 3;
    const riskFactor = 100 - (gameState.riskLevel * 60);  // Lower risk gives more confidence
    
    // Blend with previous confidence based on results vs plans
    const expectedPerformance = 60 + (gameState.week / gameState.totalWeeks * 20);  // Expected to improve over time
    const performanceRatio = performanceIndicator / Math.max(expectedPerformance, 1);
    
    const comfort = (performanceRatio * 30) + (riskFactor * 0.3) - (this.state.stressLevel * 0.3);
   
    this.state.confidence = Math.min(100, Math.max(10, comfort));
  }

  private calculateJudgmentEffect(): number {
    // Poor psychological states impair judgment
    const stressImpairment = this.state.stressLevel > 70 ? (this.state.stressLevel - 70) * 0.03 : 0;
    const fatigueImpairment = this.state.decisionFatigue > 60 ? (this.state.decisionFatigue - 60) * 0.02 : 0;
    const anxietyImpairment = this.state.anxiety > 50 ? (this.state.anxiety - 50) * 0.025 : 0;
    
    // Positive factors
    const positiveImpacts = Math.max(0, this.state.confidence * 0.01);

    return (positiveImpacts - stressImpairment - fatigueImpairment - anxietyImpairment);
  }

  private calculateReactionTimeEffect(): number {
    // Reaction time gets worse when stressed or with high cognitive load
    const stressDelay = (this.state.stressLevel / 100) * 0.3;
    const cognitiveOverload = (this.state.cognitiveLoad / 100) * 0.2;
    const focusBenefit = Math.max(0, (this.state.focus / 100) * -0.15);

    return stressDelay + cognitiveOverload + focusBenefit;
  }

  private calculateMotivationEffect(): number {
    // Motivation is impacted by morale, stress, and burnout
    const moraleFactor = (this.state.morale - 50) / 100;  // -0.5 to +0.5
    const stressNegImpacts = this.state.stressLevel > 70 ? -(this.state.stressLevel - 70) / 100 : 0;
    const burnoutFactor = this.state.burnoutFactor > 50 ? -(this.state.burnoutFactor - 50) / 100 : -0.2;

    return Math.max(-0.9, moraleFactor + stressNegImpacts + burnoutFactor);  // Cap at -90%
  }

  getPsychologicalState(): PsychologicalState {
    return { ...this.state };
  }

  reset(): void {
    this.state = {
      stressLevel: 30,
      decisionFatigue: 20,
      cognitiveLoad: 25,
      morale: 70,
      focus: 70,
      anxiety: 20,
      confidence: 60,
      resilience: 60,
      burnoutFactor: 0
    };
  }
}