import type { ZiWeiChart } from "@/lib/ziwei";
import { buildMutagenSummary } from "@/lib/ziwei/mutagen-copy";
import { MUTAGEN_BADGE_CLASS } from "@/lib/ziwei/mutagen";

interface Props {
  chart: ZiWeiChart;
  locale?: "zh" | "en";
}

const LABEL_FULL: Record<"祿" | "權" | "科" | "忌", string> = {
  祿: "化祿",
  權: "化權",
  科: "化科",
  忌: "化忌",
};

export default function ChartMutagenSummary({ chart, locale = "zh" }: Props) {
  const summary = buildMutagenSummary(chart);
  if (!summary) return null;

  const zh = locale === "zh";

  return (
    <section
      id="mutagen"
      className="scroll-mt-20 rounded-2xl border border-destiny-purple/12 bg-white shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-destiny-purple/95 to-destiny-purple-light text-white px-5 py-4">
        <p className="text-destiny-gold text-xs font-medium mb-1">
          {zh ? "生年四化" : "Birth-year mutagens"}
        </p>
        <h2 className="font-display text-lg font-bold">
          {zh ? `${summary.yearStem}年 祿權科忌` : `Year stem ${summary.yearStem}`}
        </h2>
        <p className="text-xs text-white/70 mt-1">
          {zh
            ? "按出生年天干飛星 — 睇四化落邊宮，就知邊方面較順或要留心"
            : "Flying stars from birth-year stem — which life areas are boosted or need care"}
        </p>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* 四化一覽 */}
        <div className="flex flex-wrap gap-2">
          {summary.table.map(({ star, label }) => {
            const fly = summary.flying.find((f) => f.star === star && f.label === label);
            return (
              <span
                key={`${star}-${label}`}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-medium ${MUTAGEN_BADGE_CLASS[label]}`}
              >
                <span>
                  {star}
                  {LABEL_FULL[label]}
                </span>
                {fly && (
                  <span className="opacity-75 font-normal">→ {fly.palace}</span>
                )}
              </span>
            );
          })}
        </div>

        {summary.highlight && (
          <p className="text-sm text-destiny-purple/85 leading-relaxed bg-destiny-gold/10 border border-destiny-gold/25 rounded-xl px-4 py-3">
            {summary.highlight}
          </p>
        )}

        {/* 逐粒四化解讀 */}
        <ul className="space-y-4">
          {summary.flying.map((item) => (
            <li
              key={`${item.star}-${item.label}`}
              className="rounded-xl border border-destiny-purple/10 bg-destiny-cream/25 px-4 py-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border ${MUTAGEN_BADGE_CLASS[item.label]}`}
                >
                  {item.star}
                  {LABEL_FULL[item.label]}
                </span>
                <span className="text-sm font-bold text-destiny-purple">
                  {zh ? "入" : "in "}
                  {item.palace}
                </span>
              </div>
              <p className="text-sm text-destiny-purple/80 leading-relaxed">{item.inPalace}</p>
              {item.starFlavor && (
                <p className="text-xs text-destiny-gold/90 mt-2 leading-relaxed border-t border-destiny-purple/8 pt-2">
                  {item.starFlavor}
                </p>
              )}
              <p className="text-[11px] text-destiny-purple/45 mt-2">{item.general}</p>
            </li>
          ))}
        </ul>

        <p className="text-xs text-destiny-purple/45 leading-relaxed">
          {zh
            ? "以上為生年四化入門參考；大限、流年、自化等要配合全盤 — 想深入可 WhatsApp 預約師傅全批。"
            : "Birth-year mutagen intro only — decadal & annual layers need a full reading."}
        </p>
      </div>
    </section>
  );
}
