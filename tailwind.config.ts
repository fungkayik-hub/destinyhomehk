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
        sans: ["PingFang TC", "Microsoft JhengHei", "Noto Sans TC", "Helvetica Neue", "sans-serif"],
        // 不下載 CJK webfont。系統楷／宋已覆蓋香港裝置，避免數 MB 高優先字檔擋住 LCP。
        serif: ["Kaiti TC", "BiauKai", "KaiTi", "STKaiti", "Songti TC", "PMingLiU", "serif"],
        display: ["Songti TC", "PMingLiU", "Songti SC", "Noto Serif TC", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
