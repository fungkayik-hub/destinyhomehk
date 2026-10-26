import Link from "next/link";
import { getComplianceCopy } from "@/lib/compliance-copy";

interface Props {
  locale?: "zh" | "en";
  /** 顯示於付款按鈕區 */
  variant?: "checkout" | "report";
}

export default function MingshuComplianceNotes({
  locale = "zh",
  variant = "checkout",
}: Props) {
  const copy = getComplianceCopy(locale);

  if (variant === "report") {
    return (
      <p className="text-xs text-destiny-purple/45 mt-3 leading-relaxed border-t border-destiny-purple/8 pt-3">
        {copy.aiDisclaimerShort}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-2 text-xs text-destiny-purple/50 leading-relaxed text-center sm:text-left">
      <p>{copy.aiDisclaimerShort}</p>
      <p>
        {copy.refundNearCheckout}{" "}
        <Link href="/privacy#refund" className="text-destiny-gold hover:underline">
          {copy.refundLinkLabel}
        </Link>
        {" · "}
        <Link href="/privacy" className="text-destiny-gold hover:underline">
          {copy.privacyLinkLabel}
        </Link>
      </p>
      <p className="text-destiny-purple/40">{copy.checkoutFootnote}</p>
    </div>
  );
}
