import overridesData from "@/data/daily-overrides.json";

export interface DailyOverride {
  headline?: string;
  specialTip?: string;
  masterTip?: string;
  closing?: string;
  quote?: string;
}

type OverridesMap = Record<string, DailyOverride>;

const overrides = overridesData as OverridesMap;

/** 師傅自訂流日文案（content/daily 匯入後寫入 daily-overrides.json） */
export function getDailyOverride(date: string): DailyOverride | undefined {
  return overrides[date];
}

export function applyDailyOverride<T extends DailyOverride>(
  base: T,
  date: string,
): T {
  const patch = getDailyOverride(date);
  if (!patch) return base;
  return {
    ...base,
    ...(patch.headline ? { headline: patch.headline } : {}),
    ...(patch.specialTip ? { specialTip: patch.specialTip } : {}),
    ...(patch.masterTip ? { masterTip: patch.masterTip } : {}),
    ...(patch.closing ? { closing: patch.closing } : {}),
    ...(patch.quote ? { quote: patch.quote } : {}),
  };
}
