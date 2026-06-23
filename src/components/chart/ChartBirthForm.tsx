import type { BirthInput } from "@/lib/ziwei";
import { getShichenLabel, hourMinuteToTimeIndex } from "@/lib/ziwei";
import BirthPlaceFields from "./BirthPlaceFields";

interface Props {
  input: BirthInput;
  error?: string | null;
  locale?: "zh" | "en";
  action?: string;
}

/** 服务端表单 — 不依赖浏览器 JavaScript */
export default function ChartBirthForm({ input, error, locale = "zh", action = "/chart" }: Props) {
  const shichenLabel = getShichenLabel(hourMinuteToTimeIndex(input.hour, input.minute));
  const isEn = locale === "en";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-2.5 py-1 rounded-full bg-destiny-green/15 text-destiny-purple border border-destiny-green/30">
          {isEn ? "Free forever" : "永久免費"}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-destiny-gold/15 text-destiny-purple border border-destiny-gold/30">
          {isEn ? "Unlimited charts" : "無限次排盤"}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-destiny-purple/10 text-destiny-purple border border-destiny-purple/15">
          {isEn ? "True solar time" : "真太陽時校正"}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white text-destiny-purple/70 border border-destiny-purple/10">
          {isEn ? "No sign-up" : "無需註冊"}
        </span>
      </div>

      <form method="GET" action={action} className="card mb-8">
        <h2 className="font-display text-xl font-bold mb-6">
          {isEn ? "Birth details" : "輸入出生資料"}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">
              {isEn ? "Calendar" : "曆法"}
            </span>
            <select
              name="calendarType"
              defaultValue={input.calendarType}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2 bg-white"
            >
              <option value="solar">{isEn ? "Gregorian" : "陽曆（西曆）"}</option>
              <option value="lunar">{isEn ? "Lunar" : "農曆"}</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">
              {isEn ? "Gender" : "性別"}
            </span>
            <select
              name="gender"
              defaultValue={input.gender}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2 bg-white"
            >
              <option value="male">{isEn ? "Male" : "男"}</option>
              <option value="female">{isEn ? "Female" : "女"}</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">
              {isEn ? "Birth year" : "出生年份"}
            </span>
            <input
              name="year"
              type="number"
              min={1900}
              max={2100}
              required
              defaultValue={input.year}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">
              {isEn ? "Month" : "月份"}
            </span>
            <input
              name="month"
              type="number"
              min={1}
              max={12}
              required
              defaultValue={input.month}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">
              {isEn ? "Day" : "日期"}
            </span>
            <input
              name="day"
              type="number"
              min={1}
              max={31}
              required
              defaultValue={input.day}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
          </label>

          <BirthPlaceFields input={input} locale={locale} />

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">
              {isEn ? "Birth time" : "出生時間"}
            </span>
            <div className="flex gap-2">
              <input
                name="hour"
                type="number"
                min={0}
                max={23}
                required
                placeholder="時"
                defaultValue={input.hour}
                className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
              />
              <span className="self-center text-destiny-purple/50">:</span>
              <input
                name="minute"
                type="number"
                min={0}
                max={59}
                required
                placeholder="分"
                defaultValue={input.minute}
                className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
              />
            </div>
            <span className="text-xs text-destiny-gold mt-1 block">→ {shichenLabel}</span>
          </label>
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          {isEn ? "Generate chart" : "即時起盤"}
        </button>

        <p className="text-xs text-destiny-purple/45 mt-3">
          {isEn
            ? "First AI analysis may take 10–20s; layout changes are instant. Zhong Zhou school method."
            : "首次起盤約需 10–20 秒（AI 分析）；換排版唔使再等。採用《紫微斗數全書》三合派安星法。"}
        </p>

        {error && <p className="text-sm text-destiny-red mt-4">{error}</p>}

        <p className="text-xs text-destiny-purple/50 mt-4">
          {isEn
            ? "True solar time adjusts clock time by birth longitude. If Master Sunny’s chart differs, his version is final."
            : "真太陽時會按出生地經度校正時辰。如與師傅定盤有出入，請以師傅版本為準。"}
        </p>
      </form>
    </div>
  );
}
