import { create } from 'zustand';
import type { Room, RoomMember } from '../types';

interface RoomState {
  currentRoom: Room | null;
  rooms: Room[];
  members: RoomMember[];
  onlineUsers: Set<string>;
  
  setCurrentRoom: (room: Room | null) => void;
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
  setMembers: (members: RoomMember[]) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  rooms: [],
  members: [],
  onlineUsers: new Set(),

  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  removeRoom: (roomId) => set((state) => ({ rooms: state.rooms.filter(r => r.id !== roomId) })),
  setMembers: (members) => set({ members }),
}));
