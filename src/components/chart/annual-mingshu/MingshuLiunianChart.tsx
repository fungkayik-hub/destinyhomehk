"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ChartFortuneSummaryData } from "@/lib/chart-fortune-summary";
import { letterGradeStyle } from "@/lib/chart-fortune-summary";

const PURPLE = "#0F1A33";
const GOLD = "#C9A96E";
const MUTED = "#6B7A99";

interface Props {
  data: ChartFortuneSummaryData;
  year: number;
  locale?: "zh" | "en";
}

export default function MingshuLiunianChart({ data, year, locale = "zh" }: Props) {
  const zh = locale === "zh";

  return (
    <div className="rounded-xl border border-destiny-purple/10 bg-white px-3 py-4">
      <p className="text-xs text-destiny-purple/55 mb-2 text-center">
        {zh ? `${year} 流年 · 命盤五維對照` : `${year} · five dimensions`}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {data.dimensions.map((d) => (
          <span
            key={d.key}
            className={`text-[10px] px-2 py-0.5 rounded-full border tabular-nums ${letterGradeStyle(d.grade)}`}
          >
            {zh ? d.label : d.labelEn} {d.grade}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data.radarData} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke={MUTED} strokeOpacity={0.35} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: PURPLE, fontSize: 11, fontWeight: 500 }}
          />
          <Radar
            name={zh ? "指數" : "Score"}
            dataKey="score"
            stroke={GOLD}
            fill={GOLD}
            fillOpacity={0.32}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: `1px solid ${GOLD}`, fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-destiny-purple/40 text-center mt-1 px-2">
        {zh
          ? "五維由十二宮分數加權推算，供對照流年文字重點；8級最好、1級較弱。"
          : "Weighted palace scores for cross-checking the annual write-up."}
      </p>
    </div>
  );
}
