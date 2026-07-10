import { createHash, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_USAGE_COOKIE = "usage_admin";

function adminToken(): string | null {
  const secret = process.env.ADMIN_USAGE_SECRET?.trim();
  if (!secret) return null;
  return createHash("sha256").update(`usage-admin:${secret}`).digest("hex");
}

export function isAdminUsageConfigured(): boolean {
  return Boolean(process.env.ADMIN_USAGE_SECRET?.trim());
}

export function verifyAdminSecret(candidate: string): boolean {
  const expected = adminToken();
  if (!expected) return false;
  const bufA = Buffer.from(expected);
  const bufB = Buffer.from(candidate.trim());
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isAdminRequest(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_USAGE_COOKIE)?.value;
  const expected = adminToken();
  if (!cookie || !expected) return false;
  const bufA = Buffer.from(expected);
  const bufB = Buffer.from(cookie);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function adminCookieValue(): string {
  const token = adminToken();
  if (!token) throw new Error("ADMIN_USAGE_SECRET not configured");
  return token;
}
