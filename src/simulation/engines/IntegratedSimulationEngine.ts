import { GameState, Scenario, StakeholderConfig, StateEffects } from '../core/SimulationEngine';
import { TimeEngine, TimeState } from './TimeEngine';
import { CrisisEngine, CrisisInstance } from './CrisisEngine';
import { StakeholderEngine } from './StakeholderEngine';
import { DecisionEngine } from './DecisionEngine';
import { PsychologicalPressureLayer, PsychologicalState, PsychologicalEffect } from './PsychologicalPressureLayer';

export interface IntegrationEffect {
  timeEffect: number;
  crisisSeverityChange: number;
  stakeholderImpact: number;
  decisionQualityModifier: number;
  psychologicalEffects: PsychologicalEffect;
}

export interface IntegratedState {
  timeState: TimeState;
  activeCrises: CrisisInstance[];
  psychologicalState: PsychologicalState;
  criticalStakeholders: string[];
  pressureMetrics: {
    timePressure: number;
    stressIndex: number;
    decisionFatigueLevel: number;
    overallSystemLoad: number;
  };
}

export class IntegratedSimulationEngine {
  private timeEngine: TimeEngine;
  private crisisEngine: CrisisEngine;
  private stakeholderEngine: StakeholderEngine;
  private decisionEngine: DecisionEngine;
  private psychologicalLayer: PsychologicalPressureLayer;
  private gameState: GameState;
  private scenario: Scenario;

  constructor(scenario: Scenario, gameState: GameState) {
    this.scenario = scenario;
    this.gameState = gameState;
    this.timeEngine = new TimeEngine(scenario.durationWeeks * 24); // Convert weeks to hours for the crisis scenario
    this.crisisEngine = new CrisisEngine();
    this.stakeholderEngine = new StakeholderEngine(scenario.stakeholders);
    this.decisionEngine = new DecisionEngine();
    this.psychologicalLayer = new PsychologicalPressureLayer();
  }

  update(): IntegrationEffect {
    // Get current state values
    const currentTimeState = this.timeEngine.getTimeState();
    const accumulatedPressure = currentTimeState.pressureAccumulator;
    const decisionImpact = this.getRecentDecisionImpact();

    // Update individual engines
    const timeEffect = this.timeEngine.tick(1); // Progress by 1 day
    const crisisEffect = this.crisisEngine.update(this.gameState);
    const stakeholderEffect = this.stakeholderEngine.update(this.gameState);
    // const decisionEffect = this.decisionEngine.update(this.gameState); // Decisions managed separately by UI
    
    // Update psychological layer based on all other engine outputs
    const psychologicalEffect = this.psychologicalLayer.update(
      this.gameState, 
      accumulatedPressure,
      decisionImpact
    );

    // Calculate integration effects
    const crisisSeverityChange = Object.values(crisisEffect.severityChanges || {}).reduce((a, b) => a + b, 0);
    const stakeholderImpactAvg = Object.values(stakeholderEffect.relationshipChanges).length > 0 ?
      Object.values(stakeholderEffect.relationshipChanges).reduce((a, b) => a + b, 0) / Object.values(stakeholderEffect.relationshipChanges).length :
      0;

    return {
      timeEffect: timeEffect.hoursElapsed || 0,
      crisisSeverityChange,
      stakeholderImpact: stakeholderImpactAvg,
      decisionQualityModifier: psychologicalEffect.judgmentChanges,
      psychologicalEffects: psychologicalEffect
    };
  }

  private getRecentDecisionImpact(): number {
    // Get the most recent decision's effectiveness as impact measure
    const recentDecision = this.decisionEngine.getDecisionHistory().slice(-1)[0];
    return recentDecision?.effectiveness ? recentDecision.effectiveness : 0;
  }

  getIntegratedState(): IntegratedState {
    return {
      timeState: this.timeEngine.getTimeState(),
      activeCrises: this.crisisEngine.getActiveCrises(),
      psychologicalState: this.psychologicalLayer.getPsychologicalState(),
      criticalStakeholders: this.stakeholderEngine.getCriticalStakeholders(),
      pressureMetrics: {
        timePressure: this.timeEngine.getTimePressure(),
        stressIndex: this.psychologicalLayer.getPsychologicalState().stressLevel,
        decisionFatigueLevel: this.psychologicalLayer.getPsychologicalState().decisionFatigue,
        overallSystemLoad: this.calculateSystemLoad()
      }
    };
  }

