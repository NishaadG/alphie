import { gaussian, type Rng } from "./rng";

// Baby's First Trade: one fake stock (RATTLE), fake milk money, and Beta
// the teddy as the benchmark (he buys at the start and never sells).
// Alpha = your return minus Beta's return.

export interface Portfolio {
  cash: number;
  shares: number;
  price: number;
  history: number[];
  startPrice: number;
  startValue: number;
  trades: number;
  lastTick: number; // epoch ms
}

export const START_CASH = 1000;
export const HISTORY = 120;
const TICK_VOL = 0.012;
const MAX_CATCH_UP = 600;

export function newPortfolio(now: number, price = 100): Portfolio {
  return { cash: START_CASH, shares: 0, price, history: [price], startPrice: price, startValue: START_CASH, trades: 0, lastTick: now };
}

export function tick(p: Portfolio, drift: number, rng: Rng, now: number): Portfolio {
  const price = Math.max(0.5, p.price * Math.exp(drift - 0.5 * TICK_VOL * TICK_VOL + TICK_VOL * gaussian(rng)));
  return { ...p, price, history: [...p.history, price].slice(-HISTORY), lastTick: now };
}

// Fast-forward the market for the time the visitor was away (capped), so
// coming back shows that prices kept moving.
export function catchUp(p: Portfolio, now: number, rng: Rng, tickMs = 1000): { p: Portfolio; steps: number } {
  const steps = Math.min(MAX_CATCH_UP, Math.max(0, Math.floor((now - p.lastTick) / tickMs)));
  let out = p;
  for (let i = 0; i < steps; i++) out = tick(out, 0, rng, now);
  return { p: { ...out, lastTick: now }, steps };
}

export function trade(p: Portfolio, qty: number): Portfolio {
  if (qty > 0) {
    const n = Math.min(qty, Math.floor(p.cash / p.price));
    if (n <= 0) return p;
    return { ...p, cash: p.cash - n * p.price, shares: p.shares + n, trades: p.trades + 1 };
  }
  const n = Math.min(-qty, p.shares);
  if (n <= 0) return p;
  return { ...p, cash: p.cash + n * p.price, shares: p.shares - n, trades: p.trades + 1 };
}

export const value = (p: Portfolio) => p.cash + p.shares * p.price;
export const myReturn = (p: Portfolio) => value(p) / p.startValue - 1;
export const betaReturn = (p: Portfolio) => p.price / p.startPrice - 1;
export const alpha = (p: Portfolio) => myReturn(p) - betaReturn(p);

export function isPortfolio(x: unknown): x is Portfolio {
  const p = x as Portfolio;
  return (
    !!p &&
    [p.cash, p.shares, p.price, p.startPrice, p.startValue, p.trades, p.lastTick].every((n) => typeof n === "number" && Number.isFinite(n)) &&
    Array.isArray(p.history) &&
    p.price > 0 &&
    p.startPrice > 0
  );
}
