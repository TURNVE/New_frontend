export type ArtifactType = 
  | 'prd'
  | 'roadmap'
  | 'stakeholder_update'
  | 'retrospective'
  | 'risk_assessment'
  | 'user_research'
  | 'metrics_report'
  | 'decision_log'
  | 'project_charter'
  // Brand Design specific types
  | 'moodboard'
  | 'color_palette'
  | 'logo'
  | 'social_assets'
  | 'meta_campaign'
  | 'brand_guide'
  | 'video_storyboard'
  | 'ooh_mockup'
  | 'ad_variants';

export type ArtifactStatus = 'draft' | 'generated' | 'exported' | 'archived';

export interface Artifact {
  id: string;
  sessionId: string;
  type: ArtifactType;
  title: string;
  description?: string;
  content: ArtifactContent;
  metadata: ArtifactMetadata;
  status: ArtifactStatus;
  createdAt: Date;
  updatedAt: Date;
  week: number;
  phaseId: string;
}

export interface ArtifactContent {
  sections: ArtifactSection[];
  summary?: string;
  recommendations?: string[];
  data?: Record<string, unknown>;
}

export interface ArtifactSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'table' | 'chart' | 'image';
  order: number;
  data?: Record<string, unknown>;
}

export interface ArtifactMetadata {
  author: string;
  version: number;
  tags: string[];
  relatedDecisions?: string[];
  relatedActions?: string[];
  exportHistory?: ExportRecord[];
}

export interface ExportRecord {
  format: 'pdf' | 'docx' | 'html' | 'json';
  exportedAt: Date;
  fileUrl?: string;
  fileSize?: number;
}

export interface PRDContent extends ArtifactContent {
  problemStatement: string;
  goals: string[];
  userStories: UserStory[];
  acceptanceCriteria: string[];
  technicalRequirements?: string[];
  successMetrics: string[];
  timeline?: string;
  dependencies?: string[];
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  storyPoints?: number;
}

export interface RoadmapContent extends ArtifactContent {
  timeline: RoadmapItem[];
  themes: string[];
  milestones: Milestone[];
  currentPhase: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  startWeek: number;
  endWeek: number;
  status: 'completed' | 'in-progress' | 'planned' | 'delayed';
  dependencies: string[];
  theme: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetWeek: number;
  status: 'achieved' | 'at-risk' | 'missed' | 'pending';
  criteria: string[];
}

export interface StakeholderUpdateContent extends ArtifactContent {
  period: string;
  highlights: string[];
  metrics: MetricSnapshot[];
  risks: RiskItem[];
  upcomingWork: string[];
  decisionsMade: string[];
}

export interface MetricSnapshot {
  name: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  target?: string;
  status: 'exceeded' | 'on-track' | 'at-risk' | 'missed';
}

export interface RiskItem {
  id: string;
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
  status: 'active' | 'mitigated' | 'accepted';
}

export interface RetrospectiveContent extends ArtifactContent {
  period: string;
  whatWentWell: string[];
  whatCouldBeBetter: string[];
  actionItems: ActionItem[];
  metrics: RetrospectiveMetrics;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  dueDate?: string;
  status: 'open' | 'in-progress' | 'completed';
}

export interface RetrospectiveMetrics {
  velocity: number;
  bugsFound: number;
  teamMorale: number;
  stakeholderSatisfaction: number;
}

export interface RiskAssessmentContent extends ArtifactContent {
  assessmentDate: string;
  overallRiskLevel: 'critical' | 'high' | 'medium' | 'low';
  risks: DetailedRisk[];
  mitigationStrategies: string[];
  contingencyPlans: string[];
}

export interface DetailedRisk extends RiskItem {
  category: 'technical' | 'business' | 'stakeholder' | 'resource' | 'schedule';
  identifiedWeek: number;
  owner: string;
  lastReviewed: string;
  history?: RiskHistory[];
}

export interface RiskHistory {
  week: number;
  probability: string;
  impact: string;
  notes: string;
}

export interface DecisionLogContent extends ArtifactContent {
  decisions: LoggedDecision[];
}

export interface LoggedDecision {
  id: string;
  week: number;
  date: string;
  title: string;
  context: string;
  options: DecisionOption[];
  selectedOption: string;
  rationale: string;
  outcome?: string;
  stakeholders: string[];
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
  risk: 'high' | 'medium' | 'low';
}

