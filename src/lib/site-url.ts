/** 正式網域；Vercel 預覽站會用 VERCEL_URL */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://www.destinyhomehk.com";
}

/** 首頁正規網址。Google 把根網址記成帶結尾斜線；Next metadata 會把 `/` 削成無斜線。 */
export function getHomepageUrl(): string {
  return `${getSiteUrl()}/`;
}
