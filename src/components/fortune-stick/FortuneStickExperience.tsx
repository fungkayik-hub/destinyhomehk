"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MasterReadingCta from "@/components/MasterReadingCta";
import FortuneStickGradeGuide from "@/components/fortune-stick/FortuneStickGradeGuide";
import ShakeLotAnimation from "@/components/fortune-stick/ShakeLotAnimation";
import { detectQuestionTheme } from "@/lib/fortune-stick/question-theme";
import { fortuneStickCopy } from "@/lib/fortune-stick-copy";
import { fortuneStickWhatsAppUrl } from "@/lib/fortune-stick/whatsapp";
import { trackEvent } from "@/lib/ga";

const STRIPE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim(),
);

interface LotPreview {
  number: number;
  grade: string;
  poem: string;
}

interface DrawState {
  drawId: string;
  lot: LotPreview;
  teaser: string;
  interpretation?: string;
}

export default function FortuneStickExperience() {
  const copy = fortuneStickCopy;
  const router = useRouter();
  const searchParams = useSearchParams();
  const stickSession = searchParams.get("stick_session");
  const drawParam = searchParams.get("draw");

  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<"form" | "shaking" | "result">("form");
  const [draw, setDraw] = useState<DrawState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [generating, setGenerating] = useState(Boolean(stickSession));

  const loadDrawFromId = useCallback(async (drawId: string) => {
    const res = await fetch(
      `/api/fortune-stick/session?draw_id=${encodeURIComponent(drawId)}`,
    );
    const data = await res.json();
    if (!res.ok || !data.lot) return;

    setQuestion(data.question ?? "");
    setDraw({
      drawId: data.drawId,
      lot: data.lot,
      teaser: data.teaser ?? "",
      interpretation: data.interpretation,
    });
    setPhase("result");
  }, []);

  const pollSession = useCallback(
    async (sessionId: string, drawId: string) => {
      setGenerating(true);
      setError(null);
      let attempts = 0;

      while (attempts < 45) {
        try {
          const statusRes = await fetch(
            `/api/fortune-stick/session?session_id=${encodeURIComponent(sessionId)}`,
          );
          const statusData = await statusRes.json();

          if (statusData.status === "ready" && statusData.interpretation) {
            await loadDrawFromId(drawId);
            setPhase("result");
            setGenerating(false);
            const params = new URLSearchParams(searchParams.toString());
            params.delete("stick_session");
            router.replace(`/qiu-qian?${params.toString()}`, { scroll: false });
            return;
          }

          if (
            statusData.status === "generating" ||
            statusData.status === "processing"
          ) {
            const genRes = await fetch("/api/fortune-stick/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: sessionId }),
            });
            const genData = await genRes.json();
            if (genData.status === "ready" && genData.interpretation) {
              await loadDrawFromId(drawId);
              setPhase("result");
              setGenerating(false);
              const params = new URLSearchParams(searchParams.toString());
              params.delete("stick_session");
              router.replace(`/qiu-qian?${params.toString()}`, { scroll: false });
              return;
            }
          }

          if (statusData.status === "pending") {
            await new Promise((r) => setTimeout(r, 2000));
            attempts += 1;
            continue;
          }

          setError(statusData.error ?? "無法載入解籤");
          setGenerating(false);
          return;
        } catch {
          setError("無法載入解籤，請稍後再試");
          setGenerating(false);
          return;
        }
      }

      setError("解籤時間較長，請刷新頁面再試");
      setGenerating(false);
    },
    [router, searchParams, loadDrawFromId],
  );

  useEffect(() => {
    if (stickSession && drawParam) {
      void pollSession(stickSession, drawParam);
    } else if (drawParam && !draw) {
      void loadDrawFromId(drawParam);
    }
  }, [stickSession, drawParam, pollSession, loadDrawFromId, draw]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const q = question.trim();
    if (q.length < 4) {
      setError("請輸入至少 4 個字嘅問題");
      return;
    }

    setPhase("shaking");

    const drawId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    await new Promise((r) => setTimeout(r, 2400));

    try {
      const res = await fetch("/api/fortune-stick/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, drawId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "求籤失敗");
        setPhase("form");
        return;
      }

      setDraw({
        drawId: data.drawId,
        lot: data.lot,
        teaser: data.teaser,
      });
      trackEvent("tool_submit", { tool: "fortune-stick" });
      setPhase("result");
      router.replace(`/qiu-qian?draw=${encodeURIComponent(data.drawId)}`, {
        scroll: false,
      });
    } catch {
      setError("求籤失敗，請稍後再試");
      setPhase("form");
    }
  };

  const handleCheckout = async () => {
    if (!draw) return;
    if (!STRIPE_ENABLED) {
      setError(copy.payError);
      return;
    }

    setCheckoutLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fortune-stick/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawId: draw.drawId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? copy.payError);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(copy.payError);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setDraw(null);
    setPhase("form");
    setError(null);
    router.replace("/qiu-qian", { scroll: false });
  };

  const waUrl = draw
    ? fortuneStickWhatsAppUrl(
        question || "線上求籤問事",
        draw.lot.number,
      )
    : fortuneStickWhatsAppUrl("線上求籤問事", 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <p className="text-center text-xs text-destiny-gold">{copy.badge}</p>

      {phase === "form" && (
        <>
          <form onSubmit={handleSubmit} className="card space-y-4">
          <p className="text-sm text-destiny-purple/70">{copy.formHint}</p>
          <label className="block">
            <span className="text-sm font-medium text-destiny-purple mb-1.5 block">
              {copy.questionLabel}
            </span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={copy.questionPlaceholder}
              rows={3}
              maxLength={200}
              className="w-full rounded-xl border border-destiny-purple/20 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-destiny-gold/50 resize-none"
            />
          </label>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full">
            {copy.submit}
          </button>
        </form>
          <FortuneStickGradeGuide />
        </>
      )}

      {phase === "shaking" && (
        <div className="card text-center">
          <ShakeLotAnimation active />
          <p className="text-destiny-purple/70">{copy.shaking}</p>
        </div>
      )}

      {phase === "result" && draw && (
        <>
          {question.trim() && (
            <div className="card bg-destiny-cream/50 border-destiny-gold/20 py-4">
              <p className="text-xs text-destiny-gold mb-1">你的問題</p>
              <p className="text-sm text-destiny-purple leading-relaxed">
                {question.trim()}
              </p>
              <p className="text-xs text-destiny-purple/50 mt-2">
                主題：{detectQuestionTheme(question)}
              </p>
            </div>
          )}

          <div className="card text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destiny-gold/20 text-destiny-purple font-display text-2xl font-bold">
              {draw.lot.number}
            </div>
            <div>
              <p className="text-xs text-destiny-purple/50 mb-1">{copy.lotLabel}</p>
              <p className="font-display text-xl font-bold text-destiny-purple">
                第 {draw.lot.number} 籤 · {draw.lot.grade}
              </p>
            </div>
            <div className="text-left bg-destiny-cream/60 rounded-xl p-5 border border-destiny-gold/20">
              <p className="text-xs text-destiny-gold mb-2">{copy.poemLabel}</p>
              <p className="font-serif text-lg leading-loose text-destiny-purple whitespace-pre-line">
                {draw.lot.poem}
              </p>
            </div>
            {draw.teaser && (
              <p className="text-sm text-destiny-purple/75 leading-relaxed text-left">
                <span className="text-destiny-gold font-medium">{copy.teaserLabel}：</span>
                {draw.teaser}
              </p>
            )}
          </div>

          {generating && (
            <div className="card text-center py-8">
              <div className="inline-block w-8 h-8 border-2 border-destiny-gold border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-destiny-purple/70">{copy.generating}</p>
            </div>
          )}

          {!draw.interpretation && !generating && (
            <div className="card border-destiny-gold/30 bg-gradient-to-b from-destiny-gold/5 to-white text-center">
              <h3 className="font-display font-bold text-lg text-destiny-purple mb-2">
                {copy.unlockTitle}
              </h3>
              <p className="text-sm text-destiny-purple/65 mb-5">{copy.unlockDesc}</p>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="btn-primary w-full sm:w-auto min-w-[200px] disabled:opacity-60"
              >
                {checkoutLoading ? copy.unlockLoading : copy.unlockButton}
              </button>
            </div>
          )}

          {draw.interpretation && (
            <div className="card">
              <h3 className="font-display font-bold text-lg text-destiny-purple mb-4">
                {copy.interpretationTitle}
              </h3>
              <div className="prose-fortune text-destiny-purple/85 leading-relaxed whitespace-pre-line">
                {draw.interpretation}
              </div>
              <p className="text-xs text-destiny-purple/45 mt-5 leading-relaxed">
                {copy.disclaimer}
                <strong className="text-destiny-purple/60"> 非 Sunny 師傅親批。</strong>
                {copy.masterNote}
              </p>
            </div>
          )}

          <MasterReadingCta whatsappHref={waUrl} variant="fortune-stick" />

          <div className="text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-destiny-gold hover:underline"
            >
              再求一籤
            </button>
          </div>

          <FortuneStickGradeGuide />
        </>
      )}

      {error && phase === "result" && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
