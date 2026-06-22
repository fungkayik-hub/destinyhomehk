import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceAnalysis } from "@/lib/ai/types";

interface Props {
  chart: ZiWeiChart;
  focusPalace: PalaceAnalysis;
}

/** 當前選中宮位的 AI 分析（服務端預生成） */
export default function ChartPalaceAnalysis({ chart, focusPalace }: Props) {
  const palace = chart.palaces.find((p) => p.name === focusPalace.palace);
  const stars =
    palace?.stars
      .filter((s) => s.type !== "minor")
      .map((s) => s.name)
      .join("、") || "空宮";

  return (
    <section id="analysis" className="scroll-mt-20">
      <div className="card border-l-4 border-l-destiny-gold bg-gradient-to-r from-destiny-gold/8 to-transparent">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-medium bg-destiny-gold text-destiny-purple px-2 py-0.5 rounded">
            AI Sunny 師傅
          </span>
          <h3 className="font-display text-lg font-bold">{focusPalace.palace}分析</h3>
          <span className="text-xs text-destiny-purple/40 ml-auto">約 200 字 · 免費</span>
        </div>

        {palace && (
          <p className="text-xs text-destiny-purple/50 mb-3">
            {focusPalace.palace}在{palace.earthlyBranch}，主星為{stars}
          </p>
        )}

        <p className="text-destiny-purple/85 leading-relaxed text-base">{focusPalace.text}</p>

        <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed">
          以上為 AI 按命盤自動生成，模仿 Sunny 師傅語氣，僅供參考。
          <strong className="text-destiny-purple/60"> 非師傅親批</strong>，定盤請 WhatsApp 預約。
          可按上面其他宮位睇唔同分析。
        </p>
      </div>
    </section>
  );
}
