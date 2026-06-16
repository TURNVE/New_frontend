import { Star, Award, Shield, Users, DollarSign, Zap, AlertTriangle, Trophy, BookOpen, Medal, Flame, GitBranch, AlertCircle, Rocket, Briefcase, Globe } from 'lucide-react';

export const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    star: Star,
    award: Award,
    shield: Shield,
    users: Users,
    DollarSign: DollarSign,
    zap: Zap,
    AlertTriangle: AlertTriangle,
    trophy: Trophy,
    book: BookOpen,
    medal: Medal,
    flame: Flame,
    git: GitBranch,
    alert: AlertCircle,
    rocket: Rocket,
    briefcase: Briefcase,
    globe: Globe,
  };
  
  return icons[iconName] || Star;
};

export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };
  return colors[rarity] || colors.common;
};

export const getRarityBgColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: 'bg-gray-100',
    rare: 'bg-blue-100',
    epic: 'bg-purple-100',
    legendary: 'bg-amber-100',
  };
  return colors[rarity] || colors.common;
};

export interface Achievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  badge_type: string;
  earned?: boolean;
  earnedAt?: string;
  progress?: number;
}

export interface UserStats {
  totalPoints: number;
  completedSimulations: number;
  currentStreak: number;
  achievementsEarned: number;
  averageScore: number;
  skillLevels: Record<string, number>;
}

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    key: 'sim_first_steps',
    name: 'First Steps',
    description: 'Complete your first simulation',
    icon: 'rocket',
    points: 10,
    rarity: 'common',
    badge_type: 'milestone',
    earned: true,
    earnedAt: '2024-01-15',
  },
  {
    key: 'sim_perfectionist',
    name: 'Perfectionist',
    description: 'Achieve an A grade on any simulation',
    icon: 'star',
    points: 50,
    rarity: 'epic',
    badge_type: 'skill',
    earned: true,
    earnedAt: '2024-01-20',
  },
  {
    key: 'sim_risk_master',
    name: 'Risk Master',
    description: 'Complete a simulation with risk below 20%',
    icon: 'shield',
    points: 50,
    rarity: 'epic',
    badge_type: 'skill',
    earned: false,
    progress: 75,
  },
  {
    key: 'sim_streak_7',
    name: 'Weekly Warrior',
    description: 'Complete simulations 7 days in a row',
    icon: 'flame',
    points: 50,
    rarity: 'rare',
    badge_type: 'streak',
    earned: false,
    progress: 60,
  },
];

export const MOCK_USER_STATS: UserStats = {
  totalPoints: 450,
  completedSimulations: 8,
  currentStreak: 5,
  achievementsEarned: 5,
  averageScore: 82,
  skillLevels: {
    leadership: 75,
    communication: 80,
    problemSolving: 70,
    strategicThinking: 85,
    riskManagement: 65,
    decisionMaking: 78,
  },
};

export const ACHIEVEMENT_CATEGORIES = {
  milestone: { label: 'Milestones', color: '#3B82F6' },
  skill: { label: 'Skills', color: '#10B981' },
  challenge: { label: 'Challenges', color: '#F59E0B' },
  collection: { label: 'Collections', color: '#8B5CF6' },
  speed: { label: 'Speed', color: '#EF4444' },
  streak: { label: 'Streaks', color: '#F97316' },
};