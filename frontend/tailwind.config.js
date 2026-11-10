/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Afghan national palette — black, red, green
        brand: {
          DEFAULT: "#006400",   // Afghan green
          light: "#1A7A1A",
          dark: "#004300",
        },
        accent: {
          DEFAULT: "#C8102E",   // Afghan red — trust/CTAs
          light: "#E63050",
          dark: "#A00020",
        },
        amber: {
          DEFAULT: "#F4B942",   // warm gold for highlights
        },
      },
      fontFamily: {
        dari: ["'Noto Nastaliq Urdu'", "'Noto Nastaliq'", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
