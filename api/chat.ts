import Anthropic from "@anthropic-ai/sdk";
import { babyReply } from "../src/lib/babyTalk.js";
import { tidy } from "./_lib/filter.js";
import { clientId, getRedis, json, limiter, readJson } from "./_lib/http.js";

const MODEL = "claude-haiku-5-5";
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

let client: Anthropic | null = null;
function anthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic({ maxRetries: 0, timeout: 15_000 });
  return client;
}

interface Body {
  messages?: Array<{ role?: string; content?: unknown }>;
}

function fallback(last: string, why: string): Response {
  return json({ reply: babyReply(last), source: "scripted", why });
}

export async function POST(req: Request): Promise<Response> {
  const body = await readJson<Body>(req);
  const history: Anthropic.MessageParam[] = (body?.messages ?? [])
    .slice(-MAX_TURNS * 2)
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role as "user" | "assistant", content: tidy(m.content, 400) }))
    .filter((m) => m.content.length > 0);

  // The API needs the conversation to start with a user turn and end with one.
  while (history.length && history[0].role !== "user") history.shift();
  const last = history.at(-1);
  if (!last || last.role !== "user") return json({ error: "Say something to Alphie first!" }, 400);
  const lastText = String(last.content);

  const api = anthropic();
  if (!api) return fallback(lastText, "no-key");

  const perVisitor = limiter("chat", 12, "1 h");
  if (perVisitor && !(await perVisitor.limit(clientId(req))).success) return fallback(lastText, "visitor-limit");

  const r = getRedis();
  if (r) {
    const dayKey = `alphie:chat:day:${new Date().toISOString().slice(0, 10)}`;
    const used = await r.incr(dayKey);
    if (used === 1) await r.expire(dayKey, 60 * 60 * 26);
    if (used > DAILY_CAP) return fallback(lastText, "daily-cap");
  }

  try {
    const res = await api.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: history,
    });
    if (res.stop_reason === "refusal") return fallback(lastText, "refusal");
    const reply = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join(" ")
      .trim();
    return reply ? json({ reply, source: "live" }) : fallback(lastText, "empty");
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return fallback(lastText, "rate-limited");
    if (err instanceof Anthropic.AuthenticationError) return fallback(lastText, "auth");
    if (err instanceof Anthropic.APIError) return fallback(lastText, `api-${err.status ?? "error"}`);
    return fallback(lastText, "network");
  }
}
