export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  sound?: boolean;
  actionUrl?: string;
  from?: string;
  autoDismiss?: number;
}

export interface Email {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: 'welcome' | 'system' | 'stakeholder' | 'team' | 'outcome';
  attachments?: string[];
  starred?: boolean;
  archived?: boolean;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  aiResponse?: string;
  isTask?: boolean;
  taskCompleted?: boolean;
}

export const WELCOME_EMAIL: Email = {
  id: 'email-welcome-1',
  from: 'hr@flowdesk.io',
  fromName: 'Sarah Martinez - HR Director',
  to: 'you',
  subject: 'Welcome to FlowDesk! 🎉 Your Journey Starts Here',
  body: `Dear Team Member,

Welcome to FlowDesk! We're thrilled to have you join our team as a Product Manager.

📋 YOUR ROLE:
You'll be leading our flagship project initiative. Your decisions will shape the product direction and team success.

🎯 FIRST WEEK OBJECTIVES:
1. Meet your team and stakeholders
2. Review the project briefing
3. Make your first key decisions
4. Generate your initial planning documents

🏢 ABOUT FLOWDESK:
We're a B2B SaaS company building next-generation collaboration tools. Founded in 2019, we've grown to 75+ employees and just closed our Series B funding.

💬 STAY CONNECTED:
- Check your inbox regularly for updates
- Message team members anytime
- I'm here to support your success

Questions? Reply to this email or message me directly.

Best regards,
Sarah Martinez
HR Director
FlowDesk Inc.`,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  read: false,
  type: 'welcome',
  starred: true,
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'info',
    title: 'Simulation Started',
    message: 'Welcome! Your simulation has begun. Check your email for a welcome message from HR.',
    timestamp: new Date(Date.now() - 60 * 1000),
    read: false,
    sound: true,
    autoDismiss: 8000,
  },
];

export const INITIAL_EMAILS: Email[] = [
  WELCOME_EMAIL,
  {
    id: 'email-system-1',
    from: 'system@flowdesk.io',
    fromName: 'FlowDesk System',
    to: 'you',
    subject: 'Project Briefing Available',
    body: `Your project briefing is ready to review. 

Key highlights:
- Timeline: 12 weeks
- Budget: $150K
- Team: 4 members
- Industry: B2A SaaS

Review the details in your dashboard before making decisions.

Good luck!`,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    type: 'system',
  },
  {
    id: 'email-stakeholder-1',
    from: 'cto@flowdesk.io',
    fromName: 'Sarah Chen - CTO',
    to: 'you',
    subject: 'Technical Perspective',
    body: `Hi,

Looking forward to working with you on this project.

A few things from my side:
- Our technical debt is manageable
- Team capacity is good for the first phase
- I'd prioritize getting stakeholder alignment early

Let me know if you need technical input on any decisions.

Best,
Sarah`,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    type: 'stakeholder',
  },
];

export const TEAM_MEMBERS_FOR_MESSAGING = [
  { id: 'cto', name: 'Sarah Chen', role: 'CTO', department: 'Engineering', online: true },
  { id: 'product', name: 'Marcus Johnson', role: 'VP Product', department: 'Product', online: true },
  { id: 'cfo', name: 'Emily Rodriguez', role: 'CFO', department: 'Finance', online: false },
  { id: 'hr', name: 'Sarah Martinez', role: 'HR Director', department: 'People', online: true },
];

export const AI_AUTO_RESPONSES: Record<string, string> = {
  cto: "Thanks for reaching out! Happy to discuss technical aspects. Let's schedule a quick sync if you need architecture input on your decisions.",
  product: "Good question! I've been thinking about user feedback - we should prioritize features that drive activation. What specific area would you like to discuss?",
  cfo: "I can help with budget implications. Before we discuss, could you share the expected ROI for your proposed approach? I want to make sure we're making data-driven decisions.",
  hr: "Great to hear from you! The team is excited about this project. Let me know if you need help with team capacity or any HR-related support.",
  pm: "I appreciate the update! I've noted your progress. Keep up the good work - remember to balance speed with quality. Let me know if you need any guidance.",
};

export const FAILURE_CONDITIONS = {
  budgetDepleted: {
    id: 'budget_depleted',
    name: 'Budget Depleted',
    description: 'Your project ran out of funding',
    check: (state: { budget: number; initialBudget: number }) => state.budget <= 0,
    threshold: 0,
    message: 'The project has been terminated due to budget depletion. All remaining funds have been allocated to other initiatives.',
  },
  riskCritical: {
    id: 'risk_critical',
    name: 'Critical Risk Level',
    description: 'Project risk became too high',
    check: (state: { riskLevel: number }) => state.riskLevel >= 0.9,
    threshold: 0.9,
    message: 'The project was put on hold due to unacceptable risk levels. Stakeholders lost confidence in the team\'s ability to manage challenges.',
  },
  teamMoraleCritical: {
    id: 'team_morale_critical',
    name: 'Team Morale Collapse',
    description: 'Your team lost all motivation',
    check: (state: { teamMorale: number }) => state.teamMorale <= 20,
    threshold: 20,
    message: 'Multiple team members have requested transfers. The project has been reassigned to a new PM for team stability.',
  },
  stakeholderTrustCritical: {
    id: 'stakeholder_trust_critical',
    name: 'Stakeholder Confidence Lost',
    description: 'Key stakeholders withdrew support',
    check: (state: { stakeholderTrust: number }) => state.stakeholderTrust <= 20,
    threshold: 20,
    message: 'Key stakeholders have lost confidence in the project leadership. The executive team has decided to pivot the initiative.',
  },
  projectTimeout: {
    id: 'project_timeout',
    name: 'Project Timeout',
    description: 'Maximum weeks exceeded without completion',
    check: (state: { week: number; totalWeeks: number }) => state.week > state.totalWeeks,
    threshold: -1,
    message: 'The project has exceeded its timeline without meeting success criteria. Resources are being reallocated.',
  },
};