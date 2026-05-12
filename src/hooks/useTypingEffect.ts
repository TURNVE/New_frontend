import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypingEffectOptions {
  speed?: number;
  delay?: number;
  enabled?: boolean;
}

interface UseTypingEffectReturn {
  displayedText: string;
  isTyping: boolean;
}

export function useTypingEffect(text: string, options?: UseTypingEffectOptions): UseTypingEffectReturn {
  const { speed = 30, delay = 500, enabled = true } = options ?? {};
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  useEffect(() => {
    if (!enabled) { setDisplayedText(text); setIsTyping(false); clear(); return; }
    if (!text) { setDisplayedText(''); setIsTyping(false); return; }
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const tick = () => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i < text.length) { timeoutRef.current = setTimeout(tick, speed); }
      else { setIsTyping(false); }
    };
    timeoutRef.current = setTimeout(tick, delay);
    return clear;
  }, [text, speed, delay, enabled, clear]);

  return { displayedText, isTyping };
}
