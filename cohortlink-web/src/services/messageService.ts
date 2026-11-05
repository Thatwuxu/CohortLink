import api from './api';
import type { Message, SendMessageRequest } from '../types';

export const messageService = {
  getMessages: (roomId: string, params?: { page?: number; pageSize?: number }): Promise<{ items: Message[]; total: number }> =>
    api.get(`/rooms/${roomId}/messages`, { params }),

  sendMessage: (roomId: string, data: SendMessageRequest): Promise<Message> =>
    api.post(`/rooms/${roomId}/messages`, data),

  searchMessages: (roomId: string, query: string, params?: { type?: string; startDate?: string; endDate?: string }): Promise<Message[]> =>
    api.get(`/rooms/${roomId}/messages/search`, { params: { q: query, ...params } }),

  deleteMessage: (roomId: string, messageId: string): Promise<void> =>
    api.delete(`/rooms/${roomId}/messages/${messageId}`),
};
