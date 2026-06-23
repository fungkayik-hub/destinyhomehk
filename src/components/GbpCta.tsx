import { gbpBusinessUrl, gbpReviewUrl, hasGbpLinks } from "@/lib/gbp-links";
import { siteConfig } from "@/lib/site-config";

interface Props {
  source: string;
  compact?: boolean;
}

/** Google 商家／留評價 CTA */
export default function GbpCta({ source, compact = false }: Props) {
  const showReview = Boolean(siteConfig.googleReviewUrl || siteConfig.googleBusinessUrl);

  if (!showReview && !siteConfig.googleMapsUrl) return null;

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "flex flex-wrap gap-3 justify-center"}>
      {siteConfig.googleBusinessUrl ? (
        <a
          href={gbpBusinessUrl(source)}
          target="_blank"
          rel="noopener noreferrer"
          className={compact ? "text-sm text-destiny-gold hover:underline" : "btn-secondary text-sm"}
        >
          Google 商家
        </a>
      ) : null}
      {showReview ? (
        <a
          href={gbpReviewUrl(source)}
          target="_blank"
          rel="noopener noreferrer"
          className={compact ? "text-sm text-destiny-gold hover:underline" : "btn-primary text-sm"}
        >
          ⭐ 留 Google 評價
        </a>
      ) : null}
      {!compact && hasGbpLinks() ? (
        <p className="w-full text-xs text-destiny-purple/45 text-center mt-1">
          過千好評 · 幫手留個評價，等更多有緣人搵到師傅
        </p>
      ) : null}
    </div>
  );
}
