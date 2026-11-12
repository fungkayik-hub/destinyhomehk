"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import type { ZiWeiChart } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import type { ChartFortuneSummaryData } from "@/lib/chart-fortune-summary";
import type { AnnualReportViewId, PalaceReportCopy } from "@/lib/palace-report-copy";
import { reportViewTitle, getPalaceReportCopy } from "@/lib/palace-report-copy";
import AnnualMingshuCharts from "./AnnualMingshuCharts";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 10;

interface Props {
  chart: ZiWeiChart;
  scoreByPalace: Map<string, PalaceScore>;
  fortuneSummary: ChartFortuneSummaryData;
  reportText: string;
  activeView: AnnualReportViewId;
  locale?: "zh" | "en";
}

const PdfDocument = forwardRef<
  HTMLDivElement,
  {
    chart: ZiWeiChart;
    scoreByPalace: Map<string, PalaceScore>;
    fortuneSummary: ChartFortuneSummaryData;
    reportText: string;
    activeView: AnnualReportViewId;
    locale: "zh" | "en";
    title: string;
    year: number;
    copy: PalaceReportCopy;
  }
>(function PdfDocument(
  {
    chart,
    scoreByPalace,
    fortuneSummary,
    reportText,
    activeView,
    locale,
    title,
    year,
    copy,
  },
  ref,
) {
  return (
    <div ref={ref} className="bg-white text-destiny-purple font-sans" style={{ width: 794 }}>
      <AnnualMingshuCharts
        chart={chart}
        scoreByPalace={scoreByPalace}
        fortuneSummary={fortuneSummary}
        reportText={reportText}
        activeView={activeView}
        locale={locale}
        forPdf
      />
      <div className="px-4 pb-6 border-t border-destiny-purple/10 mt-4 pt-4">
        <p className="font-display font-bold text-sm text-destiny-purple mb-2">{title}</p>
        <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-destiny-purple/90">
          {reportText}
        </p>
        <p className="text-[9px] text-destiny-purple/45 mt-4 leading-relaxed">
          {copy.analysisDisclaimer} {copy.notMasterNote}。{copy.masterCtaNote}
        </p>
        <p className="text-[9px] text-destiny-gold mt-2">馮命居 Destiny Home · {year}</p>
      </div>
    </div>
  );
});

export default function AnnualMingshuPdfExport({
  chart,
  scoreByPalace,
  fortuneSummary,
  reportText,
  activeView,
  locale = "zh",
}: Props) {
  const copy = getPalaceReportCopy(locale);
  const pdfRootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "busy" | "error">("idle");

  const downloadPdf = useCallback(async () => {
    const node = pdfRootRef.current;
    if (!node) return;

    setStatus("busy");
    try {
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
      await new Promise((r) => setTimeout(r, 500));

      const dataUrl = await toJpeg(node, {
        cacheBust: true,
        pixelRatio: 1.25,
        quality: 0.92,
        backgroundColor: "#ffffff",
      });

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("image load failed"));
        img.src = dataUrl;
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const contentWidth = A4_WIDTH_MM - MARGIN_MM * 2;
      const contentHeight = A4_HEIGHT_MM - MARGIN_MM * 2;
      const imgHeightMm = (img.height / img.width) * contentWidth;

      let heightLeft = imgHeightMm;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", MARGIN_MM, MARGIN_MM - position, contentWidth, imgHeightMm);
        heightLeft -= contentHeight;
        position += contentHeight;
        page += 1;
        if (page > 40) break;
      }

      const year = new Date().getFullYear();
      const tierSlug =
        activeView === "full" ? "quanpi" : activeView === "standard" ? "liunian" : activeView;
      pdf.save(`fungmingjyu-${year}-mingshu-${tierSlug}.pdf`);
      setStatus("idle");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }, [activeView]);

  const title = reportViewTitle(activeView, copy);
  const year = new Date().getFullYear();
  const zh = locale === "zh";

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={status === "busy"}
          className="btn-secondary text-sm"
        >
          {status === "busy"
            ? zh
              ? "製作 PDF 中…"
              : "Building PDF…"
            : zh
              ? "下載 PDF 命書（含圖表）"
              : "Download PDF (with charts)"}
        </button>
        {status === "error" && (
          <span className="text-xs text-destiny-red" role="alert">
            {zh ? "PDF 製作失敗，請再試或使用瀏覽器列印。" : "PDF failed — try again or print."}
          </span>
        )}
      </div>

      <div className="fixed left-[-9999px] top-0 z-[-1] pointer-events-none" aria-hidden>
        <PdfDocument
          ref={pdfRootRef}
          chart={chart}
          scoreByPalace={scoreByPalace}
          fortuneSummary={fortuneSummary}
          reportText={reportText}
          activeView={activeView}
          locale={locale}
          title={title}
          year={year}
          copy={copy}
        />
      </div>
    </>
  );
}
