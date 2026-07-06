import { LOT_GRADE_STATS, lotCount } from "@/lib/fortune-stick/lots";

const GRADE_STYLE: Record<string, string> = {
  大吉: "text-destiny-gold font-semibold",
  吉: "text-destiny-green",
  小吉: "text-destiny-green/80",
  半吉: "text-destiny-purple/70",
  末小吉: "text-destiny-purple/60",
  末吉: "text-destiny-purple/60",
  凶: "text-destiny-red",
};

export default function FortuneStickGradeGuide() {
  return (
    <section className="max-w-2xl mx-auto card bg-white/80">
      <h2 className="font-display font-bold text-destiny-purple mb-1">
        觀音靈籤 · 吉凶分佈
      </h2>
      <p className="text-sm text-destiny-purple/65 mb-4">
        全共 <strong>{lotCount()}</strong> 支籤，搖籤後會顯示籤號同以下其中一種吉凶等級。
      </p>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm border-collapse min-w-[280px]">
          <thead>
            <tr className="border-b border-destiny-purple/15">
              <th className="text-left py-2 px-2 text-destiny-purple/70 font-medium">等級</th>
              <th className="text-right py-2 px-2 text-destiny-purple/70 font-medium">數量</th>
            </tr>
          </thead>
          <tbody>
            {LOT_GRADE_STATS.map((row) => (
              <tr key={row.grade} className="border-b border-destiny-purple/8 last:border-0">
                <td className={`py-2.5 px-2 ${GRADE_STYLE[row.grade] ?? ""}`}>
                  {row.grade}
                </td>
                <td className="py-2.5 px-2 text-right text-destiny-purple/80 tabular-nums">
                  {row.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed">
        免費睇籤詩同等級；HK$38 解鎖後，小徒弟會按你條問題同籤文寫完整解讀（非師傅親批）。
      </p>
    </section>
  );
}
