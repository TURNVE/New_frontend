/**
 * useAvatarChat - Manages avatar conversation state and memory
 */

import { useState, useCallback, useRef } from 'react';
import { AvatarId, AVATARS, getAvatarById } from '../data/novaPayAvatars';
import { Phase } from '../data/novaPayConfig';

export interface ChatMessage {
  id: string;
  avatarId: AvatarId;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export interface AvatarChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface UseAvatarChatReturn {
  sendMessage: (avatarId: AvatarId, content: string) => Promise<void>;
  getMessagesForAvatar: (avatarId: AvatarId) => ChatMessage[];
  clearChat: (avatarId?: AvatarId) => void;
  isLoading: boolean;
  getConversationSummary: (avatarId: AvatarId) => string;
}

const MAX_MESSAGES = 10;

export function useAvatarChat(currentPhase: Phase): UseAvatarChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatHistoryRef = useRef<Record<AvatarId, string[]>>({
    ceo: [],
    cto: [],
    designer: [],
    developer: [],
    data: []
  });

  const generateResponse = useCallback(async (avatarId: AvatarId, userMessage: string): Promise<string> => {
    const avatar = getAvatarById(avatarId);
    const history = chatHistoryRef.current[avatarId];
    
    // Build the system prompt with context
    const systemPrompt = avatar.systemPrompt
      .replace('{phase}', currentPhase)
      .replace('{history}', history.join('\n') || 'No previous conversation.');
    
    // Simulated GPT-4 response (replace with actual API call)
    // In production, this would call your backend endpoint
    const responses: Record<AvatarId, string[]> = {
      ceo: [
        "That sounds reasonable. What's your timeline for getting this done?",
        "I need to see data backing this up before I can approve.",
        "Good progress. Keep me updated on any blockers.",
        "We need to move faster on this. The board is asking questions."
      ],
      cto: [
        "Technically, that's feasible but we'd need to allocate at least 2 engineers for 3 weeks.",
        "I have concerns about the technical approach here. Let me explain why.",
        "The API can support that, but there are some constraints we need to discuss.",
        "I'll need to see a more detailed spec before we can estimate accurately."
      ],
      designer: [
        "I love the direction! But have we considered how this impacts the mobile experience?",
        "Let me show you some wireframes that might help clarify this.",
        "The UX implications here are significant. Can we schedule time to discuss?",
        "I've been thinking about the user flow and have some ideas to share."
      ],
      developer: [
        "I need this in a ticket before I can start. What's the priority?",
        "This is going to be tricky with the current architecture. Let me think through options.",
        "If requirements change again, we're going to slip the deadline. Just fyi.",
        "Can you be more specific? I need clear acceptance criteria."
      ],
      data: [
        "I can pull that data, but I'll need you to be more specific about the time range.",
        "Interesting question. Let me run the query and get back to you.",
        "The data shows a clear pattern there. Want me to break it down further?",
        "I'd need to see the methodology before I can validate those conclusions."
      ]
    };
    
    // Simple simulation - in production, call GPT-4 API
    const avatarResponses = responses[avatarId];
    const randomResponse = avatarResponses[Math.floor(Math.random() * avatarResponses.length)];
    
    // Add some variation based on user message length
    if (userMessage.length > 100) {
      return randomResponse + " Also, your message was quite detailed - I appreciate that level of preparation.";
    }
    
    return randomResponse;
  }, [currentPhase]);

  const sendMessage = useCallback(async (avatarId: AvatarId, content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      avatarId,
      content,
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate network delay for GPT-4 call
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
      
      const responseContent = await generateResponse(avatarId, content);
      
      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        avatarId,
        content: responseContent,
        timestamp: new Date(),
        isUser: false
      };

      setMessages(prev => [...prev, botMessage]);

      // Update chat history for context (last 10 messages)
      chatHistoryRef.current[avatarId] = [
        ...chatHistoryRef.current[avatarId].slice(-9),
        `User: ${content}`,
        `AI: ${responseContent}`
      ];
    } catch (err) {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [generateResponse]);

  const getMessagesForAvatar = useCallback((avatarId: AvatarId) => {
    return messages.filter(m => m.avatarId === avatarId);
  }, [messages]);

  const clearChat = useCallback((avatarId?: AvatarId) => {
    if (avatarId) {
      setMessages(prev => prev.filter(m => m.avatarId !== avatarId));
      chatHistoryRef.current[avatarId] = [];
    } else {
      setMessages([]);
      Object.keys(chatHistoryRef.current).forEach(key => {
        chatHistoryRef.current[key as AvatarId] = [];
      });
    }
  }, []);

  const getConversationSummary = useCallback((avatarId: AvatarId) => {
    const avatarMessages = getMessagesForAvatar(avatarId);
    if (avatarMessages.length === 0) return '';
    
    const recentMessages = avatarMessages.slice(-4);
    return recentMessages.map(m => 
      m.isUser ? `You: ${m.content.substring(0, 50)}...` : `${m.content.substring(0, 50)}...`
    ).join('\n');
  }, [getMessagesForAvatar]);

  return {
    sendMessage,
    getMessagesForAvatar,
    clearChat,
    isLoading,
    getConversationSummary
  };
}
