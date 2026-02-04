import { create } from 'zustand';
import type { UserSummary } from '../types';

interface AuthState {
  user: UserSummary;
}

const avatarForName = (name: string): string => {
  const safe = encodeURIComponent(name || 'user');
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${safe}`;
};

export const useAuthStore = create<AuthState>(() => ({
  user: {
    name: 'Demo User',
    avatar: avatarForName('Demo User'),
    karma: 0,
  },
}));
