import Link from "next/link";
import { CHART_LAYOUTS, buildChartHref, type ChartLayoutId } from "@/lib/chart-layout";

interface Props {
  current: ChartLayoutId;
  searchParams: Record<string, string | string[] | undefined>;
  locale?: "zh" | "en";
}

export default function ChartLayoutPicker({ current, searchParams, locale = "zh" }: Props) {
  return (
    <div className="w-full rounded-xl border border-destiny-purple/10 bg-white/80 p-3 space-y-2">
      <p className="text-[11px] text-destiny-purple/45 text-center sm:text-left">
        {locale === "en" ? "Display mode" : "顯示方式"}
      </p>
      <div className="flex flex-wrap gap-2">
        {CHART_LAYOUTS.map((layout) => {
          const active = current === layout.id;
          return (
            <Link
              key={layout.id}
              href={buildChartHref(searchParams, { layout: layout.id, hash: "palaces" })}
              title={layout.desc}
              className={`flex-1 min-w-[5.5rem] text-center px-2 py-2 rounded-lg border transition-colors ${
                active
                  ? "bg-destiny-purple text-white border-destiny-purple shadow-sm"
                  : "bg-destiny-cream/50 text-destiny-purple/75 border-destiny-purple/12 hover:border-destiny-gold"
              }`}
            >
              <span className="block text-xs font-bold leading-tight">
                {layout.name}
                {layout.recommended && !active && (
                  <span className="ml-0.5 text-[10px] text-destiny-gold">★</span>
                )}
              </span>
              <span
                className={`block text-[10px] mt-0.5 leading-snug ${
                  active ? "text-white/65" : "text-destiny-purple/40"
                }`}
              >
                {layout.desc}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
