import { createHash } from "crypto";

export function ipFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export function hashVisitor(ip: string): string {
  const salt = process.env.USAGE_HASH_SALT?.trim() || "destinyhome";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 16);
}

export function getExcludedIps(): Set<string> {
  const raw = process.env.ADMIN_EXCLUDE_IPS?.trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function shouldExcludeIp(ip: string): boolean {
  return getExcludedIps().has(ip);
}
