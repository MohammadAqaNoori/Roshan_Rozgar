/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pakistan-inspired palette
        brand: {
          DEFAULT: "#01411C",   // Pakistan flag green
          light: "#0B6B3A",
          dark: "#003314",
        },
        accent: {
          DEFAULT: "#FFB300",   // warm gold for trust/CTAs
          light: "#FFC93C",
          dark: "#E89F00",
        },
      },
      fontFamily: {
        urdu: ["'Noto Nastaliq Urdu'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
