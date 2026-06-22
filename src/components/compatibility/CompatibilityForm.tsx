import type { BirthInput } from "@/lib/ziwei";
import PersonBirthFields from "./PersonBirthFields";

interface Props {
  personA: BirthInput;
  personB: BirthInput;
  error?: string | null;
}

export default function CompatibilityForm({ personA, personB, error }: Props) {
  return (
    <div className="max-w-5xl mx-auto">
      <form method="GET" action="/compatibility" className="card mb-8">
        <h2 className="font-display text-xl font-bold mb-2">輸入雙方出生資料</h2>
        <p className="text-sm text-destiny-purple/60 mb-6">
          用紫微斗數夫妻宮、命宮交叉睇配對夾度 — 免費參考，深入合婚可 WhatsApp 師傅。
        </p>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <PersonBirthFields
            prefix="a"
            title="你"
            accentClass="text-destiny-purple"
            input={personA}
          />
          <PersonBirthFields
            prefix="b"
            title="對方"
            accentClass="text-destiny-gold"
            input={personB}
          />
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          睇夾唔夾 💕
        </button>

        <p className="text-xs text-destiny-purple/45 mt-3">
          首次分析約需 10–20 秒；同一對資料唔使再等。
        </p>

        {error && <p className="text-sm text-destiny-red mt-4">{error}</p>}

        <p className="text-xs text-destiny-purple/50 mt-4">
          免費版為參考提示；感情細節、結婚時機、大限流年等，建議預約師傅全批。
        </p>
      </form>
    </div>
  );
}
