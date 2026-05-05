import { useMemo } from 'react';

export interface PageTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
}

interface ThemeColorSet {
  primary: string;
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
}

const THEME_PALETTES: Record<string, ThemeColorSet> = {
  blue: {
    primary: '#5e6ad2',
    primary50: '#f0f1fa',
    primary100: '#e1e3f5',
    primary200: '#c4c7eb',
    primary300: '#a5a9e0',
    primary400: '#888dd6',
    primary500: '#5e6ad2',
    primary600: '#4a55b5',
    primary700: '#3a4399',
  },
  indigo: {
    primary: '#5e6ad2',
    primary50: '#f0f1fa',
    primary100: '#e1e3f5',
    primary200: '#c4c7eb',
    primary300: '#a5a9e0',
    primary400: '#888dd6',
    primary500: '#5e6ad2',
    primary600: '#4a55b5',
    primary700: '#3a4399',
  },
  violet: {
    primary: '#7170ff',
    primary50: '#f0f0ff',
    primary100: '#e2e2ff',
    primary200: '#c7c7fe',
    primary300: '#a5a5fd',
    primary400: '#8888fa',
    primary500: '#7170ff',
    primary600: '#5a59e0',
    primary700: '#4847b5',
  },
  purple: {
    primary: '#7a7fad',
    primary50: '#f1f1f7',
    primary100: '#e3e3ee',
    primary200: '#c8c8dd',
    primary300: '#a8a8cb',
    primary400: '#8c8fb9',
    primary500: '#7a7fad',
    primary600: '#636890',
    primary700: '#4f5372',
  },
  cyan: {
    primary: '#6372d4',
    primary50: '#f0f1fa',
    primary100: '#e1e3f5',
    primary200: '#c5c8eb',
    primary300: '#a6abde',
    primary400: '#888dd1',
    primary500: '#6372d4',
    primary600: '#505db5',
    primary700: '#404a91',
  },
  teal: {
    primary: '#5e6ad2',
    primary50: '#f0f1fa',
    primary100: '#e1e3f5',
    primary200: '#c4c7eb',
    primary300: '#a5a9e0',
    primary400: '#888dd6',
    primary500: '#5e6ad2',
    primary600: '#4a55b5',
    primary700: '#3a4399',
  },
  emerald: {
    primary: '#5e6ad2',
    primary50: '#f0f1fa',
    primary100: '#e1e3f5',
    primary200: '#c4c7eb',
    primary300: '#a5a9e0',
    primary400: '#888dd6',
    primary500: '#5e6ad2',
    primary600: '#4a55b5',
    primary700: '#3a4399',
  },
  amber: {
    primary: '#7170ff',
    primary50: '#f0f0ff',
    primary100: '#e2e2ff',
    primary200: '#c7c7fe',
    primary300: '#a5a5fd',
    primary400: '#8888fa',
    primary500: '#7170ff',
    primary600: '#5a59e0',
    primary700: '#4847b5',
  },
  orange: {
    primary: '#5e6ad2',
    primary50: '#f0f1fa',
    primary100: '#e1e3f5',
    primary200: '#c4c7eb',
    primary300: '#a5a9e0',
    primary400: '#888dd6',
    primary500: '#5e6ad2',
    primary600: '#4a55b5',
    primary700: '#3a4399',
  },
  red: {
    primary: '#6366d1',
    primary50: '#f0f0f9',
    primary100: '#e1e2f3',
    primary200: '#c5c6e8',
    primary300: '#a6a7db',
    primary400: '#8889cd',
    primary500: '#6366d1',
    primary600: '#5052b3',
    primary700: '#40418e',
  },
  rose: {
    primary: '#5e6ad2',
    primary50: '#f0f1fa',
    primary100: '#e1e3f5',
    primary200: '#c4c7eb',
    primary300: '#a5a9e0',
    primary400: '#888dd6',
    primary500: '#5e6ad2',
    primary600: '#4a55b5',
    primary700: '#3a4399',
  },
  sky: {
    primary: '#7170ff',
    primary50: '#f0f0ff',
    primary100: '#e2e2ff',
    primary200: '#c7c7fe',
    primary300: '#a5a5fd',
    primary400: '#8888fa',
    primary500: '#7170ff',
    primary600: '#5a59e0',
    primary700: '#4847b5',
  },
};

