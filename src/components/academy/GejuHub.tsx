import Link from "next/link";
import { getArticlesByCategory, isArticlePublished } from "@/lib/articles";
import { GEJU_LABELS } from "@/lib/geju-labels";

/** 紫微格局 — 吉格／凶格導航 */
export default function GejuHub() {
  const articles = getArticlesByCategory("geju");
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const publishedCount = articles.filter((a) => isArticlePublished(a)).length;

  return (
    <div className="mb-10 space-y-8">
      <p className="text-sm text-destiny-purple/60">
        已發佈 <strong className="text-destiny-gold">{publishedCount}</strong> / {GEJU_LABELS.length}{" "}
        篇 · 每個曆日（香港時間）自動更新 2 篇
      </p>
      {(["吉", "凶"] as const).map((type) => {
        const items = GEJU_LABELS.filter((g) => g.type === type);
        const label = type === "吉" ? "吉格" : "凶格";
        return (
          <div key={type}>
            <h2 className="font-display text-xl font-bold mb-2">
              {label}（{items.length}）
            </h2>
            <p className="text-sm text-destiny-purple/70 mb-4">
              {type === "吉"
                ? "傳統論命中有利格局 — 仍須配合全盤星象同大限。"
                : "提醒留意嘅格局 — 並非絕望，可配合師傅解讀。"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {items.map(({ slug }) => {
                const article = bySlug.get(slug);
                const live = article && isArticlePublished(article);
                const href = live
                  ? `/academy/geju/${encodeURIComponent(slug)}`
                  : undefined;
                const className = `card p-3 text-center text-sm transition-all ${
                  live
                    ? "hover:border-destiny-gold/40 cursor-pointer"
                    : "opacity-50 cursor-default border-destiny-purple/5"
                } ${type === "凶" ? "border-destiny-purple/10" : ""}`;

                const inner = (
                  <>
                    <span className="font-medium text-destiny-purple">{slug}</span>
                    {!live && (
                      <span className="block text-[10px] text-destiny-purple/40 mt-1">
                        即將推出
                      </span>
                    )}
                  </>
                );

                return href ? (
                  <Link key={slug} href={href} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <div key={slug} className={className}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-destiny-purple/50">
        想知自己命盤有咩格局？
        <Link href="/chart" className="text-destiny-gold hover:underline ml-1">
          免費排盤
        </Link>
        ·
        <Link href="/booking" className="text-destiny-gold hover:underline ml-1">
          預約全批
        </Link>
      </p>
    </div>
  );
}
