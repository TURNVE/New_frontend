import { GameState, Stakeholder, StakeholderConfig } from '../core/SimulationEngine';

export interface StakeholderRelationship {
  id: string;
  trustLevel: number; // 0-100 scale
  influence: number; // 0-100 scale
  alignment: number; // 0-100 scale (to PM goals)
  favorability: number; // 0-100 scale (positive vs negative view)
  activationThreshold: number; // What triggers their intervention
  relationshipHistory: { week: number; action: string; effect: number }[];
}

export interface StakeholderEffect {
  relationshipChanges: Record<string, number>;
  stakeholderPositions: Record<string, string>; // Their stance on issues
  influenceImpacts: Record<string, number>; // How their influence affects outcomes
}

export class StakeholderEngine {
  private relationships: Map<string, StakeholderRelationship> = new Map();

  constructor(initialStakeholders: StakeholderConfig[]) {
    this.initializeRelationships(initialStakeholders);
  }

  private initializeRelationships(stakeholders: StakeholderConfig[]): void {
    for (const stakeholder of stakeholders) {
      this.relationships.set(stakeholder.id, {
        id: stakeholder.id,
        trustLevel: stakeholder.initialSatisfaction,
        influence: stakeholder.influence,
        alignment: 50, // Start neutral alignment
        favorability: stakeholder.initialSatisfaction,
        activationThreshold: 60, // When stakeholder becomes highly active
        relationshipHistory: [
          { week: 0, action: 'initial_contact', effect: stakeholder.initialSatisfaction }
        ]
      });
    }
  }

  update(gameState: GameState): StakeholderEffect {
    const effect: StakeholderEffect = {
      relationshipChanges: {},
      stakeholderPositions: {},
      influenceImpacts: {}
    };

    // Update stakeholder relationships based on game state
    for (const [id, stakeholder] of gameState.stakeholders.entries()) {
      if (!this.relationships.has(stakeholder.id)) {
        // Initialize unknown stakeholder relationships
        this.relationships.set(stakeholder.id, {
          id: stakeholder.id,
          trustLevel: stakeholder.satisfaction,
          influence: stakeholder.influence,
          alignment: 50,
          favorability: stakeholder.satisfaction,
          activationThreshold: 60,
          relationshipHistory: [{ week: gameState.week, action: 'auto_detected', effect: stakeholder.satisfaction }]
        });
      }

      // Get current relationship
      const rel = this.relationships.get(stakeholder.id)!;
      const oldTrust = rel.trustLevel;
      
      // Update based on changes in satisfaction
      rel.trustLevel = Math.max(0, Math.min(100, stakeholder.satisfaction));
      rel.favorability = Math.max(0, Math.min(100, stakeholder.satisfaction));
      
      // Calculate alignment (how aligned they are with player's actions compared to their concerns)
      rel.alignment = this.calculateAlignment(gameState, stakeholder);

      // Record changes
      const change = rel.trustLevel - oldTrust; 
      if (Math.abs(change) > 0) {
        rel.relationshipHistory.push({
          week: gameState.week,
          action: 'passive_update',
          effect: change
        });
        
        effect.relationshipChanges[stakeholder.id] = change;
      }

      // Determine stance based on various factors
      effect.stakeholderPositions[stakeholder.id] = this.determineStakeholderPosition(rel);
    }

    // Apply stakeholder influence effects to game state
    effect.influenceImpacts = this.calculateInfluenceImpacts();
    
    return effect;
  }

  private calculateAlignment(gameState: GameState, stakeholder: Stakeholder): number {
    // Simplified alignment calculation
    // In a real system, this would compare stakeholder concerns with player actions
    let alignment = 50; // Base neutral alignment
    
    // If stakeholder satisfaction is high, alignment is higher
    if (stakeholder.satisfaction >= 80) alignment = 85;
    else if (stakeholder.satisfaction >= 70) alignment = 70;
    else if (stakeholder.satisfaction >= 60) alignment = 60;
    else if (stakeholder.satisfaction >= 40) alignment = Math.max(40, 60 - (60 - stakeholder.satisfaction));
    else alignment = Math.max(10, 40 - (40 - stakeholder.satisfaction));
    
    return alignment;
  }

