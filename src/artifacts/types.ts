export type ArtifactType = 'prd' | 'roadmap' | 'stakeholder_update' | 'retrospective' | 'risk_assessment' | 'user_research' | 'metrics_report' | 'decision_log' | 'project_charter';

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  prd: 'Product Requirements',
  roadmap: 'Roadmap',
  stakeholder_update: 'Stakeholder Update',
  retrospective: 'Retrospective',
  risk_assessment: 'Risk Assessment',
  user_research: 'User Research',
  metrics_report: 'Metrics Report',
  decision_log: 'Decision Log',
  project_charter: 'Project Charter',
};

export const ARTIFACT_TYPE_ICONS: Record<ArtifactType, string> = {
  prd: '📋',
  roadmap: '🗺️',
  stakeholder_update: '👥',
  retrospective: '🔄',
  risk_assessment: '⚠️',
  user_research: '🔍',
  metrics_report: '📊',
  decision_log: '📝',
  project_charter: '📜',
};