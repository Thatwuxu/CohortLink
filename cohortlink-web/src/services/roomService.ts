import api from './api';
import type { Room, CreateRoomRequest, RoomMember } from '../types';

export const roomService = {
  createRoom: (data: CreateRoomRequest): Promise<Room> =>
    api.post('/rooms', data),

  getRooms: (): Promise<Room[]> =>
    api.get('/rooms'),

  getRoom: (roomId: string): Promise<Room> =>
    api.get(`/rooms/${roomId}`),

  joinRoom: (code: string): Promise<Room> =>
    api.post(`/rooms/${code}/join`),

  leaveRoom: (roomId: string): Promise<void> =>
    api.post(`/rooms/${roomId}/leave`),

  getMembers: (roomId: string): Promise<RoomMember[]> =>
    api.get(`/rooms/${roomId}/members`),

  removeMember: (roomId: string, userId: string): Promise<void> =>
    api.delete(`/rooms/${roomId}/members/${userId}`),

  updateRoom: (roomId: string, data: Partial<Room>): Promise<Room> =>
    api.put(`/rooms/${roomId}`, data),

  deleteRoom: (roomId: string): Promise<void> =>
    api.delete(`/rooms/${roomId}`),
};
