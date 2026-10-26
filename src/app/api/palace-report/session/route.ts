import { NextRequest, NextResponse } from "next/server";
import {
  getCachedAnnualReport,
  type AnnualGenerationTier,
} from "@/lib/ai/analyze-annual-report";
import { getCachedPalaceReport } from "@/lib/ai/analyze-palace-report";
import { buildBirthKey } from "@/lib/chart-key";
import { birthInputFromSearchParams } from "@/lib/chart-parse-params";
import {
  findPalaceReportProduct,
  isAnnualProduct,
  isLegacyAnnualProductId,
  isLegacyAnnualSlot,
  LEGACY_ANNUAL_SLOTS,
  storageSlotForTier,
  tierFromStorageSlot,
} from "@/lib/palace-report/config";
import { loadAnnualReportViews } from "@/lib/palace-report/load-reports";
import type { PalaceReportPurchase } from "@/lib/palace-report/types";
import {
  createPurchaseFromSession,
  getPurchaseByStripeSessionId,
  getReportContent,
  getReportContentsForChart,
  getUnlockedPalaces,
  saveReportContent,
} from "@/lib/palace-report/store";
import { getStripe } from "@/lib/stripe/client";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import { PALACES, type BirthInput, type PalaceName } from "@/lib/ziwei/types";

export const runtime = "nodejs";
export const maxDuration = 120;

function parseBirthInput(body: Record<string, unknown>): BirthInput | null {
  const sp: Record<string, string> = {};
  for (const key of [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "gender",
    "calendarType",
    "isLeapMonth",
    "birthPlaceId",
    "useTrueSolarTime",
  ]) {
    const val = body[key];
    if (typeof val === "string" && val.trim()) sp[key] = val.trim();
    if (typeof val === "number") sp[key] = String(val);
  }
  const parsed = birthInputFromSearchParams(sp);
  if (!parsed.submitted || parsed.error) return null;
  return parsed.input;
}

function isPalaceName(value: string): value is PalaceName {
  return (PALACES as readonly string[]).includes(value);
}

async function buildAnnualReadyResponse(chartKey: string) {
  const { access, views } = await loadAnnualReportViews(chartKey);
  return NextResponse.json({
    status: "ready",
    chartKey,
    annualAccess: access,
    annualReports: views.map((v) => ({ tier: v.id, text: v.text })),
    unlockedPalaces: await getUnlockedPalaces(chartKey),
  });
}

