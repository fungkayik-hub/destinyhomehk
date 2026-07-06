import Link from "next/link";
import GbpCta from "@/components/GbpCta";
import {
  getMergedReviews,
  getReviewSourceMeta,
  getReviewStats,
  type CustomerReview,
} from "@/lib/reviews";
import { siteConfig } from "@/lib/site-config";

function ReviewItem({ review }: { review: CustomerReview }) {
  const meta = getReviewSourceMeta(review.source);

  return (
    <li className="text-sm border-l-2 border-destiny-gold/40 pl-4">
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.badgeClass}`}
        >
          {meta.shortLabel}
        </span>
        {review.dateLabel ? (
          <span className="text-[10px] text-destiny-purple/40">{review.dateLabel}</span>
        ) : null}
      </div>
      <p className="text-destiny-purple/80 leading-relaxed">「{review.text}」</p>
      <p className="text-xs text-destiny-purple/45 mt-1">
        — {review.author} · {"★".repeat(review.rating)}
      </p>
    </li>
  );
}

export default function ReviewShowcase() {
  const reviews = getMergedReviews(6);
  const stats = getReviewStats();
  const igMeta = getReviewSourceMeta("instagram");
  const googleMeta = getReviewSourceMeta("google");

  return (
    <section className="card border-destiny-gold/25 bg-gradient-to-br from-white to-destiny-cream/30">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-destiny-purple">客人好評</h2>
          <p className="text-sm text-destiny-purple/60">
            ⭐ {stats.score} · {stats.totalLabel}真實好評
            {stats.hasGoogle ? " · IG + Google" : ""}
          </p>
        </div>
        <GbpCta source="reviews" compact />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <Link
          href={igMeta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs rounded-full border border-pink-500/25 bg-pink-500/5 px-3 py-1 text-pink-700 hover:bg-pink-500/10"
        >
          睇更多 IG 好評 →
        </Link>
        {stats.hasGoogle ? (
          <Link
            href={googleMeta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs rounded-full border border-blue-500/25 bg-blue-500/5 px-3 py-1 text-blue-800 hover:bg-blue-500/10"
          >
            睇更多 Google 評價 →
          </Link>
        ) : null}
      </div>

      <ul className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem key={`${review.source}-${review.author}-${review.text.slice(0, 12)}`} review={review} />
        ))}
      </ul>

      <p className="text-xs text-destiny-purple/40 mt-4 leading-relaxed">
        以上為網站精選評價；更多真實好評請到 IG 或 Google 商家頁面查閱。
      </p>
    </section>
  );
}
