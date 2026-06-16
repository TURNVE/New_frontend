import type { Scenario, Phase, ScenarioAction, TimelineEvent, StakeholderConfig } from '../core/SimulationEngine';
import type { GroundTruthState } from '../evaluation/GroundTruthEngine';

export const BRAND_01_ID = 'brand-01';

export interface BrandColorPalette {
  id: string;
  name: string;
  primaryColors: { name: string; hex: string; rgb: string; usage: string }[];
  secondaryColors: { name: string; hex: string; rgb: string; usage: string }[];
  accentColors: { name: string; hex: string; rgb: string; usage: string }[];
}

export interface MetaAdStats {
  campaignId: string;
  campaignName: string;
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  roas: number;
  frequency: number;
  engagementRate: number;
  adSets: {
    name: string;
    objective: string;
    impressions: number;
    engagement: number;
    clicks: number;
  }[];
  demographics: {
    age18_24: number;
    age25_34: number;
    age35_44: number;
    age45_plus: number;
  };
}

export interface DesignArtifact {
  id: string;
  type: 'moodboard' | 'color-palette' | 'logo' | 'social-assets' | 'meta-campaign' | 'brand-guide';
  title: string;
  description: string;
  content: Record<string, unknown>;
  thumbnail?: string;
  submitted: boolean;
  submittedAt?: Date;
  qualityScore?: number;
  feedback?: string;
}

export const brand01InitialMetaStats: MetaAdStats = {
  campaignId: 'camp-brand-launch-001',
  campaignName: 'Nike Vision Gen Z Launch',
  objective: 'Brand Awareness',
  budget: 25000,
  spent: 0,
  impressions: 0,
  reach: 0,
  clicks: 0,
  ctr: 0,
  cpm: 0,
  cpc: 0,
  roas: 0,
  frequency: 0,
  engagementRate: 0,
  adSets: [
    { name: 'Instagram Carousel - Gen Z', objective: 'Brand Awareness', impressions: 0, engagement: 0, clicks: 0 },
    { name: 'TikTok Video Template', objective: 'Video Views', impressions: 0, engagement: 0, clicks: 0 },
    { name: 'Facebook Feed - Lookalike', objective: 'Traffic', impressions: 0, engagement: 0, clicks: 0 },
  ],
  demographics: { age18_24: 0, age25_34: 0, age35_44: 0, age45_plus: 0 },
};

export const brand01TargetMetrics = {
  brandSentiment: { target: 70, current: 45 },
  engagementRate: { target: 8.0, current: 4.2 },
  roas: { target: 2.5, current: 0 },
  brandRecall: { target: 15, current: 0 },
  socialEngagement: { target: 8, current: 3.5 },
};

export const brand01GenZColorPreferences = {
  preferred: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
  avoid: ['#8B4513', '#A0522D', '#BC8F8F', '#F5F5DC'],
  psychology: {
    energy: ['#FF6B6B', '#FF4757', '#FF6348'],
    authenticity: ['#4ECDC4', '#45B7D1', '#26DE81'],
    innovation: ['#9B59B6', '#8E44AD', '#DDA0DD'],
    trust: ['#3498DB', '#2980B9', '#1ABC9C'],
  },
};

export const brand01InitialState = {
  week: 1,
  totalWeeks: 6,
  currentPhaseId: 'phase-1',
  phaseProgress: 0,
  progress: 0,
  budget: 85000,
  initialBudget: 85000,
  teamMorale: 75,
  riskLevel: 20,
  stakeholderTrust: 65,
  brandSentiment: 45,
  designProgress: 0,
  metaCampaignActive: false,
  metaStats: brand01InitialMetaStats,
  submittedWork: [] as DesignArtifact[],
  company: { name: 'Nike Vision', mission: 'Empowering Gen Z athletes' },
  metrics: {
    brandSentiment: 45,
    engagementRate: 4.2,
    socialReach: 120000,
    brandRecall: 0,
  },
  stakeholders: [
    { id: 'creative_director', name: 'Alex Rivera', role: 'Creative Director', department: 'Creative', influence: 9, satisfaction: 70, communicationStyle: 'direct' as const, concerns: ['brand_consistency', 'gen_z_appeal'], priorities: ['innovative_design'] },
    { id: 'marketing_lead', name: 'Jordan Chen', role: 'Marketing Lead', department: 'Marketing', influence: 8, satisfaction: 65, communicationStyle: 'formal' as const, concerns: ['roi', 'campaign_performance'], priorities: ['roas', 'engagement'] },
    { id: 'brand_strategist', name: 'Sam Patel', role: 'Brand Strategist', department: 'Brand', influence: 7, satisfaction: 60, communicationStyle: 'diplomatic' as const, concerns: ['brand_equity', 'positioning'], priorities: ['market_position'] },
    { id: 'client', name: 'Nike Brand Team', role: 'Client', department: 'External', influence: 10, satisfaction: 50, communicationStyle: 'direct' as const, concerns: ['launch_timeline', 'gen_z_resonance'], priorities: ['brand_refresh'] },
  ],
  signals: [],
  decisionsMade: [],
  timeline: new Date(),
  startedAt: new Date(),
};

export const brand01GroundTruth: GroundTruthState = {
  rootCauses: {
    'rc-1': {
      id: 'rc-1',
      name: 'Brand Perception Gap - Gen Z disconnect',
      weight: 0.40,
      observableSignals: ['Social media engagement decline', 'Survey feedback from Gen Z focus groups'],
      hiddenSignals: ['Competitor brand sentiment rising', 'Purchase intent data showing decline'],
    },
    'rc-2': {
      id: 'rc-2',
      name: 'Visual Identity Inconsistency across channels',
      weight: 0.25,
      observableSignals: ['Mixed feedback on brand cohesion', 'Internal design audit showing 12 different color usages'],
      hiddenSignals: ['Regional market brand variance', 'Partner brand extensions diverging'],
    },
    'rc-3': {
      id: 'rc-3',
      name: 'Advertising ROI Decline - Meta campaign performance',
      weight: 0.20,
      observableSignals: ['Meta Ads ROAS dropped from 3.2x to 1.8x', 'CPM increased 40%'],
      hiddenSignals: ['Ad creative fatigue signals', 'Audience saturation in 25-34 demographic'],
    },
    'rc-4': {
      id: 'rc-4',
      name: 'Competitor brand refresh gaining traction',
      weight: 0.15,
      observableSignals: ['Competitor social mentions up 60%', 'Share of voice declining'],
      hiddenSignals: ['Influencer partnerships increasing', 'Celebrity endorsement rumors'],
    },
  },
  constraints: {
    'timeline': {
      id: 'timeline',
      name: '6 weeks to brand launch',
      severity: 85,
      affectedStakeholders: ['client', 'creative_director', 'marketing_lead'],
      isBlocker: true,
    },
    'budget': {
      id: 'budget',
      name: '$85K creative budget',
      severity: 70,
      affectedStakeholders: ['marketing_lead', 'client'],
      isBlocker: false,
    },
    'brand-assets': {
      id: 'brand-assets',
      name: 'Must preserve Swoosh logo core identity',
      severity: 50,
      affectedStakeholders: ['client', 'brand_strategist'],
      isBlocker: false,
    },
    'legal-approval': {
      id: 'legal-approval',
      name: 'All final assets require client sign-off',
      severity: 60,
      affectedStakeholders: ['client'],
      isBlocker: true,
    },
  },
  causalGraph: [
    { from: 'rc-1', to: 'brand_sentiment', strength: 0.85 },
    { from: 'rc-1', to: 'social_engagement', strength: 0.75 },
    { from: 'rc-2', to: 'brand_recognition', strength: 0.70 },
    { from: 'rc-3', to: 'meta_roas', strength: 0.80 },
    { from: 'rc-4', to: 'market_share', strength: 0.65 },
  ],
  hiddenState: {
    stakeholderPrivateConcerns: {
      creative_director: ['Wants to push bold new direction', 'Fears being too conservative'],
      marketing_lead: ['Worried about ad fatigue', 'Needs quick wins for ROAS'],
      brand_strategist: ['Concerned about brand equity erosion', 'Wants heritage preserved'],
      client: ['Deadline is non-negotiable due to product launch', 'Board is watching closely'],
    },
    unrevealedData: {
      brand_sentiment: 'Gen Z actually responds to bold, vibrant colors - current palette too conservative',
      meta_roas: 'Creative fatigue is main driver - need new creative concepts, not just targeting changes',
    },
    systemVulnerabilities: [
      'No documented brand guidelines exist',
      'Design team using 3 different tools causing inconsistency',
      'Meta ad account has no recent A/B testing data',
    ],
  },
};

