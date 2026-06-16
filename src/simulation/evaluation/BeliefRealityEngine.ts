export type EvidenceType = "quantitative" | "qualitative" | "anecdotal";
export type CalibrationPattern = "overconfident" | "underconfident" | "well_calibrated" | "uncertainty_avoidant" | "rigid_thinking";
export type StressTestResponse = "maintained" | "modified" | "abandoned";

export interface SupportingEvidence {
  evidenceId: string;
  artifactId: string;
  qualityScore: number;
  type: EvidenceType;
  recency: number;
}

export interface StressTestResult {
  timestamp: number;
  newInformation: string;
  beliefStillValid: boolean;
  response: StressTestResponse;
  responseQuality: number;
}

export interface CalibrationPoint {
  phaseId: string;
  beliefId: string;
  statedConfidence: number;
  evidenceQualityAtTime: number;
  newEvidenceLater: number | null;
  calibrationError: number;
  isMiscalibrated: boolean;
}

export interface Belief {
  id: string;
  text: string;
  userConfidence: number;
  inferredConfidence: number;
  supportingEvidence: SupportingEvidence[];
  stressTested: boolean;
  stressResults: StressTestResult[];
  calibrationHistory: CalibrationPoint[];
}

export interface CalibrationMetrics {
  overconfidentCount: number;
  appropriatelyUncertainCount: number;
  underconfidentCount: number;
  calibrationScore: number;
  patternDetected: CalibrationPattern;
}

export interface BeliefRealityModel {
  sessionId: string;
  beliefs: Record<string, Belief>;
  calibrationMetrics: CalibrationMetrics;
}

export interface ProcessClaimInput {
  claimText: string;
  confidenceSignals: {
    explicit: number;
    inferred: number;
  };
  evidence?: {
    type: EvidenceType;
    artifact: string;
    source?: string;
  }[];
  phaseId: string;
}

export interface ApplyStressTestInput {
  beliefIds: string[];
  newData: string;
  userResponse: StressTestResponse;
}

export interface GetCalibrationQuestionInput {
  stakeholder: string;
  userConfidence: number;
  evidenceQuality: number;
}

export class BeliefRealityEngine {
  private model: BeliefRealityModel;
  private beliefIdCounter: number = 0;
  private evidenceIdCounter: number = 0;

  constructor(sessionId: string) {
    this.model = {
      sessionId,
      beliefs: {},
      calibrationMetrics: {
        overconfidentCount: 0,
        appropriatelyUncertainCount: 0,
        underconfidentCount: 0,
        calibrationScore: 1.0,
        patternDetected: "well_calibrated"
      }
    };
  }

  processClaim(input: ProcessClaimInput): string {
    const { claimText, confidenceSignals, evidence, phaseId } = input;

    const beliefId = this.generateBeliefId();

    const adjustedConfidence = 
      confidenceSignals.explicit * 0.7 + 
      confidenceSignals.inferred * 0.3;

    const supportingEvidence: SupportingEvidence[] = [];

    if (evidence) {
      for (const ev of evidence) {
        supportingEvidence.push({
          evidenceId: this.generateEvidenceId(),
          artifactId: ev.artifact,
          qualityScore: this.scoreEvidence(ev.type, ev.source),
          type: ev.type,
          recency: 0
        });
      }
    }

    const evidenceQuality = this.calculateEvidenceQuality(supportingEvidence);

    const belief: Belief = {
      id: beliefId,
      text: claimText,
      userConfidence: adjustedConfidence,
      inferredConfidence: confidenceSignals.inferred,
      supportingEvidence,
      stressTested: false,
      stressResults: [],
      calibrationHistory: []
    };

    this.model.beliefs[beliefId] = belief;

    this.checkCalibration(beliefId, phaseId, adjustedConfidence, evidenceQuality);
    this.updateCalibrationMetrics();

    return beliefId;
  }

  private generateBeliefId(): string {
    return `belief_${++this.beliefIdCounter}`;
  }

  private generateEvidenceId(): string {
    return `evidence_${++this.evidenceIdCounter}`;
  }

