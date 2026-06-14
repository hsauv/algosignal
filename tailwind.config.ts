import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#e11d48", // framboise (rose-600)
          dark: "#be123c", // rose-700
          light: "#fff1f2", // rose-50
        },
      },
    },
  },
  plugins: [],
};

export default config;
