/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'accent-green': 'var(--color-accent-green)',
        'accent-cyan': 'var(--color-accent-cyan)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        'bg-primary': 'var(--color-bg-primary)',
        'bg-surface': 'var(--color-bg-surface)',
        'bg-elevated': 'var(--color-bg-elevated)',
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
        'border-accent': 'var(--color-border-accent)',
      },
      gridTemplateColumns: {
        dashboard: '1fr 320px',
      },
    },
  },
  plugins: [],
}
