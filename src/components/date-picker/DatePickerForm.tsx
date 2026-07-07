import type { BirthInput } from "@/lib/ziwei";
import { apprenticeCopy } from "@/lib/apprentice-copy";
import { WEDDING_CEREMONIES } from "@/lib/date-picker/event-types";
import type { WeddingCeremonyId } from "@/lib/date-picker/types";
import PersonBirthFields from "@/components/compatibility/PersonBirthFields";

interface Props {
  ceremonyId: WeddingCeremonyId;
  startDate: string;
  endDate: string;
  personA: BirthInput;
  personB: BirthInput;
  error?: string | null;
}

export default function DatePickerForm({
  ceremonyId,
  startDate,
  endDate,
  personA,
  personB,
  error,
}: Props) {
  const copy = apprenticeCopy;

  return (
    <div className="max-w-5xl mx-auto font-sans">
      <form method="GET" action="/date-picker" className="card mb-8">
        <h2 className="font-display text-xl font-bold mb-2">{copy.datePickerName}</h2>
        <p className="text-sm text-destiny-purple/60 mb-6">{copy.datePickerFormHint}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <label className="block sm:col-span-2">
            <span className="text-sm text-destiny-purple/70 mb-1 block">儀式類型</span>
            <select
              name="ceremony"
              defaultValue={ceremonyId}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2 bg-white"
            >
              {WEDDING_CEREMONIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-destiny-purple/45 mt-1">
              {WEDDING_CEREMONIES.find((c) => c.id === ceremonyId)?.description}
            </p>
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">開始日期</span>
            <input
              type="date"
              name="startDate"
              required
              defaultValue={startDate}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">結束日期（最長 18 個月）</span>
            <input
              type="date"
              name="endDate"
              required
              defaultValue={endDate}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
          </label>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <PersonBirthFields
            prefix="a"
            title="新娘／一方"
            accentClass="text-destiny-purple"
            input={personA}
          />
          <PersonBirthFields
            prefix="b"
            title="新郎／一方"
            accentClass="text-destiny-gold"
            input={personB}
          />
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          {copy.datePickerSubmit}
        </button>

        {error && <p className="text-sm text-destiny-red mt-4">{error}</p>}

        <p className="text-xs text-destiny-purple/50 mt-4">{copy.datePickerFormFooter}</p>
      </form>
    </div>
  );
}
