import { extractCjkChars } from "@/lib/nameology";

function first(
  sp: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const v = sp[key];
  if (Array.isArray(v)) return (v[0] ?? "").trim();
  return (v ?? "").trim();
}

export interface ParsedNameologyInput {
  submitted: boolean;
  surname: string;
  givenName: string;
  error?: string;
}

export function nameologyInputFromSearchParams(
  sp: Record<string, string | string[] | undefined>,
): ParsedNameologyInput {
  const surname = first(sp, "surname");
  const givenName = first(sp, "given");

  if (!surname && !givenName) {
    return { submitted: false, surname: "", givenName: "" };
  }

  const sChars = extractCjkChars(surname);
  const gChars = extractCjkChars(givenName);

  if (sChars.length < 1 || sChars.length > 2) {
    return {
      submitted: true,
      surname,
      givenName,
      error: "請輸入 1–2 個中文字姓氏（複姓請一齊填，例如「歐陽」）。",
    };
  }
  if (gChars.length < 1 || gChars.length > 3) {
    return {
      submitted: true,
      surname,
      givenName,
      error: "請輸入 1–3 個中文字名字。",
    };
  }

  return {
    submitted: true,
    surname: sChars.join(""),
    givenName: gChars.join(""),
  };
}
