export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
}

export interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_EMAILS: Email[] = [];
export const TEAM_MEMBERS_FOR_MESSAGING = [];
export const AI_AUTO_RESPONSES = {};
export const FAILURE_CONDITIONS = {};