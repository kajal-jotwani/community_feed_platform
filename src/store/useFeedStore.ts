import { create } from 'zustand';
import type { Post, Comment, UserSummary } from '../types';
import {
  fetchPosts,
  fetchPostComments,
  likePostApi,
  likeCommentApi,
  createPostApi,
  createCommentApi,
} from '../services/feedService';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  setPosts: (posts: Post[]) => void;
  loadPosts: () => Promise<void>;
  loadPostComments: (postId: number) => Promise<void>;
  likePost: (postId: number) => Promise<void>;
  likeComment: (postId: number, commentId: number) => Promise<void>;
  addPost: (content: string, author: UserSummary) => Promise<void>;
  addComment: (postId: number, parentId: number | null, content: string, author: UserSummary) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  
  setPosts: (posts) => set({ posts }),
  
  loadPosts: async () => {
    set({ isLoading: true });
    try {
      const posts = await fetchPosts();
      set({ posts, isLoading: false });
    } catch (error) {
      console.error('Failed to load posts:', error);
      set({ isLoading: false });
    }
  },
  
  loadPostComments: async (postId: number) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post || post.hasLoadedComments) return;
    
    try {
      const comments = await fetchPostComments(postId);
      set({
        posts: posts.map((p) =>
          p.id === postId
            ? { ...p, comments, hasLoadedComments: true }
            : p
        ),
      });
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  },
  
  likePost: async (postId: number) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    
    const wasLiked = post.likedByMe;
    
    // Backend doesn't support unliking, so only allow liking
    if (wasLiked) {
      return; // Already liked, do nothing
    }
    
    const newLikes = post.likes + 1;
    
    // Optimistic update
    set({
      posts: posts.map((p) =>
        p.id === postId
          ? { ...p, likes: newLikes, likedByMe: true }
          : p
      ),
    });
    
    try {
      await likePostApi(postId);
    } catch (error) {
      // Revert on error
      set({
        posts: posts.map((p) =>
          p.id === postId
            ? { ...p, likes: post.likes, likedByMe: false }
            : p
      ),
      });
      console.error('Failed to like post:', error);
    }
  },
  
  likeComment: async (postId: number, commentId: number) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    
    const findComment = (comments: Comment[]): Comment | null => {
      for (const c of comments) {
        if (c.id === commentId) return c;
        const found = findComment(c.replies);
        if (found) return found;
      }
      return null;
    };
    
    const comment = findComment(post.comments);
    if (!comment) return;
    
    // Backend doesn't support unliking, so only allow liking
    if (comment.likedByMe) {
      return; // Already liked, do nothing
    }
    
    const updateCommentLikes = (comments: Comment[]): Comment[] => {
      return comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: c.likes + 1,
            likedByMe: true,
          };
        }
        if (c.replies.length > 0) {
          return { ...c, replies: updateCommentLikes(c.replies) };
        }
        return c;
      });
    };
    
    const updatedComments = updateCommentLikes(post.comments);
    
    // Optimistic update
    set({
      posts: posts.map((p) =>
        p.id === postId ? { ...p, comments: updatedComments } : p
      ),
    });
    
    try {
      await likeCommentApi(commentId);
    } catch (error) {
      // Revert on error - reload comments
      try {
        const comments = await fetchPostComments(postId);
        set({
          posts: posts.map((p) =>
            p.id === postId ? { ...p, comments } : p
          ),
        });
      } catch {
        // Fallback: revert to original
        set({
          posts: posts.map((p) =>
            p.id === postId ? { ...p, comments: post.comments } : p
          ),
        });
      }
      console.error('Failed to like comment:', error);
    }
  },
  
  addPost: async (content: string, author: UserSummary) => {
    const ts = new Date().toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const tempPost: Post = {
      id: -1,
      author,
      content,
      timestamp: ts,
      likes: 0,
      likedByMe: false,
      comments: [],
      hasLoadedComments: false,
    };
    set({ posts: [tempPost, ...get().posts] });
    try {
      const created = await createPostApi(content);
      const newPost: Post = {
        id: created.id,
        author: {
          name: created.author,
          avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(created.author || 'user')}`,
        },
        content: created.content,
        timestamp: new Date(created.created_at).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        likes: created.like_count ?? 0,
        likedByMe: false,
        comments: [],
        hasLoadedComments: false,
      };
      set({
        posts: get().posts.map((p) => (p.id === -1 ? newPost : p)),
      });
    } catch (e) {
      set({ posts: get().posts.filter((p) => p.id !== -1) });
      console.error('Failed to create post:', e);
    }
  },

  addComment: async (postId: number, parentId: number | null, content: string, author: UserSummary) => {
    const { posts } = get();
    const formatTs = (iso: string) => {
      try {
        return new Date(iso).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return iso;
      }
    };
    const mapU = (username: string): UserSummary => ({
      name: username,
      avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(username || 'user')}`,
    });
    const newComment: Comment = {
      id: -1,
      author,
      content,
      timestamp: formatTs(new Date().toISOString()),
      likes: 0,
      likedByMe: false,
      replies: [],
    };
    const addToTree = (comments: Comment[]): Comment[] => {
      if (parentId === null) return [...comments, newComment];
      return comments.map((c) => {
        if (c.id === parentId) return { ...c, replies: [...c.replies, newComment] };
        return { ...c, replies: addToTree(c.replies) };
      });
    };
    set({
      posts: posts.map((p) =>
        p.id === postId ? { ...p, comments: addToTree(p.comments) } : p
      ),
    });
    try {
      const created = await createCommentApi(postId, content, parentId);
      const persisted: Comment = {
        id: created.id,
        author: mapU(created.author),
        content: created.content,
        timestamp: formatTs(created.created_at),
        likes: 0,
        likedByMe: false,
        replies: (created.children ?? []).map((ch) => ({
          id: ch.id,
          author: mapU(ch.author),
          content: ch.content,
          timestamp: formatTs(ch.created_at),
          likes: 0,
          likedByMe: false,
          replies: [],
        })),
      };
      const replaceTemp = (comments: Comment[]): Comment[] =>
        comments.map((c) => (c.id === -1 ? persisted : { ...c, replies: replaceTemp(c.replies) }));
      set({
        posts: get().posts.map((p) =>
          p.id === postId ? { ...p, comments: replaceTemp(p.comments) } : p
        ),
      });
    } catch (e) {
      set({
        posts: get().posts.map((p) =>
          p.id === postId
            ? { ...p, comments: p.comments.filter((c) => c.id !== -1) }
            : p
        ),
      });
      console.error('Failed to create comment:', e);
    }
  },
}));
