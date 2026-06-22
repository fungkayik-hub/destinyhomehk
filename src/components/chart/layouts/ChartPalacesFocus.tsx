import Link from "next/link";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceAnalysis, PalaceScore } from "@/lib/ai/types";
import { SCORE_LABEL_BG } from "@/lib/palace-score-styles";
import { PalaceStars, PalaceTags, type PalaceLayoutProps } from "./palace-shared";

interface Props extends PalaceLayoutProps {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
  focusAnalysis: PalaceAnalysis;
}

/** 版本 5（推薦）：橫向揀宮 + 下方整合星曜與 AI 分析 */
export default function ChartPalacesFocus({
  chart,
  scoreByPalace,
  focusPalace,
  focusAnalysis,
  buildFocusHref,
}: Props) {
  const palace = chart.palaces.find((p) => p.name === focusPalace);
  const rating = scoreByPalace.get(focusPalace);
  const stars =
    palace?.stars
      .filter((s) => s.type !== "minor")
      .map((s) => s.name)
      .join("、") || "空宮";

  return (
    <div className="space-y-4">
      {/* 十二宮快選 — 手機橫向 scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
        {chart.palaces.map((p) => {
          const score = scoreByPalace.get(p.name);
          const active = p.name === focusPalace;
          return (
            <Link
              key={p.name}
              href={buildFocusHref(p.name)}
              className={`snap-start shrink-0 flex flex-col items-center min-w-[5rem] px-3 py-3 rounded-xl border text-center transition-all ${
                active
                  ? "bg-destiny-purple text-white border-destiny-purple shadow-md scale-[1.02]"
                  : "bg-white text-destiny-purple border-destiny-purple/12 hover:border-destiny-gold"
              }`}
            >
              <span className="text-xs font-bold leading-tight">{p.name.replace("宮", "")}</span>
              {score && (
                <span
                  className={`text-sm font-bold tabular-nums mt-0.5 ${active ? "text-destiny-gold" : ""}`}
                >
                  {score.score}
                </span>
              )}
              {p.isSoulPalace && (
                <span className={`text-[9px] mt-0.5 ${active ? "text-white/70" : "text-destiny-gold"}`}>
                  命
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 整合詳情 + AI */}
      <div
        id="analysis"
        className="scroll-mt-20 rounded-2xl border border-destiny-purple/10 bg-white shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-destiny-purple to-destiny-purple-light text-white px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-destiny-gold text-xs font-medium mb-1">AI Sunny 師傅 · 免費分析</p>
              <h3 className="font-display text-xl font-bold">{focusPalace}</h3>
              {palace && (
                <p className="text-white/70 text-sm mt-1">
                  {palace.heavenlyStem}
                  {palace.earthlyBranch} · 主星 {stars}
                </p>
              )}
              {palace && <PalaceTags palace={palace} />}
            </div>
            {rating && (
              <div className="text-right">
                <div className="text-4xl font-bold text-destiny-gold tabular-nums leading-none">
                  {rating.score}
                </div>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${SCORE_LABEL_BG[rating.label]}`}
                >
                  {rating.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {palace && (
          <div className="px-5 py-4 border-b border-destiny-purple/8 bg-destiny-cream/30">
            <p className="text-xs text-destiny-purple/50 mb-2">主星分佈</p>
            <PalaceStars palace={palace} />
          </div>
        )}

        <div className="px-5 py-5">
          <p className="text-destiny-purple/85 leading-relaxed text-base">{focusAnalysis.text}</p>
          <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed">
            以上為 AI 按命盤自動生成，模仿 Sunny 師傅語氣，僅供參考。
            <strong className="text-destiny-purple/60"> 非師傅親批</strong>，定盤請 WhatsApp 預約。
            左右滑動揀其他宮位。
          </p>
        </div>
      </div>
    </div>
  );
}
