import SiteImage from "@/components/SiteImage";
import { siteImages } from "@/lib/site-images";

const personalities = [
  {
    color: "green",
    label: "綠色傳播者",
    percent: 60,
    description: "社會的橋梁與連結者，擅長建立關係網絡，對認可有強烈需求。",
    domain: "傳播 / 教育",
    bg: "bg-destiny-green",
    text: "text-destiny-green",
    image: siteImages.tricolor[1],
  },
  {
    color: "red",
    label: "紅色開創者",
    percent: 30,
    description: "行動力強，敢於冒險開創，適合領導與決策角色。",
    domain: "管理 / 創業",
    bg: "bg-destiny-red",
    text: "text-destiny-red",
    image: siteImages.tricolor[0],
  },
  {
    color: "blue",
    label: "藍色分析者",
    percent: 10,
    description: "邏輯縝密，善於分析與規劃，追求精準與深度。",
    domain: "研究 / 技術",
    bg: "bg-destiny-blue",
    text: "text-destiny-blue",
    image: siteImages.tricolor[2],
  },
];

export default function PersonalityChart() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-destiny-cream/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title mb-2">三色人格統計</h2>
        <p className="text-center text-destiny-purple/70 mb-10">
          你命中屬哪一類 · 基於萬人命盤驗證
        </p>

        <div className="flex h-4 rounded-full overflow-hidden mb-10 shadow-inner">
          <div className="bg-destiny-green" style={{ width: "60%" }} />
          <div className="bg-destiny-red" style={{ width: "30%" }} />
          <div className="bg-destiny-blue" style={{ width: "10%" }} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {personalities.map((p) => (
            <div key={p.color} className="card text-center p-0 overflow-hidden">
              <div className="relative h-40 bg-destiny-cream">
                <SiteImage
                  src={p.image}
                  alt={p.label}
                  width={400}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${p.bg}`} />
              </div>
              <div className="p-5">
                <div className={`w-12 h-12 rounded-full ${p.bg} mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold -mt-8 relative ring-4 ring-white shadow`}>
                  {p.percent}%
                </div>
                <h3 className={`font-display text-lg font-bold ${p.text} mb-2`}>{p.label}</h3>
                <p className="text-sm text-destiny-purple/70 mb-3">{p.description}</p>
                <span className="text-xs bg-destiny-cream px-3 py-1 rounded-full">{p.domain}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