const INDUSTRY_MAP: Record<string, string> = {
  technology: 'blue',
  fintech: 'indigo',
  finance: 'emerald',
  healthcare: 'teal',
  education: 'violet',
  'e-commerce': 'orange',
  ecommerce: 'orange',
  retail: 'amber',
  gaming: 'purple',
  media: 'rose',
  'real estate': 'cyan',
  logistics: 'sky',
  ai: 'violet',
  'artificial intelligence': 'violet',
  blockchain: 'amber',
  crypto: 'amber',
  saas: 'blue',
  'social media': 'red',
  sports: 'red',
  food: 'orange',
  travel: 'sky',
  automotive: 'slate',
  energy: 'emerald',
  defense: 'slate',
};

const ROLE_MAP: Record<string, string> = {
  'product-management': 'indigo',
  'product manager': 'indigo',
  'web-dev': 'blue',
  'web developer': 'blue',
  'full-stack': 'blue',
  'frontend': 'sky',
  'backend': 'emerald',
  'data-analytics': 'violet',
  'data science': 'purple',
  'data analyst': 'violet',
  'brand-design-advertising': 'rose',
  'graphic design': 'rose',
  'ui design': 'purple',
  'ux design': 'purple',
  'project-management': 'cyan',
  'project manager': 'cyan',
  'operations': 'teal',
  'marketing': 'amber',
  'growth': 'emerald',
  'sales': 'orange',
  'hr': 'pink',
  'content': 'teal',
};

const TRACK_MAP: Record<string, string> = {
  business: 'indigo',
  technical: 'blue',
  creative: 'rose',
  data: 'violet',
  design: 'purple',
  marketing: 'amber',
  leadership: 'emerald',
  management: 'cyan',
};

function getThemeKey(industry?: string, track?: string, role?: string): string {
  if (role && ROLE_MAP[role.toLowerCase()]) {
    return ROLE_MAP[role.toLowerCase()];
  }
  if (industry && INDUSTRY_MAP[industry.toLowerCase()]) {
    return INDUSTRY_MAP[industry.toLowerCase()];
  }
  if (track && TRACK_MAP[track.toLowerCase()]) {
    return TRACK_MAP[track.toLowerCase()];
  }
  return 'indigo';
}

function buildTheme(key: string): PageTheme {
  const palette = THEME_PALETTES[key] || THEME_PALETTES.indigo;
  return {
    primary: palette.primary500,
    primaryLight: palette.primary300,
    primaryDark: palette.primary700,
    primaryMuted: palette.primary200,
    gradientFrom: palette.primary600,
    gradientTo: palette.primary400,
    accent: palette.primary500,
    badgeBg: `${palette.primary500}20`,
    badgeText: palette.primary700,
    ring: `${palette.primary500}40`,
  };
}

export function usePageTheme(industry?: string, track?: string, role?: string): PageTheme & {
  themeKey: string;
  tw: (token: string) => string;
  apply: (styles: React.CSSProperties) => React.CSSProperties;
} {
  const themeKey = useMemo(() => getThemeKey(industry, track, role), [industry, track, role]);
  const theme = useMemo(() => buildTheme(themeKey), [themeKey]);

  const tw = useMemo(() => {
    return (token: string): string => {
      return token;
    };
  }, []);

  const apply = useMemo(() => {
    return (styles: React.CSSProperties): React.CSSProperties => {
      const resolved: React.CSSProperties = {};
      for (const [key, value] of Object.entries(styles)) {
        if (typeof value === 'string') {
          resolved[key as keyof React.CSSProperties] = value
            .replace(/\{primary\}/g, theme.primary)
            .replace(/\{primaryLight\}/g, theme.primaryLight)
            .replace(/\{primaryDark\}/g, theme.primaryDark)
            .replace(/\{primaryMuted\}/g, theme.primaryMuted)
            .replace(/\{gradientFrom\}/g, theme.gradientFrom)
            .replace(/\{gradientTo\}/g, theme.gradientTo)
            .replace(/\{accent\}/g, theme.accent)
            .replace(/\{badgeBg\}/g, theme.badgeBg)
            .replace(/\{badgeText\}/g, theme.badgeText)
            .replace(/\{ring\}/g, theme.ring);
        } else {
          resolved[key as keyof React.CSSProperties] = value;
        }
      }
      return resolved;
    };
  }, [theme]);

  return { ...theme, themeKey, tw, apply };
}

export function getSimulationTheme(primaryColor: string): PageTheme {
  return {
    primary: primaryColor,
    primaryLight: `${primaryColor}cc`,
    primaryDark: `${primaryColor}99`,
    primaryMuted: `${primaryColor}40`,
    gradientFrom: primaryColor,
    gradientTo: `${primaryColor}cc`,
    accent: primaryColor,
    badgeBg: `${primaryColor}20`,
    badgeText: primaryColor,
    ring: `${primaryColor}40`,
  };
}

export { THEME_PALETTES, INDUSTRY_MAP, ROLE_MAP, TRACK_MAP };
