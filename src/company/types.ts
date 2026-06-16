export type NewsCategory = 'internal' | 'business' | 'product' | 'industry' | 'leadership';

export interface CompanyNews {
  id: string;
  type: NewsCategory;
  title: string;
  content: string;
  summary?: string;
  author: string;
  timestamp: Date;
  week: number;
  isRead: boolean;
  priority: 'high' | 'normal' | 'low';
  tags?: string[];
}

export interface CompanyProfile {
  name: string;
  industry: string;
  founded: number;
  size: string;
  mission: string;
  vision: string;
  values: string[];
  headquarters: string;
  website?: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar?: string;
  bio?: string;
  startDate: string;
  manager?: string;
  skills: string[];
}

export interface IndustryTrend {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  source?: string;
  publishedDate: Date;
  data?: {
    value: number;
    change: number;
    period: string;
  };
}

export interface Competitor {
  id: string;
  name: string;
  logo?: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  recentNews?: string;
}

export interface StakeholderProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  photo?: string;
  bio: string;
  careerHistory: string[];
  personalGoals: string[];
  concerns: string[];
  priorities: string[];
  communicationStyle: 'direct' | 'formal' | 'diplomatic' | 'casual';
  satisfaction: number;
  lastContact?: Date;
  relationshipStrength: 'strong' | 'neutral' | 'weak';
}

export const DEFAULT_COMPANY: CompanyProfile = {
  name: 'FlowDesk',
  industry: 'B2B SaaS',
  founded: 2019,
  size: '50-100 employees',
  mission: 'Transform how teams collaborate and manage projects with intelligent, intuitive tools.',
  vision: 'Be the leading project management platform for modern product teams, enabling seamless collaboration and measurable outcomes.',
  values: [
    'Customer Obsession - We put our customers at the center of every decision',
    'Radical Transparency - We share information openly and honestly',
    'Continuous Innovation - We constantly evolve and improve our products',
    'Team First - We prioritize team success over individual glory',
    'Data-Driven - We use insights to guide our decisions',
  ],
  headquarters: 'San Francisco, CA',
  website: 'https://flowdesk.io',
  description: 'FlowDesk is a B2B SaaS company building next-generation project management and collaboration tools for product teams. Our platform helps companies streamline workflows, improve team productivity, and deliver better products.',
};

export const NEWS_CATEGORIES: Record<NewsCategory, { label: string; icon: string; color: string }> = {
  internal: { label: 'Internal Updates', icon: '🏢', color: 'blue' },
  business: { label: 'Business News', icon: '📈', color: 'emerald' },
  product: { label: 'Product News', icon: '🏆', color: 'purple' },
  industry: { label: 'Industry Trends', icon: '🌍', color: 'amber' },
  leadership: { label: 'Leadership', icon: '🎯', color: 'rose' },
};

export const INITIAL_NEWS: CompanyNews[] = [
  {
    id: 'news-1',
    type: 'leadership',
    title: 'Welcome Our New VP of Product',
    content: 'We are thrilled to announce that Sarah Martinez has joined FlowDesk as our new VP of Product. Sarah brings 15 years of experience from leading product teams at Stripe and Atlassian. She will be leading our product strategy and roadmap.',
    summary: 'Sarah Martinez joins as VP of Product',
    author: 'Jordan Chen (CEO)',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    week: 1,
    isRead: false,
    priority: 'high',
    tags: ['leadership', 'team'],
  },
  {
    id: 'news-2',
    type: 'business',
    title: 'Series B Funding Round Complete',
    content: 'FlowDesk has successfully closed our $25M Series B funding round led by Accel Partners, with participation from existing investors. This funding will accelerate our product development and market expansion.',
    summary: '$25M raised to fuel growth',
    author: 'Finance Team',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    week: 1,
    isRead: true,
    priority: 'high',
    tags: ['funding', 'growth'],
  },
  {
    id: 'news-3',
    type: 'product',
    title: 'Mobile App Launching Next Month',
    content: 'Our native mobile app for iOS and Android is on track for launch next month. Early beta feedback has been extremely positive, with users praising the seamless experience and offline capabilities.',
    summary: 'Mobile app entering final testing phase',
    author: 'Product Team',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    week: 2,
    isRead: false,
    priority: 'normal',
    tags: ['product', 'mobile', 'launch'],
  },
  {
    id: 'news-4',
    type: 'industry',
    title: 'Remote Work Trends Report Released',
    content: 'Our annual Remote Work Trends report shows 78% of companies plan to maintain hybrid work policies. This presents a significant opportunity for collaboration tools that enable distributed teams.',
    summary: 'Industry report shows strong demand for hybrid work solutions',
    author: 'Research Team',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    week: 2,
    isRead: true,
    priority: 'normal',
    tags: ['research', 'market'],
  },
  {
    id: 'news-5',
    type: 'internal',
    title: 'New Engineering Hub in Austin',
    content: 'We are opening a new engineering hub in Austin, Texas. This will help us tap into the strong talent pool and better serve our growing customer base in the region.',
    summary: 'Austin office opening in Q2',
    author: 'People Operations',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    week: 2,
    isRead: false,
    priority: 'normal',
    tags: ['expansion', 'hiring'],
  },
];

