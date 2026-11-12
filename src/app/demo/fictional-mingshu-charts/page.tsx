import type { Metadata } from "next";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import { buildChartFortuneSummary } from "@/lib/chart-fortune-summary";
import AnnualMingshuCharts from "@/components/chart/annual-mingshu/AnnualMingshuCharts";
import AnnualMingshuPdfExport from "@/components/chart/annual-mingshu/AnnualMingshuPdfExport";

export const metadata: Metadata = {
  title: "示範 · 流年命書圖表（虛構樣本）",
  robots: { index: false, follow: false },
};

/** 純虛構示範命盤，非真實客戶資料 — 供設計／QA 預覽 */
const FICTIONAL_INPUT = {
  year: 1990,
  month: 6,
  day: 15,
  hour: 9,
  minute: 30,
  gender: "female" as const,
  calendarType: "solar" as const,
  birthPlaceId: "hong-kong",
};

const MOCK_STANDARD_TEXT = `【2026 流年詳批 · 網上小師傅命書 · 示範】

【流年總述】
示範命盤：今年宜調整整節奏、鞏固基本盤。

【十二個月流月】
正月 — 主題：開局定調；宜：整理計劃；忌：衝動決策。
二月 — 主題：人際拓展；宜：主動聯絡；忌：過度承諾。
三月 — 主題：理財修整；宜：檢視開支；忌：大額投機。
四月 — 主題：職涯節奏；宜：專注核心；忌：分散精力。
五月 — 主題：感情波折；宜：坦白溝通；忌：冷戰拖延、衝動決定。
六月 — 主題：健康作息；宜：規律運動、早睡；忌：熬夜硬撐。
七月 — 主題：進修充電；宜：學習新技能、拓展視野；忌：半途而廢。
八月 — 主題：合作簽約；宜：書面確認、順利推進；忌：口頭承諾、冒進。
九月 — 主題：守成鞏固；宜：鞏固成果；忌：盲目擴張、投機。
十月 — 主題：變動壓力；宜：預留緩衝；忌：倉卒改變、賭注加大。
十一月 — 主題：收攏資源；宜：精簡目標；忌：分心太多。
十二月 — 主題：總結鋪排；宜：回顧調整；忌：逃避總結。

【實用化解／加強行動】
1. 示範條文 — 非真實客戶內容。`;

const MOCK_FULL_TEXT = `${MOCK_STANDARD_TEXT}

【一生大運】
示範全批一生層摘要。

【十年大運】
示範各段大限說明。`;

export default function FictionalMingshuChartsDemoPage() {
  const chart = generateChart(FICTIONAL_INPUT);
  const scores = chart.palaces.map((p, i) => ({
    palace: p.name,
    score: 62 + (i % 7) * 4,
    label: "平" as const,
    brief: "示範評分",
  }));
  const scoreByPalace = new Map(scores.map((s) => [s.palace, s]));
  const fortuneSummary = buildChartFortuneSummary(chart, scores);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <header className="rounded-xl border border-destiny-amber/40 bg-destiny-amber/10 px-4 py-3 text-sm text-destiny-purple">
        <strong>虛構示範</strong> — 下列為示範命盤與範文，並非真實客戶資料；此頁不會被搜尋收錄。
      </header>

      <section className="space-y-4">
        <h1 className="font-display text-xl font-bold text-destiny-purple">流年詳批圖表（HK$128 示範）</h1>
        <AnnualMingshuCharts
          chart={chart}
          scoreByPalace={scoreByPalace}
          fortuneSummary={fortuneSummary}
          reportText={MOCK_STANDARD_TEXT}
          activeView="standard"
        />
      </section>

      <section className="space-y-4 border-t border-destiny-purple/10 pt-8">
        <h1 className="font-display text-xl font-bold text-destiny-purple">全批圖表（HK$688 示範）</h1>
        <AnnualMingshuCharts
          chart={chart}
          scoreByPalace={scoreByPalace}
          fortuneSummary={fortuneSummary}
          reportText={MOCK_FULL_TEXT}
          activeView="full"
        />
        <AnnualMingshuPdfExport
          chart={chart}
          scoreByPalace={scoreByPalace}
          fortuneSummary={fortuneSummary}
          reportText={MOCK_FULL_TEXT}
          activeView="full"
        />
      </section>
    </main>
  );
}
