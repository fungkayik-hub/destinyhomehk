"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BirthInput } from "@/lib/ziwei/types";
import { chartPathFromInput } from "@/lib/chart-url";

const STORAGE_KEY = "destinyhomehk_chart_history";
const MAX_ITEMS = 8;

interface SavedChart {
  savedAt: string;
  label: string;
  input: BirthInput;
}

interface Props {
  current?: BirthInput;
  locale?: "zh" | "en";
}

function loadHistory(): SavedChart[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedChart[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function inputLabel(input: BirthInput): string {
  return `${input.year}-${String(input.month).padStart(2, "0")}-${String(input.day).padStart(2, "0")} ${String(input.hour).padStart(2, "0")}:${String(input.minute).padStart(2, "0")}`;
}

function sameInput(a: BirthInput, b: BirthInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function ChartSavedHistory({ current, locale = "zh" }: Props) {
  const [items, setItems] = useState<SavedChart[]>([]);

  useEffect(() => {
    if (!current) {
      setItems(loadHistory());
      return;
    }

    const entry: SavedChart = {
      savedAt: new Date().toISOString(),
      label: inputLabel(current),
      input: current,
    };

    const next = [entry, ...loadHistory().filter((h) => !sameInput(h.input, current))].slice(
      0,
      MAX_ITEMS,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setItems(next);
  }, [current]);

  if (items.length === 0) return null;

  return (
    <div className="card mb-6">
      <h3 className="font-display font-bold text-sm text-destiny-purple mb-3">
        {locale === "en" ? "Saved charts (this device)" : "已儲存命盤（本機，無需註冊）"}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={`${item.label}-${item.savedAt}`}>
            <Link
              href={chartPathFromInput(item.input, locale)}
              className="text-sm text-destiny-gold hover:underline"
            >
              {item.label}
              {item.input.birthPlaceId && item.input.birthPlaceId !== "hong-kong"
                ? ` · ${item.input.birthPlaceId}`
                : ""}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
