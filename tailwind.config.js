// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define your custom font family here
        // The key 'dmsans' will become 'font-dmsans' utility class
        dmsans: ['DM Sans', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}