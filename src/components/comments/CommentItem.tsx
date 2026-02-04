import React, { useState } from 'react';
import type { Comment } from '../../types';
import { Avatar } from '../ui/Avatar';
import { LikeButton } from '../feed/LikeButton';
import { useFeedStore } from '../../store/useFeedStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ReplyBox } from './ReplyBox';

interface CommentItemProps {
  postId: number;
  comment: Comment;
  depth?: number;
}

const COMMENTS_PER_PAGE = 5;

export const CommentItem: React.FC<CommentItemProps> = ({ postId, comment, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const { likeComment, addComment } = useFeedStore();
  const currentUser = useAuthStore(s => s.user);

  const handleReply = (content: string) => {
    addComment(postId, comment.id, content, currentUser);
    setIsReplying(false);
  };

  const replies = comment.replies || [];
  const hasMoreReplies = replies.length > COMMENTS_PER_PAGE;
  const displayedReplies = showAllReplies ? replies : replies.slice(0, COMMENTS_PER_PAGE);

  return (
    <div className={`group ${depth > 0 ? 'ml-6 mt-3 border-l-2 border-gray-100 pl-4' : 'mt-6'}`}>
      <div className="flex gap-3">
        <Avatar src={comment.author.avatar} alt={comment.author.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              {comment.author.name}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {comment.timestamp}
            </span>
            {comment.author.karma && comment.author.karma > 1000 && (
              <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                Elite
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed tracking-tight">
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <LikeButton 
              size="sm" 
              likes={comment.likes} 
              liked={!!comment.likedByMe} 
              onClick={() => likeComment(postId, comment.id)} 
            />
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-medium text-gray-400 hover:text-indigo-500 transition-colors"
            >
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="mt-3">
              <ReplyBox autoFocus onSubmit={handleReply} />
            </div>
          )}

          {replies.length > 0 && (
            <div className="space-y-3 mt-4">
              {displayedReplies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  postId={postId} 
                  comment={reply} 
                  depth={depth + 1} 
                />
              ))}
              {hasMoreReplies && !showAllReplies && (
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors ml-9"
                >
                  Show {replies.length - COMMENTS_PER_PAGE} more replies
                </button>
              )}
              {hasMoreReplies && showAllReplies && (
                <button
                  onClick={() => setShowAllReplies(false)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors ml-9"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