  private scoreEvidence(type: EvidenceType, source?: string): number {
    let baseScore = 0.5;

    switch (type) {
      case "quantitative":
        baseScore += 0.4;
        break;
      case "qualitative":
        baseScore += 0.2;
        break;
      case "anecdotal":
        baseScore += 0.0;
        break;
    }

    if (source === "data_team") baseScore *= 1.0;
    else if (source === "user_research") baseScore *= 0.9;
    else if (source === "support_team") baseScore *= 0.7;
    else baseScore *= 0.8;

    return Math.min(1.0, baseScore);
  }

  private calculateEvidenceQuality(evidence: SupportingEvidence[]): number {
    if (evidence.length === 0) return 0.0;

    const totalScore = evidence.reduce((sum, ev) => sum + ev.qualityScore, 0);
    const avgScore = totalScore / evidence.length;

    const recencyMultiplier = 1.0;
    return Math.min(1.0, avgScore * recencyMultiplier);
  }

  private checkCalibration(
    beliefId: string,
    phaseId: string,
    confidence: number,
    evidenceQuality: number
  ): void {
    const belief = this.model.beliefs[beliefId];

    const adjustedConfidence = confidence;
    const calibrationError = Math.abs(adjustedConfidence - evidenceQuality);

    const isMiscalibrated = 
      (adjustedConfidence > evidenceQuality + 0.3 && evidenceQuality < 0.5) ||
      (adjustedConfidence > 0.8 && evidenceQuality < 0.3);

    const calibrationPoint: CalibrationPoint = {
      phaseId,
      beliefId,
      statedConfidence: adjustedConfidence,
      evidenceQualityAtTime: evidenceQuality,
      newEvidenceLater: null,
      calibrationError,
      isMiscalibrated
    };

    belief.calibrationHistory.push(calibrationPoint);

    if (isMiscalibrated) {
      if (adjustedConfidence > evidenceQuality + 0.3) {
        this.model.calibrationMetrics.overconfidentCount++;
      } else if (adjustedConfidence < evidenceQuality - 0.2) {
        this.model.calibrationMetrics.underconfidentCount++;
      }
    } else if (adjustedConfidence < 0.6 && evidenceQuality > 0.4) {
      this.model.calibrationMetrics.appropriatelyUncertainCount++;
    }
  }

  applyStressTest(input: ApplyStressTestInput): void {
    const { beliefIds, newData, userResponse } = input;

    for (const beliefId of beliefIds) {
      const belief = this.model.beliefs[beliefId];
      if (!belief) continue;

      const beliefStillValid = this.evaluateBeliefAgainstNewData(belief.text, newData);

      const responseQuality = this.evaluateResponseQuality(
        beliefStillValid,
        userResponse,
        belief.userConfidence
      );

      const stressResult: StressTestResult = {
        timestamp: Date.now(),
        newInformation: newData,
        beliefStillValid,
        response: userResponse,
        responseQuality
      };

      belief.stressResults.push(stressResult);
      belief.stressTested = true;

      if (!beliefStillValid && userResponse === "maintained") {
        this.model.calibrationMetrics.overconfidentCount++;
      }
    }

    this.updateCalibrationMetrics();
  }

