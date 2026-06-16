export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  storyPoints: number;
  assignee?: string;
  category: 'feature' | 'bug' | 'improvement' | 'tech-debt';
  createdWeek: number;
  completedWeek?: number;
  dependencies: string[];
}

export interface RoadmapPhase {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
  items: RoadmapItem[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  startWeek: number;
  endWeek: number;
  category: string;
  progress: number;
}

export interface MetricData {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  history: { week: number; value: number }[];
}

export const DEFAULT_BACKLOG_ITEMS: BacklogItem[] = [
  {
    id: 'item-1',
    title: 'User Authentication System',
    description: 'Implement secure login with OAuth and email/password',
    priority: 'critical',
    status: 'done',
    storyPoints: 8,
    category: 'feature',
    createdWeek: 1,
    completedWeek: 2,
    dependencies: [],
  },
  {
    id: 'item-2',
    title: 'Dashboard Analytics',
    description: 'Create analytics dashboard with real-time metrics',
    priority: 'high',
    status: 'in-progress',
    storyPoints: 5,
    category: 'feature',
    createdWeek: 1,
    dependencies: ['item-1'],
  },
  {
    id: 'item-3',
    title: 'Mobile Responsive Design',
    description: 'Ensure all pages work on mobile devices',
    priority: 'medium',
    status: 'review',
    storyPoints: 3,
    category: 'improvement',
    createdWeek: 2,
    dependencies: [],
  },
  {
    id: 'item-4',
    title: 'API Rate Limiting',
    description: 'Add rate limiting to prevent abuse',
    priority: 'high',
    status: 'todo',
    storyPoints: 3,
    category: 'tech-debt',
    createdWeek: 2,
    dependencies: ['item-1'],
  },
  {
    id: 'item-5',
    title: 'User Profile Page',
    description: 'Allow users to edit their profile information',
    priority: 'medium',
    status: 'backlog',
    storyPoints: 3,
    category: 'feature',
    createdWeek: 3,
    dependencies: ['item-1'],
  },
  {
    id: 'item-6',
    title: 'Notification System',
    description: 'In-app notifications for important events',
    priority: 'low',
    status: 'backlog',
    storyPoints: 5,
    category: 'feature',
    createdWeek: 3,
    dependencies: [],
  },
  {
    id: 'item-7',
    title: 'Fix Login Bug',
    description: 'Users reports timeout on login',
    priority: 'critical',
    status: 'in-progress',
    storyPoints: 2,
    category: 'bug',
    createdWeek: 3,
    dependencies: [],
  },
  {
    id: 'item-8',
    title: 'Performance Optimization',
    description: 'Reduce page load time by 50%',
    priority: 'medium',
    status: 'backlog',
    storyPoints: 8,
    category: 'tech-debt',
    createdWeek: 4,
    dependencies: [],
  },
];

export const PRIORITY_COLORS = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-blue-500',
  low: 'bg-gray-500',
};

export const STATUS_COLORS = {
  backlog: 'bg-gray-500/20 text-gray-400',
  todo: 'bg-blue-500/20 text-blue-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  review: 'bg-purple-500/20 text-purple-400',
  done: 'bg-emerald-500/20 text-emerald-400',
};

export const CATEGORY_ICONS = {
  feature: '✨',
  bug: '🐛',
  improvement: '⚡',
  'tech-debt': '📚',
};

export function generateMetricsFromGameState(gameState: {
  week: number;
  budget: number;
  initialBudget: number;
  progress: number;
  teamMorale: number;
  riskLevel: number;
  stakeholderTrust: number;
  metrics?: { velocity: number; quality: number; engagement: number };
}): MetricData[] {
  return [
    {
      name: 'Budget Remaining',
      value: gameState.budget,
      target: gameState.initialBudget * 0.3,
      unit: '$K',
      trend: gameState.budget > gameState.initialBudget * 0.5 ? 'up' : 'down',
      history: [
        { week: 1, value: gameState.initialBudget },
        { week: Math.max(2, gameState.week - 1), value: gameState.budget + 10 },
        { week: gameState.week, value: gameState.budget },
      ],
    },
    {
      name: 'Project Progress',
      value: Math.round(gameState.progress),
      target: 100,
      unit: '%',
      trend: gameState.progress > 50 ? 'up' : gameState.progress > 25 ? 'stable' : 'down',
      history: [
        { week: 1, value: 5 },
        { week: Math.max(2, gameState.week - 1), value: Math.round(gameState.progress * 0.7) },
        { week: gameState.week, value: Math.round(gameState.progress) },
      ],
    },
    {
      name: 'Team Morale',
      value: Math.round(gameState.teamMorale),
      target: 70,
      unit: '%',
      trend: gameState.teamMorale > 70 ? 'up' : gameState.teamMorale > 50 ? 'stable' : 'down',
      history: [
        { week: 1, value: 75 },
        { week: Math.max(2, gameState.week - 1), value: Math.round(gameState.teamMorale + 5) },
        { week: gameState.week, value: Math.round(gameState.teamMorale) },
      ],
    },
    {
      name: 'Risk Level',
      value: Math.round(gameState.riskLevel * 100),
      target: 30,
      unit: '%',
      trend: gameState.riskLevel < 0.3 ? 'up' : gameState.riskLevel < 0.5 ? 'stable' : 'down',
      history: [
        { week: 1, value: 30 },
        { week: Math.max(2, gameState.week - 1), value: Math.round(gameState.riskLevel * 100 - 5) },
        { week: gameState.week, value: Math.round(gameState.riskLevel * 100) },
      ],
    },
    {
      name: 'Stakeholder Trust',
      value: Math.round(gameState.stakeholderTrust),
      target: 75,
      unit: '%',
      trend: gameState.stakeholderTrust > 70 ? 'up' : 'stable',
      history: [
        { week: 1, value: 70 },
        { week: Math.max(2, gameState.week - 1), value: gameState.stakeholderTrust + 3 },
        { week: gameState.week, value: Math.round(gameState.stakeholderTrust) },
      ],
    },
  ];
}