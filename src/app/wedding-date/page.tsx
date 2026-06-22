import Link from "next/link";
import { PageBanner } from "@/components/SiteImage";
import FaqSection from "@/components/FaqSection";
import { faqJsonLd } from "@/components/JsonLd";
import { FAQ_BY_PAGE } from "@/lib/faq-content";
import { buildPageMetadata } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";
import { whatsappDatePickerUrl } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "結婚擇日香港 — 上頭吉時",
  description:
    "香港結婚擇日服務 — Sunny 師傅按雙方八字擇上頭、過大禮、出門、入門吉時。灣仔 Destiny Home，HK$800，WhatsApp 預約。",
  path: "/wedding-date",
  image: siteImages.services.datePicker,
  keywords: [
    "結婚擇日香港",
    "上頭吉時",
    "過大禮擇日",
    "出門吉時",
    "入門擇日",
    "嫁娶擇日",
    "香港擇日師傅",
  ],
});

const STEPS = [
  { title: "WhatsApp 預約", desc: "提供雙方出生年月日時同擬辦婚期月份。" },
  { title: "師傅親自擇日", desc: "按中洲派紫微同八字，避開冲煞，揀最合適吉日吉時。" },
  { title: "收到吉時表", desc: "清楚列出上頭、過大禮、出門、入門等時段建議。" },
];

const SERVICES = [
  "上頭（擺床）吉時",
  "過大禮日期",
  "出門、入門吉時",
  "註冊及宴會日子參考",
  "入伙擇日（另議）",
];

export default function WeddingDatePage() {
  const faq = FAQ_BY_PAGE.wedding;
  const faqLd = faqJsonLd(faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PageBanner
        src={siteImages.services.datePicker}
        title="結婚擇日香港"
        subtitle="上頭 · 過大禮 · 出門 · 入門吉時"
        overlay="subtle"
      />
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-destiny-purple/80 leading-relaxed mb-8">
            結婚係人生大事，擇日唔可以只求通勝寫「宜嫁娶」。Sunny 師傅會按
            <strong> 新郎新娘雙方生辰八字</strong>，配合大限流年，為你揀最貼身嘅吉日吉時。
            工作室位於灣仔駱克道，服務過千香港新人。
          </p>

          <div className="card bg-destiny-gold/10 border-destiny-gold/30 mb-8 text-center">
            <p className="text-2xl font-display font-bold text-destiny-purple mb-1">HK$800</p>
            <p className="text-sm text-destiny-purple/70 mb-4">擇日及吉時 · 需時 15–30 分鐘</p>
            <a
              href={whatsappDatePickerUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              WhatsApp 預約擇日
            </a>
          </div>

          <h2 className="font-display text-xl font-bold mb-4">擇日流程</h2>
          <ol className="space-y-4 mb-10">
            {STEPS.map((step, i) => (
              <li key={step.title} className="card flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destiny-gold text-destiny-purple font-bold text-sm">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-destiny-purple">{step.title}</p>
                  <p className="text-sm text-destiny-purple/70 mt-1">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="font-display text-xl font-bold mb-4">可擇項目</h2>
          <ul className="grid sm:grid-cols-2 gap-2 mb-10">
            {SERVICES.map((s) => (
              <li key={s} className="flex gap-2 text-sm text-destiny-purple/80">
                <span className="text-destiny-gold">✦</span>
                {s}
              </li>
            ))}
          </ul>

          <div className="card bg-destiny-purple/5 mb-8">
            <h2 className="font-display text-lg font-bold mb-2">通勝 vs 師傅擇日</h2>
            <p className="text-sm text-destiny-purple/75 leading-relaxed">
              通勝只列當日通用宜忌，唔會理你個人八字同雙方是否相冲。師傅擇日會睇你哋命盤、流年同實際行程，
              避開对新人不利嘅日子，令你安心步入礼堂。
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm mb-4">
            <Link href="/daily" className="text-destiny-gold hover:underline">
              每日流日黃曆
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/compatibility" className="text-destiny-gold hover:underline">
              夾桃花配對
            </Link>
            <span className="text-destiny-purple/30">·</span>
            <Link href="/booking" className="text-destiny-gold hover:underline">
              收費詳情
            </Link>
          </div>
        </div>

        <FaqSection items={faq} />
      </div>
    </>
  );
}
