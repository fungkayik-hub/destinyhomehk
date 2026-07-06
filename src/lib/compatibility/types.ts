export type CompatibilityLabel =
  | "緣分深厚"
  | "相處順遂"
  | "尚可"
  | "要多溝通"
  | "要用心經營";

export interface CompatibilityFactors {
  spouseA: number;
  spouseB: number;
  crossAB: number;
  crossBA: number;
  mood: number;
}

export interface CompatibilityResult {
  score: number;
  label: CompatibilityLabel;
  summary: string;
  strengths: string[];
  tips: string[];
  chemistry: string;
  factors: CompatibilityFactors;
  provider: "openai" | "azure" | "fallback";
}
