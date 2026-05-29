export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  onClick?: () => void;
}

export interface Email {
  id: string;
  fromName: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  type?: 'welcome' | 'stakeholder' | 'general';
  starred?: boolean;
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
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  online?: boolean;
}

export interface FailureCondition {
  name: string;
  message: string;
  check: (state: any) => boolean;
}

export const TEAM_MEMBERS_FOR_MESSAGING: TeamMember[] = [
  { id: 'ceo', name: 'Marcus Johnson', role: 'CEO', online: true },
  { id: 'cto', name: 'Sarah Chen', role: 'CTO', online: true },
  { id: 'cfo', name: 'David Park', role: 'CFO', online: false },
];

export const AI_AUTO_RESPONSES: Record<string, string> = {
  ceo: "I've reviewed your message. Let's discuss this in our next sync meeting.",
  cto: "Thanks for reaching out. I need to evaluate the technical implications first.",
  cfo: "I'll need to run the numbers before I can provide a proper response.",
};

export const FAILURE_CONDITIONS: Record<string, FailureCondition> = {};