import { LXGW_WenKai_TC, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";

/** 楷書風格正文 — 有傳統味、屏讀清晰 */
export const lxgwWenkaiTC = LXGW_WenKai_TC({
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  subsets: ["latin"],
  variable: "--font-lxgw-wenkai",
});

/** 表單、命盤、數字等需要高可讀性的 UI */
export const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

/** 標題 — 明體襯線，莊重有氣場 */
export const notoSerifTC = Noto_Serif_TC({
  weight: ["600", "700", "900"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  subsets: ["latin"],
  variable: "--font-noto-serif",
});
