export interface GuanyinLot {
  number: number;
  grade: string;
  poem: string;
  explanation: string;
  aspects: string;
  advice: string;
}

export interface FortuneStickDraw {
  id: string;
  question: string;
  lotNumber: number;
  createdAt: string;
  stripeSessionId?: string;
  paidAt?: string;
  interpretationText?: string;
  interpretationProvider?: string;
}

export interface DrawResult {
  drawId: string;
  lot: GuanyinLot;
  teaser: string;
}

export interface CreatePurchaseResult {
  ok: boolean;
  draw?: FortuneStickDraw;
  error?: string;
}
