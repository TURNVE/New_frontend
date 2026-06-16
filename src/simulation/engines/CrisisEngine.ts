import { GameState } from '../core/SimulationEngine';

export interface CrisisInstance {
  id: string;
  name: string;
  description: string;
  severity: number; // 0-1 scale
  escalationRate: number; // How fast it gets worse when not addressed
  stakeholderImpact: Record<string, number>; // Impact on stakeholder satisfaction
  businessImpact: Record<string, number>; // Impact on business metrics
  resolved: boolean;
  reportedAt: number; // Week when crisis was discovered
  resolvedAt?: number;
  mitigationStrategy?: string;
}

export interface CrisisEffect {
  newCrises?: CrisisInstance[];
  severityChanges?: Record<string, number>;
  stakeholderImpacts?: Record<string, number>;
  businessImpacts?: Record<string, number>;
  riskIncrease?: number;
  reputationDamage?: number;
}

export class CrisisEngine {
  private activeCrises: CrisisInstance[] = [];
  private history: CrisisInstance[] = [];

  constructor() {}

  update(gameState: GameState): CrisisEffect {
    const effect: CrisisEffect = {
      severityChanges: {},
      stakeholderImpacts: {},
      businessImpacts: {},
      riskIncrease: 0,
      reputationDamage: 0
    };

    // First, handle any crises from state that might affect the crisis engine
    if (this.activeCrises.length === 0) {
      // Initialize with PayLink scenario crises if in PayLink scenario
      this.initializeCrisisState(gameState);
    }

    // Iterate through all active crises
    for (const crisis of this.activeCrises) {
      if (crisis.resolved) continue;

      // 1. Escalate crisis severity based on time passed since detection
      const weeksSinceReport = gameState.week - crisis.reportedAt;
      const escalationImpact = crisis.escalationRate * weeksSinceReport * 0.1;
      
      // Cap severity at 1.0, but never decrease past original severity
      const newSeverity = Math.min(1.0, crisis.severity + escalationImpact);
      const severityChange = newSeverity - crisis.severity;
      crisis.severity = newSeverity;

      // Add to effect record
      effect.severityChanges![crisis.id] = severityChange;

      // 2. Apply stakeholder impacts
      Object.entries(crisis.stakeholderImpact).forEach(([stakeholderId, impact]) => {
        // Scale impact by severity
        const scaledImpact = impact * crisis.severity;
        effect.stakeholderImpacts![stakeholderId] = (effect.stakeholderImpacts![stakeholderId] || 0) + scaledImpact;
      });

      // 3. Apply business impacts
      Object.entries(crisis.businessImpact).forEach(([metric, impact]) => {
        // Scale impact by severity
        const scaledImpact = impact * crisis.severity * 0.1; // Less severe for business metrics
        effect.businessImpacts![metric] = (effect.businessImpacts![metric] || 0) + scaledImpact;
      });

      // 4. Cumulative risk increase from ongoing crises
      effect.riskIncrease! += crisis.severity * 0.1;
    }

    return effect;
  }

  private initializeCrisisState(gameState: GameState): void {
    // For the PayLink scenario, populate crises from scenario data if available
    // For now, adding sample crises for demonstration
    if (gameState.week <= 2) {
      this.activeCrises = [
        {
          id: 'transaction_failures',
          name: 'Payment Transaction Failures',
          description: '12% of payment transactions fail during QA testing',
          severity: 0.7, // Starts high due to immediate impact
          escalationRate: 1.2,
          stakeholderImpact: {
            'ceo': -0.3,
            'cto': -0.5,
            'compliance_lead': -0.6,
            'customer_support_head': -0.4
          },
          businessImpact: {
            'reputation': -10,
            'customerSafety': -15,
            'financialRisk': -12
          },
          reportedAt: 1,
          resolved: false
        },
        {
          id: 'kyc_gap',
          name: 'KYC/AML Compliance Gap',
          description: 'Discovered gaps in Know Your Customer verification for international transfers',
          severity: 0.6,
          escalationRate: 0.8,
          stakeholderImpact: {
            'compliance_lead': -0.6,
            'ceo': -0.4,
            'legal_lead': -0.7
          },
          businessImpact: {
            'regulatoryRisk': 12,
            'operationalRisk': 10
          },
          reportedAt: 1,
          resolved: false
        },
        {
          id: 'ceo_cto_conflict',
          name: 'CEO-CTO Strategic Conflict',
          description: 'Deep disagreements between CEO and CTO about launch readiness',
          severity: 0.5,
          escalationRate: 0.5,
          stakeholderImpact: {
            'all_other_stakeholders': -0.2 
          },
          businessImpact: {
            'decisionVelocity': -8,
            'resourceAllocation': -6
          },
          reportedAt: 1,
          resolved: false
        }
      ];
    }
  }

  detectCrisis(newCrisis: CrisisInstance): void {
    // Find if crisis already exists
    const existingCrisis = this.activeCrises.find(c => c.id === newCrisis.id);
    if (existingCrisis) {
      // Update existing crisis if newer info is more severe
      if (newCrisis.severity > existingCrisis.severity) {
        existingCrisis.severity = newCrisis.severity;
        existingCrisis.description = newCrisis.description;
      }
      return;
    }

    // Otherwise, add new crisis
    this.activeCrises.push({ ...newCrisis });
  }

  resolveCrisis(crisisId: string, strategy: string): void {
    const crisis = this.activeCrises.find(c => c.id === crisisId);
    if (crisis) {
      crisis.resolved = true;
      crisis.mitigationStrategy = strategy;
      crisis.resolvedAt = Date.now(); // Use timestamp to track resolution time
      
      // Move from active to history
      this.history.push({ ...crisis });
      this.activeCrises = this.activeCrises.filter(c => c.id !== crisisId);
    }
  }

  escalateCrisis(crisisId: string, factor: number = 1.0): void {
    const crisis = this.activeCrises.find(c => c.id === crisisId);
    if (crisis && !crisis.resolved) {
      crisis.severity = Math.min(1.0, crisis.severity * (1 + factor * 0.2));
    }
  }

  applyCrisisIntervention(crisisId: string, effectiveness: number): void {
    const crisis = this.activeCrises.find(c => c.id === crisisId);
    if (crisis && !crisis.resolved) {
      // Effectiveness reduces crisis severity (higher effectiveness = more reduction)
      // Effectiveness ranges from 0 to 1 (0 = no help, 1 = fully mitigates)
      crisis.severity = Math.max(0, crisis.severity * (1 - effectiveness));
      
      if (crisis.severity < 0.1) {
        this.resolveCrisis(crisisId, `Successfully addressed with ${effectiveness * 100}% effectiveness`);
      }
    }
  }

  getActiveCrises(): CrisisInstance[] {
    return [...this.activeCrises]; // Return copy to prevent mutation
  }

  getSeverityRating(): number {
    // Overall system stress level from all active crises
    const totalSeverity = this.activeCrises.reduce((sum, cr) => sum + (cr.resolved ? 0 : cr.severity), 0);
    const normalizedSeverity = totalSeverity / Math.max(1, this.activeCrises.length); // Average across active
    return Math.min(1.0, normalizedSeverity);
  }

  getCrisisCount(): number {
    return this.activeCrises.length;
  }
}