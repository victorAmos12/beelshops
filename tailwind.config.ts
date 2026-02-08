import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode - Luxury palette
        'cream': '#faf8f3',
        'beige': '#f5f1e8',
        'warm-gray': '#e8e4d9',
        'taupe': '#a5a0a0',
        'charcoal': '#2c2c2c',
        'gold': '#d4af37',
        'champagne': '#f1e4c3',
        'soft-gold': '#e8d7a0',

        // Dark mode
        'dark-bg': '#1a1a1a',
        'dark-surface': '#252525',
        'dark-text': '#f5f1e8',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['DM Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe': 'max(1.5rem, env(safe-area-inset-bottom))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'subtle-zoom': 'subtleZoom 0.3s ease-out',
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
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        subtleZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
      backdropFilter: {
        'blur': 'blur(10px)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
