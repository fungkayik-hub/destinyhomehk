import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        destiny: {
          /** 方案 A「星盤夜色」— 夜空藍主色 */
          purple: "#0F1A33",
          "purple-light": "#243052",
          /** 古金 / 星金 */
          gold: "#C9A96E",
          "gold-light": "#E8C55A",
          cream: "#F7F3EB",
          ink: "#1E2A45",
          muted: "#6B7A99",
          amber: "#B8860B",
          red: "#A83248",
          green: "#2D6A4F",
          blue: "#1D4E89",
        },
      },
      fontFamily: {
        display: ["var(--font-noto-serif)", "Noto Serif TC", "Songti TC", "PMingLiU", "serif"],
        sans: ["var(--font-noto-sans)", "Noto Sans TC", "PingFang TC", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
