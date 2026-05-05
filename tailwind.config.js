/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* Linear Design System Colors */
      colors: {
        /* Background Surfaces */
        background: {
          DEFAULT: '#08090a',
          marketing: '#010102',
        },
        panel: '#0f1011',
        surface: {
          DEFAULT: '#191a1b',
          secondary: '#28282c',
        },

        /* Text Colors */
        foreground: '#f7f8f8',
        text: {
          primary: '#f7f8f8',
          secondary: '#d0d6e0',
          tertiary: '#8a8f98',
          quaternary: '#62666d',
        },

        /* Brand & Accent */
        primary: {
          DEFAULT: '#5e6ad2',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#7170ff',
          hover: '#828fff',
          secondary: '#7a7fad',
        },

        /* Borders */
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.05)',
          solid: '#23252a',
          'solid-secondary': '#34343a',
          'solid-tertiary': '#3e3e44',
        },

        /* Status */
        success: {
          DEFAULT: '#27a644',
          secondary: '#10b981',
        },

        /* Card */
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.02)',
          foreground: '#f7f8f8',
          hover: 'rgba(255, 255, 255, 0.04)',
        },

        /* Muted */
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.02)',
          foreground: '#8a8f98',
        },

        /* Input */
        input: 'rgba(255, 255, 255, 0.02)',
        ring: '#7170ff',

        /* Popover */
        popover: {
          DEFAULT: '#191a1b',
          foreground: '#f7f8f8',
        },

        /* Secondary */
        secondary: {
          DEFAULT: 'rgba(255, 255, 255, 0.04)',
          foreground: '#d0d6e0',
        },
      },

      /* Linear Typography */
      fontFamily: {
        inter: ['Inter Variable', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Berkeley Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'Monaco', 'monospace'],
      },

      fontSize: {
        /* Linear Typography Scale */
        'display-xl': ['4.5rem', { lineHeight: '1.00', letterSpacing: '-1.584px', fontWeight: '510' }],
        'display-lg': ['4rem', { lineHeight: '1.00', letterSpacing: '-1.408px', fontWeight: '510' }],
        'display': ['3rem', { lineHeight: '1.00', letterSpacing: '-1.056px', fontWeight: '510' }],
        'heading-1': ['2rem', { lineHeight: '1.13', letterSpacing: '-0.704px', fontWeight: '400' }],
        'heading-2': ['1.5rem', { lineHeight: '1.33', letterSpacing: '-0.288px', fontWeight: '400' }],
        'heading-3': ['1.25rem', { lineHeight: '1.33', letterSpacing: '-0.24px', fontWeight: '590' }],
        'body-lg': ['1.125rem', { lineHeight: '1.60', letterSpacing: '-0.165px', fontWeight: '400' }],
        'body-emphasis': ['1.06rem', { lineHeight: '1.60', fontWeight: '590' }],
        'body': ['1rem', { lineHeight: '1.50', fontWeight: '400' }],
        'body-medium': ['1rem', { lineHeight: '1.50', fontWeight: '510' }],
        'small': ['0.94rem', { lineHeight: '1.60', letterSpacing: '-0.165px', fontWeight: '400' }],
        'small-medium': ['0.94rem', { lineHeight: '1.60', letterSpacing: '-0.165px', fontWeight: '510' }],
        'caption': ['0.81rem', { lineHeight: '1.50', letterSpacing: '-0.13px', fontWeight: '400' }],
        'caption-medium': ['0.81rem', { lineHeight: '1.50', letterSpacing: '-0.13px', fontWeight: '510' }],
        'label': ['0.75rem', { lineHeight: '1.40', fontWeight: '510' }],
        'micro': ['0.69rem', { lineHeight: '1.40', fontWeight: '510' }],
      },

      /* Linear Border Radius */
      borderRadius: {
        'micro': '2px',
        'standard': '4px',
        'comfortable': '6px',
        'card': '8px',
        'panel': '12px',
        'large': '22px',
      },

      /* Linear Shadows */
      boxShadow: {
        'linear-subtle': 'rgba(0, 0, 0, 0.03) 0px 1.2px 0px',
        'linear-surface': 'rgba(0, 0, 0, 0.2) 0px 0px 0px 1px',
        'linear-elevated': 'rgba(0, 0, 0, 0.4) 0px 2px 4px',
        'linear-dialog': 'rgba(0, 0, 0, 0) 0px 8px 2px, rgba(0, 0, 0, 0.01) 0px 5px 2px, rgba(0, 0, 0, 0.04) 0px 3px 2px, rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.08) 0px 0px 1px',
      },

      /* Breakpoints */
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      /* Spacing */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      /* Animations */
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-slide': 'fadeSlideIn 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideIn: {
          '0%': { opacity: '0', filter: 'blur(4px)', transform: 'translateY(10px)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
