export type ClaimType = "hypothesis" | "root_cause" | "solution" | "metric" | "observation";

export interface Claim {
  id: string;
  text: string;
  type: ClaimType;
  phaseId: string;
  confidenceLevel: number;
  isExplicitClaim: boolean;
}

export interface CausalLink {
  id: string;
  fromClaimId: string;
  toClaimId: string;
  linkType: "directly_supports" | "contradicts" | "unrelated";
  phaseId: string;
  isUserStated: boolean;
}

export interface EvidenceRef {
  id: string;
  claimId: string;
  evidenceType: "data_point" | "stakeholder_quote" | "observation" | "analysis_result";
  artifactId: string;
  evidenceText: string;
}

export interface ClaimEvolution {
  phaseId: string;
  previousClaim: string;
  newClaim: string;
  changeReason: string | null;
  isContradiction: boolean;
}

export interface Uncertainty {
  id: string;
  text: string;
  phaseId: string;
  isExplicit: boolean;
  linkedClaims: string[];
}

export interface CoherenceTrack {
  initialClaim: string;
  evolution: ClaimEvolution[];
  finalPosition: string;
  isCoherent: boolean;
}

export interface ReasoningMetrics {
  totalClaims: number;
  claimsWithEvidence: number;
  claimsWithoutEvidence: number;
  confidenceCalibrationScore: number;
  coherenceScore: number;
  contradictionCount: number;
}

export interface ArtifactContent {
  artifactId: string;
  phaseId: string;
  contentText: string;
  claims: Claim[];
  causalLinks: CausalLink[];
  uncertainties: Uncertainty[];
  evidenceRefs: EvidenceRef[];
}

export interface ThinkingTrace {
  sessionId: string;
  artifacts: Record<string, ArtifactContent>;
  coherenceTracks: Record<string, CoherenceTrack>;
  reasoningMetrics: ReasoningMetrics;
}

export interface ProcessArtifactInput {
  artifactId: string;
  phaseId: string;
  contentText: string;
  contentHash?: string;
}

export class ThinkingTraceEngine {
  private trace: ThinkingTrace;
  private claimIdCounter: number = 0;
  private similarityCache = new Map<string, number>();

  constructor(sessionId: string) {
    this.trace = {
      sessionId,
      artifacts: {},
      coherenceTracks: {},
      reasoningMetrics: {
        totalClaims: 0,
        claimsWithEvidence: 0,
        claimsWithoutEvidence: 0,
        confidenceCalibrationScore: 1.0,
        coherenceScore: 1.0,
        contradictionCount: 0
      }
    };
  }

  processArtifact(input: ProcessArtifactInput): void {
    const { artifactId, phaseId, contentText } = input;

    const extractedClaims = this.extractClaims(contentText, phaseId, artifactId);
    const extractedUncertainties = this.extractUncertainties(contentText, phaseId);
    const extractedEvidenceRefs = this.extractEvidenceRefs(contentText, extractedClaims.map(c => c.id), artifactId);
    const extractedCausalLinks = this.detectCausalLinks(extractedClaims, phaseId);

    const artifactContent: ArtifactContent = {
      artifactId,
      phaseId,
      contentText,
      claims: extractedClaims,
      causalLinks: extractedCausalLinks,
      uncertainties: extractedUncertainties,
      evidenceRefs: extractedEvidenceRefs
    };

    this.trace.artifacts[phaseId] = artifactContent;

    this.updateCoherenceTracks(phaseId, extractedClaims, extractedCausalLinks);
    this.updateReasoningMetrics(extractedClaims, extractedEvidenceRefs);
  }

  private generateClaimId(): string {
    return `claim_${++this.claimIdCounter}`;
  }

