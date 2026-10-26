"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ZiWeiChart } from "@/lib/ziwei";
import {
  getPalaceReportCopy,
  reportViewTitle,
  type AnnualReportViewId,
} from "@/lib/palace-report-copy";
import type { AnnualReportAccess } from "@/lib/palace-report/types";
import { whatsappUrl } from "@/lib/site-config";

const STRIPE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim(),
);

const VIEW_PRIORITY: AnnualReportViewId[] = [
  "full",
  "standard",
  "legacyDetailed",
  "legacyBrief",
];

interface ReportView {
  id: AnnualReportViewId;
  text: string;
}

interface Props {
  chart: ZiWeiChart;
  initialAccess: AnnualReportAccess;
  initialReports: ReportView[];
  layout: string;
  locale?: "zh" | "en";
}

function defaultActiveView(reports: ReportView[]): AnnualReportViewId {
  for (const id of VIEW_PRIORITY) {
    if (reports.some((r) => r.id === id)) return id;
  }
  return "standard";
}

function emptyReportTexts(): Record<AnnualReportViewId, string | undefined> {
  return {
    standard: undefined,
    full: undefined,
    legacyBrief: undefined,
    legacyDetailed: undefined,
  };
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
  const [reports, setReports] = useState(() => {
    const next = emptyReportTexts();
    for (const r of initialReports) next[r.id] = r.text;
    return next;
  });
  const [loading, setLoading] = useState<"standard" | "full" | null>(null);
  const [generating, setGenerating] = useState(Boolean(reportSession));
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AnnualReportViewId>(
    defaultActiveView(initialReports),
  );

  const tierCards = useMemo(
    () =>
      [
        {
          tier: "standard" as const,
          title: copy.tierStandardTitle,
          price: copy.tierStandardPrice,
          bullets: copy.tierStandardBullets,
          unlock: copy.unlockStandard,
          unlockedLabel: copy.alreadyUnlockedStandard,
        },
        {
          tier: "full" as const,
          title: copy.tierFullTitle,
          price: copy.tierFullPrice,
          bullets: copy.tierFullBullets,
          unlock: copy.unlockFull,
          unlockedLabel: copy.alreadyUnlockedFull,
          highlighted: true,
        },
      ] as const,
    [copy],
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
              for (const r of data.annualReports as {
                tier: AnnualReportViewId;
                text: string;
              }[]) {
                next[r.tier] = r.text;
              }
              return next;
            });
            const bought = (
              data.annualReports as { tier: AnnualReportViewId; text: string }[]
            ).at(-1)?.tier;
            if (bought) setActiveView(bought);
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

  async function startCheckout(tier: "standard" | "full") {
    if (!STRIPE_ENABLED || access[tier]) return;
    setLoading(tier);
    setError(null);
    try {
      const res = await fetch("/api/palace-report/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: tier,
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

  const unlockedViews = VIEW_PRIORITY.filter((id) => reports[id]);
  const hasAnyReport = unlockedViews.length > 0;

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
    const text = reports[activeView];
    return (
      <section
        id="annual-report"
        className="scroll-mt-20 mt-8 rounded-xl border border-destiny-gold/40 bg-gradient-to-b from-destiny-gold/10 to-white overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-destiny-gold/20 bg-destiny-gold/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium bg-destiny-purple text-white px-2 py-0.5 rounded">
            {copy.shortBadge}
          </span>
          {unlockedViews.length > 1 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {unlockedViews.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveView(id)}
                  className={`text-xs px-2 py-1 rounded-full border ${
                    activeView === id
                      ? "bg-destiny-purple text-white border-destiny-purple"
                      : "border-destiny-purple/20 text-destiny-purple"
                  }`}
                >
                  {reportViewTitle(id, copy)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-4 py-4">
          <h3 className="font-display font-bold text-destiny-purple mb-2">
            {reportViewTitle(activeView, copy)}
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
          {tierCards.map((card) => (
            <TierCard
              key={card.tier}
              title={card.title}
              price={card.price}
              bullets={card.bullets}
              highlighted={"highlighted" in card && card.highlighted}
              unlocked={access[card.tier]}
              unlockedLabel={card.unlockedLabel}
              loading={loading === card.tier}
              disabled={Boolean(loading) || access[card.tier]}
              onBuy={() => startCheckout(card.tier)}
              buyLabel={card.unlock}
              stripeEnabled={STRIPE_ENABLED}
              whatsappFallback={copy.whatsappFallback}
            />
          ))}
        </div>
        <p className="text-xs text-destiny-purple/45 mt-3 text-center">
          {copy.sectionHint} · {copy.tierStandardTitle} {copy.tierStandardPrice} /{" "}
          {copy.tierFullTitle} {copy.tierFullPrice}
        </p>
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
          ? "border-destiny-gold bg-white shadow-sm ring-1 ring-destiny-gold/30"
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
