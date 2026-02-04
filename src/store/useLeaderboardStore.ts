import { create } from 'zustand';
import type { LeaderboardEntry } from '../types';
import { fetchLeaderboard, fetchLeaderboardFull } from '../services/leaderboardService';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  fullEntries: LeaderboardEntry[];
  isLoading: boolean;
  fullListOpen: boolean;
  loadLeaderboard: () => Promise<void>;
  loadLeaderboardFull: () => Promise<void>;
  setFullListOpen: (open: boolean) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  fullEntries: [],
  isLoading: false,
  fullListOpen: false,

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

  loadLeaderboardFull: async () => {
    try {
      const fullEntries = await fetchLeaderboardFull();
      set({ fullEntries, fullListOpen: true });
    } catch (error) {
      console.error('Failed to load full leaderboard:', error);
    }
  },

  setFullListOpen: (open) => set({ fullListOpen: open }),
}));
