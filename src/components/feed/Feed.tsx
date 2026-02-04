import React, { useEffect, useState } from 'react';
import { useFeedStore } from '../../store/useFeedStore';
import { useAuthStore } from '../../store/useAuthStore';
import { PostCard } from './PostCard';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const Feed: React.FC = () => {
  const { posts, isLoading, addPost, loadPosts } = useFeedStore();
  const currentUser = useAuthStore(s => s.user);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      addPost(newPostContent, currentUser);
      setNewPostContent('');
    }
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse h-56 bg-white/50"></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Card className="shadow-2xl shadow-gray-200/50">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-5 items-start">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What are you working on today?"
                className="w-full min-h-[120px] text-xl bg-transparent border-none focus:outline-none placeholder:text-gray-300 font-medium tracking-tight resize-none"
              />
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <button type="button" className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                   <Button 
                    type="submit" 
                    disabled={!newPostContent.trim()}
                    className="px-10"
                    variant="primary"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Card>

      <div className="space-y-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <p className="text-gray-400 font-medium">No posts yet. Be the first to share!</p>
          </Card>
        )}
      </div>
    </div>
  );
};
