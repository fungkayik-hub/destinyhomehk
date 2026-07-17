"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { PalaceName } from "@/lib/ziwei/types";
import {
  type ChartFortuneSummaryData,
  letterGradeStyle,
  sliceDecadalTrendForChart,
} from "@/lib/chart-fortune-summary";
import { formatDisplayDecadalRange } from "@/lib/ziwei/chart-decadal";

const PURPLE = "#0F1A33";
const GOLD = "#C9A96E";
const GOLD_LIGHT = "#E8C55A";
const MUTED = "#6B7A99";

interface Props {
  data: ChartFortuneSummaryData;
  focusPalace: PalaceName;
  locale?: "zh" | "en";
}

function dimensionForPalace(palace: PalaceName): string | null {
  const map: Partial<Record<PalaceName, string>> = {
    命宮: "career",
    官祿宮: "career",
    財帛宮: "wealth",
    夫妻宮: "love",
    福德宮: "wellness",
    奴僕宮: "social",
    兄弟宮: "social",
    疾厄宮: "wellness",
  };
  return map[palace] ?? null;
}

export default function ChartFortuneSummary({ data, focusPalace, locale = "zh" }: Props) {
  const isEn = locale === "en";
  const highlightKey = dimensionForPalace(focusPalace);
  const lineData = sliceDecadalTrendForChart(data.decadalTrend, data.currentDecadal);
  const currentAge = data.nominalAge;
  const offset = data.decadalDisplayOffset;
  const currentDisplayRange = data.currentDecadal
    ? formatDisplayDecadalRange(data.currentDecadal, offset)
    : null;
  const currentLinePoint = lineData.find((p) => p.isCurrent);

  const decadalExplain = isEn
    ? "Each decade (大限) shifts which palace leads your life theme — chart ages start from 0 nominal years."
    : "大限掌管每十年能量走向；圖表由 0 虛歲起計（對應本命五行局起運）。";

  return (
    <div className="rounded-2xl border border-destiny-purple/10 bg-white shadow-sm overflow-hidden">
      {/* 而家大限 */}
      {data.currentDecadal && (
        <div className="px-4 py-3 bg-gradient-to-r from-destiny-purple/5 to-destiny-gold/10 border-b border-destiny-purple/8">
          <p className="text-xs text-destiny-purple/50 mb-1">
            {isEn ? "Current decade luck (大限)" : "而家行緊大限"}
          </p>
          <p className="text-sm font-medium text-destiny-purple">
            <span className="text-destiny-gold font-bold tabular-nums">
              {currentDisplayRange}
            </span>
            {isEn ? " nominal yrs (from 0) · " : " 虛歲 · 大限走 "}
            <strong>【{data.currentDecadal.palace}】</strong>
            {data.currentDecadal.heavenlyStem}
            {data.currentDecadal.earthlyBranch}
            {isEn ? "" : " · "}
            {!isEn && (
              <span className="text-destiny-purple/70">
                你而家約 {currentAge} 虛歲
                {offset > 0 ? `（起運 ${offset} 虛歲）` : ""}
              </span>
            )}
          </p>
          <p className="text-xs text-destiny-purple/45 mt-1 leading-relaxed">{decadalExplain}</p>
        </div>
      )}

      {/* 五維評級 pill */}
      <div className="px-4 py-4 border-b border-destiny-purple/8">
        <p className="text-xs text-destiny-purple/50 mb-3">
          {isEn ? "Five-dimension overview (8 = best)" : "命盤五維評估（八級運 · 8級最好）"}
        </p>
        <div className="flex flex-wrap gap-2">
          {data.dimensions.map((d) => {
            const active = d.key === highlightKey;
            return (
              <div
                key={d.key}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all ${
                  active
                    ? "border-destiny-gold bg-destiny-gold/15 ring-1 ring-destiny-gold/30"
                    : "border-destiny-purple/10 bg-destiny-cream/50"
                }`}
              >
                <span className={`font-medium ${active ? "text-destiny-purple" : "text-destiny-purple/75"}`}>
                  {isEn ? d.labelEn : d.label}
                </span>
                <span
                  className={`font-bold tabular-nums text-xs px-1.5 py-0.5 rounded border ${letterGradeStyle(d.grade)}`}
                >
                  {d.grade}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 圖表區 */}
      <div className="grid md:grid-cols-2 gap-0 md:gap-px md:bg-destiny-purple/8">
        <div className="px-2 py-4 md:px-4 bg-white">
          <p className="text-xs text-destiny-purple/50 text-center mb-2">
            {isEn ? "Life balance radar" : "五維雷達"}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={data.radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke={MUTED} strokeOpacity={0.35} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: PURPLE, fontSize: 11, fontWeight: 500 }}
              />
              <Radar
                name={isEn ? "Score" : "指數"}
                dataKey="score"
                stroke={GOLD}
                fill={GOLD}
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${GOLD}`,
                  fontSize: 12,
                }}
                formatter={(value, _name, item) => {
                  const p = item.payload as { grade?: string };
                  return [p.grade ?? value, isEn ? "Grade" : "級數"];
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="px-2 py-4 md:px-4 bg-white border-t md:border-t-0 border-destiny-purple/8">
          <p className="text-xs text-destiny-purple/50 text-center mb-2">
            {isEn ? "Decade trend from age 0 (8 periods · grade 1–8)" : "十年大限走勢（由 0 虛歲起 · 八段 · 縱軸八級）"}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={MUTED} strokeOpacity={0.25} />
              <XAxis
                dataKey="label"
                tick={{ fill: MUTED, fontSize: 10, fontFamily: "sans-serif" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={56}
                padding={{ left: 8, right: 8 }}
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
                  return [
                    `${p.gradeLevel}級 · ${p.palace}`,
                    isEn ? "Decade luck" : "大限宮",
                  ];
                }}
                labelFormatter={(label) =>
                  isEn ? `Ages ${label}` : `${label} 虛歲`
                }
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
          <p className="text-[10px] text-destiny-purple/40 text-center mt-1 px-2">
            {isEn
              ? "From age 0 · Gold = current decade · Y: 8 = best, 1 = weak"
              : "由 0 虛歲起計 · 金點 = 而家大限 · 縱軸 8級最好、1級較弱"}
          </p>
        </div>
      </div>
    </div>
  );
}
