export type NewsCategory = 'internal' | 'business' | 'product' | 'industry' | 'leadership';

export interface CompanyNews {
  id: string;
  title: string;
  content: string;
  summary?: string;
  type: NewsCategory;
  week: number;
  author: string;
  isRead: boolean;
  priority?: 'high' | 'normal';
  createdAt?: string;
}

export interface NewsCategoryInfo {
  label: string;
  icon: string;
  color: string;
}

export interface TrendData {
  value: number;
  period: string;
  change: number;
}

export type TrendImpact = 'positive' | 'negative' | 'neutral';

export interface IndustryTrend {
  id: string;
  title: string;
  description: string;
  category?: string;
  impact: TrendImpact;
  data?: TrendData;
  source?: string;
  affectedAreas: string[];
}

export type StakeholderAttitude = 'supportive' | 'neutral' | 'critical';
export type RelationshipStrength = 'strong' | 'neutral' | 'weak';

export interface StakeholderProfile {
  id: string;
  name: string;
  role: string;
  department?: string;
  influence: number;
  attitude: StakeholderAttitude;
  interests: string[];
  lastContact?: number;
  satisfaction?: number;
  relationshipStrength?: RelationshipStrength;
  bio?: string;
  concerns?: string[];
  priorities?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  bio?: string;
  department?: string;
  skills?: string[];
}

export interface Company {
  name: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  founded: number;
  size: string;
  headquarters: string;
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  recentNews?: string;
}

export const NEWS_CATEGORIES: Record<NewsCategory, NewsCategoryInfo> = {
  internal: { label: 'Internal', icon: '🏢', color: 'blue' },
  business: { label: 'Business', icon: '📈', color: 'emerald' },
  product: { label: 'Product', icon: '📦', color: 'purple' },
  industry: { label: 'Industry', icon: '🌐', color: 'amber' },
  leadership: { label: 'Leadership', icon: '👔', color: 'rose' },
};

export const INITIAL_NEWS: CompanyNews[] = [
  {
    id: '1',
    title: 'Q4 All-Hands Meeting Scheduled',
    content: 'Our quarterly all-hands meeting is scheduled for next week. CEO Sarah Chen will share updates on company strategy and answer your questions.',
    summary: 'CEO Sarah Chen to share company strategy updates',
    type: 'internal',
    week: 1,
    author: 'HR Team',
    isRead: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'New Product Launch Exceeds Expectations',
    content: 'The recent launch of our enterprise analytics platform has exceeded initial projections by 40%. Customer feedback has been overwhelmingly positive.',
    type: 'product',
    week: 1,
    author: 'Product Team',
    isRead: false,
  },
  {
    id: '3',
    title: 'Industry Report: Market Growth Projected',
    content: 'Analysts predict 25% growth in our sector over the next two years. Key drivers include digital transformation and AI adoption.',
    type: 'industry',
    week: 1,
    author: 'Strategy Team',
    isRead: true,
  },
];

export const INDUSTRY_TRENDS: IndustryTrend[] = [
  {
    id: '1',
    title: 'AI Integration Accelerating',
    description: 'Companies are rapidly adopting AI to improve efficiency and customer experience.',
    category: 'Technology',
    impact: 'positive',
    data: { value: 45, period: 'YoY', change: 15 },
    source: 'Gartner Report',
    affectedAreas: ['Product', 'Operations', 'Customer Service'],
  },
  {
    id: '2',
    title: 'Remote Work Normalization',
    description: 'Hybrid work models are becoming the standard across the industry.',
    category: 'Workplace',
    impact: 'neutral',
    source: 'McKinsey Study',
    affectedAreas: ['HR', 'Culture', 'Office'],
  },
  {
    id: '3',
    title: 'Increased Regulatory Scrutiny',
    description: 'New data privacy regulations require careful compliance management.',
    category: 'Regulatory',
    impact: 'negative',
    data: { value: 30, period: 'YoY', change: -5 },
    source: 'Legal Team',
    affectedAreas: ['Legal', 'Product', 'Operations'],
  },
];

