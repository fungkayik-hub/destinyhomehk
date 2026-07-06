import { NextRequest, NextResponse } from "next/server";
import { createDrawResult } from "@/lib/fortune-stick/draw";
import { upsertDrawFromQuestion } from "@/lib/fortune-stick/store";
import { clientIp, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(`fortune-stick-draw:${clientIp(request)}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "請求太頻繁，請稍後再試" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "無效的請求" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const question = typeof input.question === "string" ? input.question.trim() : "";
  const drawId = typeof input.drawId === "string" ? input.drawId.trim() : undefined;

  if (question.length < 4) {
    return NextResponse.json({ error: "請輸入至少 4 個字嘅問題" }, { status: 400 });
  }
  if (question.length > 200) {
    return NextResponse.json({ error: "問題請不超過 200 字" }, { status: 400 });
  }

  try {
    const result = createDrawResult(question, drawId);
    await upsertDrawFromQuestion(result.drawId, question);

    return NextResponse.json({
      drawId: result.drawId,
      lot: {
        number: result.lot.number,
        grade: result.lot.grade,
        poem: result.lot.poem,
      },
      teaser: result.teaser,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "draw_mismatch") {
      return NextResponse.json({ error: "籤資料不一致，請重新求籤" }, { status: 400 });
    }
    console.error("Fortune stick draw failed:", err);
    return NextResponse.json({ error: "求籤失敗，請稍後再試" }, { status: 500 });
  }
}
