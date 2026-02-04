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

function mapLeaderboardData(data: ApiLeaderboardItem[]): LeaderboardEntry[] {
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

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await get<ApiLeaderboardItem[]>('/leaderboard/');
  return mapLeaderboardData(data);
}

export async function fetchLeaderboardFull(): Promise<LeaderboardEntry[]> {
  const data = await get<ApiLeaderboardItem[]>('/leaderboard/full/');
  return mapLeaderboardData(data);
}