export interface BrandPhaseDetail {
  id: string;
  name: string;
  phaseNumber: 1 | 2 | 3 | 4 | 5 | 6;
  objective: string;
  situationContext: string;
  availableActions: string[];
  requiredArtifacts: string[];
  timeConstraints: string;
  unlockConditions: string;
  embeddedTension: string;
  qualityThresholds: {
    minProgress: number;
    maxRisk: number;
    minTrust: number;
    designQuality: number;
  };
}

export const brand01PhaseStructure: BrandPhaseDetail[] = [
  {
    id: 'phase-1',
    name: 'Brand Research & Discovery',
    phaseNumber: 1,
    objective: 'Understand current brand perception and Gen Z preferences',
    situationContext: 'You are the creative lead on the Nike Vision rebrand. Initial research shows Gen Z disconnect from current brand identity.',
    availableActions: ['review_brand_metrics', 'conduct_gen_z_research', 'analyze_competitors'],
    requiredArtifacts: ['Brand Perception Report', 'Competitor Analysis Matrix', 'Gen Z Insights Summary'],
    timeConstraints: 'Week 1 only',
    unlockConditions: 'Complete initial brand audit and competitor analysis',
    embeddedTension: 'Speed vs Depth - Quick insights needed but shallow research risks wrong creative direction',
    qualityThresholds: { minProgress: 15, maxRisk: 35, minTrust: 50, designQuality: 50 },
  },
  {
    id: 'phase-2',
    name: 'Moodboard & Visual Direction',
    phaseNumber: 2,
    objective: 'Define visual vibe, core colors, typography direction',
    situationContext: 'Research complete. Now need to synthesize findings into visual direction. Creative Director wants bold, innovative approach.',
    availableActions: ['create_moodboard', 'select_color_palette', 'define_typography', 'present_direction'],
    requiredArtifacts: ['Moodboard Collection', 'Color Palette Proposal', 'Typography Direction'],
    timeConstraints: 'Week 2',
    unlockConditions: 'Present visual direction to stakeholders',
    embeddedTension: 'Creative vision vs Stakeholder approval - Bold may be risky, safe may not move the needle',
    qualityThresholds: { minProgress: 30, maxRisk: 40, minTrust: 55, designQuality: 60 },
  },
  {
    id: 'phase-3',
    name: 'Brand Assets Development',
    phaseNumber: 3,
    objective: 'Create primary brand assets, color codes, logo variants',
    situationContext: 'Visual direction approved. Now build actual assets. Color codes must be finalized this week.',
    availableActions: ['refine_color_codes', 'create_logo_variants', 'design_brand_assets', 'draft_style_guide'],
    requiredArtifacts: ['Official Color Palette (HEX codes)', 'Logo Variants', 'Brand Assets Package', 'Draft Style Guide'],
    timeConstraints: 'Week 3-4 - Color submission deadline',
    unlockConditions: 'Submit color palette with valid HEX codes',
    embeddedTension: 'Perfection vs Timeline - Colors must resonate with Gen Z but also be producible',
    qualityThresholds: { minProgress: 50, maxRisk: 35, minTrust: 60, designQuality: 70 },
  },
  {
    id: 'phase-4',
    name: 'Campaign Creative Development',
    phaseNumber: 4,
    objective: 'Create social media assets, video storyboard, OOH mockups',
    situationContext: 'Brand assets locked. Now create campaign creative for social, video, and out-of-home.',
    availableActions: ['design_social_assets', 'create_video_storyboard', 'design_ooh_mockups', 'create_ad_variants'],
    requiredArtifacts: ['Social Media Asset Pack', 'Video Campaign Storyboard', 'OOH Mockups', 'Ad Creative Variants'],
    timeConstraints: 'Week 4-5',
    unlockConditions: 'Complete social media asset pack',
    embeddedTension: 'Volume vs Quality - Need enough assets for full campaign but each must be on-brand',
    qualityThresholds: { minProgress: 65, maxRisk: 30, minTrust: 65, designQuality: 75 },
  },
  {
    id: 'phase-5',
    name: 'Meta Advertising Setup',
    phaseNumber: 5,
    objective: 'Set up Meta advertising campaigns with performance tracking',
    situationContext: 'Creative assets ready. Marketing Lead wants to launch Meta campaigns to test performance before full launch.',
    availableActions: ['setup_meta_campaign', 'import_meta_stats', 'optimize_ad_creative', 'analyze_performance'],
    requiredArtifacts: ['Meta Campaign Strategy', 'Ad Performance Report', 'A/B Test Results', 'Optimization Recommendations'],
    timeConstraints: 'Week 5',
    unlockConditions: 'Import Meta campaign stats and analyze performance',
    embeddedTension: 'Testing vs Spending - Need data but budget is limited',
    qualityThresholds: { minProgress: 80, maxRisk: 35, minTrust: 60, designQuality: 70 },
  },
  {
    id: 'phase-6',
    name: 'Brand Book & Launch',
    phaseNumber: 6,
    objective: 'Finalize brand book and launch campaign',
    situationContext: 'All components ready. Need final brand book documentation and client sign-off for launch.',
    availableActions: ['finalize_brand_book', 'get_stakeholder_approval', 'prepare_launch', 'launch_campaign'],
    requiredArtifacts: ['Complete Brand Style Guide', 'Launch Checklist', 'Stakeholder Sign-off', 'Campaign Launch Report'],
    timeConstraints: 'Week 6 - FINAL',
    unlockConditions: 'All stakeholders approve final deliverables',
    embeddedTension: 'Scope creep vs Deadlines - Client may request changes but timeline is fixed',
    qualityThresholds: { minProgress: 100, maxRisk: 25, minTrust: 75, designQuality: 85 },
  },
];

export const brand01Phases: Phase[] = [
  { id: 'phase-1', name: 'Brand Research & Discovery', description: 'Understand current brand perception and Gen Z preferences', duration: 1, objectives: ['Review brand metrics', 'Conduct Gen Z research', 'Analyze competitors'], availableActions: ['review_brand_metrics', 'conduct_gen_z_research', 'analyze_competitors'], successCriteria: { minProgress: 15, maxRisk: 35, minTrust: 50 } },
  { id: 'phase-2', name: 'Moodboard & Visual Direction', description: 'Define visual vibe, core colors, typography direction', duration: 1, objectives: ['Create moodboard', 'Select color palette', 'Define typography'], availableActions: ['create_moodboard', 'select_color_palette', 'define_typography', 'present_direction'], successCriteria: { minProgress: 30, maxRisk: 40, minTrust: 55 } },
  { id: 'phase-3', name: 'Brand Assets Development', description: 'Create primary brand assets and color codes', duration: 2, objectives: ['Finalize color codes', 'Create logo variants', 'Draft style guide'], availableActions: ['refine_color_codes', 'create_logo_variants', 'design_brand_assets', 'draft_style_guide'], successCriteria: { minProgress: 50, maxRisk: 35, minTrust: 60 } },
  { id: 'phase-4', name: 'Campaign Creative Development', description: 'Create social media assets and campaign creative', duration: 2, objectives: ['Design social assets', 'Create video storyboard', 'Design OOH mockups'], availableActions: ['design_social_assets', 'create_video_storyboard', 'design_ooh_mockups'], successCriteria: { minProgress: 65, maxRisk: 30, minTrust: 65 } },
  { id: 'phase-5', name: 'Meta Advertising Setup', description: 'Set up and track Meta advertising campaigns', duration: 1, objectives: ['Setup Meta campaign', 'Import stats', 'Optimize creative'], availableActions: ['setup_meta_campaign', 'import_meta_stats', 'optimize_ad_creative'], successCriteria: { minProgress: 80, maxRisk: 35, minTrust: 60 } },
  { id: 'phase-6', name: 'Brand Book & Launch', description: 'Finalize brand book and launch campaign', duration: 1, objectives: ['Finalize brand book', 'Get approval', 'Launch campaign'], availableActions: ['finalize_brand_book', 'get_stakeholder_approval', 'launch_campaign'], successCriteria: { minProgress: 100, maxRisk: 25, minTrust: 75 } },
];

