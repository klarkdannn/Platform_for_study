/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          500: '#e94560',
          600: '#c73652',
          700: '#a02843',
        },
        surface: {
          900: '#0d0d0d',
          800: '#151515',
          700: '#1e1e1e',
          600: '#252525',
          500: '#2d2d2d',
          400: '#3a3a3a',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
