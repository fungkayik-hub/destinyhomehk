import Link from "next/link";
import { CHART_LAYOUTS, buildChartHref, type ChartLayoutId } from "@/lib/chart-layout";

interface Props {
  current: ChartLayoutId;
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ChartLayoutPicker({ current, searchParams }: Props) {
  return (
    <details className="group text-center">
      <summary className="text-xs text-destiny-purple/45 cursor-pointer hover:text-destiny-gold list-none inline-flex items-center gap-1">
        <span className="group-open:rotate-90 transition-transform">▸</span>
        換排版顯示
      </summary>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {CHART_LAYOUTS.map((layout) => {
          const active = current === layout.id;
          return (
            <Link
              key={layout.id}
              href={buildChartHref(searchParams, { layout: layout.id, hash: "palaces" })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "bg-destiny-purple text-white border-destiny-purple"
                  : "bg-white text-destiny-purple/70 border-destiny-purple/15 hover:border-destiny-gold"
              }`}
            >
              {layout.name}
              {layout.recommended && !active && (
                <span className="ml-1 text-[10px] text-destiny-gold">★</span>
              )}
            </Link>
          );
        })}
      </div>
    </details>
  );
}
