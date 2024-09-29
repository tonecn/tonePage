/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'default-bg': '#fafafa',
        'dark-bg': '#1a1a1a',
      },
      screens: {
        'xs': '440px'
      }
    },
  },
  plugins: [],
}

