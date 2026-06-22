import { redirect } from "next/navigation";

/** 網上擇日已關閉 — 請 WhatsApp 預約師傅親自擇日 */
export default function DatePickerPage() {
  redirect("/booking?service=date");
}
