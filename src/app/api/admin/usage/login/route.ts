import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_USAGE_COOKIE,
  adminCookieValue,
  isAdminUsageConfigured,
  verifyAdminSecret,
} from "@/lib/usage/admin-auth";

export async function POST(request: NextRequest) {
  if (!isAdminUsageConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const secret =
    typeof (body as { secret?: unknown }).secret === "string"
      ? (body as { secret: string }).secret
      : "";

  if (!verifyAdminSecret(secret)) {
    return NextResponse.json({ error: "invalid_secret" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_USAGE_COOKIE, adminCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
