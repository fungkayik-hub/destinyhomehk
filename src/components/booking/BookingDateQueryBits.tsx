"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import { whatsappDatePickerUrl, whatsappUrl } from "@/lib/site-config";

function DateNotice() {
  const isDateService = useSearchParams().get("service") === "date";
  if (!isDateService) return null;

  return (
    <div className="max-w-3xl mx-auto mb-8 card bg-destiny-gold/10 border-destiny-gold/30">
      <p className="text-sm text-destiny-purple/80 leading-relaxed">
        結婚、入伙等重要日子請 WhatsApp 預約，Sunny 師傅會按雙方生辰親自擇日及吉時（HK$800）。
      </p>
    </div>
  );
}

export function BookingDateNotice() {
  return (
    <Suspense fallback={null}>
      <DateNotice />
    </Suspense>
  );
}

function FooterButton({ isDateService }: { isDateService: boolean }) {
  return (
    <TrackedWhatsAppLink
      href={isDateService ? whatsappDatePickerUrl() : whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      location={isDateService ? "booking_footer_date" : "booking_footer"}
      className="btn-primary"
    >
      WhatsApp 預約
    </TrackedWhatsAppLink>
  );
}

function FooterWhatsApp() {
  const isDateService = useSearchParams().get("service") === "date";
  return <FooterButton isDateService={isDateService} />;
}

export function BookingFooterWhatsApp() {
  return (
    <Suspense fallback={<FooterButton isDateService={false} />}>
      <FooterWhatsApp />
    </Suspense>
  );
}
