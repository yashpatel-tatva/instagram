/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [],
  theme: {
    screens: {
      '2xl': { 'max': '1535px' },
      'xl': { 'max': '1279px' },
      'lg': { 'max': '1023px' },
      'md': { 'max': '930px' },
      'sm': { 'max': '639px' },
      'fm': { 'max': '430px' },
      'fnm': { 'min': '430px' },
    }
  }
}
