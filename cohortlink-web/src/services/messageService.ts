import api from './api';
import type { Message, SendMessageRequest, PageResponse } from '../types';

export const messageService = {
  getMessages: (roomId: string, page: number = 1, pageSize: number = 20): Promise<PageResponse<Message>> =>
    api.get(`/rooms/${roomId}/messages`, { params: { page, pageSize } }),

  sendMessage: (roomId: string, data: SendMessageRequest): Promise<Message> =>
    api.post(`/rooms/${roomId}/messages`, data),

  searchMessages: (roomId: string, params: { keyword?: string; type?: string; startDate?: string; endDate?: string }): Promise<Message[]> =>
    api.get(`/rooms/${roomId}/messages/search`, { params }),

  deleteMessage: (roomId: string, messageId: string): Promise<void> =>
    api.delete(`/rooms/${roomId}/messages/${messageId}`),
};
