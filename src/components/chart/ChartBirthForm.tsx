import type { BirthInput } from "@/lib/ziwei";
import { getShichenLabel, hourMinuteToTimeIndex } from "@/lib/ziwei";

interface Props {
  input: BirthInput;
  error?: string | null;
}

/** 服务端表单 — 不依赖浏览器 JavaScript */
export default function ChartBirthForm({ input, error }: Props) {
  const shichenLabel = getShichenLabel(hourMinuteToTimeIndex(input.hour, input.minute));

  return (
    <div className="max-w-5xl mx-auto">
      <form method="GET" action="/chart" className="card mb-8">
        <h2 className="font-display text-xl font-bold mb-6">輸入出生資料</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">曆法</span>
            <select
              name="calendarType"
              defaultValue={input.calendarType}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2 bg-white"
            >
              <option value="solar">陽曆（西曆）</option>
              <option value="lunar">農曆</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">性別</span>
            <select
              name="gender"
              defaultValue={input.gender}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2 bg-white"
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">出生年份</span>
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
            <span className="text-sm text-destiny-purple/70 mb-1 block">月份</span>
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
            <span className="text-sm text-destiny-purple/70 mb-1 block">日期</span>
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

          <label className="block">
            <span className="text-sm text-destiny-purple/70 mb-1 block">出生時間</span>
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
          即時起盤
        </button>

        <p className="text-xs text-destiny-purple/45 mt-3">
          首次起盤約需 10–20 秒；換排版唔使再等。
        </p>

        {error && <p className="text-sm text-destiny-red mt-4">{error}</p>}

        <p className="text-xs text-destiny-purple/50 mt-4">
          採用《紫微斗數全書》三合派安星法。如與師傅定盤有出入，請以師傅版本為準。
        </p>
      </form>
    </div>
  );
}
