export type PlayerStyle = "aggressive" | "analytical" | "avoidant" | "reactive" | "balanced";
export type InformationSource = "data_team" | "support_logs" | "user_interviews" | "sales_team" | "market_research";

export interface EvidencePattern {
  signal: string;
  cause: string;
  strength: number;
}

export interface DynamicFactors {
  emergentPatterns: boolean;
  uncertaintyZones: string[];
  multipleValidPaths: boolean;
}

export interface PlayerModel {
  style: PlayerStyle;
  riskProfile: number;
  decisionSpeed: number;
  consistencyScore: number;
  overconfidenceTendency: number;
  patternHistory: PatternRecord[];
}

export interface PatternRecord {
  phaseId: string;
  actionType: string;
  confidenceLevel: number;
  evidenceBasis: number;
  outcome: "success" | "partial" | "failure";
  timestamp: number;
}

export interface InfoSource {
  source: InformationSource;
  costHours: number;
  reliability: number;
  available: boolean;
  accessCost?: number;
  hiddenDataPoints?: string[];
}

export interface InfoPool {
  [key: string]: InfoSource;
}

export interface GroundTruthState {
  rootCauses: Record<string, {
    id: string;
    name: string;
    weight: number;
    observableSignals: string[];
    hiddenSignals: string[];
  }>;
  constraints: Record<string, {
    id: string;
    name: string;
    severity: number;
    affectedStakeholders: string[];
    isBlocker: boolean;
  }>;
  causalGraph: { from: string; to: string; strength: number }[];
  hiddenState: {
    stakeholderPrivateConcerns: Record<string, string[]>;
    unrevealedData: Record<string, string>;
    systemVulnerabilities: string[];
  };
}

export class EnhancedGroundTruthEngine {
  private truth: GroundTruthState | null = null;
  private dynamicFactors: DynamicFactors = {
    emergentPatterns: true,
    uncertaintyZones: ["mobile_data", "competitive_intel", "content_pipeline"],
    multipleValidPaths: true
  };
  private scenarioId: string = "";

  initialize(scenarioId: string): void {
    this.scenarioId = scenarioId;
    this.truth = this.generateGroundTruth(scenarioId);
  }

  setDynamicFactors(factors: DynamicFactors): void {
    this.dynamicFactors = factors;
  }

  private generateGroundTruth(scenarioId: string): GroundTruthState {
    if (scenarioId.includes("churn")) {
      return {
        rootCauses: {
          onboarding_friction: {
            id: "onboarding_friction",
            name: "Onboarding Friction",
            weight: 0.35,
            observableSignals: ["new user drop-off", "day 1 to day 7 retention gap"],
            hiddenSignals: ["first-time user confusion markers", "workflow completion rates"]
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
          }
        },
        causalGraph: [
          { from: "onboarding_friction", to: "day_1_churn", strength: 0.8 },
          { from: "content_quality_decline", to: "engagement_drop", strength: 0.6 },
          { from: "pricing_annoyance", to: "plan_downgrades", strength: 0.5 },
          { from: "recommendation_miss", to: "discovery_failure", strength: 0.7 },
          { from: "competitive_pressure", to: "market_share_loss", strength: 0.4 }
        ],
        hiddenState: {
          stakeholderPrivateConcerns: {
            cfo: ["Q4 targets unrealistic", "need visible win for board"],
            cto: ["team burnout real", "can't sustain this velocity"]
          },
          unrevealedData: {
            mobile_onboarding: "Mobile users have 2x worse experience",
            competitive_leak: "Competitor launching similar feature next month"
          },
          systemVulnerabilities: [
            "Analytics pipeline has 15% data gap",
            "No A/B test capability for pricing"
          ]
        }
      };
    }
    return {
      rootCauses: {},
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

  evaluateHypothesis(hypothesis: string, observedSignals: string[]): number {
    if (!this.truth) return 0;

    let explainedWeight = 0;
    let totalWeight = 0;

    for (const [causeId, cause] of Object.entries(this.truth.rootCauses)) {
      totalWeight += cause.weight;
      const causeSignals = [...cause.observableSignals, ...cause.hiddenSignals];
      
      const overlap = observedSignals.filter(s => 
        causeSignals.some(cs => cs.toLowerCase().includes(s.toLowerCase()))
      ).length;
      
      if (overlap >= causeSignals.length * 0.7) {
        explainedWeight += cause.weight;
      }
    }

    return explainedWeight / totalWeight;
  }

  canAlternativeExplain(hypothesis: string): boolean {
    return this.evaluateHypothesis(hypothesis, []) >= 0.7;
  }

  revealHiddenData(sourceAccessed: string): string[] {
    const revealed: string[] = [];
    if (sourceAccessed.includes("data")) {
      if (Math.random() > 0.5 && !this.truth?.hiddenState.unrevealedData["mobile_onboarding"]) {
        revealed.push("mobile_onboarding");
      }
    }
    return revealed;
  }

  getEmergentPatterns(): string[] {
    return this.dynamicFactors.emergentPatterns ? ["mobile_performance_gap"] : [];
  }

  getTrueStateLabel(): string {
    const truth = this.truth;
    if (!truth) return "unknown";
    
    const topCauses = Object.entries(truth.rootCauses)
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, 2);
    
    return topCauses.map(([id]) => id).join("_");
  }

  isPathValid(pathCauses: string[]): boolean {
    if (!this.dynamicFactors.multipleValidPaths) {
      return pathCauses.every(c => this.truth?.rootCauses[c]);
    }

    const pathWeight = pathCauses.reduce((sum, c) => 
      sum + (this.truth?.rootCauses[c]?.weight || 0), 0
    );
    
    return pathWeight >= 0.6;
  }

  getUncertaintyZones(): string[] {
    return this.dynamicFactors.uncertaintyZones;
  }

  getRootCausesSorted(): { id: string; weight: number }[] {
    if (!this.truth) return [];
    return Object.entries(this.truth.rootCauses)
      .map(([id, cause]) => ({ id, weight: cause.weight }))
      .sort((a, b) => b.weight - a.weight);
  }

  calculateCompoundEffect(decisionEffects: string[]): number {
    if (!this.truth) return 0;

    let compound = 0;
    for (const effect of decisionEffects) {
      for (const edge of this.truth.causalGraph) {
        if (edge.from === effect) {
          compound += edge.strength;
        }
      }
    }
    return Math.min(1.0, compound);
  }

  setRootCauseWeight(causeId: string, newWeight: number): void {
    if (this.truth && this.truth.rootCauses[causeId]) {
      this.truth.rootCauses[causeId].weight = newWeight;
    }
  }
}

export class PlayerModelEngine {
  private playerModel: PlayerModel = {
    style: "balanced",
    riskProfile: 0.5,
    decisionSpeed: 0.5,
    consistencyScore: 1.0,
    overconfidenceTendency: 0.5,
    patternHistory: []
  };

