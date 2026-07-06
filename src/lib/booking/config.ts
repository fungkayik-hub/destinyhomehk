/** 網上預約設定 — 星期一至六 12:00–20:00，每日最多 4 個時段 */
export const BOOKING_CONFIG = {
  /** 0 = 星期日 */
  openWeekdays: [1, 2, 3, 4, 5, 6] as const,
  slotTimes: ["12:00", "14:00", "16:00", "18:00"] as const,
  maxPerDay: 4,
  timezone: "Asia/Hong_Kong",
} as const;

export type SlotTime = (typeof BOOKING_CONFIG.slotTimes)[number];

export function getNotifyEmail(): string {
  return process.env.BOOKING_NOTIFY_EMAIL?.trim() || "fungkayik@gmail.com";
}

export function getFromEmail(): string {
  return (
    process.env.BOOKING_FROM_EMAIL?.trim() ||
    "Destiny Home <onboarding@resend.dev>"
  );
}
