/** 测试 Azure 连接 — 不显示 Key：node scripts/test-azure-ai.mjs */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

function loadEnv() {
  try {
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim();
      process.env[k] = v;
    }
  } catch {
    console.error("找不到 .env.local");
    process.exit(1);
  }
}

loadEnv();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
const key = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o-mini";

if (!endpoint || !key || endpoint.includes("粘贴") || key.includes("粘贴")) {
  console.error("❌ .env.local 仍是占位文字，请贴真实的 Endpoint 和 API key");
  process.exit(1);
}

console.log("Endpoint:", endpoint);
console.log("Deployment:", deployment);
console.log("Key 长度:", key.length, "字符（不会显示 Key 内容）");

const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-08-01-preview`;

const res = await fetch(url, {
  method: "POST",
  headers: { "api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "用一句粤语说：连接成功" }],
    max_tokens: 50,
  }),
});

const body = await res.text();
if (res.ok) {
  const data = JSON.parse(body);
  console.log("✅ Azure AI 连接成功！");
  console.log("回复:", data.choices?.[0]?.message?.content);
} else {
  console.error("❌ 失败 HTTP", res.status);
  console.error(body.slice(0, 500));
}