export const brand01Actions: Record<string, ScenarioAction> = {
  review_brand_metrics: {
    id: 'review_brand_metrics',
    name: 'Review Brand Metrics',
    description: 'Analyze current brand sentiment, engagement data, and performance metrics',
    category: 'technical',
    urgency: 'high',
    choices: [
      { id: 'full-audit', label: 'Complete brand audit', description: 'Deep dive into all brand metrics and historical data', effects: { progress: 10, customMetrics: { brandInsight: 30, brandSentiment: 45 } }, feedback: 'Brand sentiment at 45% - below target. Gen Z engagement particularly weak.', risk: 2, timeCost: 1 },
      { id: 'focused-review', label: 'Focus on Gen Z metrics', description: 'Prioritize understanding Gen Z perception', effects: { progress: 8, customMetrics: { genZInsight: 35, brandSentiment: 43 } }, feedback: 'Gen Z sentiment: 38%. They want bold, authentic brands.', risk: 3, timeCost: 1 },
      { id: 'quick-dashboard', label: 'Quick dashboard review', description: 'Brief overview of available data', effects: { progress: 5 }, feedback: 'Key metrics: Engagement down 12%, Sentiment 45%.', risk: 5, timeCost: 0.5 },
    ],
  },
  conduct_gen_z_research: {
    id: 'conduct_gen_z_research',
    name: 'Conduct Gen Z Research',
    description: 'Research Gen Z preferences, color psychology, and brand expectations',
    category: 'technical',
    urgency: 'high',
    choices: [
      { id: 'focus-group', label: 'Virtual focus group ($5K)', description: 'Direct interviews with 20 Gen Z participants', effects: { budget: -5000, progress: 12, customMetrics: { genZInsight: 50, brandSentiment: 53 } }, feedback: 'Key insight: Gen Z prefers vibrant, bold colors. Sustainability messaging resonates.', risk: 2, timeCost: 2 },
      { id: 'survey', label: 'Online survey ($2K)', description: 'Quantitative survey with 200+ responses', effects: { budget: -2000, progress: 8, customMetrics: { genZInsight: 35, brandSentiment: 50 } }, feedback: 'Data shows preference for teal, coral, and bold accent colors.', risk: 3, timeCost: 1 },
      { id: 'desk-research', label: 'Desk research', description: 'Analyze existing studies and reports', effects: { progress: 5, customMetrics: { genZInsight: 20 } }, feedback: 'Industry reports confirm: bold, authentic brands winning with Gen Z.', risk: 5, timeCost: 0.5 },
    ],
  },
  analyze_competitors: {
    id: 'analyze_competitors',
    name: 'Analyze Competitors',
    description: 'Research competitor brand strategies and visual identities',
    category: 'technical',
    urgency: 'medium',
    choices: [
      { id: 'deep-competitor', label: 'Deep competitive analysis', description: 'Analyze 5 top competitors in detail', effects: { progress: 8, customMetrics: { competitorInsight: 30 } }, feedback: 'Competitors A and B recently refreshed with bolder palettes. Gap widening.', risk: 2, timeCost: 1 },
      { id: 'quick-competitor', label: 'Quick competitor scan', description: 'Review top 3 competitors', effects: { progress: 5, customMetrics: { competitorInsight: 15 } }, feedback: 'Key competitors using more vibrant palettes than us.', risk: 4, timeCost: 0.5 },
    ],
  },
  create_moodboard: {
    id: 'create_moodboard',
    name: 'Create Moodboard',
    description: 'Build visual moodboard with inspiration, colors, and typography',
    category: 'technical',
    urgency: 'high',
    choices: [
      { id: 'digital-moodboard', label: 'Figma/Canva moodboard', description: 'Create digital moodboard with design tools', effects: { progress: 15, customMetrics: { moodboardQuality: 35, designProgress: 25 } }, feedback: 'Moodboard shows bold, energetic direction with teal/coral palette.', risk: 2, timeCost: 1 },
      { id: 'physical-moodboard', label: 'Physical moodboard', description: 'Create physical collage with prints and samples', effects: { progress: 10, customMetrics: { moodboardQuality: 25, designProgress: 15 } }, feedback: 'Tactile approach but harder to share with remote team.', risk: 3, timeCost: 1.5 },
    ],
  },
  select_color_palette: {
    id: 'select_color_palette',
    name: 'Submit Color Palette',
    description: 'Define and submit official brand colors with HEX codes',
    category: 'technical',
    urgency: 'high',
    submitWork: true,
    showInCorner: true,
    choices: [
      { id: 'bold-palette', label: 'Bold Gen Z palette', description: 'Vibrant colors optimized for Gen Z appeal', effects: { progress: 15, customMetrics: { colorApproval: 45, brandSentiment: 10 } }, feedback: 'Colors submitted: #FF6B6B, #4ECDC4, #45B7D1 - Creative Director loves it!', risk: 3, timeCost: 1 },
      { id: 'balanced-palette', label: 'Balanced palette', description: 'Mix of bold and neutral tones', effects: { progress: 12, customMetrics: { colorApproval: 35, brandSentiment: 5 } }, feedback: 'Colors submitted: #3498DB, #2ECC71, #9B59B6 - Safe but solid.', risk: 2, timeCost: 1 },
      { id: 'conservative-palette', label: 'Conservative palette', description: 'Stick closer to current brand', effects: { progress: 8, customMetrics: { colorApproval: 25 } }, feedback: 'Colors submitted but may not move the needle on Gen Z appeal.', risk: 5, timeCost: 0.5 },
    ],
  },
  define_typography: {
    id: 'define_typography',
    name: 'Define Typography',
    description: 'Select and specify brand typography system',
    category: 'technical',
    urgency: 'medium',
    choices: [
      { id: 'bold-type', label: 'Bold, expressive type', description: 'Use bold, contemporary fonts', effects: { progress: 10, customMetrics: { typographyQuality: 30, designProgress: 15 } }, feedback: 'Typography direction: Modern sans-serif, bold weights for impact.', risk: 3, timeCost: 1 },
      { id: 'clean-type', label: 'Clean, minimal type', description: 'Focus on clarity and simplicity', effects: { progress: 8, customMetrics: { typographyQuality: 25, designProgress: 10 } }, feedback: 'Typography: Clean geometric sans-serif, good readability.', risk: 2, timeCost: 0.5 },
    ],
  },
  present_direction: {
    id: 'present_direction',
    name: 'Present to Stakeholders',
    description: 'Present visual direction to stakeholders for approval',
    category: 'communication',
    urgency: 'high',
    choices: [
      { id: 'bold-presentation', label: 'Present bold direction', description: 'Push for innovative, Gen Z-focused approach', effects: { progress: 10, stakeholderSatisfaction: { creative_director: 15, client: 5 }, customMetrics: { brandSentiment: 8 } }, feedback: 'Client excited but some concerns about risk. Wants to see options.', risk: 5, timeCost: 1 },
      { id: 'balanced-presentation', label: 'Present balanced approach', description: 'Offer moderate innovation with safety options', effects: { progress: 8, stakeholderSatisfaction: { client: 10, brand_strategist: 5 } }, feedback: 'Stakeholders approve moving forward with refinements.', risk: 3, timeCost: 1 },
    ],
  },
  refine_color_codes: {
    id: 'refine_color_codes',
    name: 'Refine Color Codes',
    description: 'Finalize brand colors with precise HEX/RGB values',
    category: 'technical',
    urgency: 'high',
    submitWork: true,
    showInCorner: true,
    choices: [
      { id: 'finalize-bold', label: 'Finalize bold palette', description: 'Lock in vibrant palette with all color variations', effects: { progress: 15, customMetrics: { colorQuality: 40, designProgress: 20 } }, feedback: 'Color codes finalized: Primary #FF6B6B, Secondary #4ECDC4. Full palette ready.', risk: 2, timeCost: 1 },
      { id: 'refine-existing', label: 'Refine existing choices', description: 'Make minor adjustments to approved colors', effects: { progress: 10, customMetrics: { colorQuality: 30, designProgress: 10 } }, feedback: 'Colors slightly adjusted. Still aligned with Gen Z strategy.', risk: 2, timeCost: 0.5 },
    ],
  },
  create_logo_variants: {
    id: 'create_logo_variants',
    name: 'Create Logo Variants',
    description: 'Design secondary marks and logo variations for different use cases',
    category: 'technical',
    urgency: 'medium',
    submitWork: true,
    showInCorner: true,
    choices: [
      { id: 'comprehensive-logo', label: 'Comprehensive logo system', description: 'Create full logo family (primary, secondary, icon, reversed)', effects: { progress: 15, customMetrics: { logoQuality: 35, designProgress: 20 } }, feedback: 'Logo variants complete: Primary, Icon, Wordmark, all colorways.', risk: 2, timeCost: 2 },
      { id: 'focused-logo', label: 'Key logo variants only', description: 'Focus on most essential variations', effects: { progress: 10, customMetrics: { logoQuality: 25, designProgress: 15 } }, feedback: 'Core variants done. Additional variations deferred to Phase 6.', risk: 3, timeCost: 1 },
    ],
  },
  design_brand_assets: {
    id: 'design_brand_assets',
    name: 'Design Brand Assets',
    description: 'Create supporting brand assets like patterns, icons, and graphics',
    category: 'technical',
    urgency: 'medium',
    submitWork: true,
    showInCorner: true,
    choices: [
      { id: 'full-asset-pack', label: 'Full asset package', description: 'Complete set of brand assets', effects: { progress: 15, customMetrics: { assetQuality: 35, designProgress: 20 } }, feedback: 'Asset pack complete: Patterns, icons, badges, graphic elements.', risk: 2, timeCost: 2 },
      { id: 'essential-assets', label: 'Essential assets only', description: 'Focus on must-have assets', effects: { progress: 10, customMetrics: { assetQuality: 25, designProgress: 10 } }, feedback: 'Core assets created. Nice-to-haves deferred.', risk: 3, timeCost: 1 },
    ],
  },
  draft_style_guide: {
    id: 'draft_style_guide',
    name: 'Draft Style Guide',
    description: 'Create preliminary style guide documentation',
    category: 'process',
    urgency: 'low',
    choices: [
      { id: 'comprehensive-guide', label: 'Comprehensive style guide', description: 'Detailed brand guidelines document', effects: { progress: 10, customMetrics: { guideQuality: 30 } }, feedback: 'Style guide draft covers logo, color, typography, tone of voice.', risk: 2, timeCost: 2 },
      { id: 'quick-guide', label: 'Quick reference guide', description: 'Essential guidelines only', effects: { progress: 5, customMetrics: { guideQuality: 15 } }, feedback: 'Quick reference created for team alignment.', risk: 3, timeCost: 1 },
    ],
  },
  design_social_assets: {
    id: 'design_social_assets',
    name: 'Design Social Media Assets',
    description: 'Create Instagram, TikTok, and other social media creative',
    category: 'technical',
    urgency: 'high',
    submitWork: true,
    showInCorner: true,
    choices: [
      { id: 'full-social-pack', label: 'Complete social pack', description: 'Full set of social media assets across platforms', effects: { progress: 20, customMetrics: { socialQuality: 40, designProgress: 25 } }, feedback: 'Social pack complete: 12 Instagram posts, 6 stories, TikTok templates.', risk: 2, timeCost: 2 },
      { id: 'instagram-focus', label: 'Instagram focused', description: 'Prioritize Instagram content', effects: { progress: 15, customMetrics: { socialQuality: 30, designProgress: 20 } }, feedback: 'Instagram content complete: Feed posts, carousel, stories.', risk: 2, timeCost: 1.5 },
      { id: 'tiktok-focus', label: 'TikTok focused', description: 'Prioritize TikTok content', effects: { progress: 15, customMetrics: { socialQuality: 30, designProgress: 20 } }, feedback: 'TikTok templates ready: Video concepts, sound sync, effects.', risk: 2, timeCost: 1.5 },
    ],
  },
  create_video_storyboard: {
    id: 'create_video_storyboard',
    name: 'Create Video Storyboard',
    description: 'Develop video campaign concepts and storyboards',
    category: 'technical',
    urgency: 'medium',
    choices: [
      { id: 'full-video', label: 'Full video campaign', description: 'Complete video strategy with multiple spots', effects: { progress: 15, customMetrics: { videoQuality: 35, designProgress: 15 } }, feedback: 'Video storyboards complete: Hero 30s, 3x 15s, UGC concepts.', risk: 2, timeCost: 2 },
      { id: 'key-videos', label: 'Key videos only', description: 'Focus on hero content', effects: { progress: 10, customMetrics: { videoQuality: 25, designProgress: 10 } }, feedback: 'Hero video storyboard complete.', risk: 3, timeCost: 1.5 },
    ],
  },
  design_ooh_mockups: {
    id: 'design_ooh_mockups',
    name: 'Design OOH Mockups',
    description: 'Create out-of-home advertising mockups',
    category: 'technical',
    urgency: 'low',
    submitWork: true,
    showInCorner: true,
    choices: [
      { id: 'full-ooh', label: 'Full OOH package', description: 'Billboards, transit, digital OOH', effects: { progress: 12, customMetrics: { oohQuality: 30, designProgress: 10 } }, feedback: 'OOH mockups ready: Billboard, bus shelter, metro panels.', risk: 2, timeCost: 2 },
      { id: 'digital-ooh', label: 'Digital OOH only', description: 'Focus on digital signage', effects: { progress: 8, customMetrics: { oohQuality: 20, designProgress: 5 } }, feedback: 'Digital OOH concepts complete.', risk: 3, timeCost: 1 },
    ],
  },
  create_ad_variants: {
    id: 'create_ad_variants',
    name: 'Create Ad Variants',
    description: 'Design multiple ad creative variants for testing',
    category: 'technical',
    urgency: 'medium',
    submitWork: true,
    choices: [
      { id: 'ab-testing', label: 'A/B testing variants', description: 'Create clear A/B test pairs', effects: { progress: 10, customMetrics: { abTestQuality: 30, designProgress: 10 } }, feedback: 'A/B test pairs ready: Color focus vs Product focus, Bold vs Minimal.', risk: 2, timeCost: 1.5 },
      { id: 'multi-variant', label: 'Multiple variants', description: 'Create many variations for optimization', effects: { progress: 15, customMetrics: { abTestQuality: 40, designProgress: 15 } }, feedback: '12 ad variants ready for Meta testing.', risk: 2, timeCost: 2 },
    ],
  },
  setup_meta_campaign: {
    id: 'setup_meta_campaign',
    name: 'Setup Meta Campaign',
    description: 'Configure Meta advertising campaign structure',
    category: 'resource',
    urgency: 'high',
    choices: [
      { id: 'full-campaign', label: 'Full campaign structure', description: 'Complete campaign with multiple ad sets', effects: { progress: 15, customMetrics: { campaignSetup: 40 }, metaCampaignActive: true }, feedback: 'Meta campaign structured: Brand Awareness, Traffic, Engagement objectives.', risk: 2, timeCost: 1.5 },
      { id: 'focused-campaign', label: 'Focused campaign', description: 'Single objective focus', effects: { progress: 10, customMetrics: { campaignSetup: 25 }, metaCampaignActive: true }, feedback: 'Campaign set up for Brand Awareness.', risk: 3, timeCost: 1 },
    ],
  },
  import_meta_stats: {
    id: 'import_meta_stats',
    name: 'Import Meta Stats',
    description: 'Import and analyze Meta campaign performance data',
    category: 'resource',
    urgency: 'high',
    showStats: true,
    choices: [
      { id: 'import-full', label: 'Import complete stats', description: 'Get full campaign performance data', effects: { progress: 20, customMetrics: { metaInsight: 50 } }, feedback: 'Stats imported! ROAS: 2.8x, CTR: 1.47%, Engagement: 8.2%. Exceeding targets!', risk: 2, timeCost: 1 },
      { id: 'import-focused', label: 'Import key metrics', description: 'Focus on ROAS and engagement', effects: { progress: 15, customMetrics: { metaInsight: 35 } }, feedback: 'Key metrics: ROAS 2.8x (target: 2.5x), Engagement 8.2% (target: 8%).', risk: 3, timeCost: 0.5 },
    ],
  },
  optimize_ad_creative: {
    id: 'optimize_ad_creative',
    name: 'Optimize Ad Creative',
    description: 'Use performance data to optimize ad creative',
    category: 'resource',
    urgency: 'medium',
    choices: [
      { id: 'data-driven-optimize', label: 'Data-driven optimization', description: 'Use stats to make creative decisions', effects: { progress: 15, customMetrics: { optimizationScore: 40 }, roas: 0.5 }, feedback: 'Insights: Carousel ads performing 40% better than single image.', risk: 2, timeCost: 1 },
      { id: 'intuitive-optimize', label: 'Intuitive adjustments', description: 'Use gut feeling to optimize', effects: { progress: 10, customMetrics: { optimizationScore: 25 } }, feedback: 'Adjusted based on Creative Director feedback. A/B test planned.', risk: 4, timeCost: 0.5 },
    ],
  },
  analyze_performance: {
    id: 'analyze_performance',
    name: 'Analyze Performance',
    description: 'Deep dive into campaign performance and recommendations',
    category: 'resource',
    urgency: 'low',
    choices: [
      { id: 'comprehensive-analysis', label: 'Full performance analysis', description: 'Complete analysis with recommendations', effects: { progress: 10, customMetrics: { analysisDepth: 35 } }, feedback: 'Recommendations: Increase budget on Carousel, test new CTA, refresh creative.', risk: 2, timeCost: 1 },
      { id: 'summary-analysis', label: 'Summary analysis', description: 'Key highlights only', effects: { progress: 5, customMetrics: { analysisDepth: 20 } }, feedback: 'Summary: Campaign performing above benchmark. Recommend scaling.', risk: 3, timeCost: 0.5 },
    ],
  },
  finalize_brand_book: {
    id: 'finalize_brand_book',
    name: 'Finalize Brand Book',
    description: 'Complete comprehensive brand style guide',
    category: 'process',
    urgency: 'high',
    submitWork: true,
    choices: [
      { id: 'complete-brand-book', label: 'Complete brand book', description: 'Full documentation of all brand standards', effects: { progress: 15, customMetrics: { brandBookQuality: 45, designProgress: 20 } }, feedback: 'Brand book complete! 48 pages covering all brand guidelines.', risk: 2, timeCost: 2 },
      { id: 'essential-brand-book', label: 'Essential brand guide', description: 'Core guidelines only', effects: { progress: 10, customMetrics: { brandBookQuality: 30, designProgress: 10 } }, feedback: 'Essential brand guide complete: 24 pages.', risk: 3, timeCost: 1.5 },
    ],
  },
  get_stakeholder_approval: {
    id: 'get_stakeholder_approval',
    name: 'Get Stakeholder Approval',
    description: 'Secure final approval from all stakeholders',
    category: 'communication',
    urgency: 'high',
    choices: [
      { id: 'full-approval', label: 'Full sign-off process', description: 'Get approval from all stakeholders', effects: { progress: 10, stakeholderSatisfaction: { client: 20, creative_director: 15 }, customMetrics: { designProgress: 10 } }, feedback: 'All stakeholders approved! Ready for launch.', risk: 3, timeCost: 1 },
      { id: 'key-approval', label: 'Key stakeholder approval', description: 'Prioritize client approval', effects: { progress: 8, stakeholderSatisfaction: { client: 15 } }, feedback: 'Client approved. Creative Director had minor notes - addressed.', risk: 4, timeCost: 0.5 },
    ],
  },
  prepare_launch: {
    id: 'prepare_launch',
    name: 'Prepare Launch',
    description: 'Final preparations for campaign launch',
    category: 'process',
    urgency: 'high',
    choices: [
      { id: 'comprehensive-launch', label: 'Full launch prep', description: 'Complete launch checklist', effects: { progress: 10, customMetrics: { launchReadiness: 40 } }, feedback: 'Launch checklist complete: Assets uploaded, campaigns scheduled, team briefed.', risk: 2, timeCost: 1 },
      { id: 'essential-launch', label: 'Essential prep only', description: 'Core launch items', effects: { progress: 5, customMetrics: { launchReadiness: 25 } }, feedback: 'Core prep done. Fine-tuning can happen Day 1.', risk: 4, timeCost: 0.5 },
    ],
  },
  launch_campaign: {
    id: 'launch_campaign',
    name: 'Launch Campaign',
    description: 'Execute the brand launch and campaign rollout',
    category: 'process',
    urgency: 'high',
    choices: [
      { id: 'full-launch', label: 'Full launch', description: 'Launch all components simultaneously', effects: { progress: 25, customMetrics: { designProgress: 30, brandSentiment: 15 } }, feedback: 'LAUNCH COMPLETE! Brand refresh live across all channels.', risk: 5, timeCost: 1 },
      { id: 'phased-launch', label: 'Phased launch', description: 'Staggered rollout', effects: { progress: 20, customMetrics: { designProgress: 25, brandSentiment: 10 } }, feedback: 'Phase 1 complete. Phase 2 scheduled for Week 2.', risk: 3, timeCost: 1 },
    ],
  },
};

