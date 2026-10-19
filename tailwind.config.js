/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Plus Jakarta Sans", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#08080d",
          900: "#0c0c13",
          850: "#13131c",
          800: "#1a1a25",
          700: "#262634",
        },
        brand: {
          50: "#f2f0ff",
          100: "#e6e1ff",
          200: "#cabdff",
          300: "#ab93ff",
          400: "#8b63ff",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
        },
        accent: {
          400: "#ff6bcb",
          500: "#ff4fb8",
        },
        gold: {
          400: "#ffc857",
          500: "#f5a623",
        },
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0) 70%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px -10px rgba(124,58,237,0.55)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.3), 0 12px 32px -16px rgba(0,0,0,0.5)",
        lift: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px -20px rgba(0,0,0,0.65)",
      },
      animation: {
        blob: "blob 16s infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        shimmer: "shimmer 2.2s infinite",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
      },
    },
  },
  plugins: [],
};
