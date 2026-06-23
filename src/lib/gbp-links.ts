import { siteConfig } from "@/lib/site-config";

/** Google Business Profile / Maps 連結（含 UTM 追蹤） */
export function gbpBusinessUrl(source: string): string {
  const base = siteConfig.googleBusinessUrl || siteConfig.googleMapsUrl;
  return withUtm(base, source);
}

export function gbpReviewUrl(source: string): string {
  const base = siteConfig.googleReviewUrl || siteConfig.googleBusinessUrl || siteConfig.googleMapsUrl;
  return withUtm(base, source);
}

export function gbpMapsUrl(source: string): string {
  return withUtm(siteConfig.googleMapsUrl, source);
}

function withUtm(url: string, source: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "destinyhomehk");
    u.searchParams.set("utm_medium", "website");
    u.searchParams.set("utm_campaign", source);
    return u.toString();
  } catch {
    return url;
  }
}

export function hasGbpLinks(): boolean {
  return Boolean(siteConfig.googleBusinessUrl || siteConfig.googleReviewUrl);
}
