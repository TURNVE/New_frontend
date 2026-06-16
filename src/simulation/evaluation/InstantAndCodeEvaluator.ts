import {
  type InstantEvaluationResult,
  type ArtifactSubmission,
  type Contradiction,
} from './AIEvaluationTypes';

// ============================================================================
// INSTANT EVALUATOR (Phase A: 0-1 second local evaluation)
// ============================================================================

export class InstantEvaluator {
  
  /**
   * Perform instant evaluation - runs synchronously with no AI calls
   * Checks: structure, format, missing sections, basic contradictions
   */
  evaluate(artifactTypeId: string, submission: ArtifactSubmission): InstantEvaluationResult {
    const issues: InstantEvaluationResult['issues'] = [];
    let score = 1.0;
    const feedback: InstantEvaluationResult['feedback'] = {
      message: '',
      canProceed: true,
      requiresAttention: [],
    };

    // 1. Check required sections
    const sectionIssues = this.checkRequiredSections(artifactTypeId, submission);
    issues.push(...sectionIssues.issues);
    score -= sectionIssues.scorePenalty;

    // 2. Check format and validity
    const formatIssues = this.checkFormat(artifactTypeId, submission);
    issues.push(...formatIssues.issues);
    score -= formatIssues.scorePenalty;

    // 3. Check for basic contradictions (lightweight)
    const contradictionIssues = this.checkBasicContradictions(artifactTypeId, submission);
    issues.push(...contradictionIssues);
    
    // Apply contradiction penalty (simplified)
    contradictionIssues.forEach(c => {
      if (c.severity === 'error') score -= 0.25;
      else if (c.severity === 'warning') score -= 0.1;
    });

    // 4. Generate feedback message
    const criticalErrors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');

    if (criticalErrors.length > 0) {
      feedback.message = `${criticalErrors.length} critical issue(s) must be resolved.`;
      feedback.canProceed = false;
      feedback.requiresAttention = criticalErrors.map(e => e.message);
    } else if (warnings.length > 2) {
      feedback.message = `${warnings.length} warnings found. Review before proceeding.`;
      feedback.canProceed = true;
      feedback.requiresAttention = warnings.map(e => e.message);
    } else {
      feedback.message = 'Structure looks good. Ready for deep evaluation.';
      feedback.canProceed = true;
    }

    return {
      passed: score >= 0.7,
      score: Math.max(0, Math.min(1, score)),
      issues,
      feedback,
    };
  }

