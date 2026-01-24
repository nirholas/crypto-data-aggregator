/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ═══════════════════════════════════════════════════════════════
        // CRYPTO DATA AGGREGATOR - DESIGN TOKENS
        // All colors reference CSS variables from globals.css
        // This ensures a single source of truth for theming
        // ═══════════════════════════════════════════════════════════════

        // Background hierarchy
        background: {
          DEFAULT: 'var(--bg-primary)',
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },

        // Surface hierarchy (cards, modals, dropdowns)
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
          elevated: 'var(--surface-elevated)',
          border: 'var(--surface-border)',
        },

        // Text hierarchy
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          disabled: 'var(--text-disabled)',
        },

        // Brand colors
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
        },

        // Semantic colors
        gain: {
          DEFAULT: 'var(--gain)',
          bg: 'var(--gain-bg)',
        },
        loss: {
          DEFAULT: 'var(--loss)',
          bg: 'var(--loss-bg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
        },
        info: {
          DEFAULT: 'var(--info)',
        },

        // Chart colors (for data viz)
        chart: {
          blue: 'var(--primary)',
          green: 'var(--gain)',
          red: 'var(--loss)',
          orange: 'var(--warning)',
          purple: '#8B5CF6',
          teal: '#14B8A6',
          pink: '#EC4899',
          cyan: '#06B6D4',
        },
      },

      // Border colors
      borderColor: {
        DEFAULT: 'var(--surface-border)',
        surface: {
          DEFAULT: 'var(--surface-border)',
          hover: 'var(--surface-hover)',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        headline: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        title: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        body: ['1rem', { lineHeight: '1.6' }],
        caption: ['0.875rem', { lineHeight: '1.5' }],
        tiny: ['0.75rem', { lineHeight: '1.4' }],
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
        100: '25rem',
        120: '30rem',
      },

      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        full: '9999px',
      },

      boxShadow: {
        // Card shadows for dark theme
        soft: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        glow: '0 0 15px rgba(56, 97, 251, 0.15)',
        'glow-lg': '0 0 30px rgba(56, 97, 251, 0.2)',
        'glow-green': '0 0 15px rgba(22, 199, 132, 0.15)',
        'glow-red': '0 0 15px rgba(234, 57, 67, 0.15)',
        elevated: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in': 'slideInRight 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },

      transitionDuration: {
        400: '400ms',
      },

      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
