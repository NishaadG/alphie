import { gaussian, type Rng } from "./rng";

// Order-Book Blocks: Alphie and Beta both make a market in toy blocks.
// Each tick one customer may arrive and trade with whoever shows the best
// price. Some customers are "informed" (they know where the price is going),
// which is why a too-tight spread loses money.

export interface Quote {
  half: number; // half-spread: distance of bid/ask from the mid price
  skew: number; // shifts both quotes, used to get rid of inventory
}

export interface Book {
  cash: number;
  inv: number;
}

export interface Fill {
  tick: number;
  who: "alphie" | "beta";
  side: "buy" | "sell"; // what the customer did
  price: number;
  informed: boolean;
}

export interface MMState {
  tick: number;
  mid: number;
  alphie: Book;
  beta: Book;
  fills: Fill[];
}

export const BETA_QUOTE: Quote = { half: 0.8, skew: 0 };
export const MAX_INV = 8;
export const ROUND_TICKS = 40;
// Tuned by simulation so that very tight spreads lose to informed customers,
// very wide ones get no trades, and a middle spread with skew wins most rounds.
const VOL = 0.55;
const INFORMED = 0.4;

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function quotes(mid: number, q: Quote): { bid: number; ask: number } {
  return { bid: round2(mid - q.half + q.skew), ask: round2(mid + q.half + q.skew) };
}

export function newMarket(mid = 100): MMState {
  return { tick: 0, mid, alphie: { cash: 0, inv: 0 }, beta: { cash: 0, inv: 0 }, fills: [] };
}

export const pnl = (b: Book, mid: number) => b.cash + b.inv * mid;

export function step(s: MMState, alphieQ: Quote, rng: Rng): { state: MMState; fill: Fill | null } {
  const move = gaussian(rng) * VOL;
  const a = quotes(s.mid, alphieQ);
  const b = quotes(s.mid, BETA_QUOTE);
  const alphie = { ...s.alphie };
  const beta = { ...s.beta };
  let fill: Fill | null = null;

  if (rng() < 0.85) {
    const informed = rng() < INFORMED;
    const side: Fill["side"] = informed ? (move > 0 ? "buy" : "sell") : rng() < 0.5 ? "buy" : "sell";
    const tolerance = 0.3 + Math.abs(gaussian(rng)) * 0.9 + (informed ? 0.6 : 0);

    // A full crib (inventory limit) stops Alphie quoting that side.
    const alphieCan = side === "buy" ? alphie.inv > -MAX_INV : alphie.inv < MAX_INV;
    const offers: Array<{ who: Fill["who"]; price: number }> = [];
    if (side === "buy") {
      if (alphieCan && a.ask <= s.mid + tolerance) offers.push({ who: "alphie", price: a.ask });
      if (b.ask <= s.mid + tolerance) offers.push({ who: "beta", price: b.ask });
      offers.sort((x, y) => x.price - y.price);
    } else {
      if (alphieCan && a.bid >= s.mid - tolerance) offers.push({ who: "alphie", price: a.bid });
      if (b.bid >= s.mid - tolerance) offers.push({ who: "beta", price: b.bid });
      offers.sort((x, y) => y.price - x.price);
    }
    if (offers.length) {
      // Equal prices share the customer at random.
      const best = offers.length > 1 && offers[0].price === offers[1].price && rng() < 0.5 ? offers[1] : offers[0];
      const book = best.who === "alphie" ? alphie : beta;
      if (side === "buy") {
        book.cash += best.price;
        book.inv -= 1;
      } else {
        book.cash -= best.price;
        book.inv += 1;
      }
      fill = { tick: s.tick, who: best.who, side, price: best.price, informed };
    }
  }

  const state: MMState = {
    tick: s.tick + 1,
    mid: Math.max(1, round2(s.mid + move)),
    alphie,
    beta,
    fills: fill ? [fill, ...s.fills].slice(0, 6) : s.fills,
  };
  return { state, fill };
}
