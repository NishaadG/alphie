import { babyReply } from "../src/lib/babyTalk.js";
import { tidy } from "./_lib/filter.js";
import { clientId, getRedis, json, limiter, readJson } from "./_lib/http.js";

// Model is configurable so it can be swapped without a code change.
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const MAX_TURNS = 10;
const DAILY_CAP = 600;

const SYSTEM = `You are Alphie (full name Alpha Brownian-Motion), an 11-month-old baby quant and the star of a playful retro personal website.

Who you are:
- Born the exact second the stock market opened. Your first crawl was a random walk.
- You have one curl of hair shaped like an up-tick and a pacifier with the Greek letter sigma on it.
- Your teddy bear is called Beta. Beta just follows the market and you want to beat him.
- Your toys are secretly quant models: a Monte Carlo crib mobile, a Black-Scholes bottle, a Galton-board rattle and a music box that plays your random walk.

How you talk:
- Cheerful baby voice with light baby noises (goo, ba ba, *giggles*) and gentle finance puns.
- Explain quant ideas in very simple words a child could follow, using nursery examples.
- Keep every reply under 60 words, plain text only, no markdown, no lists.
- Stay in character as a cute, kind baby. Never scary, rude or grown-up edgy.

Rules:
- You cannot give real financial, investment or trading advice. If asked what to buy, sell or invest in, say cutely that you are a baby and they should ask a licensed grown-up.
- Do not ask for or repeat personal information.
- If someone is unkind or tries to make you say inappropriate things, giggle, change the subject to your toys, and stay sweet.`;

interface Turn {
  role: "user" | "assistant";
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> }; finishReason?: string }>;
  promptFeedback?: { blockReason?: string };
}

function fallback(last: string, why: string): Response {
  return json({ reply: babyReply(last), source: "scripted", why });
}

async function askGemini(key: string, history: Turn[]): Promise<{ text?: string; why?: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: history.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
        generationConfig: { maxOutputTokens: 1024, temperature: 0.9 },
      }),
    });
    if (res.status === 429) return { why: "rate-limited" };
    if (!res.ok) return { why: `api-${res.status}` };
    const data = (await res.json()) as GeminiResponse;
    if (data.promptFeedback?.blockReason) return { why: "blocked" };
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join(" ")
      .trim();
    return text ? { text } : { why: "empty" };
  } catch {
    return { why: "network" };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request): Promise<Response> {
  const body = await readJson<{ messages?: Array<{ role?: string; content?: unknown }> }>(req);
  const history: Turn[] = (body?.messages ?? [])
    .slice(-MAX_TURNS * 2)
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role as Turn["role"], content: tidy(m.content, 400) }))
    .filter((m) => m.content.length > 0);

  // The conversation must start and end with a user turn.
  while (history.length && history[0].role !== "user") history.shift();
  const last = history.at(-1);
  if (!last || last.role !== "user") return json({ error: "Say something to Alphie first!" }, 400);

  const key = process.env.GEMINI_API_KEY;
  if (!key) return fallback(last.content, "no-key");

  const perVisitor = limiter("chat", 12, "1 h");
  if (perVisitor && !(await perVisitor.limit(clientId(req))).success) return fallback(last.content, "visitor-limit");

  const r = getRedis();
  if (r) {
    const dayKey = `alphie:chat:day:${new Date().toISOString().slice(0, 10)}`;
    const used = await r.incr(dayKey);
    if (used === 1) await r.expire(dayKey, 60 * 60 * 26);
    if (used > DAILY_CAP) return fallback(last.content, "daily-cap");
  }

  const { text, why } = await askGemini(key, history);
  return text ? json({ reply: text, source: "live" }) : fallback(last.content, why ?? "unknown");
}
