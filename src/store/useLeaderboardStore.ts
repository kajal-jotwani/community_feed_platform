import { create } from 'zustand';
import type { LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../services/leaderboardService';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  loadLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  isLoading: false,
  
  loadLeaderboard: async () => {
    set({ isLoading: true });
    try {
      const entries = await fetchLeaderboard();
      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      set({ isLoading: false });
    }
  },
}));
