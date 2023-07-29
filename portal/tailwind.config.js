/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto',' sans-serif'],
      },
      backgroundColor: {
        'dark': '#303030',
        'darker': '#212121',
        'light': '#626262',
        'lighter': '#b2b2b2',
      },
      textColor: {
        'lighter': '#b2b2b2',
        'light': '#626262',
        'dark': '#303030',
        'darker': '#212121'
      },
    },
  },
  plugins: [],
}