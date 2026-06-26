import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";

export const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const notoSerifTC = Noto_Serif_TC({
  weight: ["700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  subsets: ["latin"],
  variable: "--font-noto-serif",
});
