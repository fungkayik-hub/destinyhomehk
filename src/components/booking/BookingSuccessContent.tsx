"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

interface BookingInfo {
  serviceTitle: string;
  date: string;
  time: string;
  name: string;
  email: string | null;
  paid: boolean;
  amountLabel: string | null;
}

export default function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "confirmed" | "processing" | "error">(
    sessionId ? "loading" : "error",
  );
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let attempts = 0;
    const maxAttempts = 12;

    async function poll() {
      try {
        const res = await fetch(`/api/booking/session?session_id=${encodeURIComponent(sessionId!)}`);
        const data = await res.json();

        if (data.status === "confirmed" && data.booking) {
          setBooking(data.booking);
          setStatus("confirmed");
          return;
        }

        if (data.status === "processing") {
          setMessage(data.message ?? "付款已收到，正在確認預約…");
          setStatus("processing");
        }

        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else if (data.status === "processing") {
          setStatus("processing");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    poll();
  }, [sessionId]);

  if (status === "loading" || status === "processing") {
    return (
      <div className="card text-center max-w-lg mx-auto">
        <div className="text-4xl mb-4 animate-pulse">💳</div>
        <h2 className="font-display text-2xl font-bold text-destiny-purple mb-2">
          {status === "loading" ? "確認付款中…" : "付款成功"}
        </h2>
        <p className="text-sm text-destiny-purple/75">
          {message ?? "正在為你確認預約，請稍候…"}
        </p>
      </div>
    );
  }

  if (status === "error" || !booking) {
    return (
      <div className="card text-center max-w-lg mx-auto">
        <h2 className="font-display text-2xl font-bold text-destiny-purple mb-2">
          付款已提交
        </h2>
        <p className="text-sm text-destiny-purple/75 mb-6">
          若未見確認電郵，請 WhatsApp 聯絡師傅，並提供付款時間同姓名。
        </p>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary">
          WhatsApp 聯絡
        </a>
      </div>
    );
  }

  const [y, m, d] = booking.date.split("-").map(Number);
  const dateLabel = new Intl.DateTimeFormat("zh-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: BOOKING_CONFIG.timezone,
  }).format(new Date(y, m - 1, d));

  return (
    <div className="card text-center max-w-lg mx-auto">
      <div className="text-4xl mb-4">✓</div>
      <h2 className="font-display text-2xl font-bold text-destiny-purple mb-2">
        付款及預約成功
      </h2>
      <p className="text-sm text-destiny-purple/75 mb-2 leading-relaxed">
        {booking.name}，你已預約並完成付款 <strong>{booking.serviceTitle}</strong>
        {booking.amountLabel && (
          <>
            <br />
            已付 <strong className="text-destiny-gold">{booking.amountLabel}</strong>
          </>
        )}
        <br />
        {dateLabel} · {booking.time}
      </p>
      <p className="text-sm text-destiny-muted mb-6">
        Sunny 師傅會透過 WhatsApp 同你確認出生資料同諮詢內容。
        {booking.email ? " 確認電郵已發送。" : ""}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappUrl(
            `你好，我剛完成網上付款及預約 ${booking.serviceTitle}（${booking.date} ${booking.time}），想確認資料。`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          WhatsApp 聯絡
        </a>
        <Link href="/" className="btn-secondary">
          返回首頁
        </Link>
      </div>
      <p className="text-xs text-destiny-muted mt-6">
        📍 {siteConfig.address} · {siteConfig.hours}
      </p>
    </div>
  );
}
