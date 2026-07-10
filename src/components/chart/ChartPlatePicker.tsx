import Link from "next/link";
import type { ChartPlateType } from "@/lib/ziwei/types";
import { CHART_PLATES } from "@/lib/ziwei/zhongzhou-plates";
import { buildChartHref } from "@/lib/chart-layout";

interface Props {
  current: ChartPlateType;
  suggested?: ChartPlateType;
  searchParams: Record<string, string | string[] | undefined>;
  locale?: "zh" | "en";
}

export default function ChartPlatePicker({
  current,
  suggested,
  searchParams,
  locale = "zh",
}: Props) {
  const zh = locale === "zh";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {CHART_PLATES.map((plate) => {
          const active = current === plate.id;
          const isSuggested = suggested === plate.id && suggested !== current;
          return (
            <Link
              key={plate.id}
              href={buildChartHref(searchParams, { plate: plate.id, hash: "plates" }, locale)}
              className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                active
                  ? "bg-destiny-gold text-destiny-purple border-destiny-gold font-semibold"
                  : "bg-white text-destiny-purple/80 border-destiny-purple/15 hover:border-destiny-gold"
              }`}
            >
              {zh ? plate.name : plate.nameEn}
              {isSuggested && (
                <span className="ml-1.5 text-[10px] font-normal text-destiny-gold">
                  {zh ? "建議" : "suggested"}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-destiny-purple/50 leading-relaxed">
        {zh
          ? CHART_PLATES.find((p) => p.id === current)?.desc
          : CHART_PLATES.find((p) => p.id === current)?.descEn}
        {suggested && suggested !== current && (
          <span className="text-destiny-gold">
            {zh
              ? ` · 依時辰分刻，建議先睇${CHART_PLATES.find((p) => p.id === suggested)?.name}，但仍須定盤確認`
              : ` · Time slot suggests ${CHART_PLATES.find((p) => p.id === suggested)?.nameEn} plate — verify with master`}
          </span>
        )}
      </p>
    </div>
  );
}
