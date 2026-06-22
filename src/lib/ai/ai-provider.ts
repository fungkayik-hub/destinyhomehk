/** AI 供應商：azure = Microsoft Azure OpenAI（Copilot 同款 GPT 引擎） */

export type AiProvider = "azure" | "openai";

export function getAiProvider(): AiProvider {
  if (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY) {
    return "azure";
  }
  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }
  throw new Error("NO_API_KEY");
}

export function hasAiConfigured(): boolean {
  return Boolean(
    (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY) ||
      process.env.OPENAI_API_KEY,
  );
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** 统一调用 OpenAI 或 Microsoft Azure OpenAI */
export async function chatComplete(
  messages: ChatMessage[],
  maxTokens: number,
): Promise<{ text: string; provider: AiProvider }> {
  const provider = getAiProvider();

  if (provider === "azure") {
    return { text: await callAzureOpenAI(messages, maxTokens), provider: "azure" };
  }
  return { text: await callOpenAI(messages, maxTokens), provider: "openai" };
}

async function callAzureOpenAI(
  messages: ChatMessage[],
  maxTokens: number,
): Promise<string> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/$/, "");
  const apiKey = process.env.AZURE_OPENAI_API_KEY!;
  const deployment =
    process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o-mini";
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION ?? "2024-08-01-preview";

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure OpenAI error: ${res.status} ${err}`);
  }

  return parseChatResponse(await res.json());
}

async function callOpenAI(
  messages: ChatMessage[],
  maxTokens: number,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY!;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  return parseChatResponse(await res.json());
}

function parseChatResponse(data: unknown): string {
  const d = data as { choices?: { message?: { content?: string } }[] };
  const text = d.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty AI response");
  return text;
}
