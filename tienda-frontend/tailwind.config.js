/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        pulseSoft: {
          '0%, 100%': { 
            opacity: '1' 
          },
          '50%': { 
            opacity: '0.8' 
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      colors: {
        primary: {
          DEFAULT: '#00BCD4', // Bright teal
          light: '#64D8EB',
          dark: '#0097A7',
        },
        accent: {
          DEFAULT: '#FF7043', // Modern orange
          light: '#FFA726',
          dark: '#E64A19',
        },
        gray: { // Existing refined grayscale
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        // Remove old gradients as they are replaced by new primary/accent
        'gradient-primary': 'linear-gradient(135deg, var(--tw-color-primary-DEFAULT) 0%, var(--tw-color-primary-dark) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, var(--tw-color-accent-DEFAULT) 0%, var(--tw-color-accent-dark) 100%)',
      },
    },
  },
  plugins: [],
}