  /**
   * Check for required sections based on artifact type
   */
  private checkRequiredSections(
    artifactTypeId: string, 
    submission: ArtifactSubmission
  ): { issues: InstantEvaluationResult['issues']; scorePenalty: number } {
    const issues: InstantEvaluationResult['issues'] = [];
    let scorePenalty = 0;
    const structured = submission.structured as Record<string, unknown>;
    const rawContent = submission.rawContent;

    switch (artifactTypeId) {
      case 'artifact-diagnosis':
        // Need hypotheses
        if (!structured.hypotheses || !Array.isArray(structured.hypotheses) || (structured.hypotheses as unknown[]).length === 0) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'At least one hypothesis is required',
            field: 'hypotheses',
          });
          scorePenalty += 0.3;
        }

        // Need raw analysis content
        if (!rawContent || rawContent.length < 100) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'Analysis content is too short (minimum 100 characters)',
            field: 'rawContent',
          });
          scorePenalty += 0.2;
        }
        break;

      case 'artifact-tech-decision':
        // Need decision
        if (!structured.decision) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'A technical decision is required',
            field: 'decision',
          });
          scorePenalty += 0.3;
        }

        // Need alternatives considered
        if (!structured.alternativesRejected || !(structured.alternativesRejected as string[]).length) {
          issues.push({
            type: 'missing',
            severity: 'warning',
            message: 'Consider documenting alternatives you rejected',
            field: 'alternativesRejected',
          });
          scorePenalty += 0.1;
        }

        // Need risks
        if (!structured.risks || !(structured.risks as string[]).length) {
          issues.push({
            type: 'missing',
            severity: 'warning',
            message: 'Every decision has risks - document them',
            field: 'risks',
          });
          scorePenalty += 0.1;
        }
        break;

      case 'artifact-code':
        // Need language
        if (!structured.language) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'Code language is required',
            field: 'language',
          });
          scorePenalty += 0.2;
        }

        // Need code
        if (!rawContent || rawContent.length < 20) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'Code snippet is required',
            field: 'rawContent',
          });
          scorePenalty += 0.3;
        }

        // Need purpose
        if (!structured.purpose) {
          issues.push({
            type: 'missing',
            severity: 'warning',
            message: 'Describe what this code does',
            field: 'purpose',
          });
          scorePenalty += 0.1;
        }
        break;

      case 'artifact-pr':
        const requiredSections = ['whatChanged', 'why', 'riskAreas', 'rollbackPlan'];
        requiredSections.forEach(section => {
          if (!structured[section]) {
            const isCritical = section === 'whatChanged' || section === 'rollbackPlan';
            issues.push({
              type: 'missing',
              severity: isCritical ? 'error' : 'warning',
              message: `Missing section: ${section}`,
              field: section,
            });
            scorePenalty += isCritical ? 0.15 : 0.08;
          }
        });
        break;

      case 'artifact-comms':
        // Check for vague language
        const vaguePatterns = ['hopefully', 'maybe', 'might', 'probably', 'should work', 'stuff', 'things'];
        const rawLower = rawContent.toLowerCase();
        const vagueFound = vaguePatterns.filter(p => rawLower.includes(p));
        
        if (vagueFound.length > 0) {
          issues.push({
            type: 'format',
            severity: 'warning',
            message: `Vague language detected: ${vagueFound.join(', ')}. Be specific.`,
          });
          scorePenalty += 0.1;
        }

        // Need content
        if (!rawContent || rawContent.length < 50) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'Communication content is too short',
            field: 'rawContent',
          });
          scorePenalty += 0.2;
        }
        break;

      case 'artifact-perf-analysis':
        if (!structured.improvements || !(structured.improvements as string[]).length) {
          issues.push({
            type: 'missing',
            severity: 'warning',
            message: 'Document what improvements you observed',
            field: 'improvements',
          });
          scorePenalty += 0.1;
        }
        break;

      case 'artifact-launch-decision':
        if (!structured.decision) {
          issues.push({
            type: 'missing',
            severity: 'error',
            message: 'A launch decision is required',
            field: 'decision',
          });
          scorePenalty += 0.3;
        }
        break;
    }

    return { issues, scorePenalty };
  }

  /**
   * Check format and validity of content
   */
  private checkFormat(
    artifactTypeId: string, 
    submission: ArtifactSubmission
  ): { issues: InstantEvaluationResult['issues']; scorePenalty: number } {
    const issues: InstantEvaluationResult['issues'] = [];
    let scorePenalty = 0;
    const structured = submission.structured as Record<string, unknown>;
    const rawContent = submission.rawContent;

    // Check confidence calibration for diagnosis
    if (artifactTypeId === 'artifact-diagnosis') {
      const hypotheses = structured.hypotheses as Array<{ confidence: number; evidence: string[] }> | undefined;
      if (hypotheses) {
        hypotheses.forEach((h, idx) => {
          const evidenceCount = h.evidence?.length || 0;
          
          // Overconfidence check
          if (h.confidence >= 0.9 && evidenceCount < 2) {
            issues.push({
              type: 'structure',
              severity: 'warning',
              message: `Hypothesis ${idx + 1}: High confidence (${h.confidence}) with limited evidence`,
            });
            scorePenalty += 0.08;
          }

          // Very low confidence with evidence
          if (h.confidence <= 0.3 && evidenceCount >= 3) {
            issues.push({
              type: 'structure',
              severity: 'warning',
              message: `Hypothesis ${idx + 1}: Low confidence despite evidence`,
            });
            scorePenalty += 0.05;
          }
        });
      }
    }

    // Check code syntax (basic)
    if (artifactTypeId === 'artifact-code') {
      const language = structured.language as string;
      const code = rawContent;

      if (language === 'sql' && code) {
        // Basic SQL validation
        const codeLower = code.toLowerCase();
        if (codeLower.includes('create index') && !codeLower.includes(' on ')) {
          issues.push({
            type: 'format',
            severity: 'error',
            message: 'SQL index missing ON clause',
          });
          scorePenalty += 0.15;
        }
        if (codeLower.includes('create index') && !codeLower.includes('(')) {
          issues.push({
            type: 'format',
            severity: 'error',
            message: 'SQL index missing column specification',
          });
          scorePenalty += 0.15;
        }
      }

      if (language === 'typescript' || language === 'javascript') {
        // Check for obvious syntax issues
        const openBraces = (code.match(/{/g) || []).length;
        const closeBraces = (code.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
          issues.push({
            type: 'format',
            severity: 'warning',
            message: 'Mismatched braces detected',
          });
          scorePenalty += 0.1;
        }
      }
    }

    return { issues, scorePenalty };
  }

  /**
   * Lightweight contradiction check (compares with recent artifacts)
   */
  private checkBasicContradictions(
    artifactTypeId: string, 
    submission: ArtifactSubmission
  ): InstantEvaluationResult['issues'] {
    const issues: InstantEvaluationResult['issues'] = [];
    
    // This is a simplified version - full contradiction detection 
    // happens in MockEvaluator with access to all previous artifacts
    
    return issues;
  }
}

