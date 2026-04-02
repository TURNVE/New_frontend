export interface MetricData {
  id: string;
  label: string;
  value: number;
  max: number;
}

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  storyPoints: number;
  assignee?: string;
  category: string;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  phaseId: string;
  status: string;
}

export const generateMetricsFromGameState = (gameState: { teamMorale?: number; budget?: number; progress?: number; riskLevel?: number; stakeholderSatisfaction?: number }) => {
  return [
    { id: '1', label: 'Team Morale', value: gameState?.teamMorale || 0, max: 100 },
    { id: '2', label: 'Budget', value: gameState?.budget || 0, max: 100 },
    { id: '3', label: 'Progress', value: gameState?.progress || 0, max: 100 },
    { id: '4', label: 'Risk Level', value: gameState?.riskLevel || 0, max: 100 },
    { id: '5', label: 'Stakeholder Sat.', value: gameState?.stakeholderSatisfaction || 0, max: 100 },
  ] as MetricData[];
};

export const DEFAULT_BACKLOG_ITEMS: BacklogItem[] = [];
export const PRIORITY_COLORS = {};
export const STATUS_COLORS = {};
export const CATEGORY_ICONS = {};