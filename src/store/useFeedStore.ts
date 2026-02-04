import { create } from 'zustand';
import type { Post, Comment, UserSummary } from '../types';
import { fetchPosts, fetchPostComments, likePostApi, likeCommentApi } from '../services/feedService';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  setPosts: (posts: Post[]) => void;
  loadPosts: () => Promise<void>;
  loadPostComments: (postId: number) => Promise<void>;
  likePost: (postId: number) => Promise<void>;
  likeComment: (postId: number, commentId: number) => Promise<void>;
  addPost: (content: string, author: UserSummary) => void;
  addComment: (postId: number, parentId: number | null, content: string, author: UserSummary) => void;
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
  
  addPost: (content: string, author: UserSummary) => {
    const newPost: Post = {
      id: Date.now(), // Temporary ID
      author,
      content,
      timestamp: new Date().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      likes: 0,
      likedByMe: false,
      comments: [],
      hasLoadedComments: false,
    };
    set({ posts: [newPost, ...get().posts] });
  },
  
  addComment: (postId: number, parentId: number | null, content: string, author: UserSummary) => {
    const { posts } = get();
    const newComment: Comment = {
      id: Date.now(), // Temporary ID
      author,
      content,
      timestamp: new Date().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      likes: 0,
      likedByMe: false,
      replies: [],
    };
    
    const addCommentToTree = (comments: Comment[]): Comment[] => {
      if (parentId === null) {
        return [...comments, newComment];
      }
      return comments.map((c) => {
        if (c.id === parentId) {
          return { ...c, replies: [...c.replies, newComment] };
        }
        return { ...c, replies: addCommentToTree(c.replies) };
      });
    };
    
    set({
      posts: posts.map((p) =>
        p.id === postId
          ? { ...p, comments: addCommentToTree(p.comments) }
          : p
      ),
    });
  },
}));