export const brand01Stakeholders: StakeholderConfig[] = [
  { id: 'creative_director', name: 'Alex Rivera', role: 'Creative Director', department: 'Creative', influence: 9, initialSatisfaction: 70, communicationStyle: 'direct', concerns: ['brand_consistency', 'gen_z_appeal'], priorities: ['innovative_design'], relationships: [] },
  { id: 'marketing_lead', name: 'Jordan Chen', role: 'Marketing Lead', department: 'Marketing', influence: 8, initialSatisfaction: 65, communicationStyle: 'formal', concerns: ['roi', 'campaign_performance'], priorities: ['roas', 'engagement'], relationships: [] },
  { id: 'brand_strategist', name: 'Sam Patel', role: 'Brand Strategist', department: 'Brand', influence: 7, initialSatisfaction: 60, communicationStyle: 'diplomatic', concerns: ['brand_equity', 'positioning'], priorities: ['market_position'], relationships: [] },
  { id: 'client', name: 'Nike Brand Team', role: 'Client', department: 'External', influence: 10, initialSatisfaction: 50, communicationStyle: 'direct', concerns: ['launch_timeline', 'gen_z_resonance'], priorities: ['brand_refresh'], relationships: [] },
];

export const brand01TimelineEvents: TimelineEvent[] = [
  { week: 2, type: 'milestone', title: 'Visual Direction Review', description: 'Stakeholder presentation of moodboard and color direction', impact: { stakeholderSatisfaction: { creative_director: 10, client: 5 } }, triggered: false },
  { week: 3, type: 'milestone', title: 'Color Submission Deadline', description: 'Official color palette must be finalized', impact: { customMetrics: { colorLock: 1 } }, triggered: false },
  { week: 4, type: 'milestone', title: 'Assets Complete', description: 'All brand assets and social creative should be ready', impact: { customMetrics: { assetsReady: 1 } }, triggered: false },
  { week: 5, type: 'opportunity', title: 'Meta Campaign Launch', description: 'Test campaigns with new creative', impact: { customMetrics: { metaLive: 1 }, budget: -5000 }, triggered: false },
  { week: 6, type: 'milestone', title: 'Final Delivery', description: 'Complete brand book and launch campaign', impact: { customMetrics: { launchComplete: 1 }, stakeholderSatisfaction: { client: 20 } }, triggered: false },
];

