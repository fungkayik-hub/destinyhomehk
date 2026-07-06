import { whatsappUrl } from "@/lib/site-config";

export function fortuneStickWhatsAppUrl(question: string, lotNumber: number): string {
  const q = question.trim().slice(0, 80);
  const msg = [
    "你好，我喺網站線上求籤，想預約 Sunny 師傅深入問事。",
    `問題：${q}${question.length > 80 ? "…" : ""}`,
    `抽中：第 ${lotNumber} 籤`,
    "請問可預約時間同收費？",
  ].join("\n");
  return whatsappUrl(msg);
}
