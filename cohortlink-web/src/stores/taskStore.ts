import { create } from 'zustand';
import type { Task, StickyNote } from '../types';

interface TaskState {
  tasks: Task[];
  myTasks: Task[];
  stickyNotes: StickyNote[];
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  
  setMyTasks: (tasks: Task[]) => void;
  
  setStickyNotes: (notes: StickyNote[]) => void;
  addStickyNote: (note: StickyNote) => void;
  updateStickyNote: (noteId: string, updates: Partial<StickyNote>) => void;
  removeStickyNote: (noteId: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  myTasks: [],
  stickyNotes: [],

  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task],
  })),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    ),
  })),
  
  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== taskId),
  })),

  setMyTasks: (tasks) => set({ myTasks: tasks }),

  setStickyNotes: (notes) => set({ stickyNotes: notes }),
  
  addStickyNote: (note) => set((state) => ({
    stickyNotes: [...state.stickyNotes, note],
  })),
  
  updateStickyNote: (noteId, updates) => set((state) => ({
    stickyNotes: state.stickyNotes.map(n =>
      n.id === noteId ? { ...n, ...updates } : n
    ),
  })),
  
  removeStickyNote: (noteId) => set((state) => ({
    stickyNotes: state.stickyNotes.filter(n => n.id !== noteId),
  })),
}));
