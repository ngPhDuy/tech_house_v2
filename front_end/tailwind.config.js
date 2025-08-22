/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1FB5D4",
        darkSecondary: "#008ECC",
        lightSecondary: "#05ABF3",
        grayColor: "#F0F0F0",
      },
    },
  },
  plugins: [],
};
