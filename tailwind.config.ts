import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f5f0e8",
        charcoal: "#2d2d2d",
        terracotta: "#b86d4e",
        bluegrey: "#a8c4d4",
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
