import { NextRequest, NextResponse } from "next/server";
import { generateChart } from "@/lib/ziwei/iztro-adapter";
import type { BirthInput } from "@/lib/ziwei/types";

export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as BirthInput;
    const chart = generateChart(input);
    return NextResponse.json(chart);
  } catch (error) {
    console.error("Chart generation failed:", error);
    return NextResponse.json(
      { error: "排盤失敗，請檢查輸入資料" },
      { status: 500 },
    );
  }
}
