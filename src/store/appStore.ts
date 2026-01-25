import { create } from 'zustand';

export interface Match {
  id: string;
  name: string;
  age: number;
  avatar: string;
  compatibility: number;
  interests: string[];
  lastActive: string;
  bio: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface AppState {
  currentScreen: 'splash' | 'onboarding' | 'permissions' | 'orientation' | 'create-profile' | 'analyzing' | 'matches' | 'chat' | 'messages' | 'profile' | 'settings';
  orientation: string | null;
  setOrientation: (orientation: string) => void;
  permissionsGranted: boolean;
  matches: Match[];
  messages: Message[];
  currentMatchId: string | null;
  notifications: { id: string; type: 'match' | 'message'; matchId: string; text: string }[];
  setScreen: (screen: AppState['currentScreen']) => void;
  grantPermissions: () => void;
  setMatches: (matches: Match[]) => void;
  addMessage: (message: Message) => void;
  setCurrentMatch: (matchId: string | null) => void;
  addNotification: (notification: AppState['notifications'][0]) => void;
  clearNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentScreen: 'splash',
  permissionsGranted: false,
  orientation: null,
  setOrientation: (orientation) => set({ orientation }),
  matches: [],
  messages: [],
  currentMatchId: null,
  notifications: [],
  setScreen: (screen) => set({ currentScreen: screen }),
  grantPermissions: () => set({ permissionsGranted: true }),
  setMatches: (matches) => set({ matches }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setCurrentMatch: (matchId) => set({ currentMatchId: matchId }),
  addNotification: (notification) => set((state) => ({ 
    notifications: [...state.notifications, notification] 
  })),
  clearNotification: (id) => set((state) => ({ 
    notifications: state.notifications.filter(n => n.id !== id) 
  })),
}));
