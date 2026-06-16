export interface CausalEdge {
  from: string;
  to: string;
  strength: number;
}

export interface RootCause {
  id: string;
  name: string;
  weight: number;
  observableSignals: string[];
  hiddenSignals: string[];
}

export interface Constraint {
  id: string;
  name: string;
  severity: number;
  affectedStakeholders: string[];
  isBlocker: boolean;
}

export interface GroundTruthState {
  rootCauses: Record<string, RootCause>;
  constraints: Record<string, Constraint>;
  causalGraph: CausalEdge[];
  hiddenState: {
    stakeholderPrivateConcerns: Record<string, string[]>;
    unrevealedData: Record<string, string>;
    systemVulnerabilities: string[];
  };
}

export interface ScenarioGroundTruth {
  scenarioId: string;
  truth: GroundTruthState;
}

export class GroundTruthEngine {
  private truth: GroundTruthState | null = null;
  private scenarioId: string = "";

  initialize(scenarioId: string): void {
    this.scenarioId = scenarioId;
    this.truth = this.generateGroundTruth(scenarioId);
  }

  private generateGroundTruth(scenarioId: string): GroundTruthState {
    if (scenarioId.includes("churn")) {
      return this.generateChurnScenarioTruth();
    }
    return this.generateDefaultTruth();
  }

  private generateChurnScenarioTruth(): GroundTruthState {
    return {
      rootCauses: {
        onboarding_friction: {
          id: "onboarding_friction",
          name: "Onboarding Friction",
          weight: 0.35,
          observableSignals: ["new user drop-off", "day 1 to day 7 retention gap"],
          hiddenSignals: ["first-time user confusion markers", " Wertflow completion rates"]
        },
        content_quality_decline: {
          id: "content_quality_decline",
          name: "Content Quality Decline",
          weight: 0.25,
          observableSignals: ["support tickets", "decreased watch time"],
          hiddenSignals: ["exclusive content expiry", "genre saturation"]
        },
        pricing_annoyance: {
          id: "pricing_annoyance",
          name: "Pricing Annoyance",
          weight: 0.15,
          observableSignals: ["plan downgrades"],
          hiddenSignals: ["price perception surveys", "feature confusion"]
        },
        recommendation_miss: {
          id: "recommendation_miss",
          name: "Recommendation Algorithm",
          weight: 0.15,
          observableSignals: ["declining engagement", "low discovery"],
          hiddenSignals: ["content variety gap", "user preference drift"]
        },
        competitive_pressure: {
          id: "competitive_pressure",
          name: "Competitive Pressure",
          weight: 0.10,
          observableSignals: ["competitor launches"],
          hiddenSignals: ["user consideration sets"]
        }
      },
      constraints: {
        limited_engineering: {
          id: "limited_engineering",
          name: "Limited Engineering Bandwidth",
          severity: 0.9,
          affectedStakeholders: ["cto"],
          isBlocker: true
        },
        budget_cap: {
          id: "budget_cap",
          name: "Q4 Budget Cap",
          severity: 0.6,
          affectedStakeholders: ["cfo"],
          isBlocker: false
        },
        compliance_review: {
          id: "compliance_review",
          name: "Pricing Change Requires Compliance",
          severity: 0.4,
          affectedStakeholders: ["legal"],
          isBlocker: false
        }
      },
      causalGraph: [
        { from: "onboarding_friction", to: "day_1_churn", strength: 0.8 },
        { from: "content_quality_decline", to: "engagement_drop", strength: 0.6 },
        { from: "pricing_annoyance", to: "plan_downgrades", strength: 0.5 },
        { from: "recommendation_miss", to: "discovery_failure", strength: 0.7 },
        { from: "competitive_pressure", to: "market_share_loss", strength: 0.4 },
        { from: "onboarding_friction", to: "competitive_pressure", strength: 0.3 }
      ],
      hiddenState: {
        stakeholderPrivateConcerns: {
          cfo: ["Q4 targets are unrealistic", "need visible win for board"],
          cto: ["team burnout is real", "can't sustain this velocity"],
          support_lead: ["escalations up 40%", "users are frustrated"]
        },
        unrevealedData: {
          mobile_onboarding: "Mobile users have 2x worse experience",
          competitive_leak: "Competitor launching similar feature next month",
          content_gap: "Top 10 requested genres have 0 new content"
        },
        systemVulnerabilities: [
          "Analytics pipeline has 15% data gap",
          "No A/B test capability for pricing",
          "Support team at capacity"
        ]
      }
    };
  }

