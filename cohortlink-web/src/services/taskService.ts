import api from './api';
import type { Task, CreateTaskRequest } from '../types';

export const taskService = {
  getMyTasks: (): Promise<Task[]> =>
    api.get('/tasks/my'),

  getRoomTasks: (roomId: string): Promise<Task[]> =>
    api.get(`/rooms/${roomId}/tasks`),

  createTask: (data: CreateTaskRequest): Promise<Task> =>
    api.post('/tasks', data),

  updateTask: (taskId: string, data: Partial<Task>): Promise<Task> =>
    api.put(`/tasks/${taskId}`, data),

  deleteTask: (taskId: string): Promise<void> =>
    api.delete(`/tasks/${taskId}`),

  updateTaskStatus: (taskId: string, status: Task['status']): Promise<Task> =>
    api.patch(`/tasks/${taskId}/status`, { status }),
};