// ============================================================================
// CODE EVALUATOR (3-Layer Evaluation)
// ============================================================================

export interface CodeEvaluationInput {
  language: string;
  snippet: string;
  purpose: string;
  decisionField?: string;
}

export interface CodeEvaluationResult {
  layer1: { passed: boolean; issues: string[] };
  layer2: { passed: boolean; alignmentScore: number; mismatchReason?: string };
  layer3?: { passed: boolean; effectivenessScore: number };
  overallScore: number;
  feedback: string;
}

export class CodeEvaluator {
  
  /**
   * Evaluate code submission using 3 layers:
   * Layer 1: Structural (syntax, basic validity)
   * Layer 2: Intent Alignment (matches decision)
   * Layer 3: Effectiveness (would this work? - requires AI)
   */
  evaluate(input: CodeEvaluationInput): CodeEvaluationResult {
    const layer1 = this.evaluateLayer1(input);
    const layer2 = this.evaluateLayer2(input);
    
    const overallScore = (layer1.passed ? 0.4 : 0) + 
                        (layer2.passed ? 0.3 : 0) * layer2.alignmentScore +
                        0.3; // Assume layer3 would pass for now

    const layer1Pass = layer1.passed;
    const layer2Pass = layer2.alignmentScore >= 0.5;

    let feedback = '';
    if (!layer1Pass) {
      feedback = 'Code has structural issues that need addressing. ';
      feedback += layer1.issues.join('. ');
    } else if (!layer2Pass) {
      feedback = `Code doesn't align with stated purpose. ${layer2.mismatchReason || ''}`;
    } else {
      feedback = 'Code passes structural and intent checks. Ready for deep evaluation.';
    }

    return {
      layer1,
      layer2,
      overallScore: Math.max(0, Math.min(1, overallScore)),
      feedback,
    };
  }

