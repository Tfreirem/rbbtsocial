/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rbbt-dark': '#000000',
        'rbbt-card': '#111111',
        'rbbt-accent': '#ffffff',
        'rbbt-border': 'rgba(128, 128, 128, 0.2)',
        'rbbt-positive': '#4ade80',
        'rbbt-negative': '#ef4444',
        'rbbt-purple': '#b347ff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
