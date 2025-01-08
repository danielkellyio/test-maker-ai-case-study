/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base colors
        base: {
          100: "#ffffff",
          200: "#f8fafc",
          300: "#f1f5f9",
          content: "#1e293b", // Base content color
        },
        // Primary colors
        primary: "#f97316",
        "primary-focus": "#ea580c",
        "primary-content": "#ffffff",
        // Secondary colors
        secondary: "#64748b",
        "secondary-focus": "#475569",
        "secondary-content": "#ffffff",
        // Neutral colors
        neutral: "#1e293b",
        "neutral-focus": "#0f172a",
        "neutral-content": "#f8fafc",
        // Info, Success, Warning, Error states
        info: "#3b82f6",
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