  recordAction(action: {
    phaseId: string;
    actionType: string;
    confidenceLevel: number;
    evidenceBasis: number;
    outcome: "success" | "partial" | "failure";
  }): void {
    this.playerModel.patternHistory.push({
      phaseId: action.phaseId,
      actionType: action.actionType,
      confidenceLevel: action.confidenceLevel,
      evidenceBasis: action.evidenceBasis,
      outcome: action.outcome,
      timestamp: Date.now()
    });

    this.updatePlayerMetrics();
  }

  private updatePlayerMetrics(): void {
    const history = this.playerModel.patternHistory;

    if (history.length < 3) return;

    const recentConfidences = history.slice(-5).map(h => h.confidenceLevel);
    const avgConfidence = recentConfidences.reduce((a, b) => a + b, 0) / recentConfidences.length;
    const variance = recentConfidences.reduce((a, c) => a + Math.pow(c - avgConfidence, 2), 0) / recentConfidences.length;
    
    this.playerModel.consistencyScore = 1 - Math.min(1, variance * 2);

    const overconfident = history.filter(h => h.confidenceLevel >= 0.8 && h.evidenceBasis < 0.3);
    this.playerModel.overconfidenceTendency = overconfident.length / history.length;

    const highRisk = history.filter(h => h.outcome === "partial" && h.confidenceLevel >= 0.7);
    this.playerModel.riskProfile = Math.min(1, highRisk.length / (history.length || 1));

    if (history.length >= 3) {
      const lastThree = history.slice(-3);
      const avgSpeed = lastThree.reduce((a, c) => a + (c.confidenceLevel > 0.6 ? 1 : 0), 0) / 3;
      this.playerModel.decisionSpeed = avgSpeed;
    }

    if (this.playerModel.overconfidenceTendency > 0.5) {
      this.playerModel.style = "aggressive";
    } else if (this.playerModel.consistencyScore > 0.7) {
      this.playerModel.style = "analytical";
    } else if (this.playerModel.overconfidenceTendency < 0.2 && this.playerModel.consistencyScore < 0.5) {
      this.playerModel.style = "avoidant";
    } else if (this.playerModel.overconfidenceTendency > 0.3) {
      this.playerModel.style = "reactive";
    } else {
      this.playerModel.style = "balanced";
    }
  }

  getPlayerModel(): PlayerModel {
    return this.playerModel;
  }

