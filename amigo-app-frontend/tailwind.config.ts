import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#F4F7F8",
        paper: "#FFFFFF",
        ink: "#132227",
        slate: {
          650: "#3B505A",
        },
        teal: {
          50: "#EAF5F3",
          100: "#CFE8E3",
          400: "#3E9C90",
          500: "#0F6E6E",
          600: "#0A5A5A",
          700: "#08484A",
          900: "#0A2E31",
        },
        amber: {
          50: "#FDF3E2",
          300: "#F0C36B",
          400: "#E3A008",
          500: "#C9880A",
        },
        coral: {
          400: "#E0685A",
          500: "#C94F42",
        },
        sage: {
          400: "#8FAE8B",
          500: "#6E9169",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(19,34,39,0.06), 0 8px 24px -12px rgba(19,34,39,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.6)", opacity: "0.4" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.8s ease-in-out infinite",
        dash: "dash 2.4s linear forwards",
        rise: "rise 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
