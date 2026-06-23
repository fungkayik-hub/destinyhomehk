import Link from "next/link";
import type { DailyAlmanac } from "@/lib/daily-almanac/types";
import DailyPoster from "@/components/daily/DailyPoster";
import DailyShareTools from "@/components/daily/DailyShareTools";
import FaqSection from "@/components/FaqSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { FaqItem } from "@/lib/faq-content";

interface Props {
  data: DailyAlmanac;
  faq: readonly FaqItem[];
  showBreadcrumb?: boolean;
}

export default function DailyPageContent({ data, faq, showBreadcrumb = false }: Props) {
  return (
    <div className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {showBreadcrumb && (
          <Breadcrumbs
            items={[
              { name: "首頁", href: "/" },
              { name: "每日流日", href: "/daily" },
              { name: data.solarLabel, href: `/daily/${data.date}` },
            ]}
          />
        )}

        <form method="GET" action="/daily" className="card flex flex-wrap items-end gap-4 mb-8">
          <label className="block flex-1 min-w-[200px]">
            <span className="text-sm text-destiny-purple/70 mb-1 block">選擇日期</span>
            <input
              type="date"
              name="date"
              defaultValue={data.date}
              className="w-full border border-destiny-purple/20 rounded-lg px-3 py-2"
            />
          </label>
          <button type="submit" className="btn-primary">
            查看流日
          </button>
        </form>
        <p className="text-xs text-destiny-purple/50 mb-6">
          「今日」以香港時間（HKT）為準。干支、宜忌、神煞來自傳統曆法；師傅解讀僅供參考。個人運程請
          <Link href="/chart" className="text-destiny-gold hover:underline mx-1">
            排盤
          </Link>
          或預約全批。
        </p>
      </div>

      <DailyShareTools data={data} />
      <DailyPoster data={data} />

      <div className="max-w-3xl mx-auto mt-8 text-center">
        <p className="text-sm text-destiny-purple/60 mb-4">
          下載 Story 圖或複製文案 · 每日 00:01（香港時間）自動更新
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/chart" className="text-destiny-gold hover:underline">
            免費排盤
          </Link>
          <span className="text-destiny-purple/30">·</span>
          <Link href="/compatibility" className="text-destiny-gold hover:underline">
            夾桃花
          </Link>
          <span className="text-destiny-purple/30">·</span>
          <Link href="/wedding-date" className="text-destiny-gold hover:underline">
            結婚擇日
          </Link>
          <span className="text-destiny-purple/30">·</span>
          <Link href="/academy/daily-insights" className="text-destiny-gold hover:underline">
            流日文章
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-10">
        <FaqSection items={faq} />
      </div>
    </div>
  );
}
