export type WugeLuckLabel =
  | "大吉"
  | "吉"
  | "吉多於凶"
  | "凶多於吉"
  | "凶"
  | "大凶";

export type FiveElement = "木" | "火" | "土" | "金" | "水";

export interface CharStroke {
  char: string;
  traditional: string;
  strokes: number;
}

export interface GridResult {
  key: "tian" | "ren" | "di" | "wai" | "zong";
  label: string;
  role: string;
  strokes: number;
  /** 81 數理用數（>81 則取餘） */
  number: number;
  element: FiveElement;
  luck: WugeLuckLabel;
  desc: string;
}

export interface NameologyResult {
  surname: string;
  givenName: string;
  fullName: string;
  isCompoundSurname: boolean;
  isSingleGiven: boolean;
  chars: CharStroke[];
  grids: GridResult[];
  /** 人格 + 總格是否偏凶（引導改名 CTA） */
  needsAttention: boolean;
}

export interface NameologyInput {
  surname: string;
  givenName: string;
}
