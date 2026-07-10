import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, isAdminUsageConfigured } from "@/lib/usage/admin-auth";
import { getUsageStats } from "@/lib/usage/store";

export async function GET(request: NextRequest) {
  if (!isAdminUsageConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stats = await getUsageStats();
  return NextResponse.json(stats);
}
