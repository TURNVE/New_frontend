import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(text: string, options?: {
  speed?: number;
  delay?: number;
  enabled?: boolean;
}) {
  const { speed = 30, delay = 0, enabled = true } = options ?? {};
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      let index = 0;
      const type = () => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
          timeoutRef.current = setTimeout(type, speed);
        } else {
          setIsTyping(false);
        }
      };
      type();
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, delay, enabled]);

  return { displayedText, isTyping };
}
