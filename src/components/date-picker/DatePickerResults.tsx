import Link from "next/link";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import type { WeddingDatePickerResult } from "@/lib/date-picker/types";
import { whatsappDatePickerUrl } from "@/lib/site-config";

const RATING_STYLES: Record<string, string> = {
  大吉: "bg-destiny-gold/25 text-destiny-purple border-destiny-gold/50",
  吉: "bg-emerald-100 text-emerald-900 border-emerald-300",
  平: "bg-slate-100 text-slate-700 border-slate-300",
  凶: "bg-red-100 text-red-800 border-red-300",
};

interface Props {
  result: WeddingDatePickerResult;
}

export default function DatePickerResults({ result }: Props) {
  const copy = apprenticeCopy;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="card bg-destiny-purple/5 border-destiny-purple/15">
        <p className="text-sm text-destiny-purple/80 leading-relaxed">
          <strong>{result.ceremonyLabel}</strong> · {result.startDate} 至 {result.endDate}
          <br />
          掃描 {result.totalDaysScanned} 日，符合條件 <strong>{result.matchCount}</strong> 日
          （顯示最佳 {result.dates.length} 日）。已避開冲{" "}
          <strong>{result.personAZodiac}</strong>、<strong>{result.personBZodiac}</strong> 生肖之日。
        </p>
      </div>

      {result.dates.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-destiny-purple/70 mb-4">
            呢段日期內未搵到符合黃曆宜忌同生肖冲煞嘅日子。
          </p>
          <p className="text-sm text-destiny-purple/55 mb-6">
            可以拉長範圍、換另一儀式類型，或直接 WhatsApp 師傅人工擇日。
          </p>
          <a
            href={whatsappDatePickerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            WhatsApp 師傅擇日
          </a>
        </div>
      ) : (
        <ol className="space-y-4">
          {result.dates.map((day, index) => (
            <li key={day.date} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-destiny-purple/50 mb-1">#{index + 1}</p>
                  <h3 className="font-display text-lg font-bold text-destiny-purple">
                    {day.solarLabel}（{day.weekday}）
                  </h3>
                  <p className="text-sm text-destiny-purple/65 mt-1">{day.lunarDate}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${RATING_STYLES[day.rating] ?? RATING_STYLES["平"]}`}
                  >
                    {day.rating}
                  </span>
                  <p className="text-xs text-destiny-purple/45 mt-1">評分 {day.score}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-destiny-purple/75">
                <p>
                  <span className="text-destiny-purple/50">宜：</span>
                  {day.yi.join("、") || "—"}
                </p>
                <p>
                  <span className="text-destiny-purple/50">忌：</span>
                  {day.ji.join("、") || "無"}
                </p>
                <p>
                  <span className="text-destiny-purple/50">冲：</span>
                  {day.chong}
                </p>
                <p>
                  <span className="text-destiny-purple/50">建除：</span>
                  {day.dayOfficer}日
                </p>
              </div>

              {day.notes.length > 0 && (
                <ul className="mt-3 text-xs text-destiny-purple/60 space-y-1">
                  {day.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="text-destiny-gold">✦</span>
                      {note}
                    </li>
                  ))}
                </ul>
              )}

              {day.warnings.length > 0 && (
                <ul className="mt-2 text-xs text-amber-800/80 space-y-1">
                  {day.warnings.map((w) => (
                    <li key={w}>⚠ {w}</li>
                  ))}
                </ul>
              )}

              <div className="mt-3 pt-3 border-t border-destiny-purple/10">
                <Link
                  href={`/daily/${day.date}`}
                  className="text-xs text-destiny-gold hover:underline"
                >
                  查看當日流日黃曆 →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="card bg-destiny-gold/10 border-destiny-gold/30 text-center">
        <p className="text-sm text-destiny-purple/80 mb-2">{copy.datePickerMasterNote}</p>
        <p className="text-xs text-destiny-purple/55 mb-4">{copy.datePickerDisclaimer}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={whatsappDatePickerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex text-sm"
          >
            WhatsApp 預約師傅擇日（HK$800）
          </a>
          <Link href="/wedding-date" className="btn-secondary inline-flex text-sm">
            結婚擇日服務詳情
          </Link>
        </div>
      </div>
    </div>
  );
}