// ============================================================================
// ARTIFACT EVALUATION RULES
// ============================================================================

export interface BrandArtifactEvaluationRule {
  id: string;
  artifactIds: string[];
  condition: string;
  consequence: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const brand01ArtifactConsequenceRules: BrandArtifactEvaluationRule[] = [
  // Color Palette Rules
  { id: 'rule-color-1', artifactIds: ['color-palette'], condition: 'IF less than 3 primary colors', consequence: 'Creative Director questions depth, stakeholder trust -10', severity: 'medium' },
  { id: 'rule-color-2', artifactIds: ['color-palette'], condition: 'IF colors not valid HEX format', consequence: 'System rejects submission, must resubmit', severity: 'high' },
  { id: 'rule-color-3', artifactIds: ['color-palette'], condition: 'IF colors not Gen Z appealing (no vibrant tones)', consequence: 'Brand sentiment decreases, Marketing Lead concerns increase', severity: 'high' },
  { id: 'rule-color-4', artifactIds: ['color-palette'], condition: 'IF colors conflict with brand heritage', consequence: 'Client rejects palette, must restart color selection', severity: 'critical' },
  
  // Social Assets Rules
  { id: 'rule-social-1', artifactIds: ['social-assets'], condition: 'IF fewer than 6 assets submitted', consequence: 'Insufficient coverage for campaign launch', severity: 'medium' },
  { id: 'rule-social-2', artifactIds: ['social-assets'], condition: 'IF assets not platform-optimized (wrong dimensions)', consequence: 'Poor campaign performance, Meta CPM increases', severity: 'high' },
  { id: 'rule-social-3', artifactIds: ['social-assets'], condition: 'IF design quality below threshold', consequence: 'Creative Director rejects, must revise', severity: 'medium' },
  
  // Meta Campaign Rules
  { id: 'rule-meta-1', artifactIds: ['meta-campaign'], condition: 'IF ROAS below 1.5x', consequence: 'Marketing Lead escalates, budget review required', severity: 'critical' },
  { id: 'rule-meta-2', artifactIds: ['meta-campaign'], condition: 'IF CTR below 1%', consequence: 'Creative fatigue detected, new creative required', severity: 'high' },
  { id: 'rule-meta-3', artifactIds: ['meta-campaign'], condition: 'IF campaign not set up by Week 5', consequence: 'No performance data for optimization, launch readiness impacted', severity: 'high' },
  
  // Brand Guide Rules
  { id: 'rule-guide-1', artifactIds: ['brand-guide'], condition: 'IF missing logo usage guidelines', consequence: 'Client rejects brand book, brand inconsistency risk', severity: 'high' },
  { id: 'rule-guide-2', artifactIds: ['brand-guide'], condition: 'IF missing color accessibility info', consequence: 'Legal concerns, potential ADA issues', severity: 'critical' },
  
  // Moodboard Rules
  { id: 'rule-mood-1', artifactIds: ['moodboard'], condition: 'IF moodboard has inconsistent direction', consequence: 'Stakeholders confused, approval delayed', severity: 'medium' },
  { id: 'rule-mood-2', artifactIds: ['moodboard'], condition: 'IF no Gen Z reference imagery', consequence: 'Creative Director questions strategic alignment', severity: 'medium' },
];

// ============================================================================
// THINKING & REASONING LAYER
// ============================================================================

export interface BrandThinkingMetrics {
  coherenceScore: number;
  calibrationScore: number;
  contradictionCount: number;
  reasoningDepthScore: number;
}

export const brand01ThinkingSystem = {
  claimTracking: {
    phase1: [] as string[],
    phase2: [] as string[],
    phase3: [] as string[],
    phase4: [] as string[],
    phase5: [] as string[],
    phase6: [] as string[],
  },
  
  causalChains: [] as { cause: string; effect: string; phase: number; artifactId: string }[],
  
  coherenceScoring: {
    claimsLinkedAcrossPhases: 0.3,
    resolvedContradictions: 0.25,
    evidenceBackedReasoning: 0.25,
    acknowledgedUncertainties: 0.2,
  },
  
  beliefReality: {
    confidenceLevels: ['speculative', 'confident', 'highly_confident', 'certain'] as const,
    evidenceQualityRanking: ['anecdotal', 'qualitative', 'quantitative', 'definitive'] as const,
    
    calibrationLogic: (confidence: string, evidence: string) => {
      const confIndex = { speculative: 0, confident: 1, highly_confident: 2, certain: 3 };
      const evidIndex = { anecdotal: 0, qualitative: 1, quantitative: 2, definitive: 3 };
      const diff = confIndex[confidence as keyof typeof confIndex] - evidIndex[evidence as keyof typeof evidIndex];
      if (diff > 1) return 'overconfident';
      if (diff < -1) return 'underconfident';
      return 'calibrated';
    },
    
    miscalibrationDetection: {
      overconfidence: 'High certainty with weak design evidence → penalty to credibility',
      underconfidence: 'Strong design research but low confidence → missed opportunity bonus',
    },
  },
  
  stressTesting: {
    newDataIntroduction: {
      adaptiveThinking: 'User updates design beliefs based on Meta campaign data',
      rigidThinking: 'User ignores campaign performance data',
    },
    outcomes: {
      adaptive: { trustBonus: 5, progressBonus: 10, learningUnlocked: true },
      rigid: { trustPenalty: -10, crisisTriggered: true, pathLocked: true },
    },
  },
  
  designReasoningTracking: {
    colorPsychology: [] as { phase: number; color: string; rationale: string; evidence: string }[],
    brandAlignment: [] as { phase: number; decision: string; alignment: number }[],
    genZResonance: [] as { phase: number; claim: string; evidence: string; confidence: number }[],
  },
};

// ============================================================================// DECISION SYSTEM
// ============================================================================

export interface BrandDecisionRecord {
  id: string;
  type: 'explicit' | 'implicit';
  description: string;
  phase: number;
  intendedOutcome: string;
  metricsAffected: string[];
  stakeholdersImpacted: string[];
  timeCost: number;
  budgetCost: number;
}

export const brand01DecisionSystem = {
  explicitDecisions: [
    { id: 'color-direction', name: 'Color Direction', impact: 'critical', description: 'Bold vs Conservative color approach' },
    { id: 'platform-priority', name: 'Platform Priority', impact: 'high', description: 'Instagram vs TikTok focus' },
    { id: 'meta-strategy', name: 'Meta Strategy', impact: 'high', description: 'Testing vs Scaling approach' },
    { id: 'launch-timing', name: 'Launch Timing', impact: 'critical', description: 'Full launch vs Phased rollout' },
  ],
  
  implicitDecisions: [
    { id: 'design-avoidance', name: 'Not investigating certain design areas', tracking: 'what design elements user ignores' },
    { id: 'color-iteration', name: 'Repeatedly changing colors', tracking: 'pattern of color indecision' },
    { id: 'stakeholder-avoidance', name: 'Not engaging certain stakeholders', tracking: 'who user avoids' },
    { id: 'meta-delay', name: 'Delaying Meta campaign setup', tracking: 'patterns of postponement' },
  ],
  
  constraints: {
    budgetLimit: '$85K total creative budget',
    timeLimit: '6 weeks to launch',
    brandConstraint: 'Must preserve Swoosh logo core identity',
    stakeholderConstraint: 'Client approval required for final brand book',
  },
  
  tradeoffs: [
    { choosing: 'bold-colors', prevents: 'conservative-appeal', explanation: 'Bold colors may alienate older demographics but appeal to Gen Z' },
    { choosing: 'instagram-focus', prevents: 'tiktok-presence', explanation: 'Instagram requires different creative than TikTok' },
    { choosing: 'comprehensive-assets', prevents: 'timeline', explanation: 'More assets takes more time' },
    { choosing: 'aggressive-meta-spend', prevents: 'budget-reserve', explanation: 'High Meta spend reduces budget for other channels' },
  ],
  
  decisionMemory: [] as BrandDecisionRecord[],
  
  getCallbacks: (phase: number) => {
    return [
      { trigger: 'phase-3', callback: 'Your Phase 2 color choice is affecting your asset design direction', type: 'delayed_effect' },
      { trigger: 'phase-5', callback: 'Your Phase 3 asset quality is now affecting Meta campaign performance', type: 'cumulative' },
      { trigger: 'phase-6', callback: 'Your Meta campaign data from Phase 5 is informing final brand decisions', type: 'feedback_loop' },
    ];
  },
  
  failureDetection: {
    poorQuality: 'Design decisions made without research or analysis',
    avoidance: '3+ design phases avoided or skipped',
    overloaded: 'Trying to design for all platforms simultaneously',
    inconsistent: 'Design direction changes more than twice between phases',
  },
};

// ============================================================================
// CONSEQUENCE SYSTEM
// ============================================================================

export const brand01ConsequenceSystem = {
  immediate: {
    metricShifts: {
      brandSentiment: { direction: 'varies', range: [-15, 20] },
      teamMorale: { direction: 'varies', range: [-10, 15] },
      stakeholderTrust: { direction: 'varies', range: [-15, 10] },
      progress: { direction: 'increase', range: [5, 20] },
      metaRoas: { direction: 'varies', range: [-1.0, 1.5] },
    },
    stakeholderReactions: {
      positive: ['Approves design direction', 'Offers creative suggestions', 'Becomes ally'],
      negative: ['Rejects design', 'Blocks budget', 'Escalates to client'],
      neutral: ['Takes under advisement', 'Requests more options'],
    },
    designQualityImpact: {
      colorSubmission: { qualityShift: [-20, 30] },
      assetSubmission: { qualityShift: [-15, 25] },
      moodboardQuality: { qualityShift: [-10, 20] },
    },
  },
  
  delayed: {
    crisisTriggers: [
      { trigger: 'poor-color-choice', condition: 'Color palette rejected by client', effect: 'Week 3 deadline missed, rush redesign', probability: 0.6 },
      { trigger: 'meta-underperformance', condition: 'ROAS below 1.5x for 2+ weeks', effect: 'Marketing Lead escalates, budget review', probability: 0.7 },
      { trigger: 'scope-creep', condition: 'Trying to do everything', effect: 'Final delivery incomplete', probability: 0.5 },
    ],
    compounding: [
      { early: 'Rushed color selection', late: 'Assets dont match palette', multiplier: 2.0 },
      { early: 'Ignored Meta data', late: 'Campaign underperforms', multiplier: 1.8 },
      { early: 'Inconsistent design direction', late: 'Brand book incomplete', multiplier: 1.5 },
    ],
    narrativeCallbacks: [
      'Your Phase 2 color choice from Week 2 is affecting your Phase 4 asset consistency',
      'You chose to skip comprehensive Gen Z research, which is affecting your design confidence',
      'Despite claiming Gen Z focus in your moodboard, your Meta campaign demographics show otherwise',
    ],
  },
  
  artifactMapping: {
    'color-palette': {
      poorSubmission: 'Colors rejected → stakeholder trust drops',
      noValidation: 'No color psychology evidence → Creative Director questions rationale',
      inconsistentDirection: 'Mixed color signals → brand confusion',
    },
    'social-assets': {
      lowQuality: 'Poor assets → Meta campaign underperforms',
      wrongFormat: 'Wrong dimensions → platform penalties, CPM increases',
      insufficientVolume: 'Not enough assets → campaign cannot scale',
    },
    'meta-campaign': {
      poorPerformance: 'Low ROAS → budget cuts, timeline pressure',
      noSetup: 'No campaign → no performance data for optimization',
      ignoredData: 'Ignored insights → continued poor performance',
    },
    'moodboard': {
      inconsistent: 'Inconsistent direction → stakeholder confusion',
      noResearch: 'No Gen Z references → strategic questions',
    },
  },
};

// ============================================================================
// DETAILED STAKEHOLDER BEHAVIORS
// ============================================================================

export interface BrandStakeholderDetail {
  id: string;
  name: string;
  role: string;
  
