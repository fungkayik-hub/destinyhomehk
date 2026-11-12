"use client";

import { useMemo } from "react";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import type { ParsedLiuyueMonth } from "@/lib/palace-report/parse-liuyue";
import {
  buildLiuyueRhythmMonths,
  type LiuyueRhythmTone,
} from "@/lib/palace-report/liuyue-rhythm";

const TONE_STYLE: Record<
  LiuyueRhythmTone,
  { bar: string; badge: string; height: string }
> = {
  順: {
    bar: "bg-destiny-gold/35 border-destiny-gold/50",
    badge: "bg-destiny-gold/20 text-destiny-gold border-destiny-gold/40",
    height: "h-[4.5rem]",
  },
  平: {
    bar: "bg-destiny-cream border-destiny-purple/12",
    badge: "bg-destiny-purple/8 text-destiny-purple border-destiny-purple/15",
    height: "h-[3rem]",
  },
  慎: {
    bar: "bg-destiny-red/12 border-destiny-red/25",
    badge: "bg-destiny-red/10 text-destiny-red border-destiny-red/20",
    height: "h-[2rem]",
  },
};

interface Props {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
  months: ParsedLiuyueMonth[];
  year: number;
  locale?: "zh" | "en";
}

function toneLabel(tone: LiuyueRhythmTone, zh: boolean): string {
  if (zh) return tone;
  const map: Record<LiuyueRhythmTone, string> = {
    順: "Smooth",
    平: "Steady",
    慎: "Caution",
  };
  return map[tone];
}

export default function MingshuLiuyueChart({
  chart,
  scoreByPalace,
  months,
  year,
  locale = "zh",
}: Props) {
  const zh = locale === "zh";
  const rhythm = useMemo(
    () => buildLiuyueRhythmMonths(chart, scoreByPalace, months, year),
    [chart, scoreByPalace, months, year],
  );

  const chartSourced = rhythm.filter((m) => m.source === "chart").length;
  const toneCounts = rhythm.reduce(
    (acc, m) => {
      acc[m.tone] += 1;
      return acc;
    },
    { 順: 0, 平: 0, 慎: 0 } as Record<LiuyueRhythmTone, number>,
  );

  return (
    <div className="rounded-xl border border-destiny-purple/10 bg-white px-3 py-4">
      <p className="text-xs text-destiny-purple/55 mb-2 text-center">
        {zh ? `${year} 年十二流月節奏` : `${year} monthly rhythm`}
      </p>
      <p className="text-[10px] text-destiny-purple/45 text-center mb-3 leading-relaxed px-2">
        {zh
          ? chartSourced >= 12
            ? "吉凶節奏依 iztro 流月命宮所落宮位，對照命盤宮位評分（7–8級順、5–6級平、1–4級慎）。"
            : chartSourced > 0
              ? `其中 ${chartSourced} 個月依流月宮位評分；其餘依命書宜忌關鍵字分類。`
              : "依命書主題／宜／忌關鍵字分類（無流月宮位分數時）。"
          : "Rhythm from iztro monthly palace scores when available; else report keywords."}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-4 text-[10px]">
        {(["順", "平", "慎"] as const).map((t) => (
          <span
            key={t}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${TONE_STYLE[t].badge}`}
          >
            <span className="font-bold">{toneLabel(t, zh)}</span>
            <span className="text-destiny-purple/50 tabular-nums">×{toneCounts[t]}</span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-1 items-end mb-4 min-h-[5rem]">
        {rhythm.map((m) => (
          <div key={m.monthLabel} className="flex flex-col items-center gap-1 min-w-0">
            <span
              className={`text-[9px] font-bold px-1 py-0.5 rounded border ${TONE_STYLE[m.tone].badge}`}
            >
              {toneLabel(m.tone, zh)}
            </span>
            <div
              className={`w-full rounded-t-md border ${TONE_STYLE[m.tone].bar} ${TONE_STYLE[m.tone].height} transition-all`}
              title={
                m.flowPalace
                  ? `${m.monthLabel} · 流月【${m.flowPalace}】${m.palaceGrade ?? ""}`
                  : m.monthLabel
              }
            />
            <span className="text-[9px] text-destiny-purple/55 truncate w-full text-center">
              {m.monthLabel.replace("月", "")}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {rhythm.map((m) => (
          <MonthRhythmCard key={m.monthLabel} m={m} zh={zh} />
        ))}
      </div>
    </div>
  );
}

function MonthRhythmCard({
  m,
  zh,
}: {
  m: ReturnType<typeof buildLiuyueRhythmMonths>[0];
  zh: boolean;
}) {
  return (
    <div
      className={`text-[10px] leading-snug rounded-lg border px-2 py-2 ${TONE_STYLE[m.tone].bar}`}
    >
      <div className="flex flex-wrap items-center gap-1.5 mb-1">
        <span className="font-bold text-destiny-purple">{m.monthLabel}</span>
        <span className={`font-bold px-1.5 py-0.5 rounded border text-[9px] ${TONE_STYLE[m.tone].badge}`}>
          {toneLabel(m.tone, zh)}
        </span>
        {m.flowPalace && (
          <span className="text-destiny-purple/60 text-[9px]">
            {zh ? "流月" : "Flow"}【{m.flowPalace}】{m.palaceGrade}
          </span>
        )}
      </div>
      {m.theme ? (
        <p className="text-destiny-purple/80">
          <span className="text-destiny-purple/45">{zh ? "主題" : "Theme"}：</span>
          {m.theme}
        </p>
      ) : null}
      {m.yi ? (
        <p className="text-destiny-purple/65 mt-0.5">
          <span className="text-destiny-green/80">{zh ? "宜" : "Do"}</span> {m.yi}
        </p>
      ) : null}
      {m.ji ? (
        <p className="text-destiny-purple/65">
          <span className="text-destiny-red/80">{zh ? "忌" : "Avoid"}</span> {m.ji}
        </p>
      ) : null}
    </div>
  );
}
