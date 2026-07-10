"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ChartPlateType, ZiWeiChart } from "@/lib/ziwei/types";
import {
  buildDingPanQuestions,
  scoreDingPanAnswers,
  type DingPanQuestion,
} from "@/lib/ziwei/ding-pan";
import { getPlateMeta } from "@/lib/ziwei/zhongzhou-plates";
import { buildChartHref } from "@/lib/chart-layout";

const STORAGE_PREFIX = "destinyhomehk_dingpan_";

interface Props {
  birthKey: string;
  threePlates: Record<ChartPlateType, ZiWeiChart>;
  suggestedPlate: ChartPlateType;
  activePlate: ChartPlateType;
  searchParams: Record<string, string | string[] | undefined>;
  locale?: "zh" | "en";
}

interface SavedResult {
  winner: ChartPlateType;
  scores: Record<ChartPlateType, number>;
  savedAt: string;
}

function loadSaved(birthKey: string): SavedResult | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${birthKey}`);
    if (!raw) return null;
    return JSON.parse(raw) as SavedResult;
  } catch {
    return null;
  }
}

function saveResult(birthKey: string, result: SavedResult) {
  localStorage.setItem(`${STORAGE_PREFIX}${birthKey}`, JSON.stringify(result));
}

export default function ChartDingPanQuiz({
  birthKey,
  threePlates,
  suggestedPlate,
  activePlate,
  searchParams,
  locale = "zh",
}: Props) {
  const zh = locale === "zh";
  const questions = useMemo(() => buildDingPanQuestions(threePlates), [threePlates]);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ChartPlateType[]>([]);
  const [finished, setFinished] = useState<SavedResult | null>(null);

  useEffect(() => {
    const saved = loadSaved(birthKey);
    if (saved) {
      setFinished(saved);
      setStep(questions.length);
    }
  }, [birthKey, questions.length]);

  const current: DingPanQuestion | undefined = questions[step];

  function pick(plate: ChartPlateType) {
    const next = [...answers, plate];
    setAnswers(next);
    if (step + 1 >= questions.length) {
      const { winner, scores } = scoreDingPanAnswers(next, suggestedPlate);
      const result: SavedResult = { winner, scores, savedAt: new Date().toISOString() };
      saveResult(birthKey, result);
      setFinished(result);
      setStep(questions.length);
    } else {
      setStep(step + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setFinished(null);
    localStorage.removeItem(`${STORAGE_PREFIX}${birthKey}`);
  }

  const resultPlate = finished?.winner;
  const resultMeta = resultPlate ? getPlateMeta(resultPlate) : null;

  return (
    <div className="rounded-xl border border-destiny-gold/25 bg-destiny-gold/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 text-sm font-medium text-destiny-purple hover:text-destiny-gold flex items-center gap-2"
      >
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
        {zh ? "定盤問卷（4 題快速自測）" : "Chart verification quiz (4 questions)"}
        {finished && (
          <span className="ml-auto text-xs text-destiny-gold font-normal">
            {zh ? `上次結果：${getPlateMeta(finished.winner).name}` : `Last: ${getPlateMeta(finished.winner).nameEn}`}
          </span>
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-destiny-gold/15">
          {!finished || step < questions.length ? (
            <>
              <p className="text-xs text-destiny-purple/55 mt-3 mb-4 leading-relaxed">
                {zh
                  ? "中洲派定盤：揀最似你性格同經歷嘅描述。問卷結果僅供參考，唔肯定請預約師傅當面定盤。"
                  : "Pick descriptions that match your personality and life experience. For guidance only — book a master session to confirm."}
              </p>
              {current && (
                <div>
                  <p className="text-sm font-semibold text-destiny-purple mb-3">
                    {zh ? current.prompt : current.promptEn}
                    <span className="ml-2 text-xs font-normal text-destiny-purple/40">
                      {step + 1}/{questions.length}
                    </span>
                  </p>
                  <ul className="space-y-2">
                    {current.options.map((opt) => (
                      <li key={`${current.id}-${opt.plate}`}>
                        <button
                          type="button"
                          onClick={() => pick(opt.plate)}
                          className="w-full text-left text-sm px-3 py-2.5 rounded-lg border border-destiny-purple/12 bg-white hover:border-destiny-gold hover:bg-destiny-gold/5 transition-colors text-destiny-purple leading-relaxed"
                        >
                          {zh ? opt.text : opt.textEn}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-destiny-purple leading-relaxed">
                {zh ? "問卷建議你嘅正盤係 " : "Quiz suggests your chart is "}
                <strong className="text-destiny-gold">
                  {zh ? resultMeta?.name : resultMeta?.nameEn}
                </strong>
                {finished && (
                  <span className="text-destiny-purple/55 text-xs block mt-1">
                    {zh ? "得分" : "Scores"}：天盤 {finished.scores.heaven} · 地盤{" "}
                    {finished.scores.earth} · 人盤 {finished.scores.human}
                  </span>
                )}
              </p>
              {resultPlate && resultPlate !== activePlate && (
                <Link
                  href={buildChartHref(searchParams, { plate: resultPlate, hash: "palaces" }, locale)}
                  className="inline-flex text-sm font-semibold px-4 py-2 rounded-lg bg-destiny-purple text-white hover:bg-destiny-purple-light transition-colors"
                >
                  {zh
                    ? `切換到${resultMeta?.name}睇完整分析`
                    : `Switch to ${resultMeta?.nameEn} plate`}
                </Link>
              )}
              {resultPlate === activePlate && (
                <p className="text-xs text-destiny-gold">
                  {zh ? "你而家睇緊嘅就係問卷建議嘅盤 ✓" : "You are already viewing the suggested plate ✓"}
                </p>
              )}
              <button
                type="button"
                onClick={reset}
                className="block text-xs text-destiny-purple/45 hover:text-destiny-gold underline"
              >
                {zh ? "重新作答" : "Retake quiz"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
