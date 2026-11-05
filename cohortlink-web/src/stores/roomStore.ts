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
  addMember: (member: RoomMember) => void;
  removeMember: (userId: string) => void;
  setOnlineUsers: (userIds: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  rooms: [],
  members: [],
  onlineUsers: new Set(),

  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  setRooms: (rooms) => set({ rooms }),
  
  addRoom: (room) => set((state) => ({ 
    rooms: [...state.rooms, room] 
  })),
  
  removeRoom: (roomId) => set((state) => ({ 
    rooms: state.rooms.filter(r => r.id !== roomId) 
  })),

  setMembers: (members) => set({ members }),
  
  addMember: (member) => set((state) => ({ 
    members: [...state.members, member] 
  })),
  
  removeMember: (userId) => set((state) => ({ 
    members: state.members.filter(m => m.userId !== userId) 
  })),

  setOnlineUsers: (userIds) => set({ onlineUsers: new Set(userIds) }),
  
  addOnlineUser: (userId) => set((state) => {
    const newSet = new Set(state.onlineUsers);
    newSet.add(userId);
    return { onlineUsers: newSet };
  }),
  
  removeOnlineUser: (userId) => set((state) => {
    const newSet = new Set(state.onlineUsers);
    newSet.delete(userId);
    return { onlineUsers: newSet };
  }),
}));
