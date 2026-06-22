import Link from "next/link";

const TOOLS = [
  {
    href: "/chart",
    title: "紫微即時排盤",
    desc: "輸入出生資料，十二宮 AI 分析",
    tag: "免費",
    keywords: "紫微排盤",
  },
  {
    href: "/compatibility",
    title: "夾桃花配對",
    desc: "雙人夫妻宮交叉睇配對分數",
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
    href: "/wedding-date",
    title: "結婚擇日",
    desc: "上頭、過大禮、出門吉時",
    tag: "HK$800",
    keywords: "結婚擇日香港",
  },
  {
    href: "/academy/2026-zodiac",
    title: "2026 生肖流年",
    desc: "十二生肖流年運勢詳批",
    tag: "學堂",
    keywords: "2026 運程",
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
