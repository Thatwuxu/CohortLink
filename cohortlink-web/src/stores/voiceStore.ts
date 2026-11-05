import { create } from 'zustand';
import type { VoiceParticipant } from '../types';

interface VoiceState {
  isInCall: boolean;
  isMuted: boolean;
  participants: VoiceParticipant[];
  currentSpeaker: string | null;
  
  setInCall: (inCall: boolean) => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  
  setParticipants: (participants: VoiceParticipant[]) => void;
  addParticipant: (participant: VoiceParticipant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, updates: Partial<VoiceParticipant>) => void;
  
  setCurrentSpeaker: (userId: string | null) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isInCall: false,
  isMuted: false,
  participants: [],
  currentSpeaker: null,

  setInCall: (inCall) => set({ isInCall: inCall }),
  
  setMuted: (muted) => set({ isMuted: muted }),
  
  toggleMuted: () => set((state) => ({ isMuted: !state.isMuted })),

  setParticipants: (participants) => set({ participants }),
  
  addParticipant: (participant) => set((state) => ({
    participants: [...state.participants, participant],
  })),
  
  removeParticipant: (userId) => set((state) => ({
    participants: state.participants.filter(p => p.userId !== userId),
  })),
  
  updateParticipant: (userId, updates) => set((state) => ({
    participants: state.participants.map(p =>
      p.userId === userId ? { ...p, ...updates } : p
    ),
  })),

  setCurrentSpeaker: (userId) => set({ currentSpeaker: userId }),
}));
