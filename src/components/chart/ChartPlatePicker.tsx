import Link from "next/link";
import type { ChartPlateType } from "@/lib/ziwei/types";
import { CHART_PLATES } from "@/lib/ziwei/zhongzhou-plates";
import { buildChartHref } from "@/lib/chart-layout";

interface Props {
  current: ChartPlateType;
  suggested?: ChartPlateType;
  suggestedB?: ChartPlateType;
  searchParams: Record<string, string | string[] | undefined>;
  locale?: "zh" | "en";
  /** bar = 紫色資料條內；default = 白底獨立區 */
  variant?: "default" | "bar";
  buildPlateHref?: (plate: ChartPlateType) => string;
}

export default function ChartPlatePicker({
  current,
  suggested,
  suggestedB,
  searchParams,
  locale = "zh",
  variant = "default",
  buildPlateHref,
}: Props) {
  const zh = locale === "zh";
  const isBar = variant === "bar";
  const hrefFor = (plate: ChartPlateType) =>
    buildPlateHref?.(plate) ??
    buildChartHref(searchParams, { plate, hash: "plates" }, locale);

  const buttons = (
    <div className={`flex flex-wrap gap-1.5 ${isBar ? "" : "gap-2"}`}>
      {CHART_PLATES.map((plate) => {
        const active = current === plate.id;
        const isSuggested =
          (suggested === plate.id || suggestedB === plate.id) && plate.id !== current;
        return (
          <Link
            key={plate.id}
            href={hrefFor(plate.id)}
            className={
              isBar
                ? `text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                    active
                      ? "bg-destiny-gold text-destiny-purple border-destiny-gold font-bold shadow-sm"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-destiny-gold/50"
                  }`
                : `text-sm px-4 py-2 rounded-lg border transition-colors ${
                    active
                      ? "bg-destiny-gold text-destiny-purple border-destiny-gold font-semibold"
                      : "bg-white text-destiny-purple/80 border-destiny-purple/15 hover:border-destiny-gold"
                  }`
            }
          >
            {zh ? plate.name : plate.nameEn}
            {isSuggested && (
              <span
                className={`ml-1 text-[10px] font-normal ${isBar ? "text-destiny-purple/80" : "text-destiny-gold"}`}
              >
                {zh ? "建議" : "★"}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  const desc = CHART_PLATES.find((p) => p.id === current);
  const descText = zh ? desc?.desc : desc?.descEn;
  const suggestNote =
    suggested && suggestedB && suggested !== suggestedB
      ? zh
        ? ` · 你建議${CHART_PLATES.find((p) => p.id === suggested)?.name}、對方建議${CHART_PLATES.find((p) => p.id === suggestedB)?.name} — 定盤後再合婚最準`
        : ` · You: ${CHART_PLATES.find((p) => p.id === suggested)?.nameEn}; partner: ${CHART_PLATES.find((p) => p.id === suggestedB)?.nameEn} — verify plates first`
      : suggested && suggested !== current
        ? zh
          ? ` · 依時辰分刻，建議先睇${CHART_PLATES.find((p) => p.id === suggested)?.name}，但仍須定盤確認`
          : ` · Time slot suggests ${CHART_PLATES.find((p) => p.id === suggested)?.nameEn} plate — verify with master`
        : "";

  if (isBar) {
    return (
      <div id="plates" className="space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-xs text-white/50 shrink-0">
            {zh ? "天地人盤" : "Plates"}
          </span>
          {buttons}
        </div>
        {(descText || suggestNote) && (
          <p className="text-[11px] text-white/45 leading-relaxed">
            {descText}
            {suggestNote && <span className="text-destiny-gold/90">{suggestNote}</span>}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {buttons}
      <p className="text-xs text-destiny-purple/50 leading-relaxed">
        {descText}
        {suggestNote && <span className="text-destiny-gold">{suggestNote}</span>}
      </p>
    </div>
  );
}
