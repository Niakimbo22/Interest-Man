/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette "fun mais sérieux" : base finance sombre + accents vifs
        base: {
          900: '#0b1120',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        brand: {
          DEFAULT: '#22d3ee', // cyan accent
          soft: '#67e8f9',
        },
        gain: '#22c55e',
        loss: '#ef4444',
        gold: '#fbbf24',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
