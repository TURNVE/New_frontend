import {
  type ArtifactSubmission,
  type AIEvaluationResult,
  type InstantEvaluationResult,
  type Contradiction,
  type AIFeedback,
  type RecommendedConsequence,
  type ReasoningQuality,
  type Claim,
  type ThinkingTraceState,
  type StakeholderChallenge,
} from './AIEvaluationTypes';
import type { GroundTruthState } from './GroundTruthEngine';
import type { GameState } from '../core/SimulationEngine';

// ============================================================================
// MOCK EVALUATOR
// 
// Simulates AI evaluation behavior WITHOUT calling any AI services.
// This is used for development, testing, and as fallback.
// ============================================================================

export class MockEvaluator {
  private groundTruth: GroundTruthState;
  private previousArtifacts: ArtifactSubmission[];
  private gameState: GameState;
  private thinkingTrace: ThinkingTraceState;

  constructor(
    groundTruth: GroundTruthState,
    previousArtifacts: ArtifactSubmission[],
    gameState: GameState,
    thinkingTrace: ThinkingTraceState
  ) {
    this.groundTruth = groundTruth;
    this.previousArtifacts = previousArtifacts;
    this.gameState = gameState;
    this.thinkingTrace = thinkingTrace;
  }

  // =======================================================================
  // PHASE A: INSTANT EVALUATION (Structure + Basic Contradictions)
  // =======================================================================

