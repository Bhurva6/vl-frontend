/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0066FF',
          amber: '#FF6B00',
          success: '#00B341',
          danger: '#E5000A',
          ink: '#0A0A0A',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 12px 32px -24px rgba(10, 10, 10, 0.18)',
        tooltip: '0 16px 36px -20px rgba(10, 10, 10, 0.24)',
      },
    },
  },
  plugins: [],
}