  getPlayerStyle(): PlayerStyle {
    return this.playerModel.style;
  }

  getFeedbackTuning(): string {
    const model = this.playerModel;
    
    switch (model.style) {
      case "aggressive":
        return "You tend to commit early and push hard. Watch for overconfidence when stakes rise.";
      case "analytical":
        return "You analyze deeply before acting. Watch for delays as uncertainty grows.";
      case "avoidant":
        return "You wait for perfect data before deciding. reality rarely provides that.";
      case "reactive":
        return "You respond quickly but often chase symptoms. Check if you're attacking causes.";
      default:
        return "You balance analysis and action well. Now adjust based on emerging signals.";
    }
  }

  hasOverconfidencePattern(): boolean {
    return this.playerModel.overconfidenceTendency > 0.4;
  }

  hasPatternMismatch(patternName: string): boolean {
    if (patternName === "early_commitment" && this.playerModel.decisionSpeed > 0.7) {
      return true;
    }
    if (patternName === "data_inconsistency" && this.playerModel.consistencyScore < 0.4) {
      return true;
    }
    return false;
  }

  getPatternName(): string[] {
    const patterns: string[] = [];
    
    if (this.playerModel.overconfidenceTendency > 0.4) patterns.push("overconfident");
    if (this.playerModel.decisionSpeed > 0.7) patterns.push("impulsive");
    if (this.playerModel.consistencyScore < 0.4) patterns.push("inconsistent");
    if (this.playerModel.style === "balanced") patterns.push("deliberate");
    
    return patterns;
  }

  resetHistory(): void {
    this.playerModel.patternHistory = [];
  }
}

export class InformationEconomyEngine {
  private infoPool: InfoPool = {
    data_team: {
      source: "data_team",
      costHours: 3,
      reliability: 0.9,
      available: true
    },
    support_logs: {
      source: "support_logs",
      costHours: 2,
      reliability: 0.7,
      available: true
    },
    user_interviews: {
      source: "user_interviews",
      costHours: 6,
      reliability: 0.85,
      available: true
    },
    sales_team: {
      source: "sales_team",
      costHours: 2,
      reliability: 0.6,
      available: true
    },
    market_research: {
      source: "market_research",
      costHours: 4,
      reliability: 0.8,
      available: false
    }
  };

  private timeBudget: number = 24;
  private elapsedHours: number = 0;
  private accessedSources = new Set<string>();

  checkAccess(sourceId: string): { allowed: boolean; remainingHours: number; error?: string } {
    const source = this.infoPool[sourceId];
    if (!source) {
      return { allowed: false, remainingHours: this.getRemainingHours(), error: "Source not found" };
    }

    if (!source.available) {
      return { allowed: false, remainingHours: this.getRemainingHours(), error: "Source not available" };
    }

    if (source.costHours > this.getRemainingHours()) {
      return { allowed: false, remainingHours: this.getRemainingHours(), error: "Not enough time budget" };
    }

    return { allowed: true, remainingHours: this.getRemainingHours() - source.costHours };
  }

  accessSource(sourceId: string): boolean {
    const check = this.checkAccess(sourceId);
    if (!check.allowed) return false;

    this.elapsedHours += this.infoPool[sourceId].costHours;
    this.accessedSources.add(sourceId);
    return true;
  }

  getAvailableSources(): InfoSource[] {
    return Object.values(this.infoPool).filter(s => s.available);
  }

  getAccessedSources(): Set<string> {
    return this.accessedSources;
  }

  getRemainingHours(): number {
    return Math.max(0, this.timeBudget - this.elapsedHours);
  }

  getTimeBudgetUsed(): number {
    return this.elapsedHours;
  }

  getTimePressure(): number {
    return 1 - (this.getRemainingHours() / this.timeBudget);
  }

  isTimeCritical(): boolean {
    return this.getRemainingHours() <= 4;
  }

  canAccessSources(sourceIds: string[]): boolean {
    return sourceIds.every(id => this.checkAccess(id).allowed);
  }

  advanceTime(hours: number): void {
    this.elapsedHours += hours;
  }

  getReliabilityFor(sourceId: string): number {
    return this.infoPool[sourceId]?.reliability || 0;
  }
}

export function createGroundTruthEngine(): EnhancedGroundTruthEngine {
  return new EnhancedGroundTruthEngine();
}

export function createPlayerModelEngine(): PlayerModelEngine {
  return new PlayerModelEngine();
}

export function createInformationEconomyEngine(timeBudget: number = 24): InformationEconomyEngine {
  const engine = new InformationEconomyEngine();
  (engine as any).timeBudget = timeBudget;
  return engine;
}