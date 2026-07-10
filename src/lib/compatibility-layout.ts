import type { ChartPlateType } from "@/lib/ziwei/types";

function first(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

/** 保留雙方出生參數，改 plate 等 */
export function buildCompatibilityHref(
  sp: Record<string, string | string[] | undefined>,
  overrides: { plate?: ChartPlateType; hash?: string } = {},
): string {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(sp)) {
    if (key === "plate" || val == null) continue;
    if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
    else params.set(key, val);
  }
  if (overrides.plate) params.set("plate", overrides.plate);
  else if (first(sp, "plate")) params.set("plate", first(sp, "plate")!);
  const hash = overrides.hash ? `#${overrides.hash}` : "";
  return `/compatibility?${params.toString()}${hash}`;
}
