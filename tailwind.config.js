/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        navy: {
          50: "#eef1f8",
          100: "#d5ddf0",
          200: "#aabae0",
          300: "#7f96d0",
          400: "#5473c0",
          500: "#2a50b0",
          600: "#1e3d8f",
          700: "#152b6b",
          800: "#0c1a47",
          900: "#060e24",
        },
        gold: {
          300: "#f5d98b",
          400: "#f0c84a",
          500: "#e6b800",
          600: "#b38e00",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
