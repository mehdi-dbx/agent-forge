/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
