/** 原站 destinyhomehk.com / Shopify CDN 圖片 */
const SHOP_CDN = "https://www.destinyhomehk.com/cdn/shop/files";
const FILES_CDN =
  "https://cdn.shopify.com/s/files/1/0655/4189/8475/files";

export function imageUrl(url: string, width?: number): string {
  let normalized = url
    .replace(/^\/\//, "https://")
    .replace(/^http:/, "https:")
    .replace(/_\d+x\d+\./, ".")
    .replace(/&amp;/g, "&");

  if (width && normalized.includes("destinyhomehk.com/cdn/shop/files")) {
    const [base] = normalized.split("&width=");
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}width=${width}`;
  }
  return normalized;
}

export const siteImages = {
  logo: `${SHOP_CDN}/Adobe_Express_-_file.png?v=1760593648`,
  heroPortrait: `${SHOP_CDN}/WhatsApp_Image_2022-07-22_at_2.39.31_PM.webp?v=1760339580`,
  /** 師傅專業照 */
  sunnyStudio: `${SHOP_CDN}/10.18CharlotteSunny6242QP.jpg?v=1760597984`,
  /** 首頁 Hero — 星盤封面 */
  homeHero: "/images/home-hero-stars.png",
  /** 首頁橫幅 */
  bannerPrimary: `${SHOP_CDN}/236.jpg?v=1761017217`,
  bannerSecondary: `${SHOP_CDN}/6662222.webp?v=1761017321`,
  decorativePanel: `${SHOP_CDN}/6bc8d850816d1b76a987a8e771a21a89.png?v=1760606964`,
  zodiac2026: `${SHOP_CDN}/6.jpg?v=1760601228`,
  /** 三色人格 — 來自 Sunny 講故事 */
  tricolor: [
    `${FILES_CDN}/WhatsApp_Image_2022-06-29_at_11.32.37_AM.jpg?v=1658730573`,
    `${FILES_CDN}/WhatsApp_Image_2022-06-29_at_1.06.39_AM.jpg?v=1658730583`,
    `${FILES_CDN}/WhatsApp_Image_2022-06-29_at_1.06.38_AM.jpg?v=1658730599`,
  ],
  services: {
    fullReading: `${FILES_CDN}/sunny_locker1.jpg?v=1659010344`,
    /** 紫微排盤封面 — 本地星盤圖 */
    chart: "/images/chart-cover.png",
    chartLegacy: `${FILES_CDN}/sunny_star1.jpg?v=1659234713`,
    datePicker: `${FILES_CDN}/sunny_1.jpg?v=1658824497`,
    nameNumerology: `${SHOP_CDN}/6.jpg?v=1760601228`,
    fengShui: `${FILES_CDN}/sunny_door1.jpg?v=1658829066`,
  },
  gallery: [
    `${SHOP_CDN}/10.18CharlotteSunny6242QP.jpg?v=1760597984`,
    `${SHOP_CDN}/WhatsApp_Image_2022-07-22_at_2.39.31_PM.webp?v=1760339580`,
    `${FILES_CDN}/sunny.jpg?v=1659234114`,
    `${FILES_CDN}/309253215_1260008218149206_226371781389138842_n.jpg?v=1688548495`,
  ],
} as const;
