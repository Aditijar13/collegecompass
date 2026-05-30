import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Manrope'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      backdropBlur: { glass: "12px" },
      keyframes: {
        "fade-up":   { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in":   { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer:     { "100%": { transform: "translateX(100%)" } },
        pulse:       { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        "slide-in":  { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(0)" } },
      },
      animation: {
        "fade-up":  "fade-up 0.5s cubic-bezier(0.4,0,0.2,1) forwards",
        "fade-in":  "fade-in 0.3s ease forwards",
        shimmer:    "shimmer 1.6s infinite",
        "pulse-slow":"pulse 3s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
