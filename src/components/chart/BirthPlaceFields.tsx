import { BIRTH_PLACES } from "@/lib/ziwei/birth-places";
import type { BirthInput } from "@/lib/ziwei/types";

interface Props {
  namePrefix?: string;
  input: BirthInput;
  locale?: "zh" | "en";
}

export default function BirthPlaceFields({ namePrefix = "", input, locale = "zh" }: Props) {
  const placeName = namePrefix ? `${namePrefix}birthPlaceId` : "birthPlaceId";
  const solarName = namePrefix ? `${namePrefix}useTrueSolarTime` : "useTrueSolarTime";
  const useSolar = input.useTrueSolarTime !== false && input.birthPlaceId !== "standard";

  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:col-span-2 lg:col-span-3">
      <label className="block">
        <span className="text-sm text-destiny-purple/70 mb-1 block">
          {locale === "en" ? "Birth place (true solar time)" : "出生地（真太陽時）"}
        </span>
        <select
          name={placeName}
          defaultValue={input.birthPlaceId ?? "hong-kong"}
          className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2 bg-white"
        >
          {BIRTH_PLACES.map((p) => (
            <option key={p.id} value={p.id}>
              {locale === "en" ? p.nameEn : p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-end gap-2 pb-2">
        <input
          type="checkbox"
          name={solarName}
          value="1"
          defaultChecked={useSolar}
          className="rounded border-destiny-purple/30"
        />
        <span className="text-sm text-destiny-purple/70">
          {locale === "en" ? "Apply true solar time correction" : "啟用真太陽時校正"}
        </span>
      </label>
    </div>
  );
}
