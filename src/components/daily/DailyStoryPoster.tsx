import type { DailyAlmanac } from "@/lib/daily-almanac/types";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

interface Props {
  data: DailyAlmanac;
}

const STATUS_STYLE = {
  highlight: "bg-destiny-gold/25 text-destiny-purple border-destiny-gold/50",
  stable: "bg-white/10 text-white/80 border-white/20",
  caution: "bg-destiny-red/15 text-destiny-red border-destiny-red/30",
};

/** 9:16 IG Story 版式 — 用於下載 PNG */
export default function DailyStoryPoster({ data }: Props) {
  const highlights = data.zodiacs.filter((z) => z.status === "highlight").slice(0, 4);

  return (
    <div
      id="daily-story-poster"
      className="w-[1080px] h-[1920px] bg-gradient-to-b from-[#141e36] via-[#1f2d4d] to-[#141e36] text-white flex flex-col"
      style={{ fontFamily: "Noto Sans TC, sans-serif" }}
    >
      <div className="px-16 pt-20 pb-10 text-center border-b border-white/10">
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteImages.logo}
            alt=""
            width={80}
            height={80}
            className="rounded-full w-20 h-20 object-cover"
          />
          <span className="font-display text-4xl text-destiny-gold">Destiny Home</span>
        </div>
        <h2 className="font-display text-5xl font-bold text-destiny-gold-light mb-4">
          每日流日吉凶預報
        </h2>
        <p className="text-3xl text-white/90">
          {data.solarLabel}（{data.weekday}）
        </p>
        <p className="text-2xl mt-3 text-white/70">
          {data.ganzhi.year}年 {data.ganzhi.month}月 {data.ganzhi.day}日
        </p>
        <p className="text-2xl text-destiny-gold/90 mt-2">（{data.lunarLabel}）</p>
      </div>

      <div className="px-16 py-10 bg-destiny-gold/15 border-b border-destiny-gold/25">
        <p className="text-3xl font-bold text-destiny-gold-light leading-snug">{data.headline}</p>
        <p className="text-2xl text-white/80 mt-4">{data.specialTip}</p>
      </div>

      <div className="px-16 py-10 border-b border-white/10 flex-1">
        <p className="text-2xl text-destiny-gold mb-3">師傅今日點撥</p>
        <p className="text-2xl leading-relaxed text-white/90">{data.masterTip}</p>
        <p className="text-xl text-white/50 mt-6">
          黃道十二神：{data.tianShen}（{data.tianShenLuck}）· {data.chong}
        </p>

        <div className="grid grid-cols-2 gap-6 mt-10 text-2xl">
          <div className="bg-destiny-green/20 rounded-2xl p-6 border border-destiny-green/30">
            <p className="font-bold text-destiny-green mb-2">宜</p>
            <p className="text-white/90 leading-relaxed">{data.yi.join("、")}</p>
          </div>
          <div className="bg-destiny-red/20 rounded-2xl p-6 border border-destiny-red/30">
            <p className="font-bold text-destiny-red mb-2">忌</p>
            <p className="text-white/90 leading-relaxed">{data.ji.join("、")}</p>
          </div>
        </div>

        {highlights.length > 0 && (
          <div className="mt-10">
            <p className="text-2xl text-destiny-gold mb-4">生肖留意</p>
            <div className="flex flex-wrap gap-3">
              {highlights.map((z) => (
                <span
                  key={z.name}
                  className={`text-xl px-4 py-2 rounded-full border ${STATUS_STYLE[z.status]}`}
                >
                  {z.emoji} {z.name} {z.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-16 py-12 text-center border-t border-white/10">
        <p className="text-2xl text-destiny-gold/90">{data.closing}</p>
        <p className="text-3xl font-display text-white/90 mt-6">「{data.quote}」</p>
        <p className="text-xl text-white/40 mt-8">
          中洲派 · {siteConfig.name} · destinyhomehk.com/daily
        </p>
      </div>
    </div>
  );
}
