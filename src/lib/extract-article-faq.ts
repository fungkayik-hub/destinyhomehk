import { stripHtml } from "@/lib/seo";

export interface FaqItem {
  question: string;
  answer: string;
}

function cleanFaqText(text: string): string {
  return stripHtml(text).replace(/\s+/g, " ").trim();
}

/** 從學堂文章 HTML 抽出內嵌 FAQ（支援兩種寫法） */
export function extractFaqFromArticleHtml(html: string): FaqItem[] {
  const items: FaqItem[] = [];

  // 格局／風水文：<strong>Q：…</strong><br>A：…</p>
  const blockPattern =
    /<p><strong>Q[：:]\s*([^<]+?)<\/strong>\s*(?:<br\s*\/?>)?\s*A[：:]\s*([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = blockPattern.exec(html)) !== null) {
    const question = cleanFaqText(match[1]);
    const answer = cleanFaqText(match[2]);
    if (question && answer) items.push({ question, answer });
  }
  if (items.length > 0) return items;

  // 主星文：<strong>Q：… A：…</strong></p>
  const inlinePattern =
    /<p><strong>Q[：:]\s*(.+?)\s*A[：:]\s*(.+?)<\/strong>\s*<\/p>/gi;
  while ((match = inlinePattern.exec(html)) !== null) {
    const question = cleanFaqText(match[1]);
    const answer = cleanFaqText(match[2]);
    if (question && answer) items.push({ question, answer });
  }

  return items;
}
