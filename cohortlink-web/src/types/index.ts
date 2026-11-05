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

export interface CreateRoomRequest {
  name: string;
}

export interface JoinRoomRequest {
  code: string;
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

// Task types
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskSource = 'ai' | 'manual' | 'sticky';

export interface Task {
  id: string;
  roomId: string;
  room?: Room;
  assigneeId: string;
  assignee?: User;
  creatorId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  source: TaskSource;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  roomId: string;
  assigneeId: string;
  title: string;
  description?: string;
  dueDate?: string;
  source?: TaskSource;
}

// Sticky Note types
export interface StickyNote {
  id: string;
  roomId: string;
  creatorId: string;
  creator?: User;
  title: string;
  content?: string;
  dueDate?: string;
  assigneeId?: string;
  assignee?: User;
  isDone: boolean;
  createdAt: string;
}

export interface CreateStickyNoteRequest {
  roomId: string;
  title: string;
  content?: string;
  dueDate?: string;
  assigneeId?: string;
}

// Meeting Note types
export interface MeetingNote {
  id: string;
  roomId: string;
  transcript: string;
  summary: MeetingSummary;
  tasks?: Task[];
  createdAt: string;
}

export interface MeetingSummary {
  topics: string[];
  keyPoints: string[];
  conclusions: string[];
  actionItems: string[];
}

// LLM Config types
export interface LLMConfig {
  id: string;
  userId: string;
  apiBaseUrl: string;
  apiKey: string;
  modelName: string;
  isDefault: boolean;
}

export interface CreateLLMConfigRequest {
  apiBaseUrl: string;
  apiKey: string;
  modelName: string;
  isDefault?: boolean;
}

// Voice Room types
export interface VoiceParticipant {
  userId: string;
  user?: User;
  isMuted: boolean;
  isSpeaking: boolean;
  joinedAt: string;
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
