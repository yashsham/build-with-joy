import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: "#F0D060",
          400: "#E9BF3A",
          500: "#D4AF37",
          600: "#C9A84C", // PRIMARY Logo Gold
          700: "#A8891E",
          800: "#7A6416",
        },
        dark: {
          DEFAULT: "#000000",
          soft:    "#0A0A0A",
          card:    "#111111",
          hover:   "#161616",
          border:  "#1E1E1E",
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body:    ["var(--font-body)", "sans-serif"],
        accent:  ["var(--font-accent)", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #E9BF3A 50%, #C9A84C 100%)",
        "gold-shimmer":  "linear-gradient(90deg, #A8891E, #E9BF3A, #D4AF37, #C9A84C, #E9BF3A, #A8891E)",
        "hero-gradient": "radial-gradient(ellipse at top, #1A1500 0%, #000000 60%)",
      },
      boxShadow: {
        "gold-sm":  "0 0 12px rgba(201, 168, 76, 0.3)",
        "gold":     "0 0 25px rgba(201, 168, 76, 0.4)",
        "gold-lg":  "0 0 50px rgba(201, 168, 76, 0.25)",
        "gold-card":"0 4px 30px rgba(201, 168, 76, 0.15)",
      },
      keyframes: {
        shimmer: {
          "0%": { "background-position": "-200% center" },
          "100%": { "background-position": "200% center" },
        },
        fadeUp: {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        }
      },
      animation: {
        shimmer: "shimmer 2.5s infinite linear",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "count-up": "countUp 2s ease-out forwards",
        marquee: "marquee 25s linear infinite",
      }
    }
  },
  plugins: [],
};
export default config;
