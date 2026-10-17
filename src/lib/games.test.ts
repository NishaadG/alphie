import { describe, expect, it } from "vitest";
import { BETA_QUOTE, MAX_INV, newMarket, pnl, quotes, step, type MMState } from "./marketMaker";
import { alpha, betaReturn, catchUp, isPortfolio, myReturn, newPortfolio, tick, trade, value } from "./paperTrade";
import { mulberry32 } from "./rng";

describe("market maker", () => {
  it("quotes symmetric bids and asks with skew", () => {
    expect(quotes(100, { half: 0.5, skew: 0 })).toEqual({ bid: 99.5, ask: 100.5 });
    expect(quotes(100, { half: 0.5, skew: -0.25 })).toEqual({ bid: 99.25, ask: 100.25 });
  });

  it("conserves blocks: every fill moves exactly one block", () => {
    let s: MMState = newMarket();
    const rng = mulberry32(3);
    for (let i = 0; i < 200; i++) {
      const before = s.alphie.inv + s.beta.inv;
      const { state, fill } = step(s, { half: 0.5, skew: 0 }, rng);
      const after = state.alphie.inv + state.beta.inv;
      expect(Math.abs(after - before)).toBe(fill ? 1 : 0);
      s = state;
    }
  });

  it("gives the customer the better price", () => {
    const rng = mulberry32(11);
    let s = newMarket();
    let alphieFills = 0;
    let betaFills = 0;
    for (let i = 0; i < 300; i++) {
      const r = step(s, { half: 0.3, skew: 0 }, rng); // much tighter than Beta's 0.8
      if (r.fill?.who === "alphie") alphieFills++;
      if (r.fill?.who === "beta") betaFills++;
      // keep inventory in range so Alphie keeps quoting
      s = { ...r.state, alphie: { ...r.state.alphie, inv: 0 } };
    }
    expect(alphieFills).toBeGreaterThan(0);
    expect(betaFills).toBe(0);
  });

  it("stops quoting a side when the crib is full", () => {
    const rng = mulberry32(5);
    let s: MMState = { ...newMarket(), alphie: { cash: 0, inv: MAX_INV } };
    for (let i = 0; i < 100; i++) {
      const r = step(s, { half: 0.1, skew: 0 }, rng);
      if (r.fill?.who === "alphie") expect(r.fill.side).toBe("buy");
      s = { ...r.state, alphie: { ...r.state.alphie, inv: MAX_INV } };
    }
  });

  it("marks to market", () => {
    expect(pnl({ cash: -99, inv: 1 }, 101)).toBe(2);
    expect(BETA_QUOTE.half).toBeGreaterThan(0);
  });
});

describe("paper trading", () => {
  it("buys and sells within cash and holdings", () => {
    let p = newPortfolio(0, 100);
    p = trade(p, 3);
    expect(p.shares).toBe(3);
    expect(p.cash).toBe(700);
    p = trade(p, 50); // can only afford 7 more
    expect(p.shares).toBe(10);
    expect(p.cash).toBe(0);
    p = trade(p, -4);
    expect(p.shares).toBe(6);
    expect(trade(newPortfolio(0), -1).trades).toBe(0);
  });

  it("measures alpha against buy-and-hold Beta", () => {
    let p = trade(newPortfolio(0, 100), 10); // all in, same as Beta
    p = { ...p, price: 120 };
    expect(myReturn(p)).toBeCloseTo(0.2);
    expect(betaReturn(p)).toBeCloseTo(0.2);
    expect(alpha(p)).toBeCloseTo(0);
    const cashOnly = { ...newPortfolio(0, 100), price: 80 };
    expect(alpha(cashOnly)).toBeCloseTo(0.2); // sat out a 20% drop
  });

  it("ticks, keeps a bounded history and catches up after time away", () => {
    const rng = mulberry32(9);
    let p = newPortfolio(0);
    for (let i = 0; i < 200; i++) p = tick(p, 0, rng, i * 1000);
    expect(p.history.length).toBe(120);
    const { p: back, steps } = catchUp(p, p.lastTick + 3_600_000, rng);
    expect(steps).toBe(600);
    expect(back.lastTick).toBe(p.lastTick + 3_600_000);
    expect(value(back)).toBeCloseTo(back.cash + back.shares * back.price);
  });

  it("rejects corrupt saved data", () => {
    expect(isPortfolio(newPortfolio(1))).toBe(true);
    expect(isPortfolio({ cash: "lots" })).toBe(false);
    expect(isPortfolio(null)).toBe(false);
  });
});
