import api from './api';
import type { LLMConfig, CreateLLMConfigRequest } from '../types';

export const llmService = {
  getConfigs: (): Promise<LLMConfig[]> =>
    api.get('/llm/configs'),

  createConfig: (data: CreateLLMConfigRequest): Promise<LLMConfig> =>
    api.post('/llm/configs', data),

  updateConfig: (configId: string, data: Partial<LLMConfig>): Promise<LLMConfig> =>
    api.put(`/llm/configs/${configId}`, data),

  deleteConfig: (configId: string): Promise<void> =>
    api.delete(`/llm/configs/${configId}`),

  setDefaultConfig: (configId: string): Promise<void> =>
    api.post(`/llm/configs/${configId}/default`),

  testConnection: (data: CreateLLMConfigRequest): Promise<{ success: boolean; message: string }> =>
    api.post('/llm/configs/test', data),

  transcribeAudio: (roomId: string, audioBlob: Blob): Promise<{ text: string }> =>
    api.post(`/rooms/${roomId}/ai/transcribe`, audioBlob, {
      headers: { 'Content-Type': 'audio/webm' },
    }),

  generateTasks: (roomId: string, summary: string): Promise<{ tasks: Array<{ title: string; description?: string; dueDate?: string }> }> =>
    api.post(`/rooms/${roomId}/ai/generate-tasks`, { summary }),
};
