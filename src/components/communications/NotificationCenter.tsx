import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import {
  Bell, Mail, MessageSquare, X, Check, AlertTriangle,
  Info, CheckCircle, Send, Search, Star, ChevronRight
} from 'lucide-react';
import type { Notification, Email, Message, NotificationType } from '../../communications/types';
import { INITIAL_NOTIFICATIONS, INITIAL_EMAILS, TEAM_MEMBERS_FOR_MESSAGING, AI_AUTO_RESPONSES, FAILURE_CONDITIONS } from '../../communications/types';

interface NotificationContextType {
  notifications: Notification[];
  emails: Email[];
  messages: Message[];
  unreadNotifications: number;
  unreadEmails: number;
  unreadMessages: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  addEmail: (email: Omit<Email, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markEmailRead: (id: string) => void;
  markMessageRead: (id: string) => void;
  sendMessage: (toId: string, content: string) => void;
  checkFailureConditions: (state: any) => typeof FAILURE_CONDITIONS | null;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
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
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const addEmail = useCallback((email: Omit<Email, 'id' | 'timestamp' | 'read'>) => {
    const newEmail: Email = {
      ...email,
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      archived: false,
    };
    setEmails(prev => [newEmail, ...prev]);

    addNotification({
      type: 'info',
      title: `📧 New Email from ${email.fromName || (email as any).from || 'Unknown'}`,
      message: email.subject,
    });
  }, [addNotification]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markEmailRead = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

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
      id: `msg-${Date.now()}`,
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
        id: `msg-${Date.now()}-response`,
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
          title: `🚨 ${condition.name}`,
          message: condition.message,
          sound: true,
          autoDismiss: 0,
        });
        return FAILURE_CONDITIONS;
      }
    }
    return null;
  }, [addNotification]);

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
      markNotificationRead,
      markEmailRead,
      markMessageRead,
      sendMessage,
      checkFailureConditions,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (notification.autoDismiss && notification.autoDismiss > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => onDismiss(notification.id), 300);
      }, notification.autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.autoDismiss, onDismiss]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <X className="w-5 h-5 text-red-400" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'border-l-emerald-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      case 'message': return 'border-l-blue-500';
      default: return 'border-l-blue-500';
    }
  };

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBorderColor()} border-l-4
      `}
    >
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
            <p className="text-sm text-[#a1a1aa] mt-1">{notification.message}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/5 rounded transition-colors"
          >
            <X className="w-4 h-4 text-[#a1a1aa]" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notifications, emails, messages,
    unreadNotifications, unreadEmails, unreadMessages,
    markNotificationRead, markEmailRead, markMessageRead, sendMessage
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'notifications' | 'emails' | 'messages'>('notifications');
  const [messageDraft, setMessageDraft] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');

  const allUnread = unreadNotifications + unreadEmails + unreadMessages;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/10 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Communications</h2>
            <p className="text-xs text-[#a1a1aa]">{allUnread} unread</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded">
            <X className="w-5 h-5 text-[#a1a1aa]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifications },
            { id: 'emails', label: 'Emails', icon: Mail, count: unreadEmails },
            { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessages },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors relative
                ${activeTab === tab.id ? 'text-white bg-white/5' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'notifications' && (
            <div className="p-4 space-y-2">
              {notifications.length === 0 ? (
                <p className="text-center text-[#a1a1aa] py-8">No notifications</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${notif.read ? 'bg-white/5' : 'bg-blue-500/10 border border-blue-500/20'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                        <p className="text-xs text-[#a1a1aa] mt-1">{notif.message}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="p-4 space-y-2">
              {emails.map(email => (
                <div
                  key={email.id}
                  onClick={() => markEmailRead(email.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${email.read ? 'bg-white/5' : 'bg-blue-500/10 border border-blue-500/20'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{email.fromName}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${email.type === 'welcome' ? 'bg-emerald-500/20 text-emerald-400' :
                        email.type === 'stakeholder' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                        {email.type}
                      </span>
                    </div>
                    {email.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>
                  <h4 className="text-sm text-white mt-1">{email.subject}</h4>
                  <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-2">{email.body}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-[#a1a1aa] mx-auto mb-2" />
                  <p className="text-sm text-[#a1a1aa]">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${msg.fromId === 'user' ? 'bg-blue-500/10 ml-8' : 'bg-white/5 mr-8'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white">{msg.fromName}</span>
                        {msg.aiResponse && <span className="text-xs text-blue-400">(AI)</span>}
                      </div>
                      <p className="text-sm text-[#a1a1aa]">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-white/10 pt-4">
                <select
                  value={selectedTeamMember}
                  onChange={e => setSelectedTeamMember(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-2"
                >
                  <option value="">Select team member...</option>
                  {TEAM_MEMBERS_FOR_MESSAGING.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role}) {member.online ? '🟢' : '⚫'}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageDraft}
                    onChange={e => setMessageDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#a1a1aa]"
                    onKeyDown={e => e.key === 'Enter' && selectedTeamMember && messageDraft && sendMessage(selectedTeamMember, messageDraft)}
                  />
                  <button
                    onClick={() => {
                      if (selectedTeamMember && messageDraft) {
                        sendMessage(selectedTeamMember, messageDraft);
                        setMessageDraft('');
                      }
                    }}
                    disabled={!selectedTeamMember || !messageDraft}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationProvider;