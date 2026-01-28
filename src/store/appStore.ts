import { create } from 'zustand';
import type { Match, Message, Notification } from '@/types';

// Re-export types for backward compatibility
export type { Match, Message, Notification } from '@/types';

interface AppState {
  currentScreen: 'splash' | 'auth' | 'onboarding' | 'permissions' | 'orientation' | 'create-profile' | 'analyzing' | 'matches' | 'chat' | 'messages' | 'profile' | 'settings';
  orientation: string | null;
  setOrientation: (orientation: string) => void;
  permissionsGranted: boolean;
  matches: Match[];
  messages: Message[];
  currentMatchId: string | null;
  notifications: Notification[];
  setScreen: (screen: AppState['currentScreen']) => void;
  grantPermissions: () => void;
  setMatches: (matches: Match[]) => void;
  addMessage: (message: Message) => void;
  setCurrentMatch: (matchId: string | null) => void;
  addNotification: (notification: Notification) => void;
  clearNotification: (id: string) => void;
  resetApp: () => void;
}

const initialState = {
  currentScreen: 'splash' as const,
  permissionsGranted: false,
  orientation: null,
  matches: [],
  messages: [],
  currentMatchId: null,
  notifications: [],
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setOrientation: (orientation) => set({ orientation }),
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
  resetApp: () => set(initialState),
}));
