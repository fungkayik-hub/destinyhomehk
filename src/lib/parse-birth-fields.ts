import { DEFAULT_BIRTH_PLACE_ID } from "@/lib/ziwei/birth-places";

export function parseBirthPlaceId(raw: string | undefined): string {
  if (!raw) return DEFAULT_BIRTH_PLACE_ID;
  return raw;
}

export function parseUseTrueSolarTime(raw: string | undefined): boolean | undefined {
  if (raw === "0" || raw === "false") return false;
  if (raw === "1" || raw === "true") return true;
  return undefined;
}
