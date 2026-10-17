import { getRedis, json } from "./_lib/http.js";

const KEY = "alphie:hits";

// GET reads the hit counter; POST counts a new visit and returns the total.
export async function GET(): Promise<Response> {
  const r = getRedis();
  if (!r) return json({ error: "offline" }, 503);
  return json({ hits: (await r.get<number>(KEY)) ?? 0 });
}

export async function POST(): Promise<Response> {
  const r = getRedis();
  if (!r) return json({ error: "offline" }, 503);
  return json({ hits: await r.incr(KEY) });
}
