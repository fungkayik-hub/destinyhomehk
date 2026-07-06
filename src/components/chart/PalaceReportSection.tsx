"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ZiWeiChart } from "@/lib/ziwei";
import { PALACES, type PalaceName } from "@/lib/ziwei/types";
import { getPalaceReportCopy } from "@/lib/palace-report-copy";
import { getPalaceReportTheme } from "@/lib/palace-report-theme-copy";
import { PALACE_REPORT_PRODUCTS } from "@/lib/palace-report/config";
import { formatPriceHkd } from "@/lib/stripe/plans";
import { findDecadalAtAge, nominalAge } from "@/lib/ziwei/chart-decadal";
import { whatsappUrl } from "@/lib/site-config";

const STRIPE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim(),
);

interface ReportEntry {
  palace: PalaceName;
  text: string;
}

interface Props {
  chart: ZiWeiChart;
  focusPalace: PalaceName;
  unlockedPalaces: PalaceName[];
  initialReports: ReportEntry[];
  layout: string;
  locale?: "zh" | "en";
}

export default function PalaceReportSection({
  chart,
  focusPalace,
  unlockedPalaces: initialUnlocked,
  initialReports,
  layout,
  locale = "zh",
}: Props) {
  const copy = getPalaceReportCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportSession = searchParams.get("report_session");

  const [unlockedPalaces, setUnlockedPalaces] = useState(initialUnlocked);
  const [reportsByPalace, setReportsByPalace] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialReports.map((r) => [r.palace, r.text])),
  );
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(Boolean(reportSession));
  const [error, setError] = useState<string | null>(null);
  const [bundleOpen, setBundleOpen] = useState(false);
  const [bundleSelection, setBundleSelection] = useState<PalaceName[]>([]);

  const isUnlocked = unlockedPalaces.includes(focusPalace);
  const reportText = reportsByPalace[focusPalace];
  const returnPath = locale === "en" ? "/en/chart" : "/chart";

  const selectablePalaces = useMemo(
    () => PALACES.filter((p) => !unlockedPalaces.includes(p)),
    [unlockedPalaces],
  );

  const theme = useMemo(
    () => getPalaceReportTheme(focusPalace, locale),
    [focusPalace, locale],
  );

  const focusDecadal = useMemo(
    () => chart.decadalTimeline?.find((d) => d.palace === focusPalace),
    [chart.decadalTimeline, focusPalace],
  );

  const nominalAgeNow = useMemo(
    () => nominalAge(chart.input.year),
    [chart.input.year],
  );

  const currentDecadal = useMemo(
    () =>
      chart.decadalTimeline?.length
        ? findDecadalAtAge(chart.decadalTimeline, nominalAgeNow)
        : undefined,
    [chart.decadalTimeline, nominalAgeNow],
  );

  const suggestedBundleAvailable = useMemo(
    () => theme.suggestedBundle.filter((p) => !unlockedPalaces.includes(p)),
    [theme.suggestedBundle, unlockedPalaces],
  );

  const canQuickThemedBundle =
    suggestedBundleAvailable.length >= 3 &&
    suggestedBundleAvailable.slice(0, 3).every((p) => selectablePalaces.includes(p));

  const pollSession = useCallback(async (sessionId: string) => {
    setGenerating(true);
    setError(null);
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      try {
        const res = await fetch(
          `/api/palace-report/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = await res.json();

        if (data.status === "ready" && Array.isArray(data.reports)) {
          setUnlockedPalaces(data.unlockedPalaces ?? []);
          setReportsByPalace((prev) => {
            const next = { ...prev };
            for (const r of data.reports as ReportEntry[]) {
              next[r.palace] = r.text;
            }
            return next;
          });
          setGenerating(false);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("report_session");
          router.replace(`${returnPath}?${params.toString()}#analysis`, { scroll: false });
          return;
        }

        if (
          data.status === "processing" ||
          data.status === "pending" ||
          data.status === "generating"
        ) {
          if (data.status === "generating" && Array.isArray(data.reports)) {
            setUnlockedPalaces(data.unlockedPalaces ?? []);
            setReportsByPalace((prev) => {
              const next = { ...prev };
              for (const r of data.reports as ReportEntry[]) {
                next[r.palace] = r.text;
              }
              return next;
            });
          }
          await new Promise((r) => setTimeout(r, 2000));
          attempts += 1;
          continue;
        }

        setError(data.error ?? "無法載入命書");
        setGenerating(false);
        return;
      } catch {
        setError("無法載入命書，請稍後再試");
        setGenerating(false);
        return;
      }
    }

    setError("整理命書時間較長，請刷新頁面再試");
    setGenerating(false);
  }, [router, returnPath, searchParams]);

  useEffect(() => {
    if (reportSession) {
      pollSession(reportSession);
    }
  }, [reportSession, pollSession]);

  async function startCheckout(
    productKey: "single" | "bundle3" | "full",
    palaces: PalaceName[],
  ) {
    if (!STRIPE_ENABLED) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/palace-report/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey,
          palaces,
          ...chart.input,
          returnPath,
          layout,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "無法前往付款");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("無法前往付款，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  function toggleBundlePalace(palace: PalaceName) {
    setBundleSelection((prev) => {
      if (prev.includes(palace)) return prev.filter((p) => p !== palace);
      if (prev.length >= 3) return prev;
      return [...prev, palace];
    });
  }

  if (generating) {
    return (
      <div className="mt-5 rounded-xl border border-destiny-gold/30 bg-destiny-gold/5 px-4 py-6 text-center">
        <p className="text-sm text-destiny-purple animate-pulse">{copy.generatingHint}</p>
        <p className="text-xs text-destiny-purple/50 mt-2">{copy.paymentProcessingHint}</p>
      </div>
    );
  }

  if (isUnlocked && reportText) {
    return (
      <div className="mt-5 rounded-xl border border-destiny-gold/40 bg-gradient-to-b from-destiny-gold/10 to-white overflow-hidden">
        <div className="px-4 py-3 border-b border-destiny-gold/20 bg-destiny-gold/10">
          <span className="text-xs font-medium bg-destiny-purple text-white px-2 py-0.5 rounded">
            {copy.shortBadge}
          </span>
          <p className="text-xs text-destiny-purple/55 mt-2">{copy.sectionHint}</p>
        </div>
        <div className="px-4 py-4">
          <p className="text-destiny-purple/90 leading-relaxed text-base whitespace-pre-wrap">
            {reportText}
          </p>
          <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed">
            {copy.analysisDisclaimer}{" "}
            <strong className="text-destiny-purple/60">{copy.notMasterNote}</strong>。
            {copy.masterCtaNote}
          </p>
        </div>
      </div>
    );
  }

  if (isUnlocked && !reportText) {
    return (
      <div className="mt-5 rounded-xl border border-destiny-gold/30 px-4 py-4 text-sm text-destiny-purple/70">
        此宮已解鎖，命書整理中…請刷新頁面。
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border-2 border-dashed border-destiny-gold/50 bg-gradient-to-b from-destiny-gold/8 to-destiny-cream/50 overflow-hidden">
      <div className="px-4 py-4">
        <p className="text-base font-display font-bold text-destiny-red mb-2">
          {theme.unlockTitle}
        </p>

        {focusDecadal && (
          <p className="text-xs text-destiny-purple/70 bg-white/70 rounded-lg px-3 py-2 mb-3 border border-destiny-purple/8 leading-relaxed">
            {locale === "en" ? (
              <>
                When nominal ages {focusDecadal.ageStart}–{focusDecadal.ageEnd}, decade luck
                walks <strong>{focusPalace}</strong> ({focusDecadal.heavenlyStem}
                {focusDecadal.earthlyBranch})
                {currentDecadal?.palace === focusPalace ? " — you are in this decade now." : "."}
              </>
            ) : (
              <>
                <strong>{focusDecadal.ageStart}–{focusDecadal.ageEnd} 虛歲</strong>
                大限走【{focusPalace}】{focusDecadal.heavenlyStem}
                {focusDecadal.earthlyBranch}
                {currentDecadal?.palace === focusPalace
                  ? " — ▶ 你而家行緊呢段"
                  : nominalAgeNow < focusDecadal.ageStart
                    ? " — 未來大限"
                    : nominalAgeNow > focusDecadal.ageEnd
                      ? " — 已過去大限"
                      : ""}
                。解鎖命書會詳解呢段同本命主星點樣連動。
              </>
            )}
          </p>
        )}

        <ul className="text-sm text-destiny-purple/80 space-y-1.5 mb-4 list-none">
          {theme.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="text-destiny-gold shrink-0">✓</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="relative rounded-lg bg-white/70 px-3 py-4 mb-4 select-none border border-destiny-purple/8">
          <p className="text-sm text-destiny-purple/25 blur-[2px] leading-relaxed">
            {copy.lockedPreview} · 800–1200 字 · 三方四正 · 十年大限 · 生活場景 · 實操建議…
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl opacity-35">🔒</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destiny-red mb-3" role="alert">
            {error}
          </p>
        )}

        {STRIPE_ENABLED ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => startCheckout("single", [focusPalace])}
              className="btn-primary w-full text-sm disabled:opacity-60"
            >
              {loading ? "處理中…" : copy.unlockSingle}
            </button>
            {canQuickThemedBundle && (
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  startCheckout("bundle3", suggestedBundleAvailable.slice(0, 3) as PalaceName[])
                }
                className="btn-secondary w-full text-sm disabled:opacity-60"
              >
                {loading
                  ? "處理中…"
                  : `${theme.bundleLabel} · ${formatPriceHkd(PALACE_REPORT_PRODUCTS.bundle3.priceCents)}`}
              </button>
            )}
            <button
              type="button"
              disabled={loading || selectablePalaces.length < 3}
              onClick={() => {
                const preset = suggestedBundleAvailable.slice(0, 3);
                setBundleSelection(
                  preset.length === 3 ? (preset as PalaceName[]) : [],
                );
                setBundleOpen(true);
              }}
              className="w-full text-sm py-3 rounded-xl border border-destiny-purple/15 text-destiny-purple hover:border-destiny-gold transition-colors disabled:opacity-60"
            >
              {copy.unlockBundle3}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => startCheckout("full", [...PALACES])}
              className="w-full text-sm py-3 rounded-xl border border-destiny-purple/15 text-destiny-purple hover:border-destiny-gold transition-colors disabled:opacity-60"
            >
              {copy.unlockFull}
            </button>
          </div>
        ) : (
          <a
            href={whatsappUrl("你好，想了解小師傅 AI 命書網上購買。")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full inline-flex justify-center text-sm"
          >
            {copy.whatsappFallback}
          </a>
        )}
      </div>

      {bundleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-5 shadow-xl">
            <h4 className="font-display font-bold text-destiny-purple mb-1">
              {copy.bundleModalTitle}
            </h4>
            <p className="text-xs text-destiny-purple/55 mb-4">{copy.bundleModalHint}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {selectablePalaces.map((palace) => {
                const selected = bundleSelection.includes(palace);
                return (
                  <button
                    key={palace}
                    type="button"
                    onClick={() => toggleBundlePalace(palace)}
                    className={`py-2 px-1 rounded-lg text-xs font-medium border transition-colors ${
                      selected
                        ? "bg-destiny-purple text-white border-destiny-purple"
                        : "border-destiny-purple/15 text-destiny-purple hover:border-destiny-gold"
                    }`}
                  >
                    {palace.replace("宮", "")}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBundleOpen(false)}
                className="btn-secondary flex-1 text-sm"
              >
                取消
              </button>
              <button
                type="button"
                disabled={bundleSelection.length !== 3 || loading}
                onClick={() => {
                  setBundleOpen(false);
                  startCheckout("bundle3", bundleSelection);
                }}
                className="btn-primary flex-1 text-sm disabled:opacity-60"
              >
                {copy.bundleModalConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
