export interface UserSummary {
  id?: number;
  name: string;
  avatar: string;
  karma?: number;
}

export interface Comment {
  id: number;
  author: UserSummary;
  content: string;
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  replies: Comment[];
}

export interface Post {
  id: number;
  author: UserSummary;
  content: string;
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  comments: Comment[];
  hasLoadedComments?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user: UserSummary & { id: number; karma: number };
}

