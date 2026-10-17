import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Upstash env vars come in two spellings depending on how the store was
// connected (Upstash directly, or the Vercel Marketplace / KV naming).
let redis: Redis | null | undefined;
export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

const limiters = new Map<string, Ratelimit>();
export function limiter(name: string, tokens: number, window: `${number} ${"s" | "m" | "h" | "d"}`): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  const key = `${name}:${tokens}:${window}`;
  if (!limiters.has(key)) {
    limiters.set(key, new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(tokens, window), prefix: `alphie:rl:${name}` }));
  }
  return limiters.get(key)!;
}

export function clientId(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
}

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