  evaluateInstant(artifactTypeId: string, submission: ArtifactSubmission): InstantEvaluationResult {
    const issues: InstantEvaluationResult['issues'] = [];
    let score = 1;
    const feedback: InstantEvaluationResult['feedback'] = {
      message: '',
      canProceed: true,
      requiresAttention: [],
    };

    // Check required sections based on artifact type
    const structured = submission.structured as Record<string, unknown>;
    
    switch (artifactTypeId) {
      case 'artifact-diagnosis':
        // Check for hypotheses
        const hypotheses = structured.hypotheses as Array<{ description: string; confidence: number; evidence: string[] }> | undefined;
        
        if (!hypotheses || hypotheses.length === 0) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'At least one hypothesis is required',
            field: 'hypotheses',
          });
          score -= 0.3;
        } else if (hypotheses.length > 0) {
          // Check confidence calibration
          hypotheses.forEach((h, idx) => {
            const evidenceQuality = h.evidence?.length || 0;
            if (h.confidence > 0.8 && evidenceQuality < 2) {
              issues.push({
                type: 'structure',
                severity: 'warning',
                message: `Hypothesis ${idx + 1}: High confidence (${h.confidence}) with limited evidence`,
                field: `hypotheses[${idx}].confidence`,
              });
              score -= 0.1;
            }
          });
        }

        // Check for unknowns acknowledgment
        const unknowns = structured.unknowns as string | undefined;
        if (!unknowns || (unknowns as string).length < 20) {
          issues.push({
            type: 'missing',
            severity: 'warning',
            message: 'Consider acknowledging what you don\'t know',
            field: 'unknowns',
          });
          score -= 0.05;
        }
        break;

      case 'artifact-tech-decision':
        const decision = structured.decision as string | undefined;
        const alternatives = structured.alternativesRejected as string[] | undefined;
        
        if (!decision) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'A decision is required',
            field: 'decision',
          });
          score -= 0.3;
        }
        
        if (!alternatives || alternatives.length === 0) {
          issues.push({
            type: 'missing',
            severity: 'warning',
            message: 'Consider documenting why other options were rejected',
            field: 'alternativesRejected',
          });
          score -= 0.1;
        }

        // Check for risks
        const risks = structured.risks as string[] | undefined;
        if (!risks || risks.length === 0) {
          issues.push({
            type: 'missing',
            severity: 'warning',
            message: 'Every decision has risks - document them',
            field: 'risks',
          });
          score -= 0.1;
        }
        break;

      case 'artifact-code':
        const language = structured.language as string | undefined;
        const code = submission.rawContent;
        
        if (!language) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'Please specify the code language',
            field: 'language',
          });
          score -= 0.2;
        }

        if (!code || code.length < 10) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'Code snippet is required',
            field: 'rawContent',
          });
          score -= 0.3;
        }

        // Basic syntax validation
        if (language === 'sql' && code.toLowerCase().includes('create index')) {
          if (!code.toLowerCase().includes('on ') || !code.toLowerCase().includes('(')) {
            issues.push({
              type: 'format',
              severity: 'warning',
              message: 'SQL index syntax may be incorrect',
            });
            score -= 0.1;
          }
        }
        break;

      case 'artifact-pr':
        const prSections = ['whatChanged', 'why', 'riskAreas', 'rollbackPlan'];
        prSections.forEach(section => {
          if (!structured[section]) {
            issues.push({
              type: 'missing',
              severity: section === 'whatChanged' ? 'error' : 'warning',
              message: `Missing section: ${section}`,
              field: section,
            });
            score -= section === 'whatChanged' ? 0.2 : 0.1;
          }
        });
        break;

      case 'artifact-comms':
        const commsContent = submission.rawContent.toLowerCase();
        const vagueWords = ['hopefully', 'maybe', 'might', 'should work', 'probably'];
        const hasVague = vagueWords.some(w => commsContent.includes(w));
        
        if (hasVague) {
          issues.push({
            type: 'structure',
            severity: 'warning',
            message: 'Vague language detected. Be specific and definitive.',
          });
          score -= 0.15;
        }

        // Check for acknowledgment of constraints
        const mentionsProblem = commsContent.includes('issue') || commsContent.includes('problem') || commsContent.includes('challenge');
        if (!mentionsProblem) {
          issues.push({
            type: 'structure',
            severity: 'info',
            message: 'Consider acknowledging the current challenges directly',
          });
          score -= 0.05;
        }
        break;
    }

    // Check for basic contradictions with previous artifacts
    const contradictions = this.detectBasicContradictions(artifactTypeId, submission);
    contradictions.forEach(contr => {
      issues.push({
        type: 'contradiction',
        severity: contr.severity === 'critical' ? 'error' : 'warning',
        message: contr.description,
      });
      score -= contr.severity === 'critical' ? 0.25 : 0.15;
    });

    // Generate feedback message
    if (score >= 0.9) {
      feedback.message = 'Artifact looks solid. Ready for deep evaluation.';
    } else if (score >= 0.7) {
      feedback.message = 'Some issues found. Consider addressing warnings before proceeding.';
      feedback.requiresAttention = issues.filter(i => i.severity === 'warning').map(i => i.message);
    } else {
      feedback.message = 'Critical issues found. Please address errors to proceed.';
      feedback.canProceed = false;
      feedback.requiresAttention = issues.filter(i => i.severity === 'error').map(i => i.message);
    }

    return {
      passed: score >= 0.7,
      score: Math.max(0, Math.min(1, score)),
      issues,
      feedback,
    };
  }

  // =======================================================================
  // PHASE B: DEEP MOCK EVALUATION (Simulates AI reasoning)
  // =======================================================================

  evaluateDeep(artifactTypeId: string, submission: ArtifactSubmission): AIEvaluationResult {
    const structured = submission.structured as Record<string, unknown>;
    const rawContent = submission.rawContent;

    // Calculate base scores using heuristics
    const depthScore = this.evaluateDepth(artifactTypeId, structured, rawContent);
    const evidenceScore = this.evaluateEvidenceLinkage(artifactTypeId, structured, rawContent);
    const consistencyScore = this.evaluateCrossArtifactConsistency(artifactTypeId, submission);
    const realismScore = this.evaluateEngineeringRealism(artifactTypeId, structured, rawContent);
    const constraintScore = this.evaluateConstraintRespect(artifactTypeId, structured);

    const scores = {
      depth: depthScore,
      evidenceLinkage: evidenceScore,
      crossArtifactConsistency: consistencyScore,
      engineeringRealism: realismScore,
      constraintRespect: constraintScore,
    };

    // Calculate total score (weighted average)
    const totalScore = (
      depthScore * 0.20 +
      evidenceScore * 0.20 +
      consistencyScore * 0.20 +
      realismScore * 0.25 +
      constraintScore * 0.15
    );

    // Detect contradictions
    const contradictions = this.detectDeepContradictions(artifactTypeId, submission);

    // Generate feedback
    const feedback = this.generateFeedback(artifactTypeId, scores, contradictions);

    // Calculate reasoning quality
    const reasoningQuality = this.evaluateReasoningQuality(artifactTypeId, submission, scores, contradictions);

    // Determine consequences
    const consequences = this.determineConsequences(artifactTypeId, scores, contradictions, reasoningQuality);

    return {
      scores,
      totalScore,
      contradictions,
      feedback,
      recommendedConsequences: consequences,
      reasoningQuality,
    };
  }

  // =======================================================================
  // DEPTH EVALUATION (Heuristic)
  // =======================================================================

  private evaluateDepth(artifactTypeId: string, structured: Record<string, unknown>, rawContent: string): number {
    let score = 0.5; // Base score

    const rawLower = rawContent.toLowerCase();
    const wordCount = rawContent.split(/\s+/).length;

    switch (artifactTypeId) {
      case 'artifact-diagnosis':
        const hypotheses = structured.hypotheses as Array<{ description: string; confidence: number }> | undefined;
        
        if (hypotheses) {
          // Good: specific hypotheses with reasonable confidence
          const specificCount = hypotheses.filter(h => 
            h.description.length > 30 && 
            !h.description.toLowerCase().includes('the system is slow')
          ).length;
          score += specificCount * 0.15;

          // Bad: generic hypotheses
          const genericTerms = ['slow', 'broken', 'bad', 'problem', 'issue'];
          const genericCount = hypotheses.filter(h => 
            genericTerms.some(t => h.description.toLowerCase().includes(t))
          ).length;
          score -= genericCount * 0.1;
        }

        // Bonus for detailed analysis
        if (wordCount > 300) score += 0.15;
        if (wordCount > 500) score += 0.1;
        break;

      case 'artifact-tech-decision':
        const risks = structured.risks as string[] | undefined;
        if (risks && risks.length >= 3) score += 0.2;
        
        const alternatives = structured.alternativesRejected as string[] | undefined;
        if (alternatives && alternatives.length >= 2) score += 0.15;

        // Check for "why not" reasoning
        if (rawLower.includes('because') || rawLower.includes('since') || rawLower.includes('due to')) {
          score += 0.1;
        }
        break;

      case 'artifact-code':
        // Check for meaningful variable names, comments, etc.
        const hasComments = rawLower.includes('--') || rawLower.includes('//') || rawLower.includes('/*');
        if (hasComments) score += 0.1;

        // Check code complexity (simple heuristic)
        const lines = rawContent.split('\n').length;
        if (lines > 5 && lines < 50) score += 0.1; // Reasonable size
        break;

      case 'artifact-pr':
        const rollback = structured.rollbackPlan as string | undefined;
        if (rollback && rollback.length > 50) score += 0.2;
        
        const riskAreas = structured.riskAreas as string[] | undefined;
        if (riskAreas && riskAreas.length >= 2) score += 0.15;
        break;

      default:
        if (wordCount > 200) score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  // =======================================================================
  // EVIDENCE LINKAGE EVALUATION
  // =======================================================================

  private evaluateEvidenceLinkage(artifactTypeId: string, structured: Record<string, unknown>, rawContent: string): number {
    let score = 0.5;

    switch (artifactTypeId) {
      case 'artifact-diagnosis':
        const hypotheses = structured.hypotheses as Array<{ description: string; confidence: number; evidence: string[] }> | undefined;
        
        if (hypotheses) {
          hypotheses.forEach(h => {
            const evidenceCount = h.evidence?.length || 0;
            const confidence = h.confidence || 0;
            
            // Good: high evidence, appropriate confidence
            if (evidenceCount >= 3 && confidence <= 0.8) {
              score += 0.15;
            }
            // Bad: high confidence, low evidence (overconfidence)
            else if (confidence > 0.8 && evidenceCount < 2) {
              score -= 0.1;
            }
            // Okay: some evidence
            else if (evidenceCount >= 1) {
              score += 0.05;
            }
          });
        }

        // Check for data references in raw content
        const hasNumbers = /\d+(\.\d+)?%?/.test(rawContent);
        const hasTimeReferences = /\d+\s*(min|sec|hour|ms)/i.test(rawContent);
        
        if (hasNumbers) score += 0.1;
        if (hasTimeReferences) score += 0.1;
        break;

      case 'artifact-tech-decision':
        // Check for data-driven reasoning
        if (structured.expectedImpact) score += 0.15;
        if (structured.benchmarkData) score += 0.15;
        break;

      default:
        // Generic evidence check
        const hasReferences = rawContent.includes('data shows') || 
                            rawContent.includes('metrics indicate') ||
                            rawContent.includes('analysis shows');
        if (hasReferences) score += 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  // =======================================================================
  // CROSS-ARTIFACT CONSISTENCY
  // =======================================================================

  private evaluateCrossArtifactConsistency(artifactTypeId: string, submission: ArtifactSubmission): number {
    let score = 0.7; // Default reasonable score

    const previousArtifacts = this.previousArtifacts;

    // Find relevant previous artifacts based on artifact type
    switch (artifactTypeId) {
      case 'artifact-tech-decision':
        // Should align with diagnosis
        const diagnosis = previousArtifacts.find(a => a.artifactTypeId === 'artifact-diagnosis');
        if (diagnosis) {
          const diagnosisStructured = diagnosis.structured as Record<string, unknown>;
          const decision = (submission.structured as Record<string, unknown>).decision as string;
          
          if (decision && diagnosisStructured.hypotheses) {
            const hypotheses = diagnosisStructured.hypotheses as Array<{ description: string }>;
            const decisionLower = decision.toLowerCase();
            
            // Check alignment
            const mentionsCaching = decisionLower.includes('cache');
            const mentionsIndexing = decisionLower.includes('index');
            const mentionsQuery = decisionLower.includes('query');
            
            const hasCachingHypothesis = hypotheses.some(h => 
              h.description.toLowerCase().includes('cache')
            );
            const hasIndexingHypothesis = hypotheses.some(h => 
              h.description.toLowerCase().includes('index')
            );
            const hasQueryHypothesis = hypotheses.some(h => 
              h.description.toLowerCase().includes('query')
            );

            // Strong alignment
            if ((mentionsCaching && hasCachingHypothesis) ||
                (mentionsIndexing && hasIndexingHypothesis) ||
                (mentionsQuery && hasQueryHypothesis)) {
              score += 0.2;
            }
            // Clear misalignment
            else if ((mentionsCaching && !hasCachingHypothesis) ||
                     (mentionsIndexing && !hasIndexingHypothesis)) {
              score -= 0.3;
            }
          }
        }
        break;

      case 'artifact-code':
        // Should align with decision
        const decisionArtifact = previousArtifacts.find(a => a.artifactTypeId === 'artifact-tech-decision');
        if (decisionArtifact) {
          const decision = decisionArtifact.structured as Record<string, unknown>;
          const codeLanguage = (submission.structured as Record<string, unknown>).language as string;
          const chosenDecision = decision.decision as string;
          
          if (chosenDecision && codeLanguage) {
            const decisionLower = chosenDecision.toLowerCase();
            
            // Check alignment
            if (decisionLower.includes('cache') && codeLanguage === 'typescript') {
              score += 0.1; // Caching implementation makes sense
            } else if (decisionLower.includes('index') && codeLanguage === 'sql') {
              score += 0.2; // SQL for indexing makes sense
            } else if (decisionLower.includes('cache') && codeLanguage === 'sql') {
              score -= 0.25; // Clear mismatch
            }
          }
        }
        break;

      case 'artifact-pr':
        // Should align with code
        const codeArtifact = previousArtifacts.find(a => a.artifactTypeId === 'artifact-code');
        if (codeArtifact) {
          const codeRaw = codeArtifact.rawContent;
          const prWhatChanged = (submission.structured as Record<string, unknown>).whatChanged as string;
          
          if (prWhatChanged && codeRaw) {
            // Check if PR summary matches code
            const codeHasIndex = codeRaw.toLowerCase().includes('create index');
            const codeHasCache = codeRaw.toLowerCase().includes('redis') || codeRaw.toLowerCase().includes('cache');
            const prHasIndex = prWhatChanged.toLowerCase().includes('index');
            const prHasCache = prWhatChanged.toLowerCase().includes('cache');
            
            if ((codeHasIndex && prHasIndex) || (codeHasCache && prHasCache)) {
              score += 0.15;
            }
          }
        }
        break;
    }

    return Math.max(0, Math.min(1, score));
  }

  // =======================================================================
  // ENGINEERING REALISM
  // =======================================================================

  private evaluateEngineeringRealism(artifactTypeId: string, structured: Record<string, unknown>, rawContent: string): number {
    let score = 0.6;

    switch (artifactTypeId) {
      case 'artifact-code':
        const language = structured.language as string;
        const code = rawContent;

        if (!code) return 0.3;

        // Layer 1: Basic syntax validity
        if (language === 'sql') {
          const hasCreateIndex = code.toLowerCase().includes('create index');
          const hasOnClause = code.toLowerCase().includes(' on ');
          const hasParens = code.includes('(');
          
          if (hasCreateIndex && hasOnClause && hasParens) {
            score += 0.2;
          } else if (!hasOnClause) {
            score -= 0.2; // Missing ON clause
          }
        }

        if (language === 'typescript' || language === 'javascript') {
          // Check for async/await patterns
          const hasAsync = code.includes('async') || code.includes('await');
          const hasProperErrorHandling = code.includes('try') || code.includes('catch');
          
          if (hasAsync) score += 0.1;
          if (hasProperErrorHandling) score += 0.1;
        }

        // Layer 2: Intent alignment check (simplified)
        const purpose = structured.purpose as string || '';
        const purposeLower = purpose.toLowerCase();
        
        if (purposeLower.includes('cache') && code.toLowerCase().includes('redis')) {
          score += 0.1;
        } else if (purposeLower.includes('index') && code.toLowerCase().includes('create index')) {
          score += 0.1;
        }
        break;

      case 'artifact-tech-decision':
        const expectedImpact = structured.expectedImpact as string;
        const risks = structured.risks as string[] | undefined;
        
        if (expectedImpact && expectedImpact.length > 20) score += 0.15;
        if (risks && risks.length >= 2) score += 0.15;
        
        // Check for realistic timeline
        const timeline = structured.timeline as string;
        if (timeline && /week|day/i.test(timeline)) score += 0.1;
        break;

      case 'artifact-diagnosis':
        // Check for realistic technical understanding
        const hasSpecificTech = /postgres|redis|k8s|kubernetes|node|sql|index|cache|pool/i.test(rawContent);
        if (hasSpecificTech) score += 0.2;

        // Check for performance-aware thinking
        const hasLatency = /latency|query.time|slow|performance/i.test(rawContent);
        if (hasLatency) score += 0.1;
        break;
    }

    return Math.max(0, Math.min(1, score));
  }

  // =======================================================================
  // CONSTRAINT RESPECT
  // =======================================================================

  private evaluateConstraintRespect(artifactTypeId: string, structured: Record<string, unknown>): number {
    let score = 0.8; // Start high, penalize violations

    switch (artifactTypeId) {
      case 'artifact-tech-decision':
        const budget = this.gameState.budget;
        const decision = structured.decision as string;
        
        // Check if mentions budget awareness
        if (decision && /\$?\d+k|\d+,\d+|\bbudget\b/i.test(decision)) {
          score += 0.1;
        }
        
        // Penalty for ignoring constraints
        if (budget < 20 && decision?.toLowerCase().includes('redis')) {
          // Redis would be expensive, flag it
          score -= 0.15;
        }
        break;

      case 'artifact-code':
        // Check for backward compatibility mentions
        const rawContent = (structured.purpose as string || '') + (structured.notes as string || '');
        if (rawContent.toLowerCase().includes('backward') || rawContent.toLowerCase().includes('compat')) {
          score += 0.1;
        }
        break;

      case 'artifact-pr':
        // Check for rollback plan (constraint: zero-downtime)
        const rollback = structured.rollbackPlan as string;
        if (!rollback || rollback.length < 20) {
          score -= 0.25; // Significant penalty for missing rollback
        } else {
          score += 0.1;
        }
        break;
    }

    return Math.max(0, Math.min(1, score));
  }

  // =======================================================================
  // CONTRADICTION DETECTION
  // =======================================================================

  private detectBasicContradictions(artifactTypeId: string, submission: ArtifactSubmission): Contradiction[] {
    const contradictions: Contradiction[] = [];
    const previousArtifacts = this.previousArtifacts;

    // Phase 1 vs Phase 2: Diagnosis vs Decision
    if (artifactTypeId === 'artifact-tech-decision') {
      const diagnosis = previousArtifacts.find(a => a.artifactTypeId === 'artifact-diagnosis');
      if (diagnosis) {
        const diagStructured = diagnosis.structured as Record<string, unknown>;
        const decisionStructured = submission.structured as Record<string, unknown>;

        const hypotheses = diagStructured.hypotheses as Array<{ description: string }>;
        const decision = decisionStructured.decision as string;

        if (hypotheses && decision && hypotheses.length > 0) {
          const topHypothesis = hypotheses[0].description.toLowerCase();
          const decisionLower = decision.toLowerCase();

          // Clear mismatch
          const mismatch = (
            (topHypothesis.includes('cache') && decisionLower.includes('index')) ||
            (topHypothesis.includes('index') && decisionLower.includes('cache')) ||
            (topHypothesis.includes('query') && decisionLower.includes('index') && !decisionLower.includes('query'))
          );

          if (mismatch) {
            contradictions.push({
              id: `contr-${artifactTypeId}-diagnosis`,
              type: 'diagnosis-decision',
              description: `Your decision focuses on "${decision}" but your diagnosis prioritized: "${hypotheses[0].description.substring(0, 50)}..."`,
              severity: 'major',
              phasesInvolved: [1, 2],
              relatedArtifacts: ['artifact-diagnosis', 'artifact-tech-decision'],
            });
          }
        }
      }
    }

    // Phase 2 vs Phase 3: Decision vs Code
    if (artifactTypeId === 'artifact-code') {
      const decision = previousArtifacts.find(a => a.artifactTypeId === 'artifact-tech-decision');
      if (decision) {
        const decisionStructured = decision.structured as Record<string, unknown>;
        const codeStructured = submission.structured as Record<string, unknown>;

        const decisionField = decisionStructured.decision as string;
        const codeLanguage = codeStructured.language as string;

        if (decisionField && codeLanguage) {
          const decisionLower = decisionField.toLowerCase();
          
          // Mismatch between decision and code type
          const mismatch = (
            (decisionLower.includes('cache') && codeLanguage === 'sql') ||
            (decisionLower.includes('index') && codeLanguage === 'typescript')
          );

          if (mismatch) {
            contradictions.push({
              id: `contr-${artifactTypeId}-decision`,
              type: 'decision-code',
              description: `Your code (${codeLanguage}) doesn't match your decision (${decisionField})`,
              severity: 'critical',
              phasesInvolved: [2, 3],
              relatedArtifacts: ['artifact-tech-decision', 'artifact-code'],
            });
          }
        }
      }
    }

    // Communication: Vague language
    if (artifactTypeId === 'artifact-comms') {
      const raw = submission.rawContent.toLowerCase();
      const vagueWords = ['hopefully', 'maybe', 'might', 'probably', 'should work', 'stuff', 'things'];
      const vagueCount = vagueWords.filter(w => raw.includes(w)).length;

      if (vagueCount > 0) {
        contradictions.push({
          id: `contr-${artifactTypeId}-vague`,
          type: 'comms-honesty',
          description: `Your communication contains ${vagueCount} vague term(s). Be specific.`,
          severity: vagueCount > 1 ? 'moderate' : 'minor',
          phasesInvolved: [5],
          relatedArtifacts: ['artifact-comms'],
        });
      }
    }

    return contradictions;
  }

  private detectDeepContradictions(artifactTypeId: string, submission: ArtifactSubmission): Contradiction[] {
    // Start with basic contradictions
    const contradictions = this.detectBasicContradictions(artifactTypeId, submission);

    // Add more sophisticated checks
    // ... (can be extended with more logic)

    return contradictions;
  }

  // =======================================================================
  // FEEDBACK GENERATION
  // =======================================================================

  private generateFeedback(
    artifactTypeId: string, 
    scores: Record<string, number>, 
    contradictions: Contradiction[]
  ): AIFeedback {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const learningPoints: string[] = [];

    // Analyze strengths
    if (scores.depth > 0.7) {
      strengths.push('Your analysis shows good depth and specificity');
    }
    if (scores.evidenceLinkage > 0.7) {
      strengths.push('You effectively link evidence to your claims');
    }
    if (scores.engineeringRealism > 0.7) {
      strengths.push('Your solution demonstrates solid engineering judgment');
    }
    if (scores.constraintRespect > 0.8) {
      strengths.push('You show strong awareness of project constraints');
    }

    // Analyze weaknesses
    if (scores.depth < 0.5) {
      weaknesses.push('Your analysis could benefit from more specific details');
      learningPoints.push('Dig deeper into root causes - avoid generic statements like "the system is slow"');
    }
    if (scores.evidenceLinkage < 0.5) {
      weaknesses.push('Consider backing your claims with more concrete data');
      learningPoints.push('Every hypothesis should cite specific evidence (logs, metrics, observations)');
    }
    if (scores.crossArtifactConsistency < 0.5) {
      weaknesses.push('There seems to be a disconnect between your previous work and this submission');
      learningPoints.push('Ensure your decisions flow logically from your diagnosis');
    }
    if (scores.engineeringRealism < 0.5) {
      weaknesses.push('Your solution may not be practical for production');
      learningPoints.push('Think about real-world constraints: backward compatibility, rollback plans, performance at scale');
    }

    // Add contradiction-based feedback
    const criticalContradictions = contradictions.filter(c => c.severity === 'critical' || c.severity === 'major');
    if (criticalContradictions.length > 0) {
      weaknesses.push('Significant inconsistency detected between your work');
      learningPoints.push('Review your previous artifacts - your work should tell a coherent story');
    }

    // Determine pressure point
    let pressurePoint: string | undefined;
    if (scores.crossArtifactConsistency < 0.4) {
      pressurePoint = 'CTO is questioning your decision rationale';
    } else if (scores.constraintRespect < 0.5) {
      pressurePoint = 'Your approach may violate key project constraints';
    }

    return {
      strengths,
      weaknesses,
      learningPoints,
      pressurePoint,
      narrativeSummary: this.generateNarrativeSummary(artifactTypeId, scores, contradictions),
    };
  }

  private generateNarrativeSummary(
    artifactTypeId: string, 
    scores: Record<string, number>, 
    contradictions: Contradiction[]
  ): string {
    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    
    if (avgScore >= 0.8) {
      return 'Excellent work. Your submission demonstrates strong technical reasoning and alignment with project goals.';
    } else if (avgScore >= 0.6) {
      return 'Solid submission with room for improvement. Review the feedback to strengthen your approach.';
    } else if (avgScore >= 0.4) {
      return 'Your submission needs work. Significant gaps in reasoning or alignment were detected.';
    } else {
      return 'Critical issues detected. Your work does not meet the expected standard for this simulation.';
    }
  }

  // =======================================================================
  // REASONING QUALITY
  // =======================================================================

  private evaluateReasoningQuality(
    artifactTypeId: string,
    submission: ArtifactSubmission,
    scores: Record<string, number>,
    contradictions: Contradiction[]
  ): ReasoningQuality {
    const coherenceScore = scores.crossArtifactConsistency;
    const depthScore = scores.depth;
    
    // Calibration: confidence vs evidence
    const structured = submission.structured as Record<string, unknown>;
    let calibrationScore = 0.7;
    
    if (artifactTypeId === 'artifact-diagnosis') {
      const hypotheses = structured.hypotheses as Array<{ confidence: number; evidence: string[] }> | undefined;
      if (hypotheses) {
        let overconfidentCount = 0;
        let wellCalibratedCount = 0;
        
        hypotheses.forEach(h => {
          const evidenceCount = h.evidence?.length || 0;
          if (h.confidence > 0.8 && evidenceCount < 2) {
            overconfidentCount++;
          } else if (h.confidence <= 0.7 && evidenceCount >= 2) {
            wellCalibratedCount++;
          }
        });

        calibrationScore = 1 - (overconfidentCount * 0.15) + (wellCalibratedCount * 0.1);
      }
    }

    return {
      overallScore: (coherenceScore + calibrationScore + depthScore) / 3,
      coherenceScore,
      calibrationScore: Math.max(0, Math.min(1, calibrationScore)),
      depthScore,
      hasContradictions: contradictions.length > 0,
      contradictionCount: contradictions.length,
    };
  }

  // =======================================================================
  // CONSEQUENCE DETERMINATION
  // =======================================================================

  private determineConsequences(
    artifactTypeId: string,
    scores: Record<string, number>,
    contradictions: Contradiction[],
    reasoningQuality: ReasoningQuality
  ): RecommendedConsequence[] {
    const consequences: RecommendedConsequence[] = [];

    // Contradiction consequences
    contradictions.forEach(contr => {
      if (contr.severity === 'critical') {
        consequences.push({
          trigger: 'critical-contradiction',
          effects: {
            progress: -10,
            stakeholderTrust: { cto: -15 },
            riskLevel: 0.1,
          },
          stakeholderReaction: {
            stakeholderId: 'cto',
            channel: 'slack',
            message: `I noticed your ${contr.type.replace('-', ' ')} doesn't align with your previous work. Can you explain?`,
            requiresResponse: true,
            timeoutMinutes: 5,
          },
        });
      } else if (contr.severity === 'major') {
        consequences.push({
          trigger: 'major-contradiction',
          effects: {
            progress: -5,
            stakeholderTrust: { cto: -10 },
          },
        });
      }
    });

    // Low score consequences
    if (scores.crossArtifactConsistency < 0.4) {
      consequences.push({
        trigger: 'low-consistency',
        effects: {
          stakeholderTrust: { cto: -5, product: -5 },
        },
        stakeholderReaction: {
          stakeholderId: 'cto',
          channel: 'slack',
          message: 'Your recent submissions seem disconnected. Help me understand the thread.',
          requiresResponse: false,
        },
      });
    }

    // Missing rollback plan
    if (artifactTypeId === 'artifact-pr') {
      const structured = (this.previousArtifacts.find(a => a.artifactTypeId === 'artifact-code')?.structured || {}) as Record<string, unknown>;
      const prStructured = (this.previousArtifacts.find(a => a.artifactTypeId === 'artifact-pr')?.structured || {}) as Record<string, unknown>;
      
      if (!(prStructured as Record<string, unknown>).rollbackPlan) {
        consequences.push({
          trigger: 'missing-rollback',
          effects: {
            progress: -5,
          },
          stakeholderReaction: {
            stakeholderId: 'cto',
            channel: 'slack',
            message: 'Your PR lacks a rollback plan. Without this, I can\'t approve the change.',
            requiresResponse: true,
            timeoutMinutes: 3,
          },
        });
      }
    }

    // Good performance bonus
    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    if (avgScore >= 0.8) {
      consequences.push({
        trigger: 'high-quality',
        effects: {
          progress: 5,
          stakeholderTrust: { cto: 5 },
          teamMorale: 5,
        },
      });
    }

    return consequences;
  }

  // =======================================================================
  // PUBLIC: CHECK FOR PENDING CHALLENGES
  // =======================================================================

  getPendingChallenges(): StakeholderChallenge[] {
    const challenges: StakeholderChallenge[] = [];
    
    // Check recent artifacts for trigger conditions
    const recentArtifacts = this.previousArtifacts.slice(-3);
    
    recentArtifacts.forEach(artifact => {
      if (artifact.artifactTypeId === 'artifact-comms') {
        const raw = artifact.rawContent.toLowerCase();
        if (raw.includes('hopefully') || raw.includes('maybe')) {
          challenges.push({
            id: `challenge-${artifact.id}`,
            stakeholderId: 'cto',
            channel: 'slack',
            subject: 'Clarification needed',
            message: 'Your message contained vague language. Can you be more specific about the timeline?',
            context: 'Vague communication detected',
            requiresResponse: true,
            responseRequired: true,
            timeoutMinutes: 3,
            evaluation: {
              mustAcknowledge: true,
              mustExplain: true,
              mustProposeSolution: false,
              defensivenessPenalty: -10,
              vagueLanguagePenalty: -15,
              ownershipBonus: 10,
            },
          });
        }
      }
    });

    return challenges;
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createMockEvaluator(
  groundTruth: GroundTruthState,
  previousArtifacts: ArtifactSubmission[],
  gameState: GameState,
  thinkingTrace: ThinkingTraceState
): MockEvaluator {
  return new MockEvaluator(groundTruth, previousArtifacts, gameState, thinkingTrace);
}