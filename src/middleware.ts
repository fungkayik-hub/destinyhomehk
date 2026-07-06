import { NextRequest, NextResponse } from "next/server";

const API_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/booking": { limit: 8, windowMs: 60_000 },
  "/api/booking/checkout": { limit: 8, windowMs: 60_000 },
  "/api/palace-report/checkout": { limit: 5, windowMs: 60_000 },
  "/api/chart": { limit: 30, windowMs: 60_000 },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "POST" && pathname in API_LIMITS) {
    const { checkRateLimit, clientIp } = await import("@/lib/rate-limit");
    const config = API_LIMITS[pathname];
    const ip = clientIp(request);
    const result = checkRateLimit(`${pathname}:${ip}`, config.limit, config.windowMs);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "請求太頻繁，請稍後再試" },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000)),
            ),
          },
        },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/booking",
    "/api/booking/checkout",
    "/api/palace-report/checkout",
    "/api/chart",
  ],
};
