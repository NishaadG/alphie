import { isClean, tidy } from "./_lib/filter.js";
import { clientId, getRedis, json, limiter, readJson } from "./_lib/http.js";

const KEY = "alphie:guestbook";
const KEEP = 200;
const MOODS = ["🍼", "🧸", "🐂", "🐻", "⭐", "🦆", "🎈", "💖"];

export interface Entry {
  name: string;
  message: string;
  mood: string;
  at: number;
}

export async function GET(): Promise<Response> {
  const r = getRedis();
  if (!r) return json({ error: "offline" }, 503);
  const entries = await r.lrange<Entry>(KEY, 0, 49);
  return json({ entries });
}

export async function POST(req: Request): Promise<Response> {
  const r = getRedis();
  if (!r) return json({ error: "offline" }, 503);

  const rl = limiter("guestbook", 3, "10 m");
  if (rl && !(await rl.limit(clientId(req))).success) {
    return json({ error: "Whoa, slow down! Alphie can only read 3 notes every 10 minutes." }, 429);
  }

  const body = await readJson<Partial<Entry>>(req);
  const name = tidy(body?.name, 24) || "Anonymous Baby";
  const message = tidy(body?.message, 200);
  const mood = MOODS.includes(String(body?.mood)) ? String(body!.mood) : "🍼";

  if (message.length < 2) return json({ error: "Write a little something first!" }, 400);
  if (!isClean(name) || !isClean(message)) {
    return json({ error: "Alphie's mum says no links or rude words in the guestbook." }, 400);
  }

  const entry: Entry = { name, message, mood, at: Date.now() };
  await r.lpush(KEY, entry);
  await r.ltrim(KEY, 0, KEEP - 1);
  return json({ entry }, 201);
}
