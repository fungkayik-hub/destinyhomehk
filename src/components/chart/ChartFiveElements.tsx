import { analyzeBaziFiveElements, type WuXing } from "@/lib/bazi/five-elements";

const ELEMENT_CLASS: Record<WuXing, string> = {
  金: "bg-amber-100/90 text-amber-900 border-amber-300/50",
  木: "bg-emerald-100/90 text-emerald-900 border-emerald-300/50",
  水: "bg-sky-100/90 text-sky-900 border-sky-300/50",
  火: "bg-rose-100/90 text-rose-900 border-rose-300/50",
  土: "bg-yellow-100/90 text-yellow-900 border-yellow-400/50",
};

interface Props {
  chineseDate: string;
  locale?: "zh" | "en";
}

function ElementBadges({
  elements,
  locale,
  emptyLabel,
}: {
  elements: WuXing[];
  locale: "zh" | "en";
  emptyLabel?: string;
}) {
  if (elements.length === 0) {
    return (
      <span className="text-white/70 text-sm">
        {emptyLabel ?? (locale === "en" ? "—" : "—")}
      </span>
    );
  }
  return (
    <span className="inline-flex flex-wrap gap-1">
      {elements.map((el) => (
        <span
          key={el}
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${ELEMENT_CLASS[el]}`}
        >
          {el}
        </span>
      ))}
    </span>
  );
}

export default function ChartFiveElements({ chineseDate, locale = "zh" }: Props) {
  const zh = locale === "zh";
  const result = analyzeBaziFiveElements(chineseDate);
  if (!result) return null;

  return (
    <div className="col-span-2 sm:col-span-full border-t border-white/10 pt-3 mt-1 space-y-2.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span>
          <span className="text-white/50">{zh ? "日主 " : "Day master "}</span>
          <strong>
            {result.dayMaster}
            {zh ? "（" : " ("}
            {result.dayMasterElement}
            {zh ? "）" : ")"}
          </strong>
          <span className="text-white/40 text-xs ml-1.5">{result.strength}</span>
        </span>
      </div>
      <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sm">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-white/50 shrink-0">{zh ? "缺五行" : "Missing"}</span>
          <ElementBadges
            elements={result.missing}
            locale={locale}
            emptyLabel={zh ? "五行俱全" : "All present"}
          />
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-white/50 shrink-0">{zh ? "忌五行" : "Avoid"}</span>
          <ElementBadges
            elements={result.taboo}
            locale={locale}
            emptyLabel={zh ? "較均衡" : "Balanced"}
          />
        </span>
        {result.favorable.length > 0 && (
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-white/50 shrink-0">{zh ? "喜用神" : "Favorable"}</span>
            <ElementBadges elements={result.favorable} locale={locale} />
          </span>
        )}
      </div>
      <p className="text-[11px] text-white/40 leading-relaxed">
        {zh
          ? `按四柱 ${chineseDate} 天干地支推算，入門參考；大運流年同藏干會影響實際喜忌，師傅全批可再確認。`
          : `Based on four pillars (${chineseDate}) — introductory reference; luck cycles and hidden stems affect the full reading.`}
      </p>
    </div>
  );
}
