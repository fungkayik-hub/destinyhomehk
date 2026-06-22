import type { Metadata } from "next";
import Link from "next/link";
import SiteImage, { PageBanner } from "@/components/SiteImage";
import MediaHighlights from "@/components/MediaHighlights";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "關於師傅",
  description: siteConfig.description,
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        src={siteImages.sunnyStudio}
        title="有關師傅"
        subtitle={siteConfig.school}
      />
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {siteImages.gallery.map((src, i) => (
              <div
                key={src}
                className={`relative rounded-xl overflow-hidden shadow-md bg-destiny-cream ${
                  i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <SiteImage
                  src={src}
                  alt={`Sunny 師傅 ${i + 1}`}
                  width={600}
                  className="w-full h-full object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-destiny-gold font-medium mb-8">
            ⭐ {siteConfig.rating.score} · 過千客人真實好評
          </p>

          <div className="card space-y-5 text-destiny-purple/80 leading-relaxed">
            <p>
              大家好，我是一位紫微斗數玄學家，專注於用這門古老的智慧為人解惑、指引方向。
              朋友們以前總愛開玩笑，叫我「烏鴉嘴」，因為我說什麼往往都能「講咩中咩」，
              這份天賦讓我對命理產生濃厚的興趣。
            </p>
            <p>
              從 2015 年起，我開始以興趣為基礎，幫朋友和有緣人算命，慢慢地，這份熱情演變成我的事業。
              到了 2018 年，我在新蒲崗開設了第一個辦公室，正式踏上專業玄學家的道路。
              現時辦公室位於<strong className="text-destiny-purple"> {siteConfig.address}</strong>。
            </p>
            <p>
              紫微斗數源自中國古代，是一套結合天文、數學和哲學的命理系統，透過分析一個人的出生時間，
              推算命盤，揭示人生軌跡。我專研<strong className="text-destiny-purple">中洲派</strong>，
              強調星系組合與四化飛星的精準演繹，教導「知命改運」— 命盤雖定先天，後天努力可化凶為吉。
            </p>
            <p>
              已服務過千位客人，好評不斷。以淺白易明、貼地的方式講解命理，
              幫助你認識自己的優勢和挑戰，在人生的重要時刻做出更明智的選擇。
            </p>
            <p>
              除咗一對一解盤，Sunny 師傅亦曾<strong className="text-destiny-purple"> 上 ViuTV 節目</strong>分享玄學，
              為<strong className="text-destiny-purple"> VISA 等跨國企業</strong>提供風水顧問服務，
              以及為公司團隊主講玄學講座，將中洲派紫微帶到更多生活同職場場景。
            </p>
          </div>
        </div>

        <MediaHighlights />

        <div className="max-w-4xl mx-auto">
          <div className="card mt-6 bg-gradient-to-r from-destiny-purple/5 to-destiny-gold/5 flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0">
              <SiteImage
                src={siteImages.decorativePanel}
                alt="紫微斗數"
                width={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold mb-2">Sunny 師傅親自調校的排盤系統</h2>
              <p className="text-sm text-destiny-purple/70 mb-4">
                準確 + 易用！結合傳統中洲派安星法與現代技術，即時生成命盤供你參考。
                深度解盤仍需師傅親自定盤。
              </p>
              <Link href="/chart" className="btn-primary text-sm">試用即時排盤</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">
              WhatsApp 預約
            </a>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-center"
            >
              Instagram 好評
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
