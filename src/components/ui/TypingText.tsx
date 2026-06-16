import React, { useEffect } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  as?: React.ElementType;
  enabled?: boolean;
  onComplete?: () => void;
}

export function TypingText({
  text,
  speed = 30,
  className = '',
  as: Component = 'span',
  enabled = true,
  onComplete,
}: TypingTextProps) {
  const { displayedText, isTyping } = useTypingEffect(text, { speed, enabled });

  useEffect(() => {
    if (!isTyping && onComplete) {
      onComplete();
    }
  }, [isTyping, onComplete]);

  return (
    <Component className={className}>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-0.5 h-[1em] ml-0.5 bg-current animate-pulse align-middle" />
      )}
    </Component>
  );
}

export default TypingText;
