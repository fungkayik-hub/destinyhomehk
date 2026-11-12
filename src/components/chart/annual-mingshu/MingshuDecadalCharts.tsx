"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartFortuneSummaryData } from "@/lib/chart-fortune-summary";
import { sliceDecadalTrendForChart } from "@/lib/chart-fortune-summary";
import { formatDisplayDecadalRange } from "@/lib/ziwei/chart-decadal";

const PURPLE = "#0F1A33";
const GOLD = "#C9A96E";
const GOLD_LIGHT = "#E8C55A";
const MUTED = "#6B7A99";

interface Props {
  data: ChartFortuneSummaryData;
  mode: "full" | "teaser";
  locale?: "zh" | "en";
}

export default function MingshuDecadalCharts({ data, mode, locale = "zh" }: Props) {
  const zh = locale === "zh";
  const offset = data.decadalDisplayOffset;
  const currentDisplayRange = data.currentDecadal
    ? formatDisplayDecadalRange(data.currentDecadal, offset)
    : null;

  if (mode === "teaser") {
    if (!data.currentDecadal) return null;
    return (
      <div className="rounded-xl border border-dashed border-destiny-purple/15 bg-destiny-cream/40 px-4 py-3">
        <p className="text-xs text-destiny-purple/50 mb-1">{zh ? "而家十年大限（摘要）" : "Current decade"}</p>
        <p className="text-sm text-destiny-purple leading-relaxed">
          <span className="text-destiny-gold font-bold tabular-nums">{currentDisplayRange}</span>
          {zh ? " 虛歲 · 大限走 " : " · "}
          <strong>【{data.currentDecadal.palace}】</strong>
          {data.currentDecadal.heavenlyStem}
          {data.currentDecadal.earthlyBranch}
        </p>
        <p className="text-[11px] text-destiny-purple/45 mt-2">
          {zh
            ? "流年詳批已含與大限呼應之分析；完整一生／十年大運時間軸請見「全批」命書圖表。"
            : "Full lifetime & decadal timeline charts are in the Full tier report."}
        </p>
      </div>
    );
  }

  const lineData = sliceDecadalTrendForChart(data.decadalTrend, data.currentDecadal);
  const currentLinePoint = lineData.find((p) => p.isCurrent);

  return (
    <div className="rounded-xl border border-destiny-purple/10 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-destiny-purple/8 bg-gradient-to-r from-destiny-purple/[0.04] to-destiny-gold/[0.08]">
        <p className="text-xs text-destiny-purple/50 mb-1">{zh ? "大運時間軸" : "Decadal timeline"}</p>
        <p className="text-sm text-destiny-purple">
          {zh ? "由 0 虛歲起計 · 八段十年大限 · 金點標示而家所在" : "Eight decadal periods from age 0; gold = current"}
        </p>
      </div>
      <div className="px-2 py-4">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={MUTED} strokeOpacity={0.25} />
            <XAxis
              dataKey="label"
              tick={{ fill: MUTED, fontSize: 10 }}
              interval={0}
              angle={-22}
              textAnchor="end"
              height={52}
            />
            <YAxis
              domain={[1, 8]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8]}
              tick={{ fill: MUTED, fontSize: 10 }}
              width={32}
              tickFormatter={(v) => `${v}級`}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
              formatter={(_value, _name, item) => {
                const p = item.payload as (typeof lineData)[0];
                return [`${p.gradeLevel}級 · ${p.palace}`, zh ? "大限宮" : "Palace"];
              }}
              labelFormatter={(label) => (zh ? `${label} 虛歲` : `Ages ${label}`)}
            />
            {currentLinePoint && (
              <ReferenceLine
                x={currentLinePoint.label}
                stroke={GOLD_LIGHT}
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            )}
            <Line
              type="monotone"
              dataKey="gradeLevel"
              stroke={PURPLE}
              strokeWidth={2.5}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const p = payload as (typeof lineData)[0];
                const r = p.isCurrent ? 6 : 4;
                const fill = p.isCurrent ? GOLD : PURPLE;
                return (
                  <circle
                    key={`dot-${p.label}`}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 7, fill: GOLD }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
