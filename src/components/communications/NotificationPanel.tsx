import { useState } from 'react';
import { Bell, Mail, MessageSquare, X, Send, Star } from 'lucide-react';
import { useNotifications } from './NotificationProvider';
import { TEAM_MEMBERS_FOR_MESSAGING } from '../../communications/types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, emails, messages, 
    unreadNotifications, unreadEmails, unreadMessages,
    removeNotification, markEmailRead, markMessageRead, sendMessage 
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<'notifications' | 'emails' | 'messages'>('notifications');
  const [messageDraft, setMessageDraft] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');

  const allUnread = unreadNotifications + unreadEmails + unreadMessages;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-white border-l border-gray-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Communications</h2>
            <p className="text-xs text-gray-500">{allUnread} unread</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifications },
            { id: 'emails', label: 'Emails', icon: Mail, count: unreadEmails },
            { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessages },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors relative
                ${activeTab === tab.id ? 'text-gray-900 bg-gray-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
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
                <p className="text-center text-gray-500 py-8">No notifications</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => removeNotification(notif.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notif.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{notif.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
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
              {emails.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No emails</p>
              ) : (
                emails.map(email => (
                  <div
                    key={email.id}
                    onClick={() => markEmailRead(email.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      email.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{email.fromName}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          email.type === 'welcome' ? 'bg-emerald-100 text-emerald-700' :
                          email.type === 'stakeholder' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {email.type || 'general'}
                        </span>
                      </div>
                      {email.starred && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                    </div>
                    <h4 className="text-sm text-gray-900 mt-1">{email.subject}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{email.body}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => markMessageRead(msg.id)}
                      className={`p-3 rounded-lg ${msg.fromId === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-900">{msg.fromName}</span>
                        {msg.aiResponse && <span className="text-xs text-blue-600">(AI)</span>}
                      </div>
                      <p className="text-sm text-gray-600">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <select
                  value={selectedTeamMember}
                  onChange={e => setSelectedTeamMember(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 mb-2"
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
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400"
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

export default NotificationPanel;