export const ENHANCED_STAKEHOLDERS: StakeholderProfile[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CEO',
    department: 'Executive',
    influence: 100,
    attitude: 'supportive',
    interests: ['Growth', 'Innovation', 'Company Culture'],
    lastContact: 1,
    satisfaction: 90,
    relationshipStrength: 'strong',
    bio: 'Leading the company vision and strategy since 2020.',
    concerns: ['Market competition', 'Talent retention'],
    priorities: ['Revenue growth', 'Brand awareness'],
  },
  {
    id: '2',
    name: 'Michael Roberts',
    role: 'VP of Engineering',
    department: 'Engineering',
    influence: 85,
    attitude: 'supportive',
    interests: ['Technical Excellence', 'Team Development', 'Architecture'],
    lastContact: 2,
    satisfaction: 85,
    relationshipStrength: 'strong',
    bio: 'Overseeing all technical development and infrastructure.',
    concerns: ['Technical debt', 'Hiring engineers'],
    priorities: ['Code quality', 'System reliability'],
  },
  {
    id: '3',
    name: 'Jennifer Lopez',
    role: 'Head of Sales',
    department: 'Sales',
    influence: 80,
    attitude: 'neutral',
    interests: ['Revenue Growth', 'Customer Success', 'Market Share'],
    lastContact: 1,
    satisfaction: 75,
    relationshipStrength: 'neutral',
    bio: 'Driving revenue growth and customer relationships.',
    concerns: ['Sales quotas', 'Competitive pricing'],
    priorities: ['Closing deals', 'Customer retention'],
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Chief Executive Officer',
    department: 'Executive',
    bio: 'Leading the company vision and strategy since 2020.',
    skills: ['Strategy', 'Leadership', 'Business Development'],
  },
  {
    id: '2',
    name: 'Michael Roberts',
    role: 'VP of Engineering',
    department: 'Engineering',
    bio: 'Overseeing all technical development and infrastructure.',
    skills: ['System Architecture', 'Team Management', 'Agile'],
  },
  {
    id: '3',
    name: 'Jennifer Lopez',
    role: 'Head of Sales',
    department: 'Sales',
    bio: 'Driving revenue growth and customer relationships.',
    skills: ['Sales Strategy', 'Negotiation', 'Customer Relations'],
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'VP of Product',
    department: 'Product',
    bio: 'Leading product strategy and roadmap.',
    skills: ['Product Management', 'User Research', 'Roadmapping'],
  },
];

export const DEFAULT_COMPANY: Company = {
  name: 'FlowDesk',
  description: 'A leading provider of enterprise analytics and project management solutions.',
  mission: 'To empower teams with intelligent tools that drive productivity and collaboration.',
  vision: 'To be the standard for modern workplace productivity.',
  values: ['Innovation', 'Transparency', 'Customer Focus', 'Teamwork'],
  founded: 2020,
  size: '200-500 employees',
  headquarters: 'San Francisco, CA',
};

export const COMPETITORS: Competitor[] = [
  {
    id: '1',
    name: 'TaskMaster Pro',
    marketShare: 25,
    strengths: ['Strong enterprise presence', 'Established brand'],
    weaknesses: ['Outdated UX', 'Limited integrations'],
    recentNews: 'Launched new AI features in Q4',
  },
  {
    id: '2',
    name: 'TeamFlow',
    marketShare: 18,
    strengths: ['Modern UI', 'Strong mobile app'],
    weaknesses: ['Limited enterprise features', 'Smaller team'],
    recentNews: 'Raised $50M in Series C funding',
  },
  {
    id: '3',
    name: 'ProjectHub',
    marketShare: 15,
    strengths: ['Low price point', 'Easy to use'],
    weaknesses: ['Limited customization', 'Basic reporting'],
    recentNews: 'Acquired by larger competitor',
  },
];