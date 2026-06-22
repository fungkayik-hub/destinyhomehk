import type { FaqItem } from "@/lib/faq-content";

interface Props {
  title?: string;
  items: readonly FaqItem[];
}

export default function FaqSection({
  title = "常見問題",
  items,
}: Props) {
  return (
    <section className="max-w-3xl mx-auto mt-12">
      <h2 className="font-display text-xl font-bold text-destiny-purple mb-4">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="card p-0 overflow-hidden group"
          >
            <summary className="cursor-pointer px-5 py-4 font-medium text-destiny-purple list-none flex justify-between items-center gap-2">
              <span>{item.question}</span>
              <span className="text-destiny-gold text-lg shrink-0 group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="px-5 pb-4 text-sm text-destiny-purple/75 leading-relaxed border-t border-destiny-purple/5 pt-3">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
