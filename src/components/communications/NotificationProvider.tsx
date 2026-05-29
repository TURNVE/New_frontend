import { createContext, useContext, useState, useCallback } from 'react';
import type { Notification, Email, Message } from '../../communications/types';
import { AI_AUTO_RESPONSES, TEAM_MEMBERS_FOR_MESSAGING } from '../../communications/types';

interface NotificationContextType {
  notifications: Notification[];
  emails: Email[];
  messages: Message[];
  unreadNotifications: number;
  unreadEmails: number;
  unreadMessages: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  addEmail: (email: Omit<Email, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markEmailRead: (id: string) => void;
  markMessageRead: (id: string) => void;
  sendMessage: (toId: string, content: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessageTime, setLastMessageTime] = useState<Record<string, Date>>({});

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadEmails = emails.filter(e => !e.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
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
      title: `📧 New Email from ${email.fromName}`,
      message: email.subject,
    });
  }, [addNotification]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markEmailRead = useCallback((id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  }, []);

  const markMessageRead = useCallback((id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  }, []);

  const sendMessage = useCallback((toId: string, content: string) => {
    const now = new Date();
    const twoMinutes = 2 * 60 * 1000;
    
    if (lastMessageTime[toId] && (now.getTime() - lastMessageTime[toId].getTime()) < twoMinutes) {
      addNotification({
        type: 'warning',
        title: 'Rate Limited',
        message: 'Please wait a moment before sending another message.',
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
    }, 1500);
  }, [lastMessageTime, addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      emails,
      messages,
      unreadNotifications,
      unreadEmails,
      unreadMessages,
      addNotification,
      addEmail,
      removeNotification,
      markEmailRead,
      markMessageRead,
      sendMessage,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;