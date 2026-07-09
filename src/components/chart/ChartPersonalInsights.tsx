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

  return (
    <section
      id="personal-insights"
      className="scroll-mt-20 rounded-2xl border border-destiny-purple/12 bg-white shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-destiny-purple/8 bg-destiny-cream/40">
        <h2 className="font-display text-lg font-bold text-destiny-purple">
          {zh ? "你嘅命格速覽" : "Your chart at a glance"}
        </h2>
        <p className="text-xs text-destiny-purple/55 mt-1">
          {zh
            ? "命宮主星同常見格局 — 點名稱可睇學堂詳解"
            : "Soul palace stars & detected patterns — tap names for academy articles"}
        </p>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* 命宮主星 */}
        <div>
          <h3 className="text-sm font-bold text-destiny-purple mb-2">
            {zh ? "命宮主星" : "Soul palace major stars"}
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
                  const inner = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-destiny-purple text-white">
                      {label}
                      {href && (
                        <span className="text-[10px] text-white/70">
                          {zh ? "詳解 →" : "read →"}
                        </span>
                      )}
                    </span>
                  );
                  return href ? (
                    <Link
                      key={star}
                      href={href}
                      className="hover:opacity-90 transition-opacity"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <span key={star}>{inner}</span>
                  );
                })}
              </div>
              {insights.mingComboTag && (
                <p className="text-sm text-destiny-purple/75 mt-2 leading-relaxed">
                  「{insights.mingComboTag}」
                </p>
              )}
            </>
          )}
          <p className="text-xs text-destiny-purple/45 mt-2">
            <Link href="/academy/stars" className="text-destiny-gold hover:underline">
              {zh ? "十四主星專題" : "All 14 major stars"}
            </Link>
          </p>
        </div>

        {/* 格局 */}
        <div className="pt-4 border-t border-destiny-purple/8">
          <h3 className="text-sm font-bold text-destiny-purple mb-2">
            {zh ? "命盤格局（程式檢測）" : "Detected patterns"}
          </h3>
          {insights.patterns.length === 0 ? (
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
                    ? "bg-destiny-gold/15 text-destiny-gold border-destiny-gold/30"
                    : "bg-destiny-purple/8 text-destiny-purple/80 border-destiny-purple/15";

                const row = (
                  <div className="flex flex-wrap items-start gap-2 text-sm">
                    <span
                      className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}
                    >
                      {p.type === "吉" ? (zh ? "吉" : "auspicious") : zh ? "凶" : "caution"}
                    </span>
                    <span className="text-destiny-purple/40 tabular-nums">{mark}</span>
                    <span className="font-medium text-destiny-purple">
                      {p.slug}
                      {href && (
                        <span className="text-destiny-gold font-normal text-xs ml-1">
                          {zh ? "詳解 →" : "read →"}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-destiny-purple/50 w-full sm:w-auto sm:ml-0">
                      {p.evidence}
                      {p.confidence === "中" &&
                        (zh ? "（傾向，師傅定盤會確認）" : " (tendency — master confirms)")}
                    </span>
                  </div>
                );

                return (
                  <li key={p.slug}>
                    {href ? (
                      <Link href={href} className="block hover:bg-destiny-cream/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                        {row}
                      </Link>
                    ) : (
                      <div className="-mx-2 px-2 py-1 opacity-80">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-xs text-destiny-purple/45 mt-3">
            <Link href="/academy/geju" className="text-destiny-gold hover:underline">
              {zh ? "紫微格局專題" : "All chart patterns"}
            </Link>
            {zh ? " · 格局須配合全盤星象同大限" : " · Patterns need full-chart context"}
          </p>
        </div>
      </div>
    </section>
  );
}
