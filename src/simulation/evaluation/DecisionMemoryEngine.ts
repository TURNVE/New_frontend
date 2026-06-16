export interface DecisionMemoryEntry {
  id: string;
  text: string;
  phaseId: string;
  timestamp: number;
  expectedOutcome: string;
  actualOutcome: string | null;
  impactedMetrics: string[];
  downstreamEffects: string[];
  wasReversible: boolean;
  reversedBy: string | null;
  outcomeConfidence: number;
  outcomeTimestamp: number | null;
}

export interface ConsequenceChain {
  decisionId: string;
  triggeredBy: string;
  effect: string;
  severity: number;
  delay: number;
}

export interface DecisionMemoryMetrics {
  totalDecisions: number;
  accurateDecisions: number;
  failedDecisions: number;
  reversedDecisions: number;
  compoundingEffects: number;
}

export class DecisionMemoryEngine {
  private decisions: Map<string, DecisionMemoryEntry> = new Map();
  private consequenceChains: ConsequenceChain[] = [];
  private decisionIdCounter: number = 0;

  recordDecision(
    text: string,
    phaseId: string,
    expectedOutcome: string,
    impactedMetrics: string[]
  ): string {
    const id = `decision_${++this.decisionIdCounter}`;
    
    const entry: DecisionMemoryEntry = {
      id,
      text,
      phaseId,
      timestamp: Date.now(),
      expectedOutcome,
      actualOutcome: null,
      impactedMetrics,
      downstreamEffects: [],
      wasReversible: false,
      reversedBy: null,
      outcomeConfidence: 0,
      outcomeTimestamp: null
    };

    this.decisions.set(id, entry);
    return id;
  }

  recordOutcome(
    decisionId: string,
    actualOutcome: string,
    downstreamEffects: string[]
  ): void {
    const decision = this.decisions.get(decisionId);
    if (!decision) return;

    const outcomeMatch = this.calculateOutcomeMatch(decision.expectedOutcome, actualOutcome);
    
    decision.actualOutcome = actualOutcome;
    decision.downstreamEffects = downstreamEffects;
    decision.outcomeConfidence = outcomeMatch;
    decision.outcomeTimestamp = Date.now();

    if (outcomeMatch < 0.4) {
      decision.wasReversible = true;
      this.triggerCompoundingConsequences(decisionId, downstreamEffects);
    }
  }

  recordReversal(decisionId: string, reversalReason: string): void {
    const decision = this.decisions.get(decisionId);
    if (!decision) return;

    decision.reversedBy = reversalReason;
    decision.wasReversible = true;
  }

  private calculateOutcomeMatch(expected: string, actual: string): number {
    const expectedWords = new Set(expected.toLowerCase().split(/\s+/));
    const actualWords = new Set(actual.toLowerCase().split(/\s+/));

    if (expectedWords.size === 0 || actualWords.size === 0) return 0.5;

    const intersection = new Set([...expectedWords].filter(x => actualWords.has(x)));
    const union = new Set([...expectedWords, ...actualWords]);

    return intersection.size / union.size;
  }

  private triggerCompoundingConsequences(decisionId: string, effects: string[]): void {
    for (const effect of effects) {
      this.consequenceChains.push({
        decisionId,
        triggeredBy: effect,
        effect: `${effect}_escalated`,
        severity: 0.6,
        delay: 2
      });
    }
  }

  getDecision(id: string): DecisionMemoryEntry | undefined {
    return this.decisions.get(id);
  }

  getAllDecisions(): DecisionMemoryEntry[] {
    return Array.from(this.decisions.values());
  }

  getDecisionsByPhase(phaseId: string): DecisionMemoryEntry[] {
    return Array.from(this.decisions.values()).filter(d => d.phaseId === phaseId);
  }

  getFailedDecisions(): DecisionMemoryEntry[] {
    return Array.from(this.decisions.values()).filter(
      d => d.outcomeTimestamp !== null && d.outcomeConfidence < 0.4
    );
  }

  getCompoundingConsequences(): ConsequenceChain[] {
    return this.consequenceChains;
  }

  getConsequencesForDecision(decisionId: string): ConsequenceChain[] {
    return this.consequenceChains.filter(c => c.decisionId === decisionId);
  }

  hasFailedDecisions(): boolean {
    return this.getFailedDecisions().length > 0;
  }

  getMetrics(): DecisionMemoryMetrics {
    const all = Array.from(this.decisions.values());
    const withOutcome = all.filter(d => d.outcomeTimestamp !== null);
    
    return {
      totalDecisions: all.length,
      accurateDecisions: withOutcome.filter(d => d.outcomeConfidence >= 0.6).length,
      failedDecisions: withOutcome.filter(d => d.outcomeConfidence < 0.4).length,
      reversedDecisions: all.filter(d => d.reversedBy !== null).length,
      compoundingEffects: this.consequenceChains.length
    };
  }

  getRecentDecision(phaseId: string): DecisionMemoryEntry | null {
    const phaseDecisions = this.getDecisionsByPhase(phaseId);
    if (phaseDecisions.length === 0) return null;
    
    return phaseDecisions[phaseDecisions.length - 1];
  }

  canTraceNarrative(decisionId: string): string | null {
    const decision = this.decisions.get(decisionId);
    if (!decision || !decision.actualOutcome) return null;

    const consequences = this.getConsequencesForDecision(decisionId);
    if (consequences.length === 0) return null;

    return `Your decision to "${decision.text}" led to "${decision.actualOutcome}" which triggered ${consequences.length} downstream effects.`;
  }

  getNarrativeCallback(): string[] {
    const callbacks: string[] = [];
    const failed = this.getFailedDecisions();

    for (const decision of failed.slice(-2)) {
      const callback = this.canTraceNarrative(decision.id);
      if (callback) callbacks.push(callback);
    }

    return callbacks;
  }

  wasDecisionCorrect(decisionId: string): boolean | null {
    const decision = this.decisions.get(decisionId);
    if (!decision || decision.outcomeTimestamp === null) return null;
    return decision.outcomeConfidence >= 0.6;
  }

  getAccuracyRate(): number {
    const withOutcome = Array.from(this.decisions.values()).filter(
      d => d.outcomeTimestamp !== null
    );
    if (withOutcome.length === 0) return 1.0;

    const accurate = withOutcome.filter(d => d.outcomeConfidence >= 0.6).length;
    return accurate / withOutcome.length;
  }
}

export function createDecisionMemoryEngine(): DecisionMemoryEngine {
  return new DecisionMemoryEngine();
}