export const INDUSTRY_TRENDS: IndustryTrend[] = [
  {
    id: 'trend-1',
    category: 'Market Growth',
    title: 'Project Management Software Market',
    description: 'The global project management software market is expected to grow at 10.5% CAGR, reaching $10B by 2027. Small and mid-market segments show fastest growth.',
    impact: 'high',
    trend: 'up',
    source: 'Gartner',
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    data: { value: 10.5, change: 2.1, period: 'CAGR' },
  },
  {
    id: 'trend-2',
    category: 'Technology',
    title: 'AI Integration in PM Tools',
    description: 'AI-powered features are becoming table stakes. Top vendors are incorporating predictive analytics, automated scheduling, and intelligent task management.',
    impact: 'high',
    trend: 'up',
    source: 'Forrester',
    publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'trend-3',
    category: 'User Behavior',
    title: 'Shift to Async Collaboration',
    description: 'Remote work has accelerated adoption of asynchronous collaboration tools. Teams prefer documentation over meetings, driving demand for wiki and knowledge base features.',
    impact: 'medium',
    trend: 'up',
    source: 'McKinsey',
    publishedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'trend-4',
    category: 'Competition',
    title: 'New Entrants in SMB Segment',
    description: 'Several well-funded startups are targeting the SMB segment with simplified, affordable solutions. Competition is intensifying in the under $20/user/month tier.',
    impact: 'medium',
    trend: 'down',
    source: 'Crunchbase',
    publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export const COMPETITORS: Competitor[] = [
  {
    id: 'comp-1',
    name: 'TaskMaster Pro',
    marketShare: 28,
    strengths: ['Strong enterprise presence', 'Deep integrations', 'Award-winning UX'],
    weaknesses: ['Complex pricing', 'Slower feature updates', 'Legacy codebase'],
    recentNews: 'Acquired by enterprise software giant',
  },
  {
    id: 'comp-2',
    name: 'AgileFlow',
    marketShare: 18,
    strengths: ['Agile-first approach', 'Strong developer tools', 'Great API'],
    weaknesses: ['Limited enterprise features', 'Smaller team', 'Fewer integrations'],
    recentNews: 'Launched AI-powered sprint planning',
  },
  {
    id: 'comp-3',
    name: 'SimpleTask',
    marketShare: 15,
    strengths: ['Easy to use', 'Affordable pricing', 'Fast onboarding'],
    weaknesses: ['Limited customization', 'Basic reporting', 'No enterprise SSO'],
    recentNews: 'Reached 1M users milestone',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Jordan Chen',
    role: 'CEO & Co-founder',
    department: 'Executive',
    email: 'jordan@flowdesk.io',
    bio: 'Former PM at Google. Stanford CS grad. Passionate about building tools developers love.',
    startDate: '2019-01-15',
    skills: ['Strategy', 'Leadership', 'Product'],
  },
  {
    id: 'member-2',
    name: 'Sarah Martinez',
    role: 'VP of Product',
    department: 'Product',
    email: 'sarah@flowdesk.io',
    bio: '15 years PM experience. Previously at Stripe and Atlassian. MBA from Wharton.',
    startDate: '2024-01-01',
    manager: 'Jordan Chen',
    skills: ['Product Strategy', 'Roadmapping', 'User Research'],
  },
  {
    id: 'member-3',
    name: 'Alex Kim',
    role: 'CTO',
    department: 'Engineering',
    email: 'alex@flowdesk.io',
    bio: 'Ex-Google engineer. Built systems serving 100M+ users. Open source contributor.',
    startDate: '2019-01-15',
    manager: 'Jordan Chen',
    skills: ['Architecture', 'Scalability', 'Team Building'],
  },
  {
    id: 'member-4',
    name: 'Emily Rodriguez',
    role: 'VP of Sales',
    department: 'Sales',
    email: 'emily@flowdesk.io',
    bio: 'Built sales teams at 2 SaaS startups. 10x revenue growth track record.',
    startDate: '2020-06-01',
    manager: 'Jordan Chen',
    skills: ['Sales Strategy', 'Enterprise Sales', 'Negotiation'],
  },
  {
    id: 'member-5',
    name: 'Marcus Johnson',
    role: 'Head of Customer Success',
    department: 'Customer Success',
    email: 'marcus@flowdesk.io',
    bio: 'Customer champion. Previously led CS at Figma. Known for building strong teams.',
    startDate: '2021-03-01',
    manager: 'Emily Rodriguez',
    skills: ['Customer Relations', 'Retention', 'Team Management'],
  },
];

export const ENHANCED_STAKEHOLDERS: StakeholderProfile[] = [
  {
    id: 'cto',
    name: 'Sarah Chen',
    role: 'CTO',
    department: 'Engineering',
    bio: 'Tech leader with 12 years experience. Joined from Series B startup. Very data-driven and detail-oriented. Prefers technical discussions over high-level strategy.',
    careerHistory: ['Senior Eng Manager at Netflix', 'Tech Lead at Airbnb', 'Software Engineer at Google'],
    personalGoals: ['Ship reliable, scalable systems', 'Reduce technical debt', 'Build a world-class engineering team'],
    concerns: ['System reliability', 'Technical debt', 'Developer productivity'],
    priorities: ['Code quality', 'Architecture decisions', 'Release velocity'],
    communicationStyle: 'direct',
    satisfaction: 75,
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    relationshipStrength: 'strong',
  },
  {
    id: 'product',
    name: 'Marcus Johnson',
    role: 'VP Product',
    department: 'Product',
    bio: 'Product visionary with strong user research background. Balances stakeholder requests with data-driven decisions. Great at synthesizing feedback into product strategy.',
    careerHistory: ['Director of Product at Atlassian', 'Senior PM at Spotify', 'PM at Microsoft'],
    personalGoals: ['Launch mobile app successfully', 'Increase NPS above 50', 'Expand enterprise offerings'],
    concerns: ['Feature scope creep', 'User feedback integration', 'Competitive positioning'],
    priorities: ['User satisfaction', 'Market timing', 'Feature completeness'],
    communicationStyle: 'formal',
    satisfaction: 70,
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    relationshipStrength: 'strong',
  },
  {
    id: 'cfo',
    name: 'Emily Rodriguez',
    role: 'CFO',
    department: 'Finance',
    bio: 'Finance executive with SaaS expertise. Carefully manages burn rate while funding growth initiatives. Prefers detailed business cases and ROI projections.',
    careerHistory: ['CFO at Series B Startup', 'Finance Director at Twilio', 'Investment Banking'],
    personalGoals: ['Maintain healthy burn rate', 'Prepare for IPO', 'Optimize unit economics'],
    concerns: ['Budget overruns', 'Customer acquisition cost', 'Gross margins'],
    priorities: ['Cost efficiency', 'Predictable spending', 'Financial transparency'],
    communicationStyle: 'diplomatic',
    satisfaction: 65,
    lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    relationshipStrength: 'neutral',
  },
];