function resolveAnnualGeneration(
  purchase: PalaceReportPurchase,
  product: ReturnType<typeof findPalaceReportProduct>,
): { storageSlot: string; generationTier: AnnualGenerationTier } | null {
  if (product && isAnnualProduct(product)) {
    return {
      storageSlot: storageSlotForTier(product.tier),
      generationTier: product.tier,
    };
  }

  const slot = purchase.palaces[0];
  if (!slot) return null;

  if (isLegacyAnnualProductId(purchase.productId) || isLegacyAnnualSlot(slot)) {
    if (slot === LEGACY_ANNUAL_SLOTS.brief) {
      return { storageSlot: slot, generationTier: "legacyBrief" };
    }
    if (slot === LEGACY_ANNUAL_SLOTS.detailed) {
      return { storageSlot: slot, generationTier: "standard" };
    }
  }

  const currentTier = tierFromStorageSlot(slot);
  if (currentTier) {
    return { storageSlot: slot, generationTier: currentTier };
  }

  return null;
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "缺少 session_id" }, { status: 400 });
  }

  let purchase = await getPurchaseByStripeSessionId(sessionId);

  if (!purchase) {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ status: "pending" });
    }
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return NextResponse.json({ status: "pending" });
      }
      if (session.metadata?.productType === "palace-report") {
        const created = await createPurchaseFromSession(session);
        if (created.ok) {
          purchase = created.purchase;
        } else {
          console.error("Palace report purchase sync failed:", created.error, sessionId);
          return NextResponse.json({
            status: "processing",
            message: "付款已收到，正在確認…",
          });
        }
      } else {
        return NextResponse.json({
          status: "processing",
          message: "付款已收到，正在確認…",
        });
      }
    } catch {
      return NextResponse.json({ error: "無法查詢付款狀態" }, { status: 404 });
    }
  }

  if (!purchase) {
    return NextResponse.json({ status: "pending" });
  }

  const chartKey = purchase.chartKey;
  const product = findPalaceReportProduct(purchase.productId);

  const annualGen = resolveAnnualGeneration(purchase, product);
  if (annualGen) {
    const existing = await getReportContent(chartKey, annualGen.storageSlot);
    if (existing) {
      return buildAnnualReadyResponse(chartKey);
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ status: "processing", message: "確認付款中…" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const returnQueryRaw = session.metadata?.returnQuery?.trim();
    if (!returnQueryRaw) {
      return NextResponse.json({ error: "missing_return_query" }, { status: 500 });
    }

    const sp = Object.fromEntries(new URLSearchParams(returnQueryRaw));
    const parsed = birthInputFromSearchParams(sp);
    if (!parsed.submitted || parsed.error) {
      return NextResponse.json({ error: "invalid_birth_data" }, { status: 500 });
    }

    const birthChartKey = buildBirthKey(parsed.input);
    if (birthChartKey !== chartKey) {
      return NextResponse.json({ error: "chart_mismatch" }, { status: 500 });
    }

    const chart = generateChart(parsed.input);
    const { text, provider } = await getCachedAnnualReport(
      chartKey,
      chart,
      annualGen.generationTier,
    );
    const saveTier =
      annualGen.generationTier === "legacyBrief"
        ? undefined
        : annualGen.generationTier;
    await saveReportContent({
      chartKey,
      palace: annualGen.storageSlot,
      text,
      provider,
      tier: saveTier,
    });

    return buildAnnualReadyResponse(chartKey);
  }

  // Legacy per-palace purchases
  const existingReports = await getReportContentsForChart(chartKey);
  const existingSet = new Set(existingReports.map((r) => r.palace));
  const pending = purchase.palaces.filter(
    (p) => isPalaceName(p) && !existingSet.has(p),
  ) as PalaceName[];

  if (pending.length === 0) {
    return NextResponse.json({
      status: "ready",
      chartKey,
      unlockedPalaces: await getUnlockedPalaces(chartKey),
      reports: existingReports
        .filter((r) => isPalaceName(r.palace))
        .map((r) => ({
          palace: r.palace as PalaceName,
          text: r.text,
        })),
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ status: "processing", message: "確認付款中…" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const returnQueryRaw = session.metadata?.returnQuery?.trim();
  if (!returnQueryRaw) {
    return NextResponse.json({ error: "missing_return_query" }, { status: 500 });
  }

  const sp = Object.fromEntries(new URLSearchParams(returnQueryRaw));
  const parsed = birthInputFromSearchParams(sp);
  if (!parsed.submitted || parsed.error) {
    return NextResponse.json({ error: "invalid_birth_data" }, { status: 500 });
  }

  const birthChartKey = buildBirthKey(parsed.input);
  if (birthChartKey !== chartKey) {
    return NextResponse.json({ error: "chart_mismatch" }, { status: 500 });
  }

  const chart = generateChart(parsed.input);
  const palace = pending[0];
  const { text, provider } = await getCachedPalaceReport(chartKey, chart, palace);
  await saveReportContent({ chartKey, palace, text, provider });

  const allReports = await getReportContentsForChart(chartKey);
  const stillPending = purchase.palaces.filter(
    (p) => isPalaceName(p) && !allReports.some((r) => r.palace === p),
  );

  if (stillPending.length > 0) {
    return NextResponse.json({
      status: "generating",
      message: "網上小師傅整理緊…",
      chartKey,
      unlockedPalaces: await getUnlockedPalaces(chartKey),
      reports: allReports
        .filter((r) => isPalaceName(r.palace))
        .map((r) => ({ palace: r.palace as PalaceName, text: r.text })),
      progress: {
        done: purchase.palaces.length - stillPending.length,
        total: purchase.palaces.length,
      },
    });
  }

  return NextResponse.json({
    status: "ready",
    chartKey,
    unlockedPalaces: await getUnlockedPalaces(chartKey),
    reports: allReports
      .filter((r) => isPalaceName(r.palace))
      .map((r) => ({ palace: r.palace as PalaceName, text: r.text })),
    newlyGenerated: [palace],
  });
}

/** 已解鎖內容（唔使 session） */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無效的請求" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const birthInput = parseBirthInput(input);
  if (!birthInput) {
    return NextResponse.json({ error: "出生資料無效" }, { status: 400 });
  }

  const chartKey = buildBirthKey(birthInput);
  const { access, views } = await loadAnnualReportViews(chartKey);
  const annualReports = views.map((v) => ({ tier: v.id, text: v.text }));

  const unlockedPalaces = await getUnlockedPalaces(chartKey);
  const reports: { palace: PalaceName; text: string }[] = [];
  const contents = await getReportContentsForChart(chartKey);
  for (const row of contents) {
    if (isPalaceName(row.palace)) {
      reports.push({ palace: row.palace as PalaceName, text: row.text });
    }
  }

  return NextResponse.json({
    chartKey,
    annualAccess: access,
    annualReports,
    unlockedPalaces,
    reports,
  });
}
