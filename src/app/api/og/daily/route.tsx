import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { computeDailyAlmanac } from "@/lib/daily-almanac/compute";
import { getHongKongTodayISO } from "@/lib/hong-kong-time";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? getHongKongTodayISO();
  const data = computeDailyAlmanac(date);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #141e36 0%, #1f2d4d 50%, #141e36 100%)",
          color: "white",
          padding: 48,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 28, color: "#c9a227" }}>Destiny Home</span>
          <span style={{ fontSize: 20, opacity: 0.7 }}>每日流日</span>
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#e8d5a3", marginTop: 24 }}>
          {data.solarLabel}（{data.weekday}）
        </div>
        <div style={{ fontSize: 22, opacity: 0.8, marginTop: 8 }}>
          {data.ganzhi.year}年 {data.ganzhi.month}月 {data.ganzhi.day}日 · {data.lunarLabel}
        </div>
        <div
          style={{
            fontSize: 24,
            marginTop: 32,
            padding: 24,
            background: "rgba(201,162,39,0.15)",
            borderRadius: 16,
            lineHeight: 1.4,
          }}
        >
          {data.headline}
        </div>
        <div style={{ fontSize: 20, marginTop: 24, lineHeight: 1.5, flex: 1 }}>
          💡 {data.masterTip.slice(0, 120)}
          {data.masterTip.length > 120 ? "…" : ""}
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 18, marginTop: 16 }}>
          <div style={{ flex: 1 }}>
            <span style={{ color: "#4ade80" }}>宜 </span>
            {data.yi.slice(0, 5).join("、")}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ color: "#f87171" }}>忌 </span>
            {data.ji.slice(0, 4).join("、")}
          </div>
        </div>
        <div style={{ fontSize: 16, opacity: 0.5, marginTop: 32 }}>
          destinyhomehk.com/daily · Sunny 師傅 · 中洲派
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
