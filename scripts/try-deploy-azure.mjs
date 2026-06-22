/** 尝试用 API Key 创建 deployment（若失败需走 Portal） */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i < 0) continue;
  process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
const key = process.env.AZURE_OPENAI_API_KEY;
const name = process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o-mini";

const versions = ["2023-05-01", "2023-03-15-preview"];
for (const v of versions) {
  const url = `${endpoint}/openai/deployments/${name}?api-version=${v}`;
  console.log("PUT", url);
  const res = await fetch(url, {
    method: "PUT",
    headers: { "api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      sku: { name: "Standard", capacity: 1 },
    }),
  });
  console.log("Status:", res.status, (await res.text()).slice(0, 400));
}
