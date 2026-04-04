/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom breakpoints for better responsive control
      screens: {
        'xs': '375px',      // Small phones
        'sm': '640px',      // Phones
        'md': '768px',      // Tablets
        'lg': '1024px',     // Small laptops/tablets
        'xl': '1280px',     // Desktops
        '2xl': '1536px',    // Large desktops
      },
      // Custom font sizes for responsive typography
      fontSize: {
        'xs-mobile': ['0.625rem', { lineHeight: '0.875rem' }],    // 10px
        'sm-mobile': ['0.75rem', { lineHeight: '1rem' }],         // 12px
        'base-mobile': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        'lg-mobile': ['1rem', { lineHeight: '1.5rem' }],          // 16px
        'xl-mobile': ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
        '2xl-mobile': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '3xl-mobile': ['1.5rem', { lineHeight: '2rem' }],         // 24px
      },
      // Custom spacing for mobile
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      // Safe area utilities for notched devices
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Animation durations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
