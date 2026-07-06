import { NextRequest, NextResponse } from "next/server";
import { analyzeFortuneStick } from "@/lib/ai/analyze-fortune-stick";
import { buildTeaser } from "@/lib/fortune-stick/draw";
import { getLotByNumber } from "@/lib/fortune-stick/lots";
import {
  createPurchaseFromSession,
  getDrawById,
  getDrawByStripeSessionId,
  markPaidAndSaveInterpretation,
} from "@/lib/fortune-stick/store";
import { getStripe } from "@/lib/stripe/client";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim();
  const drawIdParam = request.nextUrl.searchParams.get("draw_id")?.trim();

  if (!sessionId && !drawIdParam) {
    return NextResponse.json({ error: "缺少參數" }, { status: 400 });
  }

  if (drawIdParam && !sessionId) {
    const draw = await getDrawById(drawIdParam);
    if (!draw) {
      return NextResponse.json({ error: "找不到求籤記錄" }, { status: 404 });
    }
    const lot = getLotByNumber(draw.lotNumber);
    if (!lot) {
      return NextResponse.json({ error: "籤資料錯誤" }, { status: 500 });
    }
    const payload = {
      status: draw.interpretationText ? "ready" : "pending",
      drawId: draw.id,
      question: draw.question,
      lotNumber: draw.lotNumber,
      lot: { number: lot.number, grade: lot.grade, poem: lot.poem },
      teaser: buildTeaser(draw.question, lot),
      interpretation: draw.interpretationText,
      provider: draw.interpretationProvider,
    };
    return NextResponse.json(payload);
  }

  if (!sessionId) {
    return NextResponse.json({ error: "缺少 session_id" }, { status: 400 });
  }

  let draw = await getDrawByStripeSessionId(sessionId);

  if (!draw) {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ status: "pending" });
    }
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        return NextResponse.json({ status: "pending" });
      }
      if (session.metadata?.productType === "fortune-stick") {
        const created = await createPurchaseFromSession(session);
        if (created.ok && created.draw) {
          draw = created.draw;
        } else {
          console.error("Fortune stick purchase sync failed:", created.error, sessionId);
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

  if (!draw) {
    return NextResponse.json({ status: "pending" });
  }

  if (draw.interpretationText) {
    return NextResponse.json({
      status: "ready",
      drawId: draw.id,
      lotNumber: draw.lotNumber,
      interpretation: draw.interpretationText,
      provider: draw.interpretationProvider,
    });
  }

  return NextResponse.json({
    status: "generating",
    message: "小徒弟解籤中…",
    drawId: draw.id,
    lotNumber: draw.lotNumber,
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無效的請求" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const sessionId = typeof input.session_id === "string" ? input.session_id.trim() : "";
  if (!sessionId) {
    return NextResponse.json({ error: "缺少 session_id" }, { status: 400 });
  }

  let draw = await getDrawByStripeSessionId(sessionId);
  if (!draw) {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ status: "pending" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ status: "pending" });
    }
    const created = await createPurchaseFromSession(session);
    if (!created.ok || !created.draw) {
      return NextResponse.json({ status: "processing" });
    }
    draw = created.draw;
  }

  if (draw.interpretationText) {
    return NextResponse.json({
      status: "ready",
      drawId: draw.id,
      lotNumber: draw.lotNumber,
      interpretation: draw.interpretationText,
      provider: draw.interpretationProvider,
    });
  }

  const { text, provider } = await analyzeFortuneStick(draw.question, draw.lotNumber);
  const updated = await markPaidAndSaveInterpretation(draw.id, text, provider);

  return NextResponse.json({
    status: "ready",
    drawId: updated.id,
    lotNumber: updated.lotNumber,
    interpretation: updated.interpretationText,
    provider: updated.interpretationProvider,
  });
}
