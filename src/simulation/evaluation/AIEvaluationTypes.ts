import type { GameState, Stakeholder } from '../core/SimulationEngine';
import type { GroundTruthState } from './GroundTruthEngine';

// ============================================================================
// ARTIFACT TYPES
// ============================================================================

export type ArtifactTypeId =
  | 'artifact-diagnosis'
  | 'artifact-tech-decision'
  | 'artifact-code'
  | 'artifact-pr'
  | 'artifact-perf-analysis'
  | 'artifact-comms'
  | 'artifact-launch-decision';

export interface ArtifactDefinition {
  id: ArtifactTypeId;
  name: string;
  description: string;
  phaseDue: number; // 1-7
  required: boolean;
  canRevise: boolean;
  submitWork: boolean;
  showInCorner: boolean;
  sections: ArtifactSection[];
  evaluationCriteria: ArtifactEvaluationCriteria;
}

export interface ArtifactSection {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'code' | 'rating' | 'list';
  placeholder?: string;
  required: boolean;
  maxLength?: number;
}

export interface ArtifactEvaluationCriteria {
  depth: { weight: number; description: string };
  evidenceLinkage: { weight: number; description: string };
  crossArtifactConsistency: { weight: number; description: string };
  engineeringRealism: { weight: number; description: string };
  constraintRespect: { weight: number; description: string };
}

// ============================================================================
// SUBMISSION STRUCTURES
// ============================================================================

export interface ArtifactSubmission {
  id: string;
  artifactTypeId: ArtifactTypeId;
  phase: number;
  submittedAt: Date;
  
  // Structured content (machine-readable)
  structured: Record<string, unknown>;
  
  // Raw content (for deep AI evaluation)
  rawContent: string;
  
  // Metadata
  timeSpent: number; // minutes
  revisionOf?: string; // previous submission ID
}

// ============================================================================
// PHASE A: INSTANT EVALUATION RESULTS
// ============================================================================

export interface InstantEvaluationResult {
  passed: boolean;
  score: number; // 0-1
  issues: InstantEvaluationIssue[];
  feedback: InstantFeedback;
}

export interface InstantEvaluationIssue {
  type: 'structure' | 'contradiction' | 'missing' | 'format';
  severity: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
}

export interface InstantFeedback {
  message: string;
  canProceed: boolean;
  requiresAttention?: string[];
}

// ============================================================================
// PHASE B: DEEP AI EVALUATION RESULTS  
// ============================================================================

export interface AIEvaluationResult {
  // Per-criterion scores (0-1)
  scores: {
    depth: number;
    evidenceLinkage: number;
    crossArtifactConsistency: number;
    engineeringRealism: number;
    constraintRespect: number;
  };
  
  // Weighted total
  totalScore: number; // 0-1
  
  // Contradictions detected
  contradictions: Contradiction[];
  
  // Narrative feedback
  feedback: AIFeedback;
  
  // Recommended consequences
  recommendedConsequences: RecommendedConsequence[];
  
  // Reasoning quality for ThinkingTrace
  reasoningQuality: ReasoningQuality;
}

export interface Contradiction {
  id: string;
  type: 'diagnosis-decision' | 'decision-code' | 'code-rollback' | 'comms-honesty' | 'cross-phase';
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  phasesInvolved: number[];
  relatedArtifacts: string[];
}

export interface AIFeedback {
  strengths: string[];
  weaknesses: string[];
  learningPoints: string[];
  pressurePoint?: string;
  narrativeSummary: string;
}

export interface RecommendedConsequence {
  trigger: string;
  effects: ConsequenceEffect;
  stakeholderReaction?: StakeholderReaction;
}

export interface ConsequenceEffect {
  progress?: number;
  budget?: number;
  teamMorale?: number;
  stakeholderTrust?: Record<string, number>;
  riskLevel?: number;
  customMetrics?: Record<string, number>;
}

export interface StakeholderReaction {
  stakeholderId: string;
  channel: 'slack' | 'email' | 'meeting';
  message: string;
  requiresResponse: boolean;
  timeoutMinutes?: number;
}

export interface ReasoningQuality {
  overallScore: number; // 0-1
  coherenceScore: number; // Do claims link logically?
  calibrationScore: number; // Confidence vs evidence match?
  depthScore: number; // Surface vs deep reasoning?
  hasContradictions: boolean;
  contradictionCount: number;
}

