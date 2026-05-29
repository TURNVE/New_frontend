import { useEffect, useState } from 'react';
import { useTypingEffect } from '../../hooks/useTypingEffect';

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  enabled?: boolean;
  onComplete?: () => void;
}

export function TypingText({ text, speed = 30, delay = 500, className = '', as = 'span', enabled = true, onComplete }: TypingTextProps) {
  const { displayedText, isTyping } = useTypingEffect(text, { speed, delay, enabled });
  const [showCursor, setShowCursor] = useState(true);
  const Tag = as;

  useEffect(() => {
    if (!isTyping) {
      const t = setTimeout(() => setShowCursor(false), 600);
      return () => clearTimeout(t);
    }
    setShowCursor(true);
  }, [isTyping]);

  useEffect(() => {
    if (!isTyping && displayedText === text) onComplete?.();
  }, [isTyping, displayedText, text, onComplete]);

  return (
    <Tag className={className}>
      {displayedText}
      <span className={`text-blue-500 transition-opacity duration-300 ${showCursor && isTyping ? 'opacity-100' : 'opacity-0'}`}>|</span>
    </Tag>
  );
}
