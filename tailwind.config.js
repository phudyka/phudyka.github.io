const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: "0 0 60px rgba(59,130,246,0.45)",
      },
      colors: {
        blue: {
          ...colors.blue,
          DEFAULT: '#3B82F6',
        },
        purple: {
          ...colors.purple,
          DEFAULT: '#8B5CF6',
        },
        pink: {
          ...colors.pink,
          DEFAULT: '#EC4899',
        },
        cyan: {
          ...colors.cyan,
          DEFAULT: '#06B6D4',
        },
        emerald: {
          ...colors.emerald,
          DEFAULT: '#10B981',
        },
      }
    },
  },
  plugins: [],
};

