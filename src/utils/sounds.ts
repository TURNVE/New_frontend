const AUDIO_CONTEXT = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playSound = (type: 'notification' | 'success' | 'warning' | 'error' | 'email' | 'message') => {
  if (!AUDIO_CONTEXT) return;
  
  // Resume audio context if suspended (required by browsers)
  if (AUDIO_CONTEXT.state === 'suspended') {
    AUDIO_CONTEXT.resume();
  }

  const oscillator = AUDIO_CONTEXT.createOscillator();
  const gainNode = AUDIO_CONTEXT.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(AUDIO_CONTEXT.destination);

  const now = AUDIO_CONTEXT.currentTime;

  switch (type) {
    case 'notification':
      // Pleasant chime
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;

    case 'success':
      // Rising success sound
      oscillator.frequency.setValueAtTime(523, now);
      oscillator.frequency.setValueAtTime(659, now + 0.1);
      oscillator.frequency.setValueAtTime(784, now + 0.2);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;

    case 'warning':
      // Alert tone
      oscillator.frequency.setValueAtTime(440, now);
      oscillator.frequency.setValueAtTime(550, now + 0.15);
      oscillator.frequency.setValueAtTime(440, now + 0.3);
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      oscillator.start(now);
      oscillator.stop(now + 0.45);
      break;

    case 'error':
      // Urgent alarm
      oscillator.frequency.setValueAtTime(220, now);
      oscillator.frequency.setValueAtTime(180, now + 0.1);
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
      
      // Second beep
      const osc2 = AUDIO_CONTEXT.createOscillator();
      const gain2 = AUDIO_CONTEXT.createGain();
      osc2.connect(gain2);
      gain2.connect(AUDIO_CONTEXT.destination);
      osc2.frequency.setValueAtTime(220, now + 0.35);
      osc2.frequency.setValueAtTime(180, now + 0.45);
      osc2.type = 'sawtooth';
      gain2.gain.setValueAtTime(0.1, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc2.start(now + 0.35);
      osc2.stop(now + 0.6);
      break;

    case 'email':
      // Email "ding"
      oscillator.frequency.setValueAtTime(1047, now);
      oscillator.frequency.setValueAtTime(1319, now + 0.08);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
      break;

    case 'message':
      // Quick pop
      oscillator.frequency.setValueAtTime(660, now);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;
  }
};

// Request permission to play sounds on first user interaction
let soundEnabled = true;

export const enableSounds = () => {
  soundEnabled = true;
  if (AUDIO_CONTEXT?.state === 'suspended') {
    AUDIO_CONTEXT.resume();
  }
};

export const disableSounds = () => {
  soundEnabled = false;
};

export const isSoundEnabled = () => soundEnabled;

export const playSoundIfEnabled = (type: 'notification' | 'success' | 'warning' | 'error' | 'email' | 'message') => {
  if (soundEnabled) {
    playSound(type);
  }
};