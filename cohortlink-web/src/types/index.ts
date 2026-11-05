// User types
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  studentId?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  verificationCode?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Room types
export interface Room {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  owner?: User;
  members?: RoomMember[];
  createdAt: string;
}

export interface RoomMember {
  id: string;
  userId: string;
  user?: User;
  roomId: string;
  role: 'owner' | 'member';
  joinedAt: string;
}

// Message types
export type MessageType = 'text' | 'code' | 'image' | 'system';

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  user?: User;
  type: MessageType;
  content: string;
  language?: string;
  replyToId?: string;
  createdAt: string;
}

export interface SendMessageRequest {
  type: MessageType;
  content: string;
  language?: string;
  replyToId?: string;
}

// API Response types
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
