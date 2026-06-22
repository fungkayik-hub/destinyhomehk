/** 網站圖片 — 已遷移至 public/images/site/ */

export function imageUrl(url: string, _width?: number): string {
  return url
    .replace(/^\/\//, "/")
    .replace(/^https?:\/\/[^/]+\/cdn\/shop\/files\//, "/images/site/")
    .replace(/_\d+x\d+\./, ".")
    .replace(/&amp;/g, "&")
    .split("?")[0]
    .split("&width=")[0];
}

const S = "/images/site";

export const siteImages = {
  logo: `${S}/Adobe_Express_-_file.png`,
  heroPortrait: `${S}/WhatsApp_Image_2022-07-22_at_2.39.31_PM.webp`,
  /** 師傅專業照 */
  sunnyStudio: `${S}/10.18CharlotteSunny6242QP.jpg`,
  /** 首頁 Hero — 星盤封面 */
  homeHero: "/images/home-hero-stars.png",
  /** 首頁橫幅 */
  bannerPrimary: `${S}/236.jpg`,
  bannerSecondary: `${S}/6662222.webp`,
  decorativePanel: `${S}/6bc8d850816d1b76a987a8e771a21a89.png`,
  zodiac2026: `${S}/6.jpg`,
  /** 三色人格 — 來自 Sunny 講故事 */
  tricolor: [
    `${S}/WhatsApp_Image_2022-06-29_at_11.32.37_AM.jpg`,
    `${S}/WhatsApp_Image_2022-06-29_at_1.06.39_AM.jpg`,
    `${S}/WhatsApp_Image_2022-06-29_at_1.06.38_AM.jpg`,
  ],
  services: {
    fullReading: `${S}/sunny_locker1.jpg`,
    /** 紫微排盤封面 — 本地星盤圖 */
    chart: "/images/chart-cover.png",
    chartLegacy: `${S}/sunny_star1.jpg`,
    datePicker: `${S}/sunny_1.jpg`,
    nameNumerology: `${S}/6.jpg`,
    fengShui: `${S}/sunny_door1.jpg`,
  },
  gallery: [
    `${S}/10.18CharlotteSunny6242QP.jpg`,
    `${S}/WhatsApp_Image_2022-07-22_at_2.39.31_PM.webp`,
    `${S}/sunny.jpg`,
    `${S}/309253215_1260008218149206_226371781389138842_n.jpg`,
  ],
} as const;
