import React, { useState, useEffect, useCallback, useContext, createContext, useRef } from 'react';
import { Notification, Email, Message } from '../../communications/types';
import { INITIAL_NOTIFICATIONS, INITIAL_EMAILS, TEAM_MEMBERS_FOR_MESSAGING, AI_AUTO_RESPONSES, FAILURE_CONDITIONS } from '../../communications/types';

interface NotificationContextType {
  notifications: Notification[];
  emails: Email[];
  messages: Message[];
  unreadNotifications: number;
  unreadEmails: number;
  unreadMessages: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { actionPayload?: any }) => void;
  addEmail: (email: Omit<Email, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markEmailRead: (id: string) => void;
  markMessageRead: (id: string) => void;
  closeNotification: (id: string) => void;
  closeAllNotifications: () => void;
  sendMessage: (toId: string, content: string) => void;
  checkFailureConditions: (state: any) => typeof FAILURE_CONDITIONS | null;
  persistNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

const NOTIFICATIONS_STORAGE_KEY = 'turnve_notifications_v1';
const EMAILS_STORAGE_KEY = 'turnve_emails_v1';
const MESSAGES_STORAGE_KEY = 'turnve_messages_v1';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    getFromStorage<Notification[]>(NOTIFICATIONS_STORAGE_KEY) || INITIAL_NOTIFICATIONS
  );
  const [emails, setEmails] = useState<Email[]>(() => 
    getFromStorage<Email[]>(EMAILS_STORAGE_KEY) || INITIAL_EMAILS
  );
  const [messages, setMessages] = useState<Message[]>(() => 
    getFromStorage<Message[]>(MESSAGES_STORAGE_KEY) || []
  );
  const [lastMessageTime, setLastMessageTime] = useState<Record<string, Date>>({});
  const notificationsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emailsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (notificationsTimerRef.current) clearTimeout(notificationsTimerRef.current);
    notificationsTimerRef.current = setTimeout(() => {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    }, 300);
    return () => { if (notificationsTimerRef.current) clearTimeout(notificationsTimerRef.current); };
  }, [notifications]);

  useEffect(() => {
    if (emailsTimerRef.current) clearTimeout(emailsTimerRef.current);
    emailsTimerRef.current = setTimeout(() => {
      localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
    }, 300);
    return () => { if (emailsTimerRef.current) clearTimeout(emailsTimerRef.current); };
  }, [emails]);

  useEffect(() => {
    if (messagesTimerRef.current) clearTimeout(messagesTimerRef.current);
    messagesTimerRef.current = setTimeout(() => {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }, 300);
    return () => { if (messagesTimerRef.current) clearTimeout(messagesTimerRef.current); };
  }, [messages]);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadEmails = emails.filter(e => !e.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { actionPayload?: any }) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const addEmail = useCallback((email: Omit<Email, 'id' | 'timestamp' | 'read'>) => {
    const newEmail: Email = {
      ...email,
      id: `email-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      read: false,
      archived: false,
    };
    setEmails(prev => [newEmail, ...prev]);
    
    addNotification({
      type: 'info',
      title: `New Email from ${email.fromName}`,
      message: email.subject,
      actionPayload: { emailId: `email-${Date.now()}-${Math.random().toString(36).substring(7)}` },
    });
  }, [addNotification]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markEmailRead = useCallback((id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  }, []);

  const markMessageRead = useCallback((id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  }, []);

  const closeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const closeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const sendMessage = useCallback((toId: string, content: string) => {
    const now = new Date();
    const twoMinutes = 2 * 60 * 1000;
    
    if (lastMessageTime[toId] && (now.getTime() - lastMessageTime[toId].getTime()) < twoMinutes) {
      addNotification({
        type: 'warning',
        title: 'Rate Limited',
        message: 'Please wait a moment before sending another message to this person.',
      });
      return;
    }

    const teamMember = TEAM_MEMBERS_FOR_MESSAGING.find(m => m.id === toId);
    
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      fromId: 'user',
      fromName: 'You',
      toId,
      toName: teamMember?.name || 'Unknown',
      content,
      timestamp: now,
      read: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setLastMessageTime(prev => ({ ...prev, [toId]: now }));

    setTimeout(() => {
      const aiResponse = AI_AUTO_RESPONSES[toId] || "Thanks for your message. I'll get back to you shortly.";
      const responseMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}-response`,
        fromId: toId,
        fromName: teamMember?.name || 'Team Member',
        toId: 'user',
        toName: 'You',
        content: aiResponse,
        timestamp: new Date(),
        read: false,
        aiResponse: aiResponse,
      };
      setMessages(prev => [...prev, responseMessage]);
      
      addNotification({
        type: 'message',
        title: `Message from ${teamMember?.name}`,
        message: aiResponse.slice(0, 100) + '...',
        sound: true,
      });
    }, 1500);
  }, [lastMessageTime, addNotification]);

  const checkFailureConditions = useCallback((state: any) => {
    for (const condition of Object.values(FAILURE_CONDITIONS)) {
      if (condition.check(state)) {
        addNotification({
          type: 'error',
          title: condition.name,
          message: condition.message,
          sound: true,
          autoDismiss: 0,
        });
        return FAILURE_CONDITIONS;
      }
    }
    return null;
  }, [addNotification]);

  const persistNotifications = useCallback(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [notifications, emails, messages]);

  const value: NotificationContextType = {
    notifications,
    emails,
    messages,
    unreadNotifications,
    unreadEmails,
    unreadMessages,
    addNotification,
    addEmail,
    markNotificationRead,
    markEmailRead,
    markMessageRead,
    closeNotification,
    closeAllNotifications,
    sendMessage,
    checkFailureConditions,
    persistNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export { NotificationContext };

export default NotificationProvider;