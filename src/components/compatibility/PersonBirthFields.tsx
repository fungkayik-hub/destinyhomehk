import type { BirthInput } from "@/lib/ziwei";
import { getShichenLabel, hourMinuteToTimeIndex } from "@/lib/ziwei";

interface Props {
  prefix: "a" | "b";
  title: string;
  accentClass: string;
  input: BirthInput;
}

export default function PersonBirthFields({ prefix, title, accentClass, input }: Props) {
  const shichenLabel = getShichenLabel(hourMinuteToTimeIndex(input.hour, input.minute));
  const p = (name: string) => `${prefix}_${name}`;

  return (
    <fieldset className="border border-destiny-purple/15 rounded-xl p-4 sm:p-5 bg-white/60">
      <legend className={`font-display font-bold text-lg px-2 ${accentClass}`}>{title}</legend>

      <div className="grid sm:grid-cols-2 gap-3 mt-2">
        <label className="block sm:col-span-2">
          <span className="text-sm text-destiny-purple/70 mb-1 block">曆法</span>
          <select
            name={p("calendarType")}
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
            name={p("gender")}
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
            name={p("year")}
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
            name={p("month")}
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
            name={p("day")}
            type="number"
            min={1}
            max={31}
            required
            defaultValue={input.day}
            className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm text-destiny-purple/70 mb-1 block">出生時間</span>
          <div className="flex gap-2">
            <input
              name={p("hour")}
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
              name={p("minute")}
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
    </fieldset>
  );
}
