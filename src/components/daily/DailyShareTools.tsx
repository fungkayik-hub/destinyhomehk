"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import type { DailyAlmanac } from "@/lib/daily-almanac/types";
import { buildDailyCaption } from "@/lib/daily-caption";
import DailyStoryPoster from "./DailyStoryPoster";

interface Props {
  data: DailyAlmanac;
}

export default function DailyShareTools({ data }: Props) {
  const [status, setStatus] = useState<"idle" | "downloading" | "copied" | "error">("idle");

  async function downloadStory() {
    const node = document.getElementById("daily-story-poster");
    if (!node) return;

    setStatus("downloading");
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        width: 1080,
        height: 1920,
      });
      const link = document.createElement("a");
      link.download = `destinyhomehk-流日-${data.date}.png`;
      link.href = dataUrl;
      link.click();
      setStatus("idle");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(buildDailyCaption(data));
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap gap-3 justify-center">
        <button type="button" onClick={downloadStory} className="btn-primary text-sm" disabled={status === "downloading"}>
          {status === "downloading" ? "產生圖片中…" : "下載 Story 圖（9:16）"}
        </button>
        <button type="button" onClick={copyCaption} className="btn-secondary text-sm">
          {status === "copied" ? "已複製文案 ✓" : "複製 IG 文案"}
        </button>
        <a
          href={`/api/og/daily?date=${data.date}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm"
        >
          預覽分享圖
        </a>
      </div>

      {status === "error" && (
        <p className="text-center text-sm text-destiny-red mb-4">操作失敗，請再試或用手機截圖</p>
      )}

      {/* 螢幕外渲染 — 供 html-to-image 擷取 */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none" aria-hidden>
        <DailyStoryPoster data={data} />
      </div>
    </>
  );
}
