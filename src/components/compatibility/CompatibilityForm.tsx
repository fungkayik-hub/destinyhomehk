import type { BirthInput } from "@/lib/ziwei";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import PersonBirthFields from "./PersonBirthFields";

interface Props {
  personA: BirthInput;
  personB: BirthInput;
  error?: string | null;
}

export default function CompatibilityForm({ personA, personB, error }: Props) {
  const copy = apprenticeCopy;

  return (
    <div className="max-w-5xl mx-auto font-sans">
      <form method="GET" action="/compatibility" className="card mb-8">
        <h2 className="font-display text-xl font-bold mb-2">輸入雙方出生資料</h2>
        <p className="text-sm text-destiny-purple/60 mb-6">{copy.detectorFormHint}</p>

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
          {copy.detectorSubmit} 💕
        </button>

        <p className="text-xs text-destiny-purple/45 mt-3">{copy.detectorLoadingHint}</p>

        {error && <p className="text-sm text-destiny-red mt-4">{error}</p>}

        <p className="text-xs text-destiny-purple/50 mt-4">{copy.detectorFormFooter}</p>
      </form>
    </div>
  );
}
