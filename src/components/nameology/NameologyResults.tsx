import Link from "next/link";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import type { NameologyResult, WugeLuckLabel } from "@/lib/nameology";
import { whatsappNameologyUrl } from "@/lib/site-config";

const LUCK_STYLES: Record<WugeLuckLabel, string> = {
  大吉: "bg-destiny-gold/25 text-destiny-purple border-destiny-gold/50",
  吉: "bg-emerald-100 text-emerald-900 border-emerald-300",
  吉多於凶: "bg-amber-50 text-amber-900 border-amber-300",
  凶多於吉: "bg-orange-100 text-orange-900 border-orange-300",
  凶: "bg-red-100 text-red-800 border-red-300",
  大凶: "bg-red-200 text-red-950 border-red-400",
};

interface Props {
  result: NameologyResult;
}

export default function NameologyResults({ result }: Props) {
  const copy = apprenticeCopy;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="card bg-destiny-purple/5 border-destiny-purple/15">
        <p className="font-display text-2xl font-bold text-destiny-purple mb-2 tracking-wide">
          {result.fullName}
        </p>
        <p className="text-sm text-destiny-purple/70 leading-relaxed">
          康熙筆劃 · 台灣姓名學五格剖象
          {result.isCompoundSurname ? " · 複姓" : " · 單姓"}
          {result.isSingleGiven ? " · 單名" : " · 雙名／多名"}
        </p>
      </div>

      <div className="card">
        <h3 className="font-display text-lg font-bold text-destiny-purple mb-4">逐字筆劃</h3>
        <div className="flex flex-wrap gap-3">
          {result.chars.map((c, i) => (
            <div
              key={`${c.char}-${i}`}
              className="min-w-[4.5rem] text-center rounded-xl border border-destiny-purple/15 bg-white px-3 py-3"
            >
              <p className="font-display text-2xl text-destiny-purple leading-none mb-1">
                {c.traditional}
              </p>
              {c.char !== c.traditional && (
                <p className="text-[10px] text-destiny-purple/40 mb-1">原：{c.char}</p>
              )}
              <p className="text-sm font-medium text-destiny-gold">{c.strokes} 劃</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.grids.map((g) => (
          <div
            key={g.key}
            className={`card ${g.key === "ren" || g.key === "zong" ? "ring-1 ring-destiny-gold/40" : ""}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-display text-lg font-bold text-destiny-purple">{g.label}</h3>
                <p className="text-xs text-destiny-purple/50 mt-0.5">{g.role}</p>
              </div>
              <span
                className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${LUCK_STYLES[g.luck]}`}
              >
                {g.luck}
              </span>
            </div>
            <p className="text-sm text-destiny-purple/80 mb-2">
              <span className="font-semibold text-destiny-purple">{g.strokes}</span> 劃
              {g.strokes !== g.number ? (
                <span className="text-destiny-purple/50"> → 數理 {g.number}</span>
              ) : null}
              <span className="text-destiny-purple/40"> · </span>
              <span>{g.element}</span>
            </p>
            <p className="text-sm text-destiny-purple/65 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>

      <div className="card text-center">
        <p className="text-sm text-destiny-purple/70 mb-2">{copy.nameologyDisclaimer}</p>
        {result.needsAttention ? (
          <p className="text-destiny-purple font-medium mb-4">
            人格或總格偏凶／偏險 — 改名可調整人格、地格同總格，天格一般唔改。
          </p>
        ) : (
          <p className="text-destiny-purple/80 mb-4">{copy.nameologyMasterNote}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappNameologyUrl(result.fullName)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex justify-center"
          >
            WhatsApp 預約改名（HK$3,800）
          </a>
          <Link href="/academy/name-numerology" className="btn-secondary inline-flex justify-center">
            睇完整 1–81 對照表
          </Link>
        </div>
      </div>
    </div>
  );
}
