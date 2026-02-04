import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white shadow-md ring-1 ring-gray-100`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};