  private calculateSystemLoad(): number {
    // Combination of multiple pressure metrics
    const pressureState = this.psychologicalLayer.getPsychologicalState();
    const timeState = this.timeEngine.getTimeState();
    const crisisStress = this.crisisEngine.getSeverityRating() * 100;

    const combinedLoad = (
      pressureState.stressLevel * 0.3 +
      timeState.pressureAccumulator * 20 * 0.2 + // Amplified time pressure
      crisisStress * 0.3 +
      pressureState.cognitiveLoad * 0.2
    );

    return Math.min(100, combinedLoad);
  }

  // Interface to individual engine updates
  triggerCrisis(crisis: CrisisInstance): void {
    this.crisisEngine.detectCrisis(crisis);
  }

  makeDecision(optionId: string, decisionId: string, justification: string = ''): boolean {
    const success = this.decisionEngine.selectOption(decisionId, optionId, justification);
    if (success) {
      this.updateStakeholdersFromDecision(optionId, decisionId);
    }
    return success;
  }

  private updateStakeholdersFromDecision(optionId: string, decisionId: string): void {
    // Get the decided option
    const allDecisions = this.decisionEngine.getDecisionHistory();
    const decision = allDecisions.find(d => d.id === decisionId);
    if (decision) {
      const selectedOption = decision.options.find(opt => opt.id === optionId);
      if (selectedOption) {
        // Apply impacts to stakeholder relationships
        for (const [stakeholderId, impact] of Object.entries(selectedOption.estimatedImpact)) {
          if (!isNaN(parseFloat(stakeholderId))) continue;
          this.stakeholderEngine.applyActionImpact(stakeholderId, impact, `Decision: ${optionId}`, this.gameState.week);
        }
      }
    }
  }

  createNewDecision(options: any[], phaseId: string, triggerReason: string): void {
    this.decisionEngine.createDecision(options, phaseId, triggerReason);
  }

  updateGameState(newState: GameState): void {
    this.gameState = newState;
    // Propagate state changes to all engines that might need to adapt
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getStakeholderRelationship(stakeholderId: string): number {
    return this.stakeholderEngine.getRelationshipStrength(stakeholderId);
  }

  getStakeholderInfluence(stakeholderId: string): number {
    return this.stakeholderEngine.getStakeholderInfluence(stakeholderId);
  }

  getStakeholdersInPosition(position: string): string[] {
    const criticalStakeholders = this.stakeholderEngine.getCriticalStakeholders();
    return criticalStakeholders.filter(id => this.stakeholderEngine.getStakeholderPosition(id) === position);
  }

  getCrisisSeverityRating(): number {
    return this.crisisEngine.getSeverityRating();
  }

  getPsychologicalState(): PsychologicalState {
    return this.psychologicalLayer.getPsychologicalState();
  }

  applyStateEffects(effects: StateEffects): void {
    // Apply general state effects
    if (effects.budget !== undefined) {
      this.gameState.budget = Math.max(0, Math.min(100, this.gameState.budget + effects.budget));
    }
    if (effects.teamMorale !== undefined) {
      this.gameState.teamMorale = Math.max(0, Math.min(100, this.gameState.teamMorale + effects.teamMorale));
    }
    if (effects.riskLevel !== undefined) {
      this.gameState.riskLevel = Math.max(0, Math.min(100, this.gameState.riskLevel + effects.riskLevel));
    }
    if (effects.stakeholderTrust !== undefined) {
      this.gameState.stakeholderTrust += effects.stakeholderTrust;
    }
    if (effects.progress !== undefined) {
      this.gameState.progress = Math.max(0, Math.min(100, this.gameState.progress + effects.progress));
    }
    if (effects.stakeholderSatisfaction) {
      for (const [stakeholderId, change] of Object.entries(effects.stakeholderSatisfaction)) {
        this.gameState.stakeholders = this.gameState.stakeholders.map(s =>
          s.id === stakeholderId ? { ...s, satisfaction: Math.min(100, Math.max(0, s.satisfaction + change)) } : s
        );
      }
    }
  }

  setWeek(week: number): void {
    this.gameState.week = week;
    // Adjust time engine accordingly if implementing in hour format
    this.timeEngine.setTimeOfDay(9, 0); // Start of day
  }

  getTimeState(): TimeState {
    return this.timeEngine.getTimeState();
  }

  getDecisionData() {
    return {
      pendingDecisions: this.decisionEngine.getPendingDecisions(),
      decisionHistory: this.decisionEngine.getDecisionHistory(),
      pressureLevel: this.decisionEngine.getCurrentPressureLevel()
    };
  }

  reset() {
    this.timeEngine = new TimeEngine();
    this.crisisEngine = new CrisisEngine();
    this.stakeholderEngine = new StakeholderEngine(this.scenario.stakeholders);
    this.decisionEngine = new DecisionEngine();
    this.psychologicalLayer = new PsychologicalPressureLayer();
  }
}