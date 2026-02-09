import { create } from 'zustand';

interface WorkspaceState {
  currentWorkspace: any | null;
  stats: any | null;
  activities: any[];
  onlineUsers: string[];
  setCurrentWorkspace: (workspace: any) => void;
  setStats: (stats: any) => void;
  addActivity: (activity: any) => void;
  setOnlineUsers: (users: string[]) => void;
}

export const useWorkspace = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  stats: null,
  activities: [],
  onlineUsers: [],
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setStats: (stats) => set({ stats }),
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities].slice(0, 50),
  })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
