/**
 * AvatarChat - Chat interface for individual avatar conversations
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X } from 'lucide-react';
import { AvatarId, getAvatarById } from '../data/novaPayAvatars';
import { ChatMessage, useAvatarChat } from '../hooks/useAvatarChat';
import { Phase } from '../data/novaPayConfig';

interface AvatarChatProps {
  avatarId: AvatarId;
  currentPhase: Phase;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export function AvatarChat({ avatarId, currentPhase, onClose, isEmbedded = false }: AvatarChatProps) {
  const avatar = getAvatarById(avatarId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    sendMessage, 
    getMessagesForAvatar, 
    isLoading,
    clearChat
  } = useAvatarChat(currentPhase);

  const messages = getMessagesForAvatar(avatarId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(avatarId, message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col bg-background h-full`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-5 border-b border-border bg-card/50 backdrop-blur-sm">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg"
          style={{ 
            background: avatar.bgColor,
            color: avatar.color
          }}
        >
          {avatar.initials}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-foreground">{avatar.name}</h3>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-80" style={{ color: avatar.color }}>{avatar.role}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-secondary transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Personality hint */}
      <div className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border-b border-border bg-secondary/30">
        <span className="text-muted-foreground/60">Personality: </span>
        <span className="text-muted-foreground">{avatar.personality}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div 
              className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl"
              style={{ background: avatar.bgColor }}
            >
              <span className="text-2xl font-bold" style={{ color: avatar.color }}>{avatar.initials}</span>
            </div>
            <h4 className="text-lg font-bold text-foreground mb-1">Meet {avatar.name.split(' ')[0]}</h4>
            <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
              {avatar.role} at NovaPay
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className="flex flex-col max-w-[85%] gap-2">
                {!msg.isUser && (
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: avatar.color }}>
                      {avatar.name}
                    </span>
                  </div>
                )}
                <div 
                  className={`rounded-2xl px-5 py-3.5 shadow-sm ${
                    msg.isUser 
                      ? 'bg-primary/10 border border-primary/20 text-foreground' 
                      : 'bg-card border border-border text-foreground/90'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-card border border-border rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: avatar.color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-border bg-card/30 backdrop-blur-md">
        <div className="flex items-center gap-3 p-2 bg-secondary/50 border border-border rounded-2xl focus-within:border-primary/30 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${avatar.name.split(' ')[0]}...`}
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
  );
}