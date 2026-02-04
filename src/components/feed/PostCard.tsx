import React, { useState, useEffect } from 'react';
import type { Post } from '../../types';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { LikeButton } from './LikeButton';
import { useFeedStore } from '../../store/useFeedStore';
import { CommentItem } from '../comments/CommentItem';
import { ReplyBox } from '../comments/ReplyBox';
import { useAuthStore } from '../../store/useAuthStore';

interface PostCardProps {
  post: Post;
}

const COMMENTS_TO_SHOW_INITIALLY = 3;

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const { likePost, addComment, loadPostComments } = useFeedStore();
  const currentUser = useAuthStore(s => s.user);

  useEffect(() => {
    if (expanded && !post.hasLoadedComments) {
      loadPostComments(post.id);
    }
  }, [expanded, post.hasLoadedComments, post.id, loadPostComments]);

  const handleAddComment = (content: string) => {
    addComment(post.id, null, content, currentUser);
  };

  const comments = post.comments || [];
  const displayedComments = showAllComments ? comments : comments.slice(0, COMMENTS_TO_SHOW_INITIALLY);
  const hasMoreComments = comments.length > COMMENTS_TO_SHOW_INITIALLY;

  return (
    <Card className="hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
      <div className="flex gap-5 items-start">
        <Avatar src={post.author.avatar} alt={post.author.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-extrabold text-black tracking-tight">
              {post.author.name}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full">
              {post.timestamp}
            </span>
          </div>
          <p className="text-gray-800 leading-relaxed text-[17px] font-medium tracking-tight whitespace-pre-wrap">
            {post.content}
          </p>
          
          <div className="flex items-center gap-8 mt-6">
            <LikeButton 
              likes={post.likes} 
              liked={!!post.likedByMe} 
              onClick={() => likePost(post.id)} 
            />
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {comments.length}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-10 pt-8 border-t border-gray-100">
          <div className="mb-8">
            <ReplyBox placeholder="Write a bold comment..." onSubmit={handleAddComment} />
          </div>
          <div className="space-y-8">
            {displayedComments.map(comment => (
              <CommentItem key={comment.id} postId={post.id} comment={comment} />
            ))}
            {comments.length === 0 && (
              <div className="py-6 px-8 bg-gray-50 rounded-[2rem] text-center border-2 border-dashed border-gray-100">
                <p className="text-sm font-bold text-gray-400 italic">No whispers yet.</p>
              </div>
            )}
            {hasMoreComments && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="w-full py-3 bg-gray-50 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-black transition-all"
              >
                Show {comments.length - COMMENTS_TO_SHOW_INITIALLY} more comments
              </button>
            )}
            {hasMoreComments && showAllComments && (
              <button
                onClick={() => setShowAllComments(false)}
                className="w-full py-3 bg-gray-50 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-black transition-all"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