  private extractClaims(text: string, phaseId: string, artifactId: string): Claim[] {
    const claims: Claim[] = [];
    const lowerText = text.toLowerCase();

    const hypothesisPatterns = [
      /i believe (.*?)(?:\.|$)/gi,
      /hypothesis:? (.*?)(?:\.|$)/gi,
      /my theory:? (.*?)(?:\.|$)/gi,
      /i think (.*?)(?:\.|$)/gi
    ];

    const rootCausePatterns = [
      /root cause (?:is|of|from):? (.*?)(?:\.|$)/gi,
      /the (?:main |primary )?cause (?:is|of):? (.*?)(?:\.|$)/gi,
      /causes (?:churn|users to leave):? (.*?)(?:\.|$)/gi,
      /driving (?:churn|users to leave):? (.*?)(?:\.|$)/gi
    ];

    const solutionPatterns = [
      /we should (.*?)(?:\.|$)/gi,
      /proposed solution:? (.*?)(?:\.|$)/gi,
      /recommend(?:ed|ing)? (.*?)(?:\.|$)/gi,
      /fix (?:by|through)?:? (.*?)(?:\.|$)/gi
    ];

    const metricPatterns = [
      /success metric:? (.*?)(?:\.|$)/gi,
      /key metric:? (.*?)(?:\.|$)/gi,
      /measure (?:success|impact):? (.*?)(?:\.|$)/gi,
      /kpi:? (.*?)(?:\.|$)/gi
    ];

    const confidencePatterns = [
      { pattern: /\bdefinitely\b/gi, confidence: 0.95 },
      { pattern: /\bcertainly\b/gi, confidence: 0.9 },
      { pattern: /\bclearly\b/gi, confidence: 0.85 },
      { pattern: /\bprobably\b/gi, confidence: 0.7 },
      { pattern: /\bmaybe\b/gi, confidence: 0.5 },
      { pattern: /\bpossibly\b/gi, confidence: 0.45 },
      { pattern: /\bi think\b/gi, confidence: 0.6 },
      { pattern: /\bi believe\b/gi, confidence: 0.7 },
      { pattern: /\bi suspect\b/gi, confidence: 0.55 },
      { pattern: /\bmight be\b/gi, confidence: 0.4 }
    ];

    const extractByPatterns = (patterns: RegExp[], type: ClaimType) => {
      for (const pattern of patterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && match[1].trim().length > 5) {
            let confidence = 0.7;
            for (const cp of confidencePatterns) {
              if (cp.pattern.test(match[0])) {
                confidence = cp.confidence;
                break;
              }
            }

            claims.push({
              id: this.generateClaimId(),
              text: match[1].trim(),
              type,
              phaseId,
              confidenceLevel: confidence,
              isExplicitClaim: true
            });
          }
        }
      }
    };

    extractByPatterns(hypothesisPatterns, "hypothesis");
    extractByPatterns(rootCausePatterns, "root_cause");
    extractByPatterns(solutionPatterns, "solution");
    extractByPatterns(metricPatterns, "metric");

    if (claims.length === 0) {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
      for (const sentence of sentences.slice(0, 3)) {
        if (sentence.toLowerCase().includes("churn") || 
            sentence.toLowerCase().includes("user") ||
            sentence.toLowerCase().includes("solution")) {
          claims.push({
            id: this.generateClaimId(),
            text: sentence.trim(),
            type: "observation",
            phaseId,
            confidenceLevel: 0.6,
            isExplicitClaim: false
          });
        }
      }
    }

    return claims;
  }

  private extractUncertainties(text: string, phaseId: string): Uncertainty[] {
    const uncertainties: Uncertainty[] = [];

    const uncertaintyPatterns = [
      { pattern: /\bnot sure\b/gi, isExplicit: true },
      { pattern: /\bunclear\b/gi, isExplicit: true },
      { pattern: /\buncertain\b/gi, isExplicit: true },
      { pattern: /\bwe don't know\b/gi, isExplicit: true },
      { pattern: /\blimited data\b/gi, isExplicit: true },
      { pattern: /\bmore research needed\b/gi, isExplicit: true },
      { pattern: /\bfurther analysis required\b/gi, isExplicit: true },
      { pattern: /\bneed more (?:time|data|information)\b/gi, isExplicit: true },
      { pattern: /\bhard to (?:tell|say|know)\b/gi, isExplicit: true },
      { pattern: /\bambiguous\b/gi, isExplicit: true },
      { pattern: /\bmight be\b/gi, isExplicit: false },
      { pattern: /\bcould be\b/gi, isExplicit: false },
      { pattern: /\bpossibly\b/gi, isExplicit: false }
    ];

    for (const { pattern, isExplicit } of uncertaintyPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        uncertainties.push({
          id: `uncertainty_${uncertainties.length + 1}`,
          text: match[0],
          phaseId,
          isExplicit,
          linkedClaims: []
        });
      }
    }

    return uncertainties;
  }

  private extractEvidenceRefs(text: string, claimIds: string[], artifactId: string): EvidenceRef[] {
    const evidenceRefs: EvidenceRef[] = [];

    const dataPatterns = [
      { pattern: /\b(\d+(?:\.\d+)?%)\b/gi, type: "data_point" as const },
      { pattern: /\b(data shows|analysis shows|research shows)\b/gi, type: "analysis_result" as const },
      { pattern: /"([^"]+)"/g, type: "stakeholder_quote" as const }
    ];

    for (const claimId of claimIds) {
      for (const { pattern, type } of dataPatterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          evidenceRefs.push({
            id: `evidence_${evidenceRefs.length + 1}`,
            claimId,
            evidenceType: type,
            artifactId,
            evidenceText: match[0]
          });
        }
      }
    }

    return evidenceRefs;
  }

  private detectCausalLinks(claims: Claim[], phaseId: string): CausalLink[] {
    const links: CausalLink[] = [];

    const hypothesisClaims = claims.filter(c => c.type === "hypothesis" || c.type === "root_cause");
    const solutionClaims = claims.filter(c => c.type === "solution");

    for (const hypothesis of hypothesisClaims) {
      for (const solution of solutionClaims) {
        const hasLink = this.semanticSimilarity(hypothesis.text, solution.text) > 0.3;

        if (hasLink) {
          links.push({
            id: `link_${links.length + 1}`,
            fromClaimId: hypothesis.id,
            toClaimId: solution.id,
            linkType: "directly_supports",
            phaseId,
            isUserStated: false
          });
        }
      }
    }

    return links;
  }

  private semanticSimilarity(text1: string, text2: string): number {
    const key = text1 < text2 ? `${text1}|||${text2}` : `${text2}|||${text1}`;
    if (this.similarityCache.has(key)) {
      return this.similarityCache.get(key)!;
    }

    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    if (words1.size === 0 || words2.size === 0) {
      this.similarityCache.set(key, 0);
      return 0;
    }

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    const result = intersection.size / union.size;
    this.similarityCache.set(key, result);
    return result;
  }

  private updateCoherenceTracks(phaseId: string, claims: Claim[], causalLinks: CausalLink[]): void {
    if (claims.length === 0) return;

    const sortedPhases = Object.keys(this.trace.artifacts).sort((a, b) => {
      const phaseOrder = ["phase_1", "phase_2", "phase_3", "phase_4", "phase_5", "phase_6"];
      return phaseOrder.indexOf(a) - phaseOrder.indexOf(b);
    });

    const currentPhaseIndex = sortedPhases.indexOf(phaseId);

    if (currentPhaseIndex === 0) {
      for (const claim of claims) {
        const trackKey = `track_${Object.keys(this.trace.coherenceTracks).length + 1}`;
        this.trace.coherenceTracks[trackKey] = {
          initialClaim: claim.text,
          evolution: [{
            phaseId,
            previousClaim: "",
            newClaim: claim.text,
            changeReason: null,
            isContradiction: false
          }],
          finalPosition: claim.text,
          isCoherent: true
        };
      }
    } else {
      const priorPhase = sortedPhases[currentPhaseIndex - 1];
      const priorClaims = this.trace.artifacts[priorPhase]?.claims || [];

      for (const claim of claims) {
        let bestMatchTrack: string | null = null;
        let bestSimilarity = 0;

        for (const [trackId, track] of Object.entries(this.trace.coherenceTracks)) {
          const similarity = this.semanticSimilarity(claim.text, track.finalPosition);
          if (similarity > bestSimilarity && similarity > 0.3) {
            bestSimilarity = similarity;
            bestMatchTrack = trackId;
          }
        }

        if (bestMatchTrack) {
          const track = this.trace.coherenceTracks[bestMatchTrack];
          const isContradiction = bestSimilarity < 0.5 && priorClaims.length > 0;

          track.evolution.push({
            phaseId,
            previousClaim: track.finalPosition,
            newClaim: claim.text,
            changeReason: null,
            isContradiction
          });

          track.finalPosition = claim.text;

          if (isContradiction) {
            track.isCoherent = false;
            this.trace.reasoningMetrics.contradictionCount++;
          }
        } else {
          const trackKey = `track_${Object.keys(this.trace.coherenceTracks).length + 1}`;
          this.trace.coherenceTracks[trackKey] = {
            initialClaim: claim.text,
            evolution: [{
              phaseId,
              previousClaim: "",
              newClaim: claim.text,
              changeReason: null,
              isContradiction: false
            }],
            finalPosition: claim.text,
            isCoherent: true
          };
        }
      }
    }
  }

  private updateReasoningMetrics(claims: Claim[], evidenceRefs: EvidenceRef[]): void {
    this.trace.reasoningMetrics.totalClaims += claims.length;

    const claimsWithEvidence = new Set(
      evidenceRefs.map(e => e.claimId)
    ).size;

    this.trace.reasoningMetrics.claimsWithEvidence = claimsWithEvidence;
    this.trace.reasoningMetrics.claimsWithoutEvidence = 
      this.trace.reasoningMetrics.totalClaims - claimsWithEvidence;

    this.calculateCoherenceScore();
  }

  private calculateCoherenceScore(): void {
    const tracks = Object.values(this.trace.coherenceTracks);
    if (tracks.length === 0) {
      this.trace.reasoningMetrics.coherenceScore = 1.0;
      return;
    }

    const coherentTracks = tracks.filter(t => t.isCoherent).length;
    const contradictionPenalty = Math.min(0.4, this.trace.reasoningMetrics.contradictionCount * 0.1);

    let baseCoherence = coherentTracks / tracks.length;
    baseCoherence = Math.max(0, baseCoherence - contradictionPenalty);

    if (tracks.length > 1) {
      const positions = tracks.map(t => t.finalPosition);
      const connections = this.countCrossTrackConnections(positions);
      baseCoherence = (baseCoherence + connections) / 2;
    }

    this.trace.reasoningMetrics.coherenceScore = Math.max(0, Math.min(1, baseCoherence));
  }

  private countCrossTrackConnections(positions: string[]): number {
    let connections = 0;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (this.semanticSimilarity(positions[i], positions[j]) > 0.3) {
          connections++;
        }
      }
    }
    return positions.length > 1 ? connections / (positions.length - 1) : 0;
  }

  getTrace(): ThinkingTrace {
    return this.trace;
  }

  getReasoningMetrics(): ReasoningMetrics {
    return this.trace.reasoningMetrics;
  }

  getCoherenceQuestion(): string | null {
    const tracks = Object.values(this.trace.coherenceTracks);
    const contradictions = tracks.filter(t => t.isCoherent === false);

    if (contradictions.length > 0) {
      const lastTrack = contradictions[contradictions.length - 1];
      return `In earlier phases you mentioned "${lastTrack.evolution[0]?.previousClaim || 'something'}" but your current focus is "${lastTrack.finalPosition}". Can you explain the connection?`;
    }

    if (tracks.length >= 3) {
      return `You've covered multiple areas in this simulation. How do they connect together?`;
    }

    return null;
  }

  hasDisconnectedReasoning(): boolean {
    const tracks = Object.values(this.trace.coherenceTracks);
    return tracks.length >= 3 && this.trace.reasoningMetrics.coherenceScore < 0.4;
  }

  getClaimByPhase(phaseId: string): Claim[] {
    return this.trace.artifacts[phaseId]?.claims || [];
  }

  getAllClaims(): Claim[] {
    const allClaims: Claim[] = [];
    for (const artifact of Object.values(this.trace.artifacts)) {
      allClaims.push(...artifact.claims);
    }
    return allClaims;
  }

  setConfidenceCalibration(score: number): void {
    this.trace.reasoningMetrics.confidenceCalibrationScore = score;
  }

  getCoherenceTracks(): Record<string, CoherenceTrack> {
    return this.trace.coherenceTracks;
  }
}

export function createThinkingTraceEngine(sessionId: string): ThinkingTraceEngine {
  return new ThinkingTraceEngine(sessionId);
}