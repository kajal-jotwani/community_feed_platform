import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-[2.5rem] border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${noPadding ? '' : 'p-8'} ${className}`}>
      {children}
    </div>
  );
};
