import { get, post } from './api';
import type { Post as UiPost, Comment as UiComment, UserSummary } from '../types';

// Backend shapes
type ApiPost = {
  id: number;
  author: string;
  content: string;
  created_at: string;
  like_count: number;
};

type ApiComment = {
  id: number;
  author: string;
  content: string;
  created_at: string;
  children: ApiComment[];
};

const avatarForName = (name: string): string => {
  const safe = encodeURIComponent(name || 'user');
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${safe}`;
};

const formatTimestamp = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const mapUser = (username: string): UserSummary => ({
  name: username,
  avatar: avatarForName(username),
});

const mapComment = (c: ApiComment): UiComment => ({
  id: c.id,
  author: mapUser(c.author),
  content: c.content,
  timestamp: formatTimestamp(c.created_at),
  likes: 0,
  likedByMe: false,
  replies: c.children?.map(mapComment) ?? [],
});

export async function fetchPosts(): Promise<UiPost[]> {
  const data = await get<ApiPost[]>('/posts/');
  return data.map((p) => ({
    id: p.id,
    author: mapUser(p.author),
    content: p.content,
    timestamp: formatTimestamp(p.created_at),
    likes: p.like_count ?? 0,
    likedByMe: false,
    comments: [],
    hasLoadedComments: false,
  }));
}

export async function fetchPostComments(postId: number): Promise<UiComment[]> {
  const data = await get<ApiComment[]>(`/posts/${postId}/comments/`);
  return data.map(mapComment);
}

export async function likePostApi(postId: number): Promise<void> {
  await post(`/posts/${postId}/like/`);
}

export async function likeCommentApi(commentId: number): Promise<void> {
  await post(`/comments/${commentId}/like/`);
}

export async function createPostApi(content: string): Promise<ApiPost> {
  return post<ApiPost>('/posts/create/', { content });
}

export async function createCommentApi(
  postId: number,
  content: string,
  parentId: number | null
): Promise<ApiComment> {
  return post<ApiComment>(`/posts/${postId}/comments/create/`, {
    content,
    parent_id: parentId,
  });
}
