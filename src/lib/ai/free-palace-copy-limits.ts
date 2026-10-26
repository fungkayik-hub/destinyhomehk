/** 免費「小徒弟贈言」每宮字數 — 付費網上小師傅命書唔用呢套 */

export const FREE_PALACE_COPY_MIN = 80;
export const FREE_PALACE_COPY_MAX = 150;

/** 低於此字數視為太薄，改用 fallback */
export const FREE_PALACE_COPY_HARD_MIN = 55;

export const FREE_PALACE_LENGTH_HINT = `${FREE_PALACE_COPY_MIN}–${FREE_PALACE_COPY_MAX} 字`;

/**
 * 將過長贈言截到目標上限（優先喺句號／分號處收束）。
 */
export function clampFreePalaceCopy(text: string): string {
  const t = text.trim();
  if (t.length <= FREE_PALACE_COPY_MAX) return t;

  const slice = t.slice(0, FREE_PALACE_COPY_MAX + 1);
  const punct = ["。", "！", "？", "；", "—"];
  let cut = -1;
  for (const p of punct) {
    const i = slice.lastIndexOf(p);
    if (i > cut) cut = i;
  }
  if (cut >= FREE_PALACE_COPY_HARD_MIN) {
    return slice.slice(0, cut + 1);
  }
  return t.slice(0, FREE_PALACE_COPY_MAX);
}

export function finalizeFreePalaceCopy(text: string): string {
  return clampFreePalaceCopy(text.trim());
}