// ============================================================================
// CODE EVALUATION (LAYERS 1-3)
// ============================================================================

export interface CodeEvaluationInput {
  language: 'sql' | 'typescript' | 'yaml' | 'javascript' | 'other';
  snippet: string;
  purpose: string; // What they claim it does
  decisionField?: string; // From decision artifact
  groundTruth: GroundTruthState;
}

export interface CodeEvaluationResult {
  layer1: Layer1Result; // Structural
  layer2: Layer2Result; // Intent alignment
  layer3?: Layer3Result; // Effectiveness (AI only)
  overallScore: number;
  issues: CodeIssue[];
  feedback: string;
}

export interface Layer1Result {
  passed: boolean;
  syntaxValid: boolean;
  compilesLogically: boolean;
  issues: string[];
}

export interface Layer2Result {
  passed: boolean;
  alignedWithDecision: boolean;
  alignmentScore: number; // 0-1
  mismatchReason?: string;
}

export interface Layer3Result {
  passed: boolean;
  effectivenessScore: number;
  technicalCorrectness: string;
  improvementPotential: string;
}

export interface CodeIssue {
  layer: 1 | 2 | 3;
  severity: 'error' | 'warning' | 'info';
  category: 'syntax' | 'logic' | 'alignment' | 'performance' | 'security';
  message: string;
  line?: number;
  suggestion?: string;
}

// ============================================================================
// EVALUATION REQUEST/RESPONSE
// ============================================================================

export interface EvaluationRequest {
  artifactTypeId: ArtifactTypeId;
  submission: ArtifactSubmission;
  gameState: GameState;
  groundTruth: GroundTruthState;
  previousArtifacts: ArtifactSubmission[];
  evaluationPhase: 'instant' | 'deep';
}

export interface EvaluationResponse {
  artifactTypeId: ArtifactTypeId;
  submissionId: string;
  evaluationPhase: 'instant' | 'deep';
  timestamp: Date;
  instant?: InstantEvaluationResult;
  deep?: AIEvaluationResult;
}

// ============================================================================
// THINKING TRACE INTEGRATION
// ============================================================================

export interface Claim {
  id: string;
  artifactId: ArtifactTypeId;
  phase: number;
  statement: string;
  confidence: number; // 0-1
  evidence: string[];
  category: 'hypothesis' | 'decision' | 'observation' | 'conclusion';
  linkedTo?: string[]; // Previous claim IDs
}

export interface ThinkingTraceState {
  claims: Claim[];
  causalChains: CausalChain[];
  coherenceHistory: number[];
}

export interface CausalChain {
  id: string;
  claims: string[]; // Claim IDs
  strength: number; // 0-1
  phaseFormed: number;
}

// ============================================================================
// STAKEHOLDER PRESSURE
// ============================================================================

export interface StakeholderChallenge {
  id: string;
  stakeholderId: string;
  channel: 'slack' | 'email' | 'meeting' | 'modal';
  subject: string;
  message: string;
  context: string; // What triggered this
  requiresResponse: boolean;
  responseRequired: boolean;
  timeoutMinutes?: number;
  evaluation?: StakeholderResponseEvaluation;
}

export interface StakeholderResponseEvaluation {
  mustAcknowledge: boolean;
  mustExplain: boolean;
  mustProposeSolution: boolean;
  defensivenessPenalty: number;
  vagueLanguagePenalty: number;
  ownershipBonus: number;
}

// ============================================================================
// FINAL OUTCOME
// ============================================================================

export interface SimulationOutcome {
  // Raw metrics
  latencyImprovement: number;
  transactionSuccessRate: number;
  budgetUtilized: number;
  timeRemaining: number;
  
  // AI-evaluated dimensions
  decisionCorrectness: number; // Alignment with ground truth
  reasoningQuality: number;    // From ThinkingTrace
  executionQuality: number;   // Code + implementation
  stakeholderManagement: number; // Communication artifacts
  
  // Weighted final score
  finalScore: number; // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  
  // Narrative outcome
  outcomeNarrative: string;
  keyDecisions: string[];
  lessonsLearned: string[];
  whatWentWell: string[];
  whatToImprove: string[];
  
  // Detailed breakdown
  breakdown: {
    performance: number;
    decision: number;
    reasoning: number;
    execution: number;
    communication: number;
  };
}

