/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#F5F5F0", // Creamy White
        foreground: "#1A1A1A", // Dark Charcoal
        primary: {
          DEFAULT: "#8E1E22", // Cold Vintage Red
          hover: "#72171A",
        },
        muted: "#F5F5F5",
        border: "#E2E2E2", // Cool Gray
      },
      fontFamily: {
        sans: ["Inter", "Source Han Sans CN", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
