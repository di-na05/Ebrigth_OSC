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
        // Theme-aware CSS variable colors
        'c-bg':      'var(--c-bg)',
        'c-surface': 'var(--c-surface)',
        'c-card':    'var(--c-card)',
        'c-card2':   'var(--c-card2)',
        'c-input':   'var(--c-input)',
        'c-border':  'var(--c-border)',
        'c-text':    'var(--c-text)',
        'c-text2':   'var(--c-text2)',
        'c-text3':   'var(--c-text3)',
        'c-hover':   'var(--c-hover)',

        // Brand colors kept for status chips
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        blue:   { 950: '#0a1628' },
        amber:  { 950: '#1c0f00' },
        green:  { 950: '#0a1f0a' },
        red:    { 950: '#1c0505' },
        purple: { 950: '#130a1f' },
      },
    },
  },
  plugins: [],
}
