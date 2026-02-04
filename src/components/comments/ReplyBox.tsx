import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface ReplyBoxProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const ReplyBox: React.FC<ReplyBoxProps> = ({ onSubmit, placeholder = "Write a reply...", autoFocus }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-3 items-start">
      <textarea
        autoFocus={autoFocus}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-h-[80px] p-3 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none"
      />
      <Button type="submit" size="sm" disabled={!text.trim()} className="mt-1">
        Send
      </Button>
    </form>
  );
};
