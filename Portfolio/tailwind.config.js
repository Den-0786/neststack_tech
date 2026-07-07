/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#c9a84c',
        'accent-hover': '#e0bd6a',
        'dark-panel': '#0d1117',
        'dark-sidebar': '#111827',
        'sys-bg': '#f5f4f0',
        neon: '#39ff14',
        'neon-dim': '#2dd40f',
        'neon-light': '#16a34a',
        'site-bg': 'var(--site-bg)',
        'site-card': 'var(--site-card)',
        'site-border': 'var(--site-border)',
        'site-muted': 'var(--site-muted)',
      },
      fontFamily: {
        mono: ['Space Mono', 'Courier New', 'monospace'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

