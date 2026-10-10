import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        brand: { DEFAULT: "#FF6903", dark: "#E05A00", soft: "#FFF1E6" },
        line: "#E7E5E4",
        mute: "#6B6B6B",
        paper: "#FAFAF9",
      },
      fontFamily: { sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"] },
      boxShadow: {
        card: "0 1px 2px rgba(10,10,10,.06), 0 8px 24px -12px rgba(10,10,10,.18)",
        lift: "0 24px 60px -24px rgba(10,10,10,.45)",
      },
    },
  },
  plugins: [],
};
export default config;
