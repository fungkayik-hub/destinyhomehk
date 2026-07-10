import Link from "next/link";
import type { ChartInsights } from "@/lib/ai/chart-insights";
import { getGejuArticleHref, getStarArticleHref } from "@/lib/academy-links";

interface Props {
  insights: ChartInsights;
  locale?: "zh" | "en";
}

function parseMajorStars(mingMajorNames: string | null): string[] {
  if (!mingMajorNames) return [];
  return mingMajorNames.split("+").filter(Boolean);
}

export default function ChartPersonalInsights({ insights, locale = "zh" }: Props) {
  const zh = locale === "zh";
  const majors = parseMajorStars(insights.mingMajorNames);
  const jiPatterns = insights.patterns.filter((p) => p.type === "吉");
  const xiongPatterns = insights.patterns.filter((p) => p.type === "凶");
  const patternCount = insights.patterns.length;

  return (
    <section
      id="personal-insights"
      className="scroll-mt-20 rounded-2xl border-2 border-destiny-gold/35 bg-gradient-to-b from-destiny-gold/8 to-white shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-destiny-gold/20 bg-destiny-purple text-white">
        <h2 className="font-display text-lg font-bold">
          {zh ? "你嘅命格速覽" : "Your chart at a glance"}
        </h2>
        <p className="text-xs text-white/75 mt-1">
          {zh
            ? "點擊主星或格局名稱 → 睇學堂詳解文章"
            : "Tap star or pattern names for academy articles"}
        </p>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* 命宮主星 */}
        <div>
          <h3 className="text-sm font-bold text-destiny-purple mb-3 flex items-center gap-2">
            {zh ? "命宮主星" : "Soul palace major stars"}
            {majors.length > 0 && (
              <span className="text-[10px] font-normal text-destiny-purple/50">
                {zh ? "可點擊" : "tap to read"}
              </span>
            )}
          </h3>
          {majors.length === 0 ? (
            <p className="text-sm text-destiny-purple/70 leading-relaxed">
              {zh
                ? "命宮無十四主星（空宮），主星借對宮三方四正 — 切換命宮或預約師傅定盤可確認。"
                : "No major stars in the soul palace (empty palace) — stars are borrowed from the opposite palace."}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {majors.map((star) => {
                  const href = getStarArticleHref(star);
                  const label = zh ? `${star}星` : star;
                  if (href) {
                    return (
                      <Link
                        key={star}
                        href={href}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-destiny-purple text-white border-2 border-destiny-gold/50 shadow-sm hover:bg-destiny-purple-light hover:border-destiny-gold hover:scale-[1.02] transition-all"
                      >
                        {label}
                        <span className="text-destiny-gold text-xs">
                          {zh ? "學堂詳解 →" : "read →"}
                        </span>
                      </Link>
                    );
                  }
                  return (
                    <span
                      key={star}
                      className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium bg-destiny-purple/10 text-destiny-purple border border-destiny-purple/15"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
              {insights.mingComboTag && (
                <p className="text-sm text-destiny-purple/75 mt-3 leading-relaxed bg-destiny-cream/60 rounded-lg px-3 py-2 border border-destiny-purple/8">
                  「{insights.mingComboTag}」
                </p>
              )}
            </>
          )}
          <p className="text-xs text-destiny-purple/45 mt-3">
            <Link
              href="/academy/stars"
              className="text-destiny-gold font-medium hover:underline"
            >
              {zh ? "→ 十四主星專題（全部）" : "→ All 14 major stars"}
            </Link>
          </p>
        </div>

        {/* 格局 */}
        <div className="pt-4 border-t border-destiny-purple/10">
          <h3 className="text-sm font-bold text-destiny-purple mb-3 flex items-center gap-2">
            {zh ? "命盤格局（程式檢測）" : "Detected patterns"}
            {patternCount > 0 && (
              <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-destiny-gold/15 text-destiny-gold border border-destiny-gold/30">
                {patternCount} {zh ? "個" : ""}
              </span>
            )}
          </h3>
          {patternCount === 0 ? (
            <p className="text-sm text-destiny-purple/70 leading-relaxed">
              {zh
                ? "未命中程式內常見格名 — 主星亮度同三方四正已反映你性格同潛力；完整格局要師傅連大限、四化一齊定。"
                : "No named patterns matched — your star brightness and palace aspects still reflect your traits; a full reading needs decadal limits & transformations."}
            </p>
          ) : (
            <ul className="space-y-2">
              {[...jiPatterns, ...xiongPatterns].map((p) => {
                const href = getGejuArticleHref(p.slug);
                const mark = p.confidence === "高" ? "✓" : "△";
                const badgeClass =
                  p.type === "吉"
                    ? "bg-destiny-gold/20 text-destiny-gold border-destiny-gold/40"
                    : "bg-destiny-purple/10 text-destiny-purple border-destiny-purple/20";

                const inner = (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span
                      className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}
                    >
                      {p.type === "吉" ? (zh ? "吉格" : "auspicious") : zh ? "凶格" : "caution"}
                    </span>
                    <span className="text-destiny-purple/50 tabular-nums text-xs">{mark}</span>
                    <span className="font-bold text-destiny-purple">{p.slug}</span>
                    {href && (
                      <span className="text-destiny-gold text-xs font-medium ml-auto shrink-0">
                        {zh ? "學堂詳解 →" : "read →"}
                      </span>
                    )}
                    <span className="text-xs text-destiny-purple/55 w-full leading-relaxed">
                      {p.evidence}
                      {p.confidence === "中" &&
                        (zh ? "（傾向，師傅定盤會確認）" : " (tendency — master confirms)")}
                    </span>
                  </div>
                );

                return (
                  <li key={p.slug}>
                    {href ? (
                      <Link
                        href={href}
                        className="block rounded-xl border border-destiny-purple/10 bg-white px-4 py-3 hover:border-destiny-gold/50 hover:bg-destiny-gold/5 hover:shadow-sm transition-all"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="rounded-xl border border-destiny-purple/8 bg-destiny-cream/30 px-4 py-3 opacity-80">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-xs text-destiny-purple/45 mt-3">
            <Link
              href="/academy/geju"
              className="text-destiny-gold font-medium hover:underline"
            >
              {zh ? "→ 紫微格局專題（全部）" : "→ All chart patterns"}
            </Link>
            {zh ? " · 格局須配合全盤星象同大限" : " · Patterns need full-chart context"}
          </p>
        </div>
      </div>
    </section>
  );
}
