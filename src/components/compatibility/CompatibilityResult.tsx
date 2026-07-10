import type { CompatibilityResult } from "@/lib/compatibility/types";
import type { BirthInput, ChartPlateType, ZiWeiChart } from "@/lib/ziwei/types";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import { buildCompatibilityHref } from "@/lib/compatibility-layout";
import { compatibilityWhatsAppUrl } from "@/lib/compatibility-whatsapp";
import MasterReadingCta from "@/components/MasterReadingCta";
import ChartPlatePicker from "@/components/chart/ChartPlatePicker";
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
  plate: ChartPlateType;
  suggestedPlateA: ChartPlateType;
  suggestedPlateB: ChartPlateType;
  searchParams: Record<string, string | string[] | undefined>;
}

const FACTOR_LABELS: {
  key: keyof CompatibilityResult["factors"];
  label: string;
  hook: (score: number) => string | null;
}[] = [
  {
    key: "spouseA",
    label: "你嘅夫妻宮",
    hook: (s) =>
      s < 70
        ? "你心目中另一半嘅輪廓同而家對象未必完全一致 — 師傅合婚會講點樣調整期望。"
        : null,
  },
  {
    key: "spouseB",
    label: "對方夫妻宮",
    hook: (s) =>
      s < 70
        ? "對方點樣諗感情、要咩安全感 — 徒弟睇到方向，深入要師傅對盤。"
        : null,
  },
  {
    key: "crossAB",
    label: "你要求 × 對方本色",
    hook: (s) =>
      s < 72
        ? "你想要嘅同對方本色有落差 — 呢度係相處關鍵，師傅會教你點樣溝通。"
        : null,
  },
  {
    key: "crossBA",
    label: "對方要求 × 你本色",
    hook: (s) =>
      s < 72
        ? "對方期待同你本色要磨合 — 唔代表唔夾，係要學點樣互相遷就。"
        : null,
  },
  {
    key: "mood",
    label: "福德宮情緒相處",
    hook: (s) =>
      s < 72
        ? "開心時好夾，心累時易誤會 — 邊段大限感情壓力較大，要師傅睇流年先準。"
        : null,
  },
];

export default function CompatibilityResult({
  personA,
  personB,
  chartA,
  chartB,
  result,
  plate,
  suggestedPlateA,
  suggestedPlateB,
  searchParams,
}: Props) {
  const waUrl = compatibilityWhatsAppUrl(personA, personB, chartA, chartB, result);
  const copy = apprenticeCopy;
  const buildPlateHref = (p: ChartPlateType) =>
    buildCompatibilityHref(searchParams, { plate: p, hash: "compat-summary" });

  const lowestFactor = FACTOR_LABELS.reduce(
    (min, f) => {
      const v = result.factors[f.key];
      return v < min.value ? { key: f.key, value: v, label: f.label } : min;
    },
    { key: "" as keyof CompatibilityResult["factors"], value: 101, label: "" },
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div
        id="compat-summary"
        className="rounded-xl bg-destiny-purple text-white px-4 py-4 sm:px-6 sm:py-5 space-y-4 scroll-mt-20"
      >
        <ChartPlatePicker
          current={plate}
          suggested={suggestedPlateA}
          suggestedB={suggestedPlateB}
          searchParams={searchParams}
          variant="bar"
          buildPlateHref={buildPlateHref}
        />
        <div className="grid sm:grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
          <div>
            <p className="text-xs text-white/45 mb-1">你 · 陽曆 {chartA.solarDate}</p>
            <p className="text-white/90">
              命宮 <strong>{chartA.mingPalaceBranch}</strong>
              <span className="text-white/40 mx-2">·</span>
              夫妻宮{" "}
              <strong>
                {chartA.palaces.find((p) => p.name === "夫妻宮")?.earthlyBranch ?? "—"}
              </strong>
            </p>
          </div>
          <div>
            <p className="text-xs text-white/45 mb-1">對方 · 陽曆 {chartB.solarDate}</p>
            <p className="text-white/90">
              命宮 <strong>{chartB.mingPalaceBranch}</strong>
              <span className="text-white/40 mx-2">·</span>
              夫妻宮{" "}
              <strong>
                {chartB.palaces.find((p) => p.name === "夫妻宮")?.earthlyBranch ?? "—"}
              </strong>
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-destiny-gold">
        {copy.detectorBadge} · {copy.tagline}
      </p>

      <div className="card text-center">
        <p className="text-sm text-destiny-purple/60 mb-2">{copy.detectorScoreLabel}</p>
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
        <p className="text-xs text-destiny-purple/45 mt-4 leading-relaxed text-left sm:text-center">
          {copy.detectorDisclaimer}
          <strong className="text-destiny-purple/60"> {copy.notMasterNote}</strong>，
          {copy.detectorDingPanNote}。
        </p>
      </div>

      {result.chemistry && (
        <div className="card">
          <h3 className="font-display font-bold text-lg mb-3">{copy.chemistryTitle}</h3>
          <p className="text-destiny-purple/85 leading-relaxed">{result.chemistry}</p>
        </div>
      )}

      <div className="card">
        <h3 className="font-display font-bold text-lg mb-3">{copy.strengthsTitle}</h3>
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
        <h3 className="font-display font-bold text-lg mb-3">{copy.tipsTitle}</h3>
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
        <h3 className="font-display font-bold text-lg mb-4">{copy.factorsTitle}</h3>
        <div className="space-y-4">
          {FACTOR_LABELS.map(({ key, label, hook }) => {
            const value = result.factors[key];
            const hookText = hook(value);
            const isLowest = key === lowestFactor.key && value < 72;
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
                {hookText && (isLowest || value < 68) && (
                  <p className="text-xs text-destiny-amber mt-1.5 leading-relaxed">
                    {copy.factorHookPrefix} {hookText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <MasterReadingCta whatsappHref={waUrl} variant="compatibility" />
    </div>
  );
}
