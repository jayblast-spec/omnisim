/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon:     "#00FF41",
        cgreen:   "#00FF41",
        cbg:      "#0c160a",
        csurface: "#141e12",
        cpanel:   "#182216",
        cpurple:  "#BF00FF",
        cpink:    "#FF0077",
        camber:   "#FFB800",
      },
      fontFamily: {
        orbitron:  ["var(--font-space-mono)", "Space Mono", "monospace"],
        jetbrains: ["var(--font-space-mono)", "Space Mono", "monospace"],
        tech:      ["var(--font-space-mono)", "Space Mono", "monospace"],
        inter:     ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono:      ["var(--font-space-mono)", "Space Mono", "monospace"],
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": { textShadow: "0 0 8px #00FF41, 0 0 20px #00FF41, 0 0 40px #00FF41" },
          "50%":      { textShadow: "0 0 4px #00FF41, 0 0 10px #00FF41" },
        },
        slideLeft: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinRing: {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        neonPulse:       "neonPulse 2s ease-in-out infinite",
        slideLeft:       "slideLeft 36s linear infinite",
        spinRing:        "spinRing 8s linear infinite",
        spinRingReverse: "spinRing 4s linear infinite reverse",
      },
    },
  },
  plugins: [],
};
