import type { CompatibilityResult } from "@/lib/compatibility/types";
import type { BirthInput, ZiWeiChart } from "@/lib/ziwei/types";
import { compatibilityWhatsAppUrl } from "@/lib/compatibility-whatsapp";
import MasterReadingCta from "@/components/MasterReadingCta";
import {
  COMPAT_LABEL_BG,
  COMPAT_LABEL_TEXT,
} from "@/lib/compatibility-score-styles";

interface Props {
  personA: BirthInput;
  personB: BirthInput;
  chartA: ZiWeiChart;
  chartB: ZiWeiChart;
  result: CompatibilityResult;
}

const FACTOR_LABELS: { key: keyof CompatibilityResult["factors"]; label: string }[] = [
  { key: "spouseA", label: "你嘅夫妻宮" },
  { key: "spouseB", label: "對方夫妻宮" },
  { key: "crossAB", label: "你要求 × 對方本色" },
  { key: "crossBA", label: "對方要求 × 你本色" },
  { key: "mood", label: "福德宮情緒相處" },
];

export default function CompatibilityResult({
  personA,
  personB,
  chartA,
  chartB,
  result,
}: Props) {
  const waUrl = compatibilityWhatsAppUrl(personA, personB, chartA, chartB, result);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card text-center">
        <p className="text-sm text-destiny-purple/60 mb-2">夾桃花指數</p>
        <div className="flex flex-col items-center gap-2">
          <span
            className={`text-6xl sm:text-7xl font-display font-bold tabular-nums leading-none ${COMPAT_LABEL_TEXT[result.label]}`}
          >
            {result.score}
          </span>
          <span
            className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${COMPAT_LABEL_BG[result.label]}`}
          >
            {result.label}
          </span>
        </div>
        <p className="mt-5 text-destiny-purple/85 leading-relaxed text-left sm:text-center">
          {result.summary}
        </p>
        {result.provider === "fallback" && (
          <p className="text-xs text-destiny-purple/40 mt-3">
            （規則引擎參考；預約師傅可得更深入解讀）
          </p>
        )}
      </div>

      {result.chemistry && (
        <div className="card">
          <h3 className="font-display font-bold text-lg mb-3">化學反應</h3>
          <p className="text-destiny-purple/85 leading-relaxed">{result.chemistry}</p>
        </div>
      )}

      <div className="card">
        <h3 className="font-display font-bold text-lg mb-3">配對亮點</h3>
        <ul className="space-y-2">
          {result.strengths.map((item) => (
            <li key={item} className="flex gap-2 text-destiny-purple/85 leading-relaxed">
              <span className="text-destiny-gold shrink-0">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-display font-bold text-lg mb-3">相處貼士</h3>
        <ul className="space-y-2">
          {result.tips.map((item) => (
            <li key={item} className="flex gap-2 text-destiny-purple/85 leading-relaxed">
              <span className="text-destiny-purple/40 shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card bg-destiny-purple/5">
        <h3 className="font-display font-bold text-lg mb-4">配對維度</h3>
        <div className="space-y-3">
          {FACTOR_LABELS.map(({ key, label }) => {
            const value = result.factors[key];
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-destiny-purple/70">{label}</span>
                  <span className="font-medium tabular-nums">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-destiny-purple/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-destiny-purple/60 to-destiny-gold/80 transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MasterReadingCta whatsappHref={waUrl} variant="compatibility" />
    </div>
  );
}
