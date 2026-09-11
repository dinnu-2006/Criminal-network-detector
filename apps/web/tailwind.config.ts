import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        surface: "#0D0D0D",
        elevated: "#141414",
        hover: "#1A1A1A",
        "border-subtle": "#1E1E1E",
        "border-dim": "#242424",
        primary: "#E8E8E8",
        secondary: "#6B6B6B",
        muted: "#3A3A3A",
        "accent-red": "#DC2626",
        "accent-red-dim": "#7F1D1D",
        "accent-red-glow": "rgba(220, 38, 38, 0.15)",
        "node-normal": "#4A4A5A",
        "node-selected": "#DC2626",
        "node-connected": "#8B8BA7",
        "node-unrelated": "#1A1A22",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": "10px",
        xs: "11px",
        sm: "12px",
        base: "13px",
        md: "14px",
      },
      animation: {
        "slide-right": "slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.15s ease",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backdropBlur: {
        xs: "4px",
      },
      boxShadow: {
        panel: "0 0 0 1px #1E1E1E, 0 8px 24px rgba(0,0,0,0.6)",
        "red-glow": "0 0 12px rgba(220, 38, 38, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
