import { redirect } from "next/navigation";

/** 網上擇日 — 轉去 SEO 結婚擇日專頁 */
export default function DatePickerPage() {
  redirect("/wedding-date");
}
