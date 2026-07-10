import { MUTAGEN_BADGE_CLASS, mutagenLabelShort } from "@/lib/ziwei/mutagen";

interface Props {
  mutagen?: string;
  className?: string;
}

export default function MutagenBadge({ mutagen, className = "" }: Props) {
  const label = mutagenLabelShort(mutagen);
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[1.1rem] px-1 py-px text-[10px] font-bold leading-none rounded border ${MUTAGEN_BADGE_CLASS[label]} ${className}`}
      title={`化${label}`}
    >
      {label}
    </span>
  );
}
