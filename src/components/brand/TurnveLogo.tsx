import { useState } from 'react';

interface TurnveLogoProps {
  className?: string
  variant?: 'mark' | 'full'
}

export function TurnveLogo({ className = 'h-9 w-auto', variant = 'full' }: TurnveLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-label="TURNVE"
        className={`inline-flex items-center font-black italic tracking-tight text-[#5e6ad2] ${className}`}
      >
        TURNVE
      </span>
    );
  }

  return (
    <img
      src={variant === 'mark' ? '/logo.png' : '/logo.svg'}
      alt="TURNVE"
      className={`block object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