  private evaluateBeliefAgainstNewData(beliefText: string, newData: string): boolean {
    const beliefLower = beliefText.toLowerCase();
    const dataLower = newData.toLowerCase();

    const contradictionKeywords = [
      "no correlation",
      "not the cause",
      "contrary to",
      "different finding",
      "in contrast"
    ];

    for (const keyword of contradictionKeywords) {
      if (dataLower.includes(keyword)) {
        const beliefKeywords = beliefLower.split(/\s+/).filter(w => w.length > 4);
        for (const keyword2 of beliefKeywords) {
          if (dataLower.includes(keyword2)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private evaluateResponseQuality(
    beliefStillValid: boolean,
    userResponse: StressTestResponse,
    originalConfidence: number
  ): number {
    if (beliefStillValid && userResponse === "maintained") {
      return 0.8;
    }

    if (!beliefStillValid && userResponse === "modified") {
      return 0.9;
    }

    if (!beliefStillValid && userResponse === "abandoned") {
      return 0.7;
    }

    if (!beliefStillValid && userResponse === "maintained") {
      return originalConfidence > 0.8 ? 0.1 : 0.3;
    }

    return 0.5;
  }

  private updateCalibrationMetrics(): void {
    const beliefCount = Object.keys(this.model.beliefs).length;
    if (beliefCount === 0) {
      this.model.calibrationMetrics.calibrationScore = 1.0;
      this.model.calibrationMetrics.patternDetected = "well_calibrated";
      return;
    }

    const overconfidentRatio = 
      this.model.calibrationMetrics.overconfidentCount / beliefCount;
    const underconfidentRatio = 
      this.model.calibrationMetrics.underconfidentCount / beliefCount;
    const appropriateRatio = 
      this.model.calibrationMetrics.appropriatelyUncertainCount / beliefCount;

    this.model.calibrationMetrics.calibrationScore = Math.max(
      0,
      1.0 - overconfidentRatio * 0.5 - underconfidentRatio * 0.3
    );

    const beliefs = Object.values(this.model.beliefs);
    const totalCalibrationPoints = beliefs.reduce(
      (sum, b) => sum + b.calibrationHistory.length,
      0,
    );

    if (totalCalibrationPoints > 0) {
      const miscalibratedPoints = beliefs.reduce(
        (sum, b) => sum + b.calibrationHistory.filter(c => c.isMiscalibrated).length,
        0
      );

      const errorRatio = miscalibratedPoints / totalCalibrationPoints;

      if (errorRatio > 0.4 && overconfidentRatio > 0.3) {
        this.model.calibrationMetrics.patternDetected = "overconfident";
      } else if (errorRatio > 0.4 && underconfidentRatio > 0.3) {
        this.model.calibrationMetrics.patternDetected = "underconfident";
      } else if (appropriateRatio > 0.4 && this.model.calibrationMetrics.overconfidentCount === 0) {
        this.model.calibrationMetrics.patternDetected = "well_calibrated";
      } else if (overconfidentRatio > 0.2) {
        const rigidCount = Object.values(this.model.beliefs).filter(
          b => b.stressResults.some(s => !s.beliefStillValid && s.response === "maintained")
        ).length;

        if (rigidCount > 0) {
          this.model.calibrationMetrics.patternDetected = "rigid_thinking";
        } else {
          this.model.calibrationMetrics.patternDetected = "overconfident";
        }
      } else {
        this.model.calibrationMetrics.patternDetected = "uncertainty_avoidant";
      }
    }
  }

  getCalibrationQuestion(input: GetCalibrationQuestionInput): string | null {
    const { userConfidence, evidenceQuality } = input;

    if (userConfidence > 0.85 && evidenceQuality < 0.4) {
      return `You're very confident about this, but the evidence is weak. What makes you so certain?`;
    }

    if (userConfidence > 0.7 && evidenceQuality < 0.3) {
      return `You've cited data that's from earlier phases. What's changed since then?`;
    }

    return null;
  }

  getCalibrationMetrics(): CalibrationMetrics {
    return this.model.calibrationMetrics;
  }

  getBelief(beliefId: string): Belief | undefined {
    return this.model.beliefs[beliefId];
  }

  getAllBeliefs(): Belief[] {
    return Object.values(this.model.beliefs);
  }

  getModel(): BeliefRealityModel {
    return this.model;
  }

  getOverconfidentBeliefs(): Belief[] {
    return Object.values(this.model.beliefs).filter(
      b => b.userConfidence > 0.8 && 
           b.supportingEvidence.length <= 1 &&
           b.calibrationHistory.some(c => c.isMiscalibrated)
    );
  }

  hasOverconfidencePattern(): boolean {
    return this.model.calibrationMetrics.patternDetected === "overconfident" ||
           this.model.calibrationMetrics.patternDetected === "rigid_thinking";
  }

  isUncertaintyAvoidant(): boolean {
    const beliefs = Object.values(this.model.beliefs);
    if (beliefs.length < 3) return false;

    const highConfidenceWithoutUncertainty = beliefs.filter(
      b => b.userConfidence >= 0.85 && b.calibrationHistory.length > 0
    ).length;

    return highConfidenceWithoutUncertainty >= 3;
  }

  getCalibrationPenalty(): number {
    const metrics = this.model.calibrationMetrics;
    
    if (metrics.patternDetected === "overconfident") return 0.15;
    if (metrics.patternDetected === "rigid_thinking") return 0.2;
    if (metrics.patternDetected === "uncertainty_avoidant") return 0.1;
    if (metrics.calibrationScore < 0.4) return 0.1;
    
    return 0;
  }
}

export function createBeliefRealityEngine(sessionId: string): BeliefRealityEngine {
  return new BeliefRealityEngine(sessionId);
}