"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { pricingPlans, siteConfig, whatsappUrl } from "@/lib/site-config";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import type { SlotAvailability } from "@/lib/booking/types";
import TurnstileWidget from "@/components/booking/TurnstileWidget";
import { trackEvent } from "@/lib/ga";
import { isOnlinePayablePlan } from "@/lib/stripe/plans";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const STRIPE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim(),
);

function planNeedsOnlinePayment(
  plan: (typeof pricingPlans)[number] | undefined,
): boolean {
  return STRIPE_ENABLED && Boolean(plan && isOnlinePayablePlan(plan));
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-destiny-purple/15 focus:border-destiny-gold focus:outline-none focus:ring-1 focus:ring-destiny-gold";

function isOpenWeekday(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  return (BOOKING_CONFIG.openWeekdays as readonly number[]).includes(weekday);
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_CONFIG.timezone }).format(
    date,
  );
}

interface SuccessInfo {
  serviceTitle: string;
  date: string;
  time: string;
  name: string;
  email?: string;
  confirmationSent?: boolean;
}

export default function BookingForm() {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: BOOKING_CONFIG.timezone,
      }).format(new Date()),
    [],
  );
  const maxDate = useMemo(() => addDays(today, 90), [today]);

  const [serviceId, setServiceId] = useState<string>(pricingPlans[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [dayFull, setDayFull] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessInfo | null>(null);

  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true);
    setError(null);
    try {
      const res = await fetch(`/api/booking/availability?date=${date}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "無法載入時段");
        setSlots([]);
        return;
      }
      setSlots(data.slots);
      setDayFull(data.dayFull);
      setSelectedTime(null);
    } catch {
      setError("無法載入時段，請稍後再試");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
    else {
      setSlots([]);
      setDayFull(false);
      setSelectedTime(null);
    }
  }, [selectedDate, fetchSlots]);

  function handleDateChange(value: string) {
    if (!value) {
      setSelectedDate("");
      return;
    }
    if (!isOpenWeekday(value)) {
      setError("星期日休息，請選擇星期一至六");
      setSelectedDate("");
      return;
    }
    setError(null);
    setSelectedDate(value);
  }

  const canSubmit =
    selectedDate &&
    selectedTime &&
    name.trim() &&
    phone.trim() &&
    (!TURNSTILE_SITE_KEY || turnstileToken);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("請選擇日期及時間");
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("請完成人機驗證");
      return;
    }
    setSubmitting(true);
    setError(null);
    const selectedPlan = pricingPlans.find((p) => p.id === serviceId);
    const useCheckout = planNeedsOnlinePayment(selectedPlan);
    try {
      const res = await fetch(useCheckout ? "/api/booking/checkout" : "/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date: selectedDate,
          time: selectedTime,
          name,
          phone,
          email: email.trim() || undefined,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "預約失敗");
        if (res.status === 409) fetchSlots(selectedDate);
        return;
      }
      if (useCheckout && data.url) {
        trackEvent("booking_checkout_start", {
          service: selectedPlan?.title ?? serviceId,
        });
        window.location.href = data.url;
        return;
      }
      trackEvent("booking_submit", {
        service: data.booking.serviceTitle,
        has_email: data.booking.email ? "yes" : "no",
      });
      setSuccess({
        serviceTitle: data.booking.serviceTitle,
        date: data.booking.date,
        time: data.booking.time,
        name: data.booking.name,
        email: data.booking.email ?? undefined,
        confirmationSent: data.confirmationSent,
      });
    } catch {
      setError("預約失敗，請稍後再試或 WhatsApp 聯絡");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const [y, m, d] = success.date.split("-").map(Number);
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
          預約成功
        </h2>
        <p className="text-sm text-destiny-purple/75 mb-6 leading-relaxed">
          {success.name}，你已預約 <strong>{success.serviceTitle}</strong>
          <br />
          {dateLabel} · {success.time}
        </p>
        <p className="text-sm text-destiny-muted mb-6">
          {success.email && success.confirmationSent
            ? "確認電郵已發送至你的信箱。"
            : success.email
              ? "電郵確認暫時未能發送，請保留此頁資料。"
              : "Sunny 師傅會透過 WhatsApp 同你確認出生資料同諮詢內容。"}
          <br />
          如有急事可主動聯絡我們。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl(`你好，我剛完成網上預約 ${success.serviceTitle}（${success.date} ${success.time}），想確認資料。`)}
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
      </div>
    );
  }

  const selectedPlan = pricingPlans.find((p) => p.id === serviceId);

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto font-sans">
      <section className="card space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold text-destiny-purple mb-1">
            網上預約
          </h2>
          <p className="text-xs text-destiny-muted">
            星期一至六 · 每日最多 {BOOKING_CONFIG.maxPerDay} 個預約 · 星期日休息
          </p>
        </div>

        <div>
          <label htmlFor="booking-service" className="block text-sm text-destiny-muted mb-1">
            服務
          </label>
          <select
            id="booking-service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className={inputClass}
          >
            {pricingPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title} — {plan.price}
              </option>
            ))}
          </select>
          {selectedPlan && "duration" in selectedPlan && selectedPlan.duration && (
            <p className="text-xs text-destiny-muted mt-1">{selectedPlan.duration}</p>
          )}
          {selectedPlan && planNeedsOnlinePayment(selectedPlan) && (
            <p className="text-xs text-destiny-gold mt-1">
              此服務需網上付款 {selectedPlan.price} 以確認預約（Visa / Mastercard / Apple Pay）
            </p>
          )}
          {selectedPlan && !planNeedsOnlinePayment(selectedPlan) && (
            <p className="text-xs text-destiny-muted mt-1">
              {selectedPlan.id === "feng-shui"
                ? "風水按實用面積計費，請先預約時段，師傅會 WhatsApp 報價。"
                : "提交後 Sunny 師傅會 WhatsApp 同你確認出生資料同預約詳情。"}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="booking-date" className="block text-sm text-destiny-muted mb-1">
            日期
          </label>
          <input
            id="booking-date"
            type="date"
            required
            min={today}
            max={maxDate}
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <span className="block text-sm text-destiny-muted mb-2">時間</span>
          {!selectedDate ? (
            <p className="text-sm text-destiny-purple/40">請先選擇日期</p>
          ) : loadingSlots ? (
            <p className="text-sm text-destiny-muted">載入時段中…</p>
          ) : dayFull ? (
            <p className="text-sm text-destiny-red">當日預約已滿，請選擇其他日期。</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-3 rounded-xl text-sm font-medium border transition-colors ${
                    selectedTime === slot.time
                      ? "border-destiny-gold bg-destiny-gold/10 text-destiny-purple"
                      : slot.available
                        ? "border-destiny-purple/15 hover:border-destiny-gold text-destiny-purple"
                        : "border-destiny-purple/5 text-destiny-purple/25 cursor-not-allowed line-through"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="booking-name" className="block text-sm text-destiny-muted mb-1">
            姓名
          </label>
          <input
            id="booking-name"
            type="text"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="陳小姐"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="booking-phone" className="block text-sm text-destiny-muted mb-1">
            電話（WhatsApp）
          </label>
          <input
            id="booking-phone"
            type="tel"
            required
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9123 4567"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="booking-email" className="block text-sm text-destiny-muted mb-1">
            電郵（選填）
          </label>
          <input
            id="booking-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        {TURNSTILE_SITE_KEY && <TurnstileWidget onToken={handleTurnstileToken} />}

        {error && (
          <p className="text-sm text-destiny-red" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="btn-primary w-full disabled:opacity-60"
        >
          {submitting
            ? "提交中…"
            : planNeedsOnlinePayment(selectedPlan)
              ? `前往付款 · ${selectedPlan?.price ?? ""}`
              : "確認預約"}
        </button>

        <p className="text-xs text-destiny-muted text-center">
          📍 {siteConfig.address} · {siteConfig.hours}
        </p>
      </section>
    </form>
  );
}
