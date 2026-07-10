import Link from "next/link";

export default function CompatibilityEditLink() {
  return (
    <div className="max-w-3xl mx-auto mb-4">
      <Link
        href="/compatibility"
        className="inline-flex items-center gap-1.5 text-sm text-destiny-purple/60 hover:text-destiny-gold transition-colors"
      >
        <span aria-hidden>←</span>
        修改雙方資料
      </Link>
    </div>
  );
}