  private generateDefaultTruth(): GroundTruthState {
    return {
      rootCauses: {
        default_cause: {
          id: "default_cause",
          name: "Unknown Primary Factor",
          weight: 1.0,
          observableSignals: [],
          hiddenSignals: []
        }
      },
      constraints: {},
      causalGraph: [],
      hiddenState: {
        stakeholderPrivateConcerns: {},
        unrevealedData: {},
        systemVulnerabilities: []
      }
    };
  }

  getTruth(): GroundTruthState | null {
    return this.truth;
  }

  getRootCauses(): RootCause[] {
    if (!this.truth) return [];
    return Object.values(this.truth.rootCauses).sort((a, b) => b.weight - a.weight);
  }

  getConstraints(): Constraint[] {
    if (!this.truth) return [];
    return Object.values(this.truth.constraints);
  }

  getConstraint(id: string): Constraint | undefined {
    return this.truth?.constraints[id];
  }

  getCausalGraph(): CausalEdge[] {
    return this.truth?.causalGraph || [];
  }

  getDownstreamEffects(causeId: string): string[] {
    if (!this.truth) return [];
    
    const effects: string[] = [];
    for (const edge of this.truth.causalGraph) {
      if (edge.from === causeId) {
        effects.push(edge.to);
      }
    }
    return effects;
  }

  getHiddenSignal(causeId: string): string[] {
    return this.truth?.rootCauses[causeId]?.hiddenSignals || [];
  }

  getObservableSignal(causeId: string): string[] {
    return this.truth?.rootCauses[causeId]?.observableSignals || [];
  }

  isConstraintActive(constraintId: string): boolean {
    const constraint = this.truth?.constraints[constraintId];
    return constraint ? constraint.severity > 0.3 : false;
  }

  canStakeholderAct(stakeholderId: string, action: string): boolean {
    if (!this.truth) return true;

    const constraints = Object.values(this.truth.constraints).filter(
      c => c.affectedStakeholders.includes(stakeholderId)
    );

    for (const constraint of constraints) {
      if (constraint.isBlocker && constraint.severity > 0.7) {
        return false;
      }
    }
    return true;
  }

  getStakeholderPrivateConcern(stakeholderId: string): string[] {
    return this.truth?.hiddenState.stakeholderPrivateConcerns[stakeholderId] || [];
  }

  getUnrevealedData(key: string): string | null {
    return this.truth?.hiddenState.unrevealedData[key] || null;
  }

  revealHiddenData(key: string, userAction: string): boolean {
    const requiredActions: Record<string, string> = {
      mobile_onboarding: "analyze mobile data",
      competitive_leak: "interview sales team",
      content_gap: "review content pipeline"
    };

    const actionLower = userAction.toLowerCase();
    const required = requiredActions[key]?.toLowerCase() || "";

    return actionLower.includes(required) || actionLower.includes(key.split("_")[0]);
  }

  calculateActualImpact(claimedCause: string): number {
    if (!this.truth) return 0;

    const rootCause = this.truth.rootCauses[claimedCause];
    if (!rootCause) return 0;

    const downstream = this.getDownstreamEffects(claimedCause);
    let impactMultiplier = 1.0;

    for (const effect of downstream) {
      const edges = this.truth.causalGraph.filter(e => e.to === effect);
      impactMultiplier += edges.reduce((sum, e) => sum + e.strength, 0) * 0.5;
    }

    return rootCause.weight * impactMultiplier;
  }

  getSystemVulnerabilities(): string[] {
    return this.truth?.hiddenState.systemVulnerabilities || [];
  }
}

export function createGroundTruthEngine(): GroundTruthEngine {
  return new GroundTruthEngine();
}