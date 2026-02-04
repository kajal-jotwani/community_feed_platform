import React from 'react';

interface LikeButtonProps {
  likes: number;
  liked: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export const LikeButton: React.FC<LikeButtonProps> = ({ likes, liked, onClick, size = 'md' }) => {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-black transition-all duration-300
        ${liked ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black'}
        ${size === 'sm' ? 'text-[10px]' : 'text-xs'}
      `}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={liked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`w-3.5 h-3.5 ${liked ? 'scale-110' : ''}`}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span className="tabular-nums tracking-tighter">{likes}</span>
    </button>
  );
};
