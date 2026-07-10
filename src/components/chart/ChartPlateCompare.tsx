import type { ChartPlateType, ZiWeiChart } from "@/lib/ziwei/types";
import { CHART_PLATES } from "@/lib/ziwei/zhongzhou-plates";

interface Props {
  plates: Record<ChartPlateType, ZiWeiChart>;
  activePlate: ChartPlateType;
  locale?: "zh" | "en";
}

function soulMajorStars(chart: ZiWeiChart): string {
  const soul = chart.palaces.find((p) => p.isSoulPalace);
  const majors = soul?.stars.filter((s) => s.type === "major").map((s) => s.name) ?? [];
  return majors.length > 0 ? majors.join("、") : "空宮";
}

export default function ChartPlateCompare({ plates, activePlate, locale = "zh" }: Props) {
  const zh = locale === "zh";

  return (
    <details className="group rounded-xl border border-destiny-purple/10 bg-white/60">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-destiny-purple hover:text-destiny-gold">
        <span className="group-open:rotate-90 inline-block transition-transform mr-1">▸</span>
        {zh ? "天地人三盤對照（定盤用）" : "Heaven / Earth / Human comparison"}
      </summary>
      <div className="px-4 pb-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[320px]">
          <thead>
            <tr className="text-left text-destiny-purple/50 text-xs">
              <th className="py-2 pr-3 font-normal" />
              {CHART_PLATES.map((p) => (
                <th
                  key={p.id}
                  className={`py-2 px-2 font-normal ${
                    p.id === activePlate ? "text-destiny-gold" : ""
                  }`}
                >
                  {zh ? p.name : p.nameEn}
                  {p.id === activePlate && (zh ? " ◀" : " ◀")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-destiny-purple">
            <tr className="border-t border-destiny-purple/8">
              <td className="py-2 pr-3 text-destiny-purple/50 text-xs">{zh ? "命宮" : "Soul"}</td>
              {CHART_PLATES.map((p) => (
                <td key={p.id} className="py-2 px-2 font-medium">
                  {plates[p.id].mingPalaceBranch}
                </td>
              ))}
            </tr>
            <tr className="border-t border-destiny-purple/8">
              <td className="py-2 pr-3 text-destiny-purple/50 text-xs">{zh ? "五行局" : "Element"}</td>
              {CHART_PLATES.map((p) => (
                <td key={p.id} className="py-2 px-2">
                  {plates[p.id].fiveElement}
                </td>
              ))}
            </tr>
            <tr className="border-t border-destiny-purple/8">
              <td className="py-2 pr-3 text-destiny-purple/50 text-xs">{zh ? "命宮主星" : "Major stars"}</td>
              {CHART_PLATES.map((p) => (
                <td key={p.id} className="py-2 px-2">
                  {soulMajorStars(plates[p.id])}
                </td>
              ))}
            </tr>
            <tr className="border-t border-destiny-purple/8">
              <td className="py-2 pr-3 text-destiny-purple/50 text-xs">{zh ? "身宮" : "Body"}</td>
              {CHART_PLATES.map((p) => (
                <td key={p.id} className="py-2 px-2">
                  {plates[p.id].shenPalaceBranch}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-destiny-purple/45 leading-relaxed">
          {zh
            ? "中洲派：地盤以身宮為命宮、人盤以福德宮為命宮重排十四主星；輔曜位置不變。邊張盤最似你性格同經歷，就係你嘅正盤 — 唔肯定請預約師傅定盤。"
            : "Zhongzhou: Earth plate pivots on body palace, Human on fortune palace — major stars only. Match past events to pick your chart."}
        </p>
      </div>
    </details>
  );
}
