import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authService = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('/auth/register', data),

  logout: (): Promise<void> =>
    api.post('/auth/logout'),

  getProfile: (): Promise<User> =>
    api.get('/auth/profile'),

  updateProfile: (data: Partial<User>): Promise<User> =>
    api.put('/auth/profile', data),

  sendVerificationCode: (email: string): Promise<void> =>
    api.post('/auth/verification-code', { email }),
};
