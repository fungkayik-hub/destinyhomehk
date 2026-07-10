import Link from "next/link";

interface Props {
  locale?: "zh" | "en";
}

export default function ChartEditBirthLink({ locale = "zh" }: Props) {
  const href = locale === "en" ? "/en/chart" : "/chart";
  const label = locale === "en" ? "Edit birth details" : "修改出生資料";

  return (
    <div className="max-w-4xl mx-auto mb-4">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm text-destiny-purple/60 hover:text-destiny-gold transition-colors"
      >
        <span aria-hidden>←</span>
        {label}
      </Link>
    </div>
  );
}
