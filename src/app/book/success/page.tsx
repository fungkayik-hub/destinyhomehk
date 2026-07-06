import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/SiteImage";
import BookingSuccessContent from "@/components/booking/BookingSuccessContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "預約確認",
  description: "Destiny Home 網上預約付款確認",
  path: "/book/success",
});

export default function BookSuccessPage() {
  return (
    <>
      <PageBanner
        src="/images/home-hero-stars.png"
        title="預約確認"
        subtitle="Destiny Home"
        overlay="subtle"
      />
      <div className="py-12 px-4">
        <Suspense
          fallback={
            <div className="card text-center max-w-lg mx-auto text-sm text-destiny-muted">
              載入中…
            </div>
          }
        >
          <BookingSuccessContent />
        </Suspense>
      </div>
    </>
  );
}
