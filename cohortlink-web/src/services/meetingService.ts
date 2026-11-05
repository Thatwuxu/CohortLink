import api from './api';
import type { MeetingNote, MeetingSummary } from '../types';

export const meetingService = {
  getMeetingNotes: (roomId: string): Promise<MeetingNote[]> =>
    api.get(`/rooms/${roomId}/meetings`),

  getMeetingNote: (roomId: string, noteId: string): Promise<MeetingNote> =>
    api.get(`/rooms/${roomId}/meetings/${noteId}`),

  createMeetingNote: (roomId: string, transcript: string): Promise<MeetingNote> =>
    api.post(`/rooms/${roomId}/meetings`, { transcript }),

  generateSummary: (roomId: string, noteId: string): Promise<MeetingSummary> =>
    api.post(`/rooms/${roomId}/meetings/${noteId}/generate-summary`),

  updateSummary: (roomId: string, noteId: string, summary: MeetingSummary): Promise<MeetingNote> =>
    api.put(`/rooms/${roomId}/meetings/${noteId}/summary`, { summary }),

  deleteMeetingNote: (roomId: string, noteId: string): Promise<void> =>
    api.delete(`/rooms/${roomId}/meetings/${noteId}`),
};
