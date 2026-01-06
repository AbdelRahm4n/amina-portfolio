import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f5f0e8",
        charcoal: "#2d2d2d",
      },
      fontFamily: {
        sans: ["var(--font-mango)", "system-ui", "sans-serif"],
        clash: ["var(--font-clash)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
