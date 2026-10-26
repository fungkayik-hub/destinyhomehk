"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ZiWeiChart } from "@/lib/ziwei";
import { getPalaceReportCopy } from "@/lib/palace-report-copy";
import type { PalaceReportTier } from "@/lib/palace-report/config";
import type { AnnualReportAccess } from "@/lib/palace-report/types";
import { whatsappUrl } from "@/lib/site-config";

const STRIPE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim(),
);

interface TierReport {
  tier: PalaceReportTier;
  text: string;
}

interface Props {
  chart: ZiWeiChart;
  initialAccess: AnnualReportAccess;
  initialReports: TierReport[];
  layout: string;
  locale?: "zh" | "en";
}

export default function AnnualMingshuSection({
  chart,
  initialAccess,
  initialReports,
  layout,
  locale = "zh",
}: Props) {
  const copy = getPalaceReportCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportSession = searchParams.get("report_session");
  const returnPath = locale === "en" ? "/en/chart" : "/chart";

  const [access, setAccess] = useState(initialAccess);
  const [reports, setReports] = useState<Record<PalaceReportTier, string | undefined>>(() => ({
    brief: initialReports.find((r) => r.tier === "brief")?.text,
    detailed: initialReports.find((r) => r.tier === "detailed")?.text,
  }));
  const [loading, setLoading] = useState<PalaceReportTier | null>(null);
  const [generating, setGenerating] = useState(Boolean(reportSession));
  const [error, setError] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<PalaceReportTier>(
    initialReports.some((r) => r.tier === "detailed")
      ? "detailed"
      : initialReports.some((r) => r.tier === "brief")
        ? "brief"
        : "detailed",
  );

  const pollSession = useCallback(
    async (sessionId: string) => {
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

          if (data.status === "ready" && Array.isArray(data.annualReports)) {
            setAccess(data.annualAccess ?? access);
            setReports((prev) => {
              const next = { ...prev };
              for (const r of data.annualReports as TierReport[]) {
                next[r.tier] = r.text;
              }
              return next;
            });
            const bought = (data.annualReports as TierReport[])[0]?.tier;
            if (bought) setActiveTier(bought);
            setGenerating(false);
            const params = new URLSearchParams(searchParams.toString());
            params.delete("report_session");
            router.replace(`${returnPath}?${params.toString()}#annual-report`, {
              scroll: false,
            });
            return;
          }

          if (
            data.status === "processing" ||
            data.status === "pending" ||
            data.status === "generating"
          ) {
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
    },
    [access, router, returnPath, searchParams],
  );

  useEffect(() => {
    if (reportSession) pollSession(reportSession);
  }, [reportSession, pollSession]);

  async function startCheckout(tier: PalaceReportTier) {
    if (!STRIPE_ENABLED || access[tier]) return;
    setLoading(tier);
    setError(null);
    try {
      const res = await fetch("/api/palace-report/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: tier === "brief" ? "brief" : "detailed",
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
      if (data.url) window.location.href = data.url;
    } catch {
      setError("無法前往付款，請稍後再試");
    } finally {
      setLoading(null);
    }
  }

  const unlockedTiers = (["brief", "detailed"] as PalaceReportTier[]).filter(
    (t) => access[t] && reports[t],
  );
  const hasAnyReport = unlockedTiers.length > 0;

  if (generating) {
    return (
      <section
        id="annual-report"
        className="scroll-mt-20 mt-8 rounded-xl border border-destiny-gold/30 bg-destiny-gold/5 px-4 py-6 text-center"
      >
        <p className="text-sm text-destiny-purple animate-pulse">{copy.generatingHint}</p>
        <p className="text-xs text-destiny-purple/50 mt-2">{copy.paymentProcessingHint}</p>
      </section>
    );
  }

  if (hasAnyReport) {
    const text = reports[activeTier];
    return (
      <section
        id="annual-report"
        className="scroll-mt-20 mt-8 rounded-xl border border-destiny-gold/40 bg-gradient-to-b from-destiny-gold/10 to-white overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-destiny-gold/20 bg-destiny-gold/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium bg-destiny-purple text-white px-2 py-0.5 rounded">
            {copy.shortBadge}
          </span>
          {unlockedTiers.length > 1 && (
            <div className="flex gap-1">
              {unlockedTiers.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTier(t)}
                  className={`text-xs px-2 py-1 rounded-full border ${
                    activeTier === t
                      ? "bg-destiny-purple text-white border-destiny-purple"
                      : "border-destiny-purple/20 text-destiny-purple"
                  }`}
                >
                  {t === "brief" ? copy.tierBriefTitle : copy.tierDetailedTitle}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-4 py-4">
          <h3 className="font-display font-bold text-destiny-purple mb-2">
            {activeTier === "brief" ? copy.tierBriefTitle : copy.tierDetailedTitle}
          </h3>
          <p className="text-destiny-purple/90 leading-relaxed text-base whitespace-pre-wrap">
            {text}
          </p>
          <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed">
            {copy.analysisDisclaimer}{" "}
            <strong className="text-destiny-purple/60">{copy.notMasterNote}</strong>。
            {copy.masterCtaNote}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="annual-report"
      className="scroll-mt-20 mt-8 rounded-xl border-2 border-dashed border-destiny-gold/50 bg-gradient-to-b from-destiny-gold/8 to-destiny-cream/50 overflow-hidden"
    >
      <div className="px-4 py-5">
        <p className="text-xs text-destiny-gold font-medium mb-1">{copy.badge}</p>
        <h2 className="font-display text-xl font-bold text-destiny-red mb-1">
          {copy.sectionTitle}
        </h2>
        <p className="text-sm text-destiny-purple/70 mb-4">{copy.sectionSubtitle}</p>

        {error && (
          <p className="text-sm text-destiny-red mb-3" role="alert">
            {error}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <TierCard
            title={copy.tierBriefTitle}
            price={copy.tierBriefPrice}
            bullets={copy.tierBriefBullets}
            unlocked={access.brief}
            unlockedLabel={copy.alreadyUnlockedBrief}
            loading={loading === "brief"}
            disabled={Boolean(loading) || access.brief}
            onBuy={() => startCheckout("brief")}
            buyLabel={copy.unlockBrief}
            stripeEnabled={STRIPE_ENABLED}
            whatsappFallback={copy.whatsappFallback}
          />
          <TierCard
            title={copy.tierDetailedTitle}
            price={copy.tierDetailedPrice}
            bullets={copy.tierDetailedBullets}
            highlighted
            unlocked={access.detailed}
            unlockedLabel={copy.alreadyUnlockedDetailed}
            loading={loading === "detailed"}
            disabled={Boolean(loading) || access.detailed}
            onBuy={() => startCheckout("detailed")}
            buyLabel={copy.unlockDetailed}
            stripeEnabled={STRIPE_ENABLED}
            whatsappFallback={copy.whatsappFallback}
          />
        </div>
      </div>
    </section>
  );
}

function TierCard({
  title,
  price,
  bullets,
  buyLabel,
  unlocked,
  unlockedLabel,
  loading,
  disabled,
  onBuy,
  stripeEnabled,
  whatsappFallback,
  highlighted,
}: {
  title: string;
  price: string;
  bullets: readonly string[];
  buyLabel: string;
  unlocked: boolean;
  unlockedLabel: string;
  loading: boolean;
  disabled: boolean;
  onBuy: () => void;
  stripeEnabled: boolean;
  whatsappFallback: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col h-full ${
        highlighted
          ? "border-destiny-gold bg-white shadow-sm"
          : "border-destiny-purple/12 bg-white/80"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <h3 className="font-display font-bold text-destiny-purple">{title}</h3>
        <span className="text-lg font-bold text-destiny-red tabular-nums">{price}</span>
      </div>
      <ul className="text-sm text-destiny-purple/80 space-y-1.5 mb-4 flex-1 list-none">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-destiny-gold shrink-0">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {unlocked ? (
        <p className="text-xs text-center text-destiny-purple/60 py-2">{unlockedLabel}</p>
      ) : stripeEnabled ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onBuy}
          className={`w-full text-sm py-3 rounded-xl disabled:opacity-60 ${
            highlighted ? "btn-primary" : "btn-secondary"
          }`}
        >
          {loading ? "處理中…" : buyLabel}
        </button>
      ) : (
        <a
          href={whatsappUrl("你好，想了解網上小師傅流年命書。")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full inline-flex justify-center text-sm"
        >
          {whatsappFallback}
        </a>
      )}
    </div>
  );
}
