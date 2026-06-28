/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: "#00F5FF",
        cpurple: "#BF00FF",
        cpink: "#FF0077",
        cgreen: "#00FF7F",
        cbg: "#03020B",
        csurface: "#0D0B1A",
        cpanel: "#141128",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
        tech: ["var(--font-share-tech)", "monospace"],
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": { textShadow: "0 0 8px #00F5FF, 0 0 20px #00F5FF, 0 0 40px #00F5FF" },
          "50%": { textShadow: "0 0 4px #00F5FF, 0 0 10px #00F5FF" },
        },
        slideLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinRing: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        neonPulse: "neonPulse 2s ease-in-out infinite",
        slideLeft: "slideLeft 40s linear infinite",
        spinRing: "spinRing 8s linear infinite",
        spinRingReverse: "spinRing 4s linear infinite reverse",
      },
    },
  },
  plugins: [],
};
