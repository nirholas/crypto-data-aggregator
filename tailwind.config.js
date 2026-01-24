/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ============================================
        // CMC/CoinGecko Inspired Color Palette
        // ============================================

        // Primary Brand - CMC Blue
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#3861FB', // CMC primary blue
          600: '#3354E0',
          700: '#2D46C4',
          800: '#2339A8',
          900: '#1A2C8C',
          950: '#111D5E',
        },

        // Secondary - CoinGecko Green
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#8DC647', // CoinGecko green
          600: '#7AB33E',
          700: '#5F9A2E',
          800: '#4A7B24',
          900: '#365C1A',
          950: '#223B10',
        },

        // Background colors - CMC dark navy theme
        background: {
          DEFAULT: '#0D1421', // Main background - deep navy
          secondary: '#131A2A', // Slightly lighter
          tertiary: '#171E2E', // Card backgrounds
        },

        // Surface/Card colors
        surface: {
          DEFAULT: '#1E2329', // Card background
          hover: '#252B36', // Card hover
          elevated: '#2B3139', // Modals, dropdowns
          border: '#2B3544', // Borders
        },

        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#A6B0C3', // CMC gray
          muted: '#808A9D', // Darker gray
          disabled: '#5E6673',
        },

        // Semantic colors - Market data
        gain: {
          DEFAULT: '#16C784', // CMC green
          light: '#1ED696',
          dark: '#12A86C',
          bg: 'rgba(22, 199, 132, 0.1)',
        },
        loss: {
          DEFAULT: '#EA3943', // CMC red
          light: '#FF4D58',
          dark: '#D42F38',
          bg: 'rgba(234, 57, 67, 0.1)',
        },

        // Accent colors
        warning: {
          DEFAULT: '#F7931A', // Bitcoin orange
          light: '#FFB347',
          dark: '#E07D00',
        },
        info: {
          DEFAULT: '#3B82F6', // Info blue
          light: '#60A5FA',
          dark: '#2563EB',
        },

        // Chart colors
        chart: {
          blue: '#3861FB',
          purple: '#8B5CF6',
          teal: '#14B8A6',
          orange: '#F59E0B',
          pink: '#EC4899',
          cyan: '#06B6D4',
        },

        // Override neutral for dark theme
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#1E2329', // Card bg
          800: '#171E2E', // Secondary bg
          900: '#0D1421', // Primary bg
          950: '#080C14', // Darkest
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
