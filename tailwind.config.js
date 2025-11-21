/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,68,23,0.08)',
      },
      colors: {
        'brand-green': '#00A651',
        'brand-green-dark': '#004417',
        'brand-orange': '#F7941F',
      }
    },
  },
  plugins: [],
};
