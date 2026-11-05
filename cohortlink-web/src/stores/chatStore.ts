import { create } from 'zustand';
import type { Message } from '../types';

interface ChatState {
  messages: Message[];
  typingUsers: Set<string>;
  
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  
  setTypingUsers: (userIds: string[]) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typingUsers: new Set(),

  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  
  updateMessage: (messageId, updates) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    ),
  })),
  
  clearMessages: () => set({ messages: [] }),

  setTypingUsers: (userIds) => set({ typingUsers: new Set(userIds) }),
  
  addTypingUser: (userId) => set((state) => {
    const newSet = new Set(state.typingUsers);
    newSet.add(userId);
    return { typingUsers: newSet };
  }),
  
  removeTypingUser: (userId) => set((state) => {
    const newSet = new Set(state.typingUsers);
    newSet.delete(userId);
    return { typingUsers: newSet };
  }),
}));
