"use client";

interface Props {
  active: boolean;
}

export default function ShakeLotAnimation({ active }: Props) {
  return (
    <div className="flex flex-col items-center py-8" aria-hidden={!active}>
      <div
        className={`relative w-28 h-40 sm:w-32 sm:h-44 ${active ? "animate-stick-shake" : ""}`}
      >
        <div className="absolute inset-x-0 bottom-0 h-[72%] rounded-b-3xl rounded-t-lg bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-2 border-amber-950/40 shadow-lg">
          <div className="absolute inset-x-3 top-3 h-2 rounded-full bg-amber-600/50" />
          <div className="absolute inset-x-4 top-8 bottom-6 flex flex-col justify-center gap-1.5 px-1">
            {["觀", "音", "靈", "籤"].map((ch) => (
              <span
                key={ch}
                className="text-center text-amber-100/90 font-display text-sm tracking-widest"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-2 top-0 h-[30%] rounded-t-2xl bg-gradient-to-b from-red-800 to-red-950 border-2 border-red-950/50 shadow-md" />
        {active && (
          <>
            <span className="absolute -left-6 top-1/3 text-xl opacity-60 animate-pulse">✨</span>
            <span className="absolute -right-5 top-1/4 text-lg opacity-50 animate-pulse delay-150">🎋</span>
          </>
        )}
      </div>
      {active && (
        <p className="mt-6 text-sm text-destiny-purple/60 animate-pulse">籤筒搖動中…</p>
      )}
    </div>
  );
}
