#!/usr/bin/env node
/**
 * Verify a GA4 measurement ID loads gtag.js (invalid IDs return HTTP 404).
 *
 * Usage: node scripts/validate-ga-id.mjs G-XXXXXXXXXX
 */
const id = process.argv[2]?.trim();
if (!id?.startsWith("G-")) {
  console.error("Usage: node scripts/validate-ga-id.mjs G-XXXXXXXXXX");
  process.exit(1);
}

const url = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
const res = await fetch(url, { redirect: "follow" });
const body = await res.text();
const valid = res.ok && body.length > 10_000 && !body.includes("Error 404");

console.log(`${id} → HTTP ${res.status}, ${body.length} bytes → ${valid ? "VALID" : "INVALID"}`);
process.exit(valid ? 0 : 1);
