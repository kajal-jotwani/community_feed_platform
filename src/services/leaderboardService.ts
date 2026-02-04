import { get } from './api';
import type { LeaderboardEntry } from '../types';

type ApiLeaderboardItem = {
  user__id: number;
  user__username: string;
  total_karma: number;
};

const avatarForName = (name: string): string => {
  const safe = encodeURIComponent(name || 'user');
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${safe}`;
};

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await get<ApiLeaderboardItem[]>('/leaderboard/');
  return data.map((item, index) => ({
    rank: index + 1,
    user: {
      id: item.user__id,
      name: item.user__username,
      karma: item.total_karma,
      avatar: avatarForName(item.user__username),
    },
  }));
}

