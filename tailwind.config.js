/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'hsl(var(--color-primary) / 0.4)',
          DEFAULT: 'hsl(var(--color-primary) / 1)',
          dark: 'hsl(var(--color-primary-dark) / 0.8)',
        },
        customBlack: {
          lighter: 'hsl(var(--custom-black-lighter))',
          light: 'hsl(var(--custom-black-light))',
          DEFAULT: 'hsl(var(--custom-black))',
          dark: 'hsl(var(--custom-black-dark))',
        },
        customWhite: 'hsl(var(--custom-white))',
      },
      fontFamily: {
        sans: ['Nunito Sans', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