  private determineStakeholderPosition(relationship: StakeholderRelationship): string {
    if (relationship.trustLevel < 30) return 'opposed';
    if (relationship.trustLevel < 60) return 'unsatisfied';
    if (relationship.trustLevel < 80) return 'satisfied';
    return 'advocating';
  }

  private calculateInfluenceImpacts(): Record<string, number> {
    const impacts: Record<string, number> = {};
    
    for (const [stakeholderId, rel] of this.relationships) {
      // Higher influence and lower favorability can lead to negative impacts
      const negativity = (100 - rel.favorability) / 100;
      const potentialNegativeImpact = (rel.influence / 100) * negativity;
      
      // Higher trust and alignment lead to positive impacts
      const positivty = rel.trustLevel / 100;
      const supportLevel = (rel.alignment / 100) * positivty;
      const potentialPositiveImpact = (rel.influence / 100) * supportLevel;
      
      // Net influence impact
      impacts[stakeholderId] = potentialPositiveImpact - potentialNegativeImpact;
    }
    
    return impacts;
  }

  applyActionImpact(stakeholderId: string, impactMagnitude: number, actionDescription: string, gameWeek?: number): void {
    const rel = this.relationships.get(stakeholderId);
    if (!rel) return;

    let previousTrust = rel.trustLevel;
    
    // Apply impact based on action
    rel.trustLevel = Math.max(0, Math.min(100, rel.trustLevel + impactMagnitude));
    
    // Log the action
    rel.relationshipHistory.push({
      week: gameWeek ?? 0,
      action: actionDescription,
      effect: impactMagnitude
    });

    // Trigger events if threshold crossed
    if (rel.activationThreshold && rel.trustLevel < rel.activationThreshold * 0.6 && previousTrust >= rel.activationThreshold * 0.6) {
      // Very disappointed stakeholder might become active opponent
      console.log(`Stakeholder ${stakeholderId} became highly active opponent due to low trust`);
    } else if (rel.trustLevel > rel.activationThreshold && previousTrust <= rel.activationThreshold) {
      // Happy stakeholder becomes advocate
      console.log(`Stakeholder ${stakeholderId} became advocate due to high trust`);
    }
  }

  getStakeholderPosition(stakeholderId: string): string {
    const rel = this.relationships.get(stakeholderId);
    return rel ? this.determineStakeholderPosition(rel) : 'unknown';
  }

  getRelationshipStrength(stakeholderId: string): number {
    const rel = this.relationships.get(stakeholderId);
    return rel ? rel.trustLevel : 0;
  }

  getStakeholderInfluence(stakeholderId: string): number {
    const rel = this.relationships.get(stakeholderId);
    return rel ? rel.influence : 0;
  }

  getOverallInfluenceFactor(): number {
    // Aggregate total stakeholder influence on situation
    const totalPotential = Array.from(this.relationships.values())
      .reduce((sum, rel) => sum + rel.influence, 0);
    
    const totalActual = Array.from(this.relationships.values())
      .reduce((sum, rel) => {
        const relationshipFactor = rel.trustLevel / 100 * rel.alignment / 100;
        return sum + (rel.influence * relationshipFactor);
      }, 0);

    return totalPotential > 0 ? totalActual / totalPotential : 0.5; // Return 0.5 if no stakeholders
  }

  getCriticalStakeholders(): string[] {
    // Return stakeholders who are either very influential or have very low trust
    
    return Array.from(this.relationships.entries())
      .filter(([id, rel]) => 
        (rel.influence > 70) || // Very influential stakeholders
        (rel.trustLevel < 40) // Unhappy stakeholders who could cause problems
      )
      .map(([id, rel]) => id);
  }

  getInterventionProbability(stakeholderId: string): number {
    const rel = this.relationships.get(stakeholderId);
    if (!rel) return 0;
    
    // Probability they'll intervene increases when:
    // 1. Their trust is low and deteriorating
    // 2. They have high influence 
    // 3. They feel their concerns aren't being addressed
    const trustFactor = Math.max(0, (60 - rel.trustLevel) / 60); // Higher when trust < 60
    const influenceFactor = Math.min(1.0, rel.influence / 100); // Higher influence = more likely to act
    const alignmentFactor = Math.max(0, (70 - rel.alignment) / 70); // More likely when misaligned
    
    return trustFactor * influenceFactor * alignmentFactor;
  }
}