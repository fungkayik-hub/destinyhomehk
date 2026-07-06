import testimonialsData from "@/data/testimonials.json";
import { siteConfig } from "@/lib/site-config";
import { gbpBusinessUrl } from "@/lib/gbp-links";

export type ReviewSource = "instagram" | "google";

export interface CustomerReview {
  author: string;
  text: string;
  rating: number;
  source: ReviewSource;
  /** 例如 2025-03、或「3 個月前」 */
  dateLabel?: string;
}

const SOURCE_META: Record<
  ReviewSource,
  { label: string; shortLabel: string; href: string; badgeClass: string }
> = {
  instagram: {
    label: "Instagram",
    shortLabel: "IG",
    href: siteConfig.instagram,
    badgeClass: "bg-pink-500/10 text-pink-700 border-pink-500/20",
  },
  google: {
    label: "Google",
    shortLabel: "Google",
    href: gbpBusinessUrl("reviews"),
    badgeClass: "bg-blue-500/10 text-blue-800 border-blue-500/20",
  },
};

export function getReviewSourceMeta(source: ReviewSource) {
  return SOURCE_META[source];
}

export function getCustomerReviews(): CustomerReview[] {
  return (testimonialsData as CustomerReview[]).map((item) => ({
    ...item,
    source: item.source ?? "instagram",
  }));
}

export function getReviewsBySource(source: ReviewSource): CustomerReview[] {
  return getCustomerReviews().filter((r) => r.source === source);
}

/** 網站展示用：IG + Google 混合，Google 優先穿插 */
export function getMergedReviews(limit = 6): CustomerReview[] {
  const ig = getReviewsBySource("instagram");
  const google = getReviewsBySource("google");
  const merged: CustomerReview[] = [];
  const max = Math.max(ig.length, google.length);

  for (let i = 0; i < max && merged.length < limit; i++) {
    if (google[i]) merged.push(google[i]);
    if (merged.length < limit && ig[i]) merged.push(ig[i]);
  }

  return merged.slice(0, limit);
}

export function getReviewStats() {
  const igCount = getReviewsBySource("instagram").length;
  const googleCount = getReviewsBySource("google").length;
  return {
    score: siteConfig.rating.score,
    totalLabel: siteConfig.rating.count >= 1000 ? "過千" : String(siteConfig.rating.count),
    igCount,
    googleCount,
    hasGoogle: googleCount > 0 || Boolean(siteConfig.googleBusinessUrl),
  };
}
