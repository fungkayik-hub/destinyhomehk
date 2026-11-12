"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ParsedLiuyueMonth } from "@/lib/palace-report/parse-liuyue";

const GOLD = "#C9A96E";
const MUTED = "#6B7A99";

interface Props {
  months: ParsedLiuyueMonth[];
  year: number;
  locale?: "zh" | "en";
}

/** 流月能量節奏（有主題則較高，方便一眼比較十二個月節奏） */
function monthEnergy(m: ParsedLiuyueMonth, index: number): number {
  if (!m.theme.trim()) return 3 + (index % 3);
  const base = 5 + Math.min(3, Math.floor(m.theme.length / 8));
  const yiBoost = m.yi ? 0.5 : 0;
  const jiDrag = m.ji ? -0.25 : 0;
  return Math.min(8, Math.max(3, base + yiBoost + jiDrag));
}

export default function MingshuLiuyueChart({ months, year, locale = "zh" }: Props) {
  const zh = locale === "zh";
  const data = months.map((m, i) => ({
    label: m.month.replace("月", ""),
    fullMonth: m.month,
    energy: monthEnergy(m, i),
    theme: m.theme || (zh ? "（待補）" : "—"),
    yi: m.yi,
    ji: m.ji,
  }));

  const hasAnyTheme = data.some((d) => d.theme && d.theme !== "（待補）" && d.theme !== "—");

  return (
    <div className="rounded-xl border border-destiny-purple/10 bg-white px-3 py-4">
      <p className="text-xs text-destiny-purple/55 mb-3 text-center">
        {zh ? `${year} 年十二流月節奏圖` : `${year} monthly rhythm`}
      </p>
      {!hasAnyTheme && (
        <p className="text-[11px] text-destiny-purple/45 text-center mb-2">
          {zh ? "圖表依命書流月主題整理；若文字尚未載入會顯示佔位。" : "Themes from report text."}
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={MUTED} strokeOpacity={0.2} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: MUTED, fontSize: 10 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={48}
          />
          <YAxis
            domain={[0, 8]}
            ticks={[2, 4, 6, 8]}
            tick={{ fill: MUTED, fontSize: 10 }}
            width={24}
            hide
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, fontSize: 12, maxWidth: 280, border: `1px solid ${GOLD}` }}
            labelFormatter={(_l, items) => {
              const p = items[0]?.payload as (typeof data)[0] | undefined;
              return p ? `${p.fullMonth}` : "";
            }}
            formatter={(_v, _n, item) => {
              const p = item.payload as (typeof data)[0];
              const lines = [
                `${zh ? "主題" : "Theme"}：${p.theme}`,
                p.yi ? `${zh ? "宜" : "Do"}：${p.yi}` : "",
                p.ji ? `${zh ? "忌" : "Avoid"}：${p.ji}` : "",
              ].filter(Boolean);
              return [lines.join("\n"), zh ? "流月" : "Month"];
            }}
          />
          <Bar dataKey="energy" fill={GOLD} fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
        {data.map((d) => (
          <div
            key={d.fullMonth}
            className="text-[10px] leading-snug rounded-lg border border-destiny-purple/8 bg-destiny-cream/30 px-2 py-1.5"
          >
            <span className="font-semibold text-destiny-purple">{d.fullMonth}</span>
            <span className="text-destiny-purple/65"> · {d.theme}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