export interface ProjectCharterContent extends ArtifactContent {
  projectName: string;
  projectManager: string;
  startDate: string;
  endDate: string;
  budget: string;
  objectives: string[];
  scope: string;
  stakeholders: string[];
  deliverables: string[];
  successCriteria: string[];
  assumptions: string[];
  constraints: string[];
}

export interface ArtifactTemplate {
  id: string;
  type: ArtifactType;
  name: string;
  description: string;
  sections: TemplateSection[];
  defaultData?: Record<string, unknown>;
}

export interface TemplateSection {
  id: string;
  title: string;
  placeholder: string;
  type: 'text' | 'list' | 'table' | 'chart';
  required: boolean;
  hint?: string;
}

export const ARTIFACT_TEMPLATES: ArtifactTemplate[] = [
  {
    id: 'prd-template',
    type: 'prd',
    name: 'Product Requirements Document',
    description: 'Comprehensive PRD with user stories, acceptance criteria, and success metrics',
    sections: [
      { id: 'problem', title: 'Problem Statement', placeholder: 'What problem are we solving?', type: 'text', required: true },
      { id: 'goals', title: 'Goals & Objectives', placeholder: 'What are we trying to achieve?', type: 'list', required: true },
      { id: 'user-stories', title: 'User Stories', placeholder: 'As a [user], I want [feature] so that [benefit]', type: 'list', required: true },
      { id: 'acceptance', title: 'Acceptance Criteria', placeholder: 'Define when this is complete', type: 'list', required: true },
      { id: 'success-metrics', title: 'Success Metrics', placeholder: 'How will we measure success?', type: 'list', required: true },
      { id: 'timeline', title: 'Timeline', placeholder: 'Key milestones and dates', type: 'text', required: false },
    ]
  },
  {
    id: 'roadmap-template',
    type: 'roadmap',
    name: 'Product Roadmap',
    description: 'Visual timeline showing features, milestones, and strategic initiatives',
    sections: [
      { id: 'themes', title: 'Strategic Themes', placeholder: 'What are the major initiatives?', type: 'list', required: true },
      { id: 'timeline', title: 'Timeline Overview', placeholder: 'Key phases and deliverables', type: 'table', required: true },
      { id: 'milestones', title: 'Key Milestones', placeholder: 'Critical checkpoints', type: 'list', required: true },
      { id: 'dependencies', title: 'Dependencies', placeholder: 'What needs to happen first?', type: 'list', required: false },
    ]
  },
  {
    id: 'stakeholder-template',
    type: 'stakeholder_update',
    name: 'Stakeholder Update',
    description: 'Status report for executives and stakeholders',
    sections: [
      { id: 'highlights', title: 'Key Highlights', placeholder: 'Major accomplishments this period', type: 'list', required: true },
      { id: 'metrics', title: 'Key Metrics', placeholder: 'Dashboard of important numbers', type: 'table', required: true },
      { id: 'risks', title: 'Risks & Mitigations', placeholder: 'What could go wrong?', type: 'list', required: true },
      { id: 'upcoming', title: 'Upcoming Work', placeholder: 'What\'s next?', type: 'list', required: true },
    ]
  },
  {
    id: 'retrospective-template',
    type: 'retrospective',
    name: 'Sprint/Phase Retrospective',
    description: 'Team reflection on what went well and areas for improvement',
    sections: [
      { id: 'went-well', title: 'What Went Well', placeholder: 'Celebrate the wins', type: 'list', required: true },
      { id: 'improvements', title: 'What Could Be Better', placeholder: 'Identify improvement areas', type: 'list', required: true },
      { id: 'action-items', title: 'Action Items', placeholder: 'Specific improvements to make', type: 'list', required: true },
      { id: 'metrics', title: 'Team Metrics', placeholder: 'Velocity, quality, morale', type: 'text', required: false },
    ]
  },
  {
    id: 'risk-template',
    type: 'risk_assessment',
    name: 'Risk Assessment Matrix',
    description: 'Comprehensive risk analysis with mitigation strategies',
    sections: [
      { id: 'overview', title: 'Risk Overview', placeholder: 'Summary of current risk landscape', type: 'text', required: true },
      { id: 'risks', title: 'Identified Risks', placeholder: 'List all potential risks', type: 'table', required: true },
      { id: 'mitigation', title: 'Mitigation Strategies', placeholder: 'How we\'ll reduce risks', type: 'list', required: true },
      { id: 'contingency', title: 'Contingency Plans', placeholder: 'What if the risk materializes?', type: 'list', required: true },
    ]
  },
  // ============================================================================
  // BRAND DESIGN ARTIFACT TEMPLATES
  // ============================================================================
  {
    id: 'moodboard-template',
    type: 'moodboard',
    name: 'Brand Moodboard',
    description: 'Visual inspiration collection for brand direction',
    sections: [
      { id: 'overview', title: 'Mood Overview', placeholder: 'Describe the overall vibe and feeling', type: 'text', required: true },
      { id: 'color-direction', title: 'Color Direction', placeholder: 'Primary color themes and emotions', type: 'text', required: true },
      { id: 'typography', title: 'Typography Inspiration', placeholder: 'Font styles and vibes', type: 'list', required: false },
      { id: 'imagery', title: 'Imagery References', placeholder: 'Visual inspiration images', type: 'list', required: true },
      { id: 'competitors', title: 'Competitor References', placeholder: 'What are competitors doing?', type: 'list', required: false },
      { id: 'gen-z-insights', title: 'Gen Z Alignment', placeholder: 'How this connects with target audience', type: 'text', required: true },
    ]
  },
  {
    id: 'color-palette-template',
    type: 'color_palette',
    name: 'Brand Color Palette',
    description: 'Official brand colors with HEX/RGB codes and usage guidelines',
    sections: [
      { id: 'primary', title: 'Primary Colors', placeholder: 'Main brand colors with HEX codes', type: 'table', required: true },
      { id: 'secondary', title: 'Secondary Colors', placeholder: 'Supporting colors', type: 'table', required: true },
      { id: 'accent', title: 'Accent Colors', placeholder: 'Highlight and CTA colors', type: 'table', required: false },
      { id: 'neutral', title: 'Neutral Colors', placeholder: 'Backgrounds, text colors', type: 'table', required: false },
      { id: 'psychology', title: 'Color Psychology', placeholder: 'Why these colors resonate with Gen Z', type: 'text', required: true },
      { id: 'accessibility', title: 'Accessibility Notes', placeholder: 'Contrast ratios and usage', type: 'text', required: true },
    ]
  },
  {
    id: 'social-assets-template',
    type: 'social_assets',
    name: 'Social Media Asset Pack',
    description: 'Collection of social media creatives for campaign',
    sections: [
      { id: 'instagram-feed', title: 'Instagram Feed Posts', placeholder: 'Number and specs', type: 'table', required: true },
      { id: 'instagram-stories', title: 'Instagram Stories', placeholder: 'Story formats and specs', type: 'table', required: false },
      { id: 'tiktok', title: 'TikTok Templates', placeholder: 'Video template specs', type: 'table', required: false },
      { id: 'facebook', title: 'Facebook Assets', placeholder: 'Feed and ad formats', type: 'table', required: false },
      { id: 'guidelines', title: 'Usage Guidelines', placeholder: 'Do and donts for each platform', type: 'text', required: true },
      { id: 'brand-voice', title: 'Copy Guidelines', placeholder: 'Tone of voice for each platform', type: 'text', required: true },
    ]
  },
  {
    id: 'meta-campaign-template',
    type: 'meta_campaign',
    name: 'Meta Advertising Campaign',
    description: 'Meta campaign setup with performance tracking',
    sections: [
      { id: 'campaign-objective', title: 'Campaign Objective', placeholder: 'Brand awareness, traffic, conversions?', type: 'text', required: true },
      { id: 'targeting', title: 'Audience Targeting', placeholder: 'Demographics, interests, behaviors', type: 'text', required: true },
      { id: 'budget', title: 'Budget & Schedule', placeholder: 'Daily budget, duration, pacing', type: 'table', required: true },
      { id: 'creatives', title: 'Creative Variants', placeholder: 'Ad variations for testing', type: 'table', required: true },
      { id: 'placements', title: 'Placements', placeholder: 'Feed, stories, reels, audience network', type: 'list', required: true },
      { id: 'tracking', title: 'Tracking & KPIs', placeholder: 'Metrics to monitor', type: 'list', required: true },
    ]
  },
  {
    id: 'brand-guide-template',
    type: 'brand_guide',
    name: 'Brand Style Guide',
    description: 'Comprehensive brand identity documentation',
    sections: [
      { id: 'brand-overview', title: 'Brand Overview', placeholder: 'Mission, vision, values', type: 'text', required: true },
      { id: 'logo-usage', title: 'Logo Usage', placeholder: 'Clear space, minimum size, do/donts', type: 'text', required: true },
      { id: 'color-system', title: 'Color System', placeholder: 'Complete color palette reference', type: 'text', required: true },
      { id: 'typography', title: 'Typography System', placeholder: 'Font families, sizes, weights', type: 'text', required: true },
      { id: 'imagery', title: 'Photography & Imagery', placeholder: 'Style guidelines for photos', type: 'text', required: false },
      { id: 'voice', title: 'Tone of Voice', placeholder: 'How we speak to audiences', type: 'text', required: true },
      { id: 'applications', title: 'Application Examples', placeholder: 'Mockups showing usage', type: 'text', required: false },
    ]
  },
  {
    id: 'video-storyboard-template',
    type: 'video_storyboard',
    name: 'Video Campaign Storyboard',
    description: 'Video concept development and storyboard',
    sections: [
      { id: 'concept', title: 'Video Concept', placeholder: 'High-level idea and message', type: 'text', required: true },
      { id: 'target-duration', title: 'Target Duration', placeholder: '15s, 30s, 60s', type: 'text', required: true },
      { id: 'scenes', title: 'Scene Breakdown', placeholder: 'Frame-by-frame description', type: 'table', required: true },
      { id: 'script', title: 'Script/S VO', placeholder: 'Narration and dialogue', type: 'text', required: false },
      { id: 'music', title: 'Music & Sound', placeholder: 'Audio direction', type: 'text', required: false },
      { id: 'cta', title: 'Call to Action', placeholder: 'What should viewers do?', type: 'text', required: true },
    ]
  },
  {
    id: 'ooh-mockup-template',
    type: 'ooh_mockup',
    name: 'Out-of-Home Advertising Mockups',
    description: 'OOH creative specifications and mockups',
    sections: [
      { id: 'placements', title: 'Placement Types', placeholder: 'Billboard, transit, digital signage', type: 'list', required: true },
      { id: 'specs', title: 'Specifications', placeholder: 'Sizes, formats, resolution', type: 'table', required: true },
      { id: 'mockups', title: 'Visual Mockups', placeholder: 'Design mockups for each placement', type: 'list', required: true },
      { id: 'message', title: 'Key Message', placeholder: 'Simplified messaging for OOH', type: 'text', required: true },
    ]
  },
  {
    id: 'ad-variants-template',
    type: 'ad_variants',
    name: 'Ad Creative Variants',
    description: 'A/B test variants for advertising optimization',
    sections: [
      { id: 'test-hypothesis', title: 'Test Hypothesis', placeholder: 'What are we testing?', type: 'text', required: true },
      { id: 'variant-a', title: 'Variant A (Control)', placeholder: 'Current/baseline version', type: 'text', required: true },
      { id: 'variant-b', title: 'Variant B (Test)', placeholder: 'New version being tested', type: 'text', required: true },
      { id: 'success-metrics', title: 'Success Metrics', placeholder: 'How we measure winner', type: 'list', required: true },
      { id: 'sample-size', title: 'Sample Size', placeholder: 'Minimum impressions per variant', type: 'text', required: false },
    ]
  },
];

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  prd: 'Product Requirements',
  roadmap: 'Product Roadmap',
  stakeholder_update: 'Stakeholder Update',
  retrospective: 'Retrospective',
  risk_assessment: 'Risk Assessment',
  user_research: 'User Research',
  metrics_report: 'Metrics Report',
  decision_log: 'Decision Log',
  project_charter: 'Project Charter',
  // Brand Design types
  moodboard: 'Moodboard',
  color_palette: 'Color Palette',
  logo: 'Logo Variants',
  social_assets: 'Social Media Assets',
  meta_campaign: 'Meta Campaign',
  brand_guide: 'Brand Style Guide',
  video_storyboard: 'Video Storyboard',
  ooh_mockup: 'OOH Mockups',
  ad_variants: 'Ad Variants',
};

export const ARTIFACT_TYPE_ICONS: Record<ArtifactType, string> = {
  prd: '📋',
  roadmap: '🗺️',
  stakeholder_update: '📊',
  retrospective: '🔄',
  risk_assessment: '⚠️',
  user_research: '👥',
  metrics_report: '📈',
  decision_log: '✅',
  project_charter: '📜',
  // Brand Design types
  moodboard: '🎨',
  color_palette: '🌈',
  logo: '🏷️',
  social_assets: '📱',
  meta_campaign: '📢',
  brand_guide: '📖',
  video_storyboard: '🎬',
  ooh_mockup: '🏙️',
  ad_variants: '🎯',
};