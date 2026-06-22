import { youtubeVideos } from "@/lib/site-config";

export default function YouTubeSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title mb-2">Sunny 笑住講</h2>
        <p className="text-center text-destiny-purple/60 mb-10 text-sm">
          預約時間表 · 玄學影片分享
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {youtubeVideos.map((video) => (
            <div key={video.id} className="card p-0 overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm text-destiny-purple leading-relaxed">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
