/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        revonix: {
          950: "#060B19",
          900: "#0B132B",
          850: "#131C38",
          800: "#1C2541",
          700: "#273559",
          600: "#3A506B",
          500: "#4D698D",
          purple: {
            900: "#2E1065",
            800: "#4C1D95",
            700: "#5B21B6",
            600: "#6D28D9",
            500: "#7C3AED",
            400: "#8B5CF6",
            300: "#A78BFA",
            200: "#C4B5FD",
            100: "#EDE9FE",
          },
        },
      },
    },
  },
  plugins: [],
};

