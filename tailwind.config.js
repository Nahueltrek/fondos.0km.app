/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0B3B63",
          dark: "#072A47",
          accent: "#2E9FD6",
          light: "#EAF6F8",
        },
      },
    },
  },
  plugins: [],
};
