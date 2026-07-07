import Link from "next/link";

const TOOLS = [
  {
    href: "/qiu-qian",
    title: "一事一問(觀音100靈籤)",
    desc: "一事一問 · 免費睇籤詩 · HK$38 AI 解籤",
    tag: "新",
    keywords: "觀音靈籤、求籤",
  },
  {
    href: "/chart",
    title: "紫微即時排盤",
    desc: "輸入出生資料，十二宮小徒弟贈言",
    tag: "免費",
    keywords: "紫微排盤",
  },
  {
    href: "/compatibility",
    title: "姻緣探測器",
    desc: "雙人夫妻宮交叉探測緣分指數",
    tag: "免費",
    keywords: "合婚、配對",
  },
  {
    href: "/daily",
    title: "每日流日",
    desc: "黃曆宜忌、建除、生肖提示",
    tag: "每日更新",
    keywords: "黃曆、流日",
  },
  {
    href: "/date-picker",
    title: "結婚吉日篩選",
    desc: "10 種儀式 · 黃曆宜忌 + 避冲生肖",
    tag: "免費",
    keywords: "結婚吉日、擇日",
  },
  {
    href: "/wedding-date",
    title: "結婚擇日",
    desc: "上頭、過大禮、出門吉時",
    tag: "HK$800",
    keywords: "結婚擇日香港",
  },
  {
    href: "/academy/name-numerology",
    title: "姓名學總格筆劃",
    desc: "五格剖象 1–81 吉凶對照表",
    tag: "學堂",
    keywords: "姓名學總格",
  },
  {
    href: "/academy/ding-pan",
    title: "天地人盤定盤",
    desc: "時辰唔準？中洲派三盤定盤方法",
    tag: "學堂",
    keywords: "天地人盤",
  },
  {
    href: "/academy/2026-zodiac",
    title: "2026 生肖流年",
    desc: "十二生肖流年運勢詳批",
    tag: "學堂",
    keywords: "2026 運程",
  },
  {
    href: "/academy/instagram",
    title: "Sunny IG 精選",
    desc: "Instagram 最新命理分享",
    tag: "學堂",
    keywords: "IG、命理",
  },
  {
    href: "/academy/stars",
    title: "十四主星",
    desc: "紫微十四主星逐一解析",
    tag: "學堂",
    keywords: "七殺星、天同星",
  },
];

export default function SeoToolsGrid() {
  return (
    <section className="py-14 px-4 bg-destiny-cream/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title mb-3">命理工具及專題</h2>
        <p className="text-center text-sm text-destiny-purple/60 mb-8 max-w-xl mx-auto">
          免費排盤、配對、每日黃曆 — 配合學堂文章，幫你了解自己同擇日參考
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card hover:shadow-lg hover:border-destiny-gold/30 transition-all group"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-display font-bold text-destiny-purple group-hover:text-destiny-gold transition-colors">
                  {tool.title}
                </h3>
                <span className="text-[10px] shrink-0 px-2 py-0.5 rounded-full bg-destiny-gold/20 text-destiny-purple">
                  {tool.tag}
                </span>
              </div>
              <p className="text-sm text-destiny-purple/70">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
