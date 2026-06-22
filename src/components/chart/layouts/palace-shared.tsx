import Link from "next/link";
import type { PalaceInfo, PalaceName } from "@/lib/ziwei";
import type { PalaceScore } from "@/lib/ai/types";
import PalaceScoreBadge from "../PalaceScoreBadge";

export function PalaceStars({ palace }: { palace: PalaceInfo }) {
  return (
    <ul className="space-y-0.5 mt-1">
      {palace.stars.filter((s) => s.type !== "minor").length > 0 ? (
        palace.stars
          .filter((s) => s.type !== "minor")
          .map((star) => (
            <li key={star.name} className="text-destiny-purple/80 text-sm">
              {star.name}
              {star.brightness && (
                <span className="text-destiny-gold text-xs ml-1">({star.brightness})</span>
              )}
            </li>
          ))
      ) : (
        <li className="text-destiny-purple/30 text-xs">無主星</li>
      )}
      {palace.stars.filter((s) => s.type === "minor").length > 0 && (
        <li className="text-destiny-purple/40 text-xs">
          {palace.stars
            .filter((s) => s.type === "minor")
            .map((s) => s.name)
            .join("、")}
        </li>
      )}
    </ul>
  );
}

export function PalaceTags({ palace }: { palace: PalaceInfo }) {
  if (!palace.isSoulPalace && !palace.isBodyPalace) return null;
  return (
    <div className="flex gap-1 mt-1">
      {palace.isSoulPalace && (
        <span className="text-[10px] bg-destiny-gold/25 text-destiny-gold px-1.5 py-0.5 rounded">
          命
        </span>
      )}
      {palace.isBodyPalace && (
        <span className="text-[10px] bg-destiny-red/10 text-destiny-red px-1.5 py-0.5 rounded">
          身
        </span>
      )}
    </div>
  );
}

export function PalaceCard({
  palace,
  rating,
  href,
  selected,
  className = "",
}: {
  palace: PalaceInfo;
  rating?: PalaceScore;
  href?: string;
  selected?: boolean;
  className?: string;
}) {
  const inner = (
    <div
      className={`bg-white rounded-xl border p-3 text-sm shadow-sm h-full transition-colors ${
        selected
          ? "border-destiny-purple ring-2 ring-destiny-purple/30 bg-destiny-purple/[0.03]"
          : palace.isSoulPalace
            ? "border-destiny-gold ring-1 ring-destiny-gold/40"
            : palace.isBodyPalace
              ? "border-destiny-red/30"
              : "border-destiny-purple/8"
      } ${href ? "hover:border-destiny-gold hover:shadow-md" : ""} ${className}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-bold text-destiny-purple text-sm">{palace.name}</h3>
          <span className="text-[11px] text-destiny-purple/45">
            {palace.heavenlyStem}
            {palace.earthlyBranch}
          </span>
          <PalaceTags palace={palace} />
        </div>
        {rating && <PalaceScoreBadge score={rating} />}
      </div>
      <PalaceStars palace={palace} />
      {href && !selected && (
        <p className="text-[10px] text-destiny-gold/80 mt-2">點擊睇 AI 分析 →</p>
      )}
      {selected && (
        <p className="text-[10px] text-destiny-purple/50 mt-2">↓ 分析在下方</p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

export interface PalaceLayoutProps {
  focusPalace: PalaceName;
  buildFocusHref: (palace: PalaceName) => string;
}
