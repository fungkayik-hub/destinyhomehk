"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyzeBaziFiveElements, WU_XING_ORDER, type WuXing } from "@/lib/bazi/five-elements";

const PURPLE = "#0F1A33";
const MUTED = "#6B7A99";

const ELEMENT_FILL: Record<WuXing, string> = {
  金: "#C9A96E",
  木: "#2D6A4F",
  水: "#1D4E89",
  火: "#A83248",
  土: "#B8860B",
};

interface Props {
  chineseDate: string;
  locale?: "zh" | "en";
}

export default function MingshuWuXingChart({ chineseDate, locale = "zh" }: Props) {
  const zh = locale === "zh";
  const analysis = analyzeBaziFiveElements(chineseDate);
  if (!analysis) return null;

  const data = WU_XING_ORDER.map((el) => ({
    element: el,
    count: analysis.counts[el],
    favorable: analysis.favorable.includes(el),
    taboo: analysis.taboo.includes(el),
  }));

  const maxCount = Math.max(2, ...data.map((d) => d.count));

  return (
    <div className="rounded-xl border border-destiny-purple/10 bg-white px-3 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <p className="text-xs text-destiny-purple/55">
          {zh ? "五行強弱（四柱分佈）" : "Five elements strength"}
        </p>
        <p className="text-xs text-destiny-purple/70">
          {zh ? "日主" : "Day master"} <strong>{analysis.dayMaster}</strong>（
          {analysis.dayMasterElement}）· {analysis.strength}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={MUTED} strokeOpacity={0.2} vertical={false} />
          <XAxis
            dataKey="element"
            tick={{ fill: PURPLE, fontSize: 13, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, maxCount + 1]}
            tick={{ fill: MUTED, fontSize: 10 }}
            width={28}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #C9A96E" }}
            formatter={(value, _n, item) => {
              const p = item.payload as (typeof data)[0];
              const tags: string[] = [];
              if (p.favorable) tags.push(zh ? "喜用" : "Favorable");
              if (p.taboo) tags.push(zh ? "忌" : "Avoid");
              const extra = tags.length ? ` · ${tags.join("、")}` : "";
              return [`${value} ${zh ? "次" : "hits"}${extra}`, zh ? "出現次數" : "Count"];
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry) => (
              <Cell
                key={entry.element}
                fill={ELEMENT_FILL[entry.element]}
                fillOpacity={entry.taboo ? 0.45 : entry.favorable ? 1 : 0.75}
                stroke={entry.favorable ? "#0F1A33" : "transparent"}
                strokeWidth={entry.favorable ? 1.5 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-destiny-purple/40 mt-2 leading-relaxed text-center px-2">
        {zh
          ? "按本命四柱推算；深色框為喜用參考、淡色為忌神參考（流年可再調整）。"
          : "From four pillars; outlined bars = favorable reference."}
      </p>
    </div>
  );
}
