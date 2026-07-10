import type { Metadata } from "next";
import UsageDashboard from "./UsageDashboard";

export const metadata: Metadata = {
  title: "工具用量統計",
  robots: { index: false, follow: false },
};

export default function AdminUsagePage() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <h1 className="section-title mb-2">命理工具用量</h1>
      <p className="text-center text-sm text-destiny-purple/60 mb-8 max-w-lg mx-auto">
        網上算命功能使用統計（除咗 ADMIN_EXCLUDE_IPS 設定嘅 IP）
      </p>
      <UsageDashboard />
    </div>
  );
}
