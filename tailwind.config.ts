import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#21182B",
          deep: "#2E0569",
          muted: "#716A78",
        },
        brand: {
          purple: "#8C52FF",
          "purple-deep": "#2E0569",
          orange: "#FFBB58",
          lavender: "#F2EBFF",
          "lavender-pale": "#FAF7FF",
          cream: "#FFFDF7",
          green: "#EAF4E4",
          peach: "#FFE6D7",
          border: "#E9E3EE",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(46,5,105,0.20)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
