const PORTFOLIO_COLORS = [
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-green-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
  'from-teal-500 to-cyan-600',
  'from-fuchsia-500 to-purple-600',
  'from-lime-500 to-green-600',
  'from-red-500 to-orange-600',
];

export function getRandomColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return PORTFOLIO_COLORS[Math.abs(hash) % PORTFOLIO_COLORS.length];
}

export function generateShareToken(userId: string): string {
  const randomPart = crypto.getRandomValues(new Uint32Array(2));
  return `portfolio-${userId}-${randomPart[0].toString(16)}${randomPart[1].toString(16)}`;
}

export const THEME_PRESETS = {
  professional: {
    name: 'Professional',
    colors: {
      primary: 'blue',
      gradient: 'from-blue-600 to-indigo-700',
      background: 'gray',
      cardBg: 'white',
    },
    style: 'clean',
  },
  creative: {
    name: 'Creative',
    colors: {
      primary: 'violet',
      gradient: 'from-violet-500 to-fuchsia-600',
      background: 'gray',
      cardBg: 'white',
    },
    style: 'bold',
  },
  minimalist: {
    name: 'Minimalist',
    colors: {
      primary: 'slate',
      gradient: 'from-slate-600 to-slate-800',
      background: 'white',
      cardBg: 'gray',
    },
    style: 'minimal',
  },
  vibrant: {
    name: 'Vibrant',
    colors: {
      primary: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      background: 'gray',
      cardBg: 'white',
    },
    style: 'bold',
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: 'blue',
      gradient: 'from-indigo-400 to-blue-500',
      background: 'dark',
      cardBg: 'dark-card',
    },
    style: 'dark',
  },
};

export type ThemePresetKey = keyof typeof THEME_PRESETS;

export function isValidTheme(key: string): key is ThemePresetKey {
  return key in THEME_PRESETS;
}
