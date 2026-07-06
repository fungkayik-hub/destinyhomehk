import { readFileSync, unlinkSync } from "fs";
import { execSync } from "child_process";

execSync("npx vercel env pull .env.production.test --environment=production", {
  stdio: "inherit",
});
const l = readFileSync(".env.production.test", "utf8");
const notify = l.match(/BOOKING_NOTIFY_EMAIL="([^"]*)"/)?.[1];
const resend = l.match(/RESEND_API_KEY="([^"]*)"/)?.[1];
console.log("BOOKING_NOTIFY_EMAIL:", notify || "(empty)");
console.log("RESEND_API_KEY length:", resend?.length ?? 0);
unlinkSync(".env.production.test");
