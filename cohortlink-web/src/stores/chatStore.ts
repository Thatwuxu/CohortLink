import { create } from 'zustand';
import type { Message } from '../types';

interface ChatState {
  messages: Message[];
  typingUsers: Set<string>;
  
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typingUsers: new Set(),

  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  
  clearMessages: () => set({ messages: [] }),
}));
