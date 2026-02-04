import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] tracking-tight';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-gray-200',
    secondary: 'bg-[#4ade80] text-black hover:bg-[#22c55e] shadow-sm',
    outline: 'bg-white text-black border-2 border-black hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