  /**
   * Layer 1: Structural validation
   * - Syntax validity
   * - Logical compilation
   * - Basic correctness
   */
  private evaluateLayer1(input: CodeEvaluationInput): CodeEvaluationResult['layer1'] {
    const issues: string[] = [];
    const { language, snippet } = input;

    if (!snippet || snippet.trim().length < 10) {
      return { passed: false, issues: ['Code snippet is too short'] };
    }

    const snippetLower = snippet.toLowerCase();

    // SQL validation
    if (language === 'sql') {
      if (snippetLower.includes('create index')) {
        if (!snippetLower.includes(' on ')) {
          issues.push('Missing ON clause');
        }
        if (!snippetLower.includes('(')) {
          issues.push('Missing column specification');
        }
        // Check for valid index name
        if (!/create\s+index\s+\w+\s+on/i.test(snippet)) {
          issues.push('Invalid index syntax');
        }
      }

      if (snippetLower.includes('create table')) {
        if (!snippet.includes('(')) {
          issues.push('Missing column definitions');
        }
      }

      if (snippetLower.includes('select') && !snippetLower.includes('from')) {
        issues.push('SELECT without FROM');
      }
    }

    // TypeScript/JavaScript validation
    if (language === 'typescript' || language === 'javascript') {
      // Check for basic syntax issues
      const openParens = (snippet.match(/\(/g) || []).length;
      const closeParens = (snippet.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        issues.push('Mismatched parentheses');
      }

      const openBraces = (snippet.match(/{/g) || []).length;
      const closeBraces = (snippet.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        issues.push('Mismatched braces');
      }

      // Check for async/await issues
      if (snippet.includes('await') && !snippet.includes('async')) {
        issues.push('await used without async function');
      }
    }

    // YAML validation
    if (language === 'yaml') {
      // Basic YAML structure check
      const lines = snippet.split('\n');
      let indentError = false;
      let prevIndent = 0;
      
      for (const line of lines) {
        if (line.trim() && !line.trim().startsWith('#')) {
          const indent = line.search(/\S/);
          if (indent > prevIndent + 2 && prevIndent !== 0) {
            indentError = true;
          }
          prevIndent = indent;
        }
      }
      
      if (indentError) {
        issues.push('Potential YAML indentation issue');
      }
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  /**
   * Layer 2: Intent Alignment
   * - Does code match the stated purpose?
   * - Does code align with the decision?
   */
  private evaluateLayer2(input: CodeEvaluationInput): CodeEvaluationResult['layer2'] {
    const { language, snippet, purpose, decisionField } = input;
    
    let alignmentScore = 0.8; // Start neutral
    let mismatchReason: string | undefined;

    const purposeLower = (purpose || '').toLowerCase();
    const snippetLower = snippet.toLowerCase();
    const decisionLower = (decisionField || '').toLowerCase();

    // Check alignment with purpose
    if (purposeLower.includes('cache') || purposeLower.includes('redis')) {
      if (snippetLower.includes('redis') || 
          snippetLower.includes('cache') || 
          snippetLower.includes('setex') ||
          snippetLower.includes('getex') ||
          snippetLower.includes('expire')) {
        alignmentScore += 0.2;
      } else {
        mismatchReason = 'Code does not appear to implement caching';
        alignmentScore -= 0.4;
      }
    }

    if (purposeLower.includes('index') || purposeLower.includes('database')) {
      if (snippetLower.includes('create index') || 
          snippetLower.includes('idx_') ||
          snippetLower.includes('index on')) {
        alignmentScore += 0.2;
      } else if (language !== 'sql') {
        mismatchReason = 'Database indexing typically requires SQL';
        alignmentScore -= 0.3;
      }
    }

    if (purposeLower.includes('query') || purposeLower.includes('optimize')) {
      if (snippetLower.includes('select') || 
          snippetLower.includes('join') ||
          snippetLower.includes('where')) {
        alignmentScore += 0.15;
      }
    }

    // Check alignment with decision
    if (decisionLower) {
      if (decisionLower.includes('cache') && language === 'sql') {
        mismatchReason = 'Decision was caching, but code is SQL (index)';
        alignmentScore -= 0.5;
      }
      if (decisionLower.includes('index') && language === 'typescript') {
        mismatchReason = 'Decision was indexing, but code is TypeScript';
        alignmentScore -= 0.5;
      }
    }

    return {
      passed: alignmentScore >= 0.5,
      alignmentScore: Math.max(0, Math.min(1, alignmentScore)),
      mismatchReason,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export function createInstantEvaluator(): InstantEvaluator {
  return new InstantEvaluator();
}

export function createCodeEvaluator(): CodeEvaluator {
  return new CodeEvaluator();
}