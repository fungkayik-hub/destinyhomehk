import type { DailyAlmanac } from "@/lib/daily-almanac/types";
import { siteConfig } from "@/lib/site-config";
import SiteImage from "@/components/SiteImage";
import { siteImages } from "@/lib/site-images";

interface Props {
  data: DailyAlmanac;
}

const STATUS_STYLE = {
  highlight: "bg-destiny-gold/20 text-destiny-purple border-destiny-gold/40",
  stable: "bg-white/80 text-destiny-purple/80 border-destiny-purple/10",
  caution: "bg-destiny-red/10 text-destiny-red border-destiny-red/20",
};

export default function DailyPoster({ data }: Props) {
  const highlights = data.zodiacs.filter((z) => z.status === "highlight").slice(0, 4);

  return (
    <div
      id="daily-poster"
      className="w-full max-w-[540px] mx-auto bg-gradient-to-b from-[#1a2744] via-[#243052] to-[#1a2744] text-white rounded-2xl overflow-hidden shadow-2xl border border-destiny-gold/30"
    >
      <div className="px-5 pt-5 pb-3 text-center border-b border-white/10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SiteImage
            src={siteImages.logo}
            alt={siteConfig.name}
            width={40}
            className="rounded-full w-10 h-10 object-cover"
          />
          <span className="font-display text-lg text-destiny-gold">Destiny Home</span>
        </div>
        <h2 className="font-display text-xl font-bold text-destiny-gold-light">
          每日流日吉凶預報
        </h2>
        <p className="text-sm mt-2 text-white/90">
          {data.solarLabel}（{data.weekday}）
        </p>
        <p className="text-xs mt-1 text-white/70">
          {data.ganzhi.year}年 {data.ganzhi.month}月 {data.ganzhi.day}日
        </p>
        <p className="text-xs text-destiny-gold/90 mt-1">（{data.lunarLabel}）</p>
      </div>

      <div className="px-5 py-4 bg-destiny-gold/10 border-b border-destiny-gold/20">
        <p className="text-sm font-bold text-destiny-gold-light leading-snug">{data.headline}</p>
        <p className="text-xs text-white/75 mt-2">{data.specialTip}</p>
      </div>

      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-xs text-destiny-gold mb-1">師傅今日點撥</p>
        <p className="text-sm leading-relaxed text-white/90">{data.masterTip}</p>
        <p className="text-xs text-white/50 mt-2">
          黃道十二神：{data.tianShen}（{data.tianShenLuck}）· {data.chong} · {data.sha}
        </p>
      </div>

      <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-white/10 text-sm">
        <div>
          <p className="text-destiny-green text-xs font-medium mb-1">吉星</p>
          <p className="text-white/85 text-xs">{data.luckyStars.join("、") || "—"}</p>
        </div>
        <div>
          <p className="text-destiny-red text-xs font-medium mb-1">凶星</p>
          <p className="text-white/85 text-xs">{data.unluckyStars.join("、") || "—"}</p>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-destiny-green/15 rounded-lg p-3 border border-destiny-green/25">
            <p className="font-bold text-destiny-green mb-1">宜</p>
            <p className="text-white/85 leading-relaxed">{data.yi.join("、")}</p>
          </div>
          <div className="bg-destiny-red/15 rounded-lg p-3 border border-destiny-red/25">
            <p className="font-bold text-destiny-red mb-1">忌</p>
            <p className="text-white/85 leading-relaxed">{data.ji.join("、")}</p>
          </div>
        </div>
      </div>

      {highlights.length > 0 && (
        <div className="px-5 py-3 border-b border-white/10">
          <p className="text-xs text-destiny-gold mb-2">生肖留意</p>
          <div className="flex flex-wrap gap-2">
            {highlights.map((z) => (
              <span
                key={z.name}
                className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLE[z.status]}`}
              >
                {z.emoji} {z.name} {z.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 py-4 text-center">
        <p className="text-xs text-destiny-gold/90 leading-relaxed">{data.closing}</p>
        <p className="text-sm font-display text-white/90 mt-3">「{data.quote}」</p>
        <p className="text-[10px] text-white/40 mt-4">中洲派 · Sunny 師傅 · destinyhomehk.com/daily</p>
      </div>
    </div>
  );
}