// ============================================================================
// BRAND DESIGN ARTIFACT TYPES
// ============================================================================

export type BrandArtifactTypeId =
  | 'brand-moodboard'
  | 'brand-color-palette'
  | 'brand-logo'
  | 'brand-social-assets'
  | 'brand-meta-campaign'
  | 'brand-guide'
  | 'brand-video-storyboard'
  | 'brand-ooh-mockup'
  | 'brand-ad-variants';

export interface BrandArtifactDefinition {
  id: BrandArtifactTypeId;
  name: string;
  description: string;
  phaseDue: number;
  required: boolean;
  canRevise: boolean;
  submitWork: boolean;
  showInCorner: boolean;
  sections: ArtifactSection[];
  evaluationCriteria: BrandEvaluationCriteria;
}

export interface BrandEvaluationCriteria {
  creativity: { weight: number; description: string };
  brandAlignment: { weight: number; description: string };
  genZResonance: { weight: number; description: string };
  technicalQuality: { weight: number; description: string };
  consistency: { weight: number; description: string };
  stakeholderApproval: { weight: number; description: string };
}

// ============================================================================
// BRAND DESIGN SPECIFIC EVALUATION TYPES
// ============================================================================

export interface BrandArtifactSubmission {
  id: string;
  artifactTypeId: BrandArtifactTypeId;
  phase: number;
  submittedAt: Date;
  
  // Structured content (machine-readable)
  structured: BrandStructuredContent;
  
  // Raw content (for deep AI evaluation)
  rawContent: string;
  
  // Metadata
  timeSpent: number; // minutes
  revisionOf?: string; // previous submission ID
}

export interface BrandStructuredContent {
  // Color Palette
  primaryColors?: { name: string; hex: string; rgb: string; usage: string }[];
  secondaryColors?: { name: string; hex: string; rgb: string; usage: string }[];
  accentColors?: { name: string; hex: string; rgb: string; usage: string }[];
  
  // Moodboard
  colorDirection?: string;
  imageryReferences?: string[];
  typographyInspiration?: string[];
  genZAlignment?: string;
  
  // Social Assets
  platformSpecs?: { platform: string; format: string; count: number }[];
  brandVoice?: string;
  
  // Meta Campaign
  campaignObjective?: string;
  targetingAudience?: string;
  budget?: number;
  adVariants?: { name: string; type: string }[];
  
  // Brand Guide
  logoUsage?: string;
  typography?: string;
  toneOfVoice?: string;
}

export interface BrandEvaluationResult {
  scores: {
    creativity: number;
    brandAlignment: number;
    genZResonance: number;
    technicalQuality: number;
    consistency: number;
    stakeholderApproval: number;
  };
  totalScore: number;
  contradictions: BrandContradiction[];
  feedback: BrandAIFeedback;
  recommendedConsequences: RecommendedConsequence[];
  reasoningQuality: ReasoningQuality;
}

export interface BrandContradiction {
  id: string;
  type: 'color-inconsistency' | 'platform-mismatch' | 'audience-mismatch' | 'direction-shift';
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  relatedPhases: number[];
}

export interface BrandAIFeedback {
  strengths: string[];
  weaknesses: string[];
  learningPoints: string[];
  stakeholderReactions: StakeholderReaction[];
  narrativeSummary: string;
}

// ============================================================================
// COLOR PSYCHOLOGY EVALUATION
// ============================================================================

export interface ColorPsychologyEvaluation {
  colorName: string;
  hexCode: string;
  psychologyNotes: string;
  genZAppealScore: number; // 0-1
  accessibilityScore: number; // 0-1
  brandAppropriateness: number; // 0-1
  recommendations: string[];
}

// ============================================================================// META CAMPAIGN PERFORMANCE EVALUATION
// ============================================================================

export interface MetaCampaignEvaluation {
  campaignSetup: {
    objective: string;
    targetingQuality: number;
    budgetAllocation: number;
  };
  performanceMetrics: {
    roas: number;
    ctr: number;
    cpm: number;
    engagement: number;
    reach: number;
  };
  creativeQuality: {
    adRelevance: number;
    messageMatch: number;
    visualAppeal: number;
  };
  optimizationRecommendations: string[];
  predictedOutcome: 'success' | 'warning' | 'failure';
}