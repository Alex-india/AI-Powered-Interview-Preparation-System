/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Vibrant Electric Green accent
          600: '#16a34a', // Primary Green for buttons and high contrast
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        indigo: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Vibrant Green
          600: '#16a34a', // Primary Green
          650: '#15803d',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        darkbg: '#0F172A',     // Slate 900
        darkcard: '#1E293B',   // Slate 800
        darkborder: '#334155'  // Slate 700
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '0.85rem' }],
        '3xs': ['0.6rem', { lineHeight: '0.8rem' }],
        '4xs': ['0.55rem', { lineHeight: '0.75rem' }],
      }
    },
  },
  plugins: [],
}