  hiddenAgenda: {
    whatTheySay: string;
    whatTheyWant: string;
    whatTheyFear: string;
  };
  
  constraints: {
    riskTolerance: 'low' | 'medium' | 'high';
    budgetAuthority: number;
    vetoPower: boolean;
    escalationPath: string[];
  };
  
  dynamic: {
    trustEvolution: { start: number; changePerAction: number };
    conflictTracking: string[];
    allianceFormation: string[];
  };
  
  channels: {
    email: { style: string; responseTime: string };
    slack: { style: string; responseTime: string };
    meetings: { frequency: string; prepRequired: boolean };
    reviews: { involvement: boolean; frequency: string };
  };
  
  designPreferences: {
    colorStyle: 'bold' | 'conservative' | 'balanced';
    platformFocus: string[];
    qualityExpectation: number;
  };
}

export const brand01StakeholderSystem: BrandStakeholderDetail[] = [
  {
    id: 'creative_director',
    name: 'Alex Rivera',
    role: 'Creative Director',
    hiddenAgenda: {
      whatTheySay: 'We need bold, innovative design direction',
      whatTheyWant: 'Push creative boundaries, build portfolio-worthy work',
      whatTheyFear: 'Being too conservative, boring work, no creative challenge',
    },
    constraints: {
      riskTolerance: 'high',
      budgetAuthority: 15000,
      vetoPower: true,
      escalationPath: ['client', 'brand_strategist'],
    },
    dynamic: {
      trustEvolution: { start: 70, changePerAction: 5 },
      conflictTracking: ['brand_strategist'],
      allianceFormation: ['marketing_lead'],
    },
    channels: {
      email: { style: 'creative, visual-heavy', responseTime: 'same_day' },
      slack: { style: 'casual, emoji-friendly', responseTime: 'hours' },
      meetings: { frequency: 'bi-weekly', prepRequired: true },
      reviews: { involvement: true, frequency: 'weekly' },
    },
    designPreferences: {
      colorStyle: 'bold',
      platformFocus: ['Instagram', 'TikTok'],
      qualityExpectation: 85,
    },
  },
  {
    id: 'marketing_lead',
    name: 'Jordan Chen',
    role: 'Marketing Lead',
    hiddenAgenda: {
      whatTheySay: 'Need strong campaign performance metrics',
      whatTheyWant: 'Proven ROAS, scalable campaigns, data-driven decisions',
      whatTheyFear: 'Wasted budget, no results to show client',
    },
    constraints: {
      riskTolerance: 'medium',
      budgetAuthority: 25000,
      vetoPower: false,
      escalationPath: ['client'],
    },
    dynamic: {
      trustEvolution: { start: 65, changePerAction: 3 },
      conflictTracking: [],
      allianceFormation: ['creative_director'],
    },
    channels: {
      email: { style: 'data-focused, metrics-first', responseTime: 'same_day' },
      slack: { style: 'professional, concise', responseTime: 'hours' },
      meetings: { frequency: 'weekly', prepRequired: false },
      reviews: { involvement: true, frequency: 'weekly' },
    },
    designPreferences: {
      colorStyle: 'balanced',
      platformFocus: ['Meta', 'Instagram'],
      qualityExpectation: 75,
    },
  },
  {
    id: 'brand_strategist',
    name: 'Sam Patel',
    role: 'Brand Strategist',
    hiddenAgenda: {
      whatTheySay: 'Must preserve brand equity and heritage',
      whatTheyWant: 'Strategic coherence, market positioning, brand longevity',
      whatTheyFear: 'Brand dilution, losing market position, client dissatisfaction',
    },
    constraints: {
      riskTolerance: 'low',
      budgetAuthority: 5000,
      vetoPower: false,
      escalationPath: ['client'],
    },
    dynamic: {
      trustEvolution: { start: 60, changePerAction: 2 },
      conflictTracking: ['creative_director'],
      allianceFormation: ['client'],
    },
    channels: {
      email: { style: 'strategic, long-form', responseTime: '1_day' },
      slack: { style: 'rare', responseTime: 'days' },
      meetings: { frequency: 'weekly', prepRequired: true },
      reviews: { involvement: true, frequency: 'bi-weekly' },
    },
    designPreferences: {
      colorStyle: 'balanced',
      platformFocus: ['All'],
      qualityExpectation: 80,
    },
  },
  {
    id: 'client',
    name: 'Nike Brand Team',
    role: 'Client',
    hiddenAgenda: {
      whatTheySay: 'Need fresh Gen Z appeal while maintaining core identity',
      whatTheyWant: 'Successful brand refresh, board approval, market impact',
      whatTheyFear: 'Launch failure, brand damage, timeline miss',
    },
    constraints: {
      riskTolerance: 'medium',
      budgetAuthority: 85000,
      vetoPower: true,
      escalationPath: ['board'],
    },
    dynamic: {
      trustEvolution: { start: 50, changePerAction: 5 },
      conflictTracking: [],
      allianceFormation: ['brand_strategist'],
    },
    channels: {
      email: { style: 'formal, executive', responseTime: '1-2_days' },
      slack: { style: 'rare', responseTime: 'days' },
      meetings: { frequency: 'weekly', prepRequired: true },
      reviews: { involvement: true, frequency: 'milestone' },
    },
    designPreferences: {
      colorStyle: 'bold',
      platformFocus: ['Instagram', 'TikTok', 'Digital'],
      qualityExpectation: 90,
    },
  },
];

// ============================================================================// EVENT & CRISIS SYSTEM
// ============================================================================

export interface BrandSimulationEvent {
  id: string;
  name: string;
  type: 'design_crisis' | 'stakeholder_feedback' | 'market_shift' | 'technical_issue' | 'opportunity';
  triggerType: 'time' | 'decision' | 'artifact';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  phaseTrigger: number;
  description: string;
  impact: {
    metrics: Record<string, number>;
    stakeholderTrust: Record<string, number>;
    budget: number;
    progress: number;
    brandSentiment?: number;
  };
  notificationStyle: 'immediate' | 'delayed' | 'ambiguous';
  escalationPotential: boolean;
  resolvedBy?: string[];
}

export const brand01EventSystem: BrandSimulationEvent[] = [
  // Time-based events
  { 
    id: 'evt-color-1', 
    name: 'Client Requests Color Preview', 
    type: 'stakeholder_feedback', 
    triggerType: 'time', 
    severity: 'minor', 
    phaseTrigger: 2, 
    description: 'Client wants to see preliminary color directions before final submission',
    impact: { metrics: {}, stakeholderTrust: { client: -5 }, budget: 0, progress: 0 }, 
    notificationStyle: 'immediate', 
    escalationPotential: false, 
    resolvedBy: ['select_color_palette'] 
  },
  { 
    id: 'evt-creative-1', 
    name: 'Creative Direction Conflict', 
    type: 'stakeholder_feedback', 
    triggerType: 'time', 
    severity: 'moderate', 
    phaseTrigger: 2, 
    description: 'Creative Director and Brand Strategist disagree on color approach direction',
    impact: { metrics: {}, stakeholderTrust: { creative_director: -5, brand_strategist: -5 }, budget: 0, progress: -5 }, 
    notificationStyle: 'immediate', 
    escalationPotential: true, 
    resolvedBy: ['present_direction'] 
  },
  { 
    id: 'evt-meta-1', 
    name: 'Meta Platform Update', 
    type: 'technical_issue', 
    triggerType: 'time', 
    severity: 'moderate', 
    phaseTrigger: 4, 
    description: 'Meta announces new ad format requirements affecting campaign setup',
    impact: { metrics: { metaRoas: -0.3 }, stakeholderTrust: { marketing_lead: -5 }, budget: -2000, progress: -5 }, 
    notificationStyle: 'delayed', 
    escalationPotential: false, 
    resolvedBy: ['optimize_ad_creative'] 
  },
  { 
    id: 'evt-competitor-1', 
    name: 'Competitor Brand Refresh', 
    type: 'market_shift', 
    triggerType: 'time', 
    severity: 'moderate', 
    phaseTrigger: 3, 
    description: 'Major competitor announces bold new brand direction gaining media attention',
    impact: { metrics: { brandSentiment: -5 }, stakeholderTrust: { client: -10 }, budget: 0, progress: 0 }, 
    notificationStyle: 'immediate', 
    escalationPotential: true 
  },
  { 
    id: 'evt-timeline-1', 
    name: 'Timeline Pressure', 
    type: 'design_crisis', 
    triggerType: 'time', 
    severity: 'major', 
    phaseTrigger: 5, 
    description: 'Only 1 week left to complete all assets and finalize brand book',
    impact: { metrics: {}, stakeholderTrust: {}, budget: -5000, progress: -10 }, 
    notificationStyle: 'immediate', 
    escalationPotential: true 
  },
  
  // Decision-based events
  { 
    id: 'evt-decision-1', 
    name: 'Bold Direction Approved', 
    type: 'opportunity', 
    triggerType: 'decision', 
    severity: 'minor', 
    phaseTrigger: 2, 
    description: 'Client loves bold color direction - green light to proceed with energy',
    impact: { metrics: { brandSentiment: 10 }, stakeholderTrust: { creative_director: 15, client: 10 }, budget: 0, progress: 10 }, 
    notificationStyle: 'immediate', 
    escalationPotential: false 
  },
  { 
    id: 'evt-decision-2', 
    name: 'Conservative Direction Requested', 
    type: 'stakeholder_feedback', 
    triggerType: 'decision', 
    severity: 'moderate', 
    phaseTrigger: 3, 
    description: 'Client requests more conservative color approach - pivot required',
    impact: { metrics: { brandSentiment: -10 }, stakeholderTrust: { creative_director: -10 }, budget: -5000, progress: -15 }, 
    notificationStyle: 'immediate', 
    escalationPotential: true, 
    resolvedBy: ['refine_color_codes'] 
  },
  { 
    id: 'evt-decision-3', 
    name: 'Platform Pivot Needed', 
    type: 'market_shift', 
    triggerType: 'decision', 
    severity: 'moderate', 
    phaseTrigger: 4, 
    description: 'Meta campaign data shows TikTok outperforming Instagram 2:1 - pivot needed',
    impact: { metrics: { metaRoas: 0.5 }, stakeholderTrust: { marketing_lead: 5 }, budget: -3000, progress: 0 }, 
    notificationStyle: 'immediate', 
    escalationPotential: false 
  },
  
  // Artifact-based events
  { 
    id: 'evt-artifact-1', 
    name: 'Color Palette Rejected', 
    type: 'design_crisis', 
    triggerType: 'artifact', 
    severity: 'major', 
    phaseTrigger: 3, 
    description: 'Client rejects submitted color palette - violates brand heritage guidelines',
    impact: { metrics: { brandSentiment: -15 }, stakeholderTrust: { client: -20 }, budget: -5000, progress: -20 }, 
    notificationStyle: 'immediate', 
    escalationPotential: true, 
    resolvedBy: ['refine_color_codes'] 
  },
  { 
    id: 'evt-artifact-2', 
    name: 'Assets Quality Issue', 
    type: 'design_crisis', 
    triggerType: 'artifact', 
    severity: 'moderate', 
    phaseTrigger: 4, 
    description: 'Creative Director flags social assets as below quality threshold',
    impact: { metrics: {}, stakeholderTrust: { creative_director: -10 }, budget: -3000, progress: -10 }, 
    notificationStyle: 'delayed', 
    escalationPotential: false, 
    resolvedBy: ['design_social_assets'] 
  },
  { 
    id: 'evt-artifact-3', 
    name: 'Meta Campaign Success', 
    type: 'opportunity', 
    triggerType: 'artifact', 
    severity: 'minor', 
    phaseTrigger: 5, 
    description: 'Meta campaign exceeding targets - ROAS 3.2x! Portfolio-worthy results.',
    impact: { metrics: { brandSentiment: 15, metaRoas: 1.0 }, stakeholderTrust: { marketing_lead: 15, client: 10 }, budget: 5000, progress: 15 }, 
    notificationStyle: 'immediate', 
    escalationPotential: false 
  },
];

export const brand01Scenario: Scenario = {
  id: BRAND_01_ID,
  name: 'Brand Identity Refresh - Nike Vision',
  description: 'Lead the creative direction for a brand identity refresh targeting Gen Z athletes. Create a cohesive visual language that works across digital, print, and physical spaces. Submit color codes, design assets, and set up Meta advertising campaigns.',
  industry: 'Technology/Sports',
  difficulty: 'advanced',
  durationWeeks: 6,
  teamSize: 5,
  budget: 85000,
  learningObjectives: [
    'Conduct effective brand research and Gen Z insights',
    'Create compelling visual direction and moodboards',
    'Define and validate brand color systems',
    'Design cohesive brand assets across channels',
    'Set up and optimize Meta advertising campaigns',
    'Present to stakeholders and secure approval',
    'Document comprehensive brand guidelines',
  ],
  skillsAssessed: [
    'Brand strategy development',
    'Visual design and color theory',
    'Creative project management',
    'Stakeholder communication',
    'Digital advertising optimization',
    'Brand documentation',
  ],
  initialState: brand01InitialState as any,
  phases: brand01Phases,
  actions: brand01Actions,
  timelineEvents: brand01TimelineEvents,
  stakeholders: brand01Stakeholders,
};

export default brand01Scenario;