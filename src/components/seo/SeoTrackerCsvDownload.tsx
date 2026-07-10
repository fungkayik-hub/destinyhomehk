"use client";

import { buildMonthlyTrackerCsv } from "@/lib/seo-keyword-strategy";

interface Props {
  monthLabel?: string;
}

export default function SeoTrackerCsvDownload({ monthLabel }: Props) {
  const label =
    monthLabel ??
    new Date().toLocaleDateString("zh-HK", { year: "numeric", month: "long" });

  function download() {
    const csv = buildMonthlyTrackerCsv(label);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `destinyhome-seo-tracker-${new Date().toISOString().slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={download} className="btn-primary text-sm">
      下載本月追蹤表（CSV）
    </button>
  );
}
