import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getHongKongTodayISO } from "@/lib/hong-kong-time";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

/** Vercel Cron：香港 00:01 觸發，刷新今日流日 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const today = getHongKongTodayISO();
  revalidateTag("daily-almanac");
  revalidateTag(`daily-${today}`);
  revalidatePath("/daily");

  try {
    await fetch(`${getSiteUrl()}/daily`, { cache: "no-store" });
  } catch {
    // 預熱失敗不影響 cron 成功
  }

  return NextResponse.json({
    ok: true,
    date: today,
    timezone: "Asia/Hong_Kong",
    updatedAt: new Date().toISOString(),
  });
}
