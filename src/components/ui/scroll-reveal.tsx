import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '../../lib/utils';

type MotionTag = 'div' | 'section' | 'article' | 'header' | 'footer' | 'li' | 'span';
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  direction?: RevealDirection;
  amount?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const motionTags = motion as Record<MotionTag, typeof motion.div>;

function getHiddenState(direction: RevealDirection, distance: number) {
  switch (direction) {
    case 'down':
      return { opacity: 0, y: -distance };
    case 'left':
      return { opacity: 0, x: distance };
    case 'right':
      return { opacity: 0, x: -distance };
    case 'scale':
      return { opacity: 0, scale: 0.96 };
    case 'up':
    default:
      return { opacity: 0, y: distance };
  }
}

function getVisibleState(direction: RevealDirection) {
  switch (direction) {
    case 'scale':
      return { opacity: 1, scale: 1 };
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 };
    case 'down':
    case 'up':
    default:
      return { opacity: 1, y: 0 };
  }
}

export function ScrollReveal({
  children,
  className,
  as = 'div',
  direction = 'up',
  amount = 0.24,
  delay = 0,
  duration = 0.65,
  distance = 24,
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motionTags[as];

  if (prefersReducedMotion) {
    return <MotionTag className={cn(className)}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={getHiddenState(direction, distance)}
      whileInView={getVisibleState(direction)}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

