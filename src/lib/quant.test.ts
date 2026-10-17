import { describe, expect, it } from "vitest";
import { blackScholes } from "./blackScholes";
import { gbmPaths } from "./gbm";
import { mulberry32 } from "./rng";

describe("blackScholes", () => {
  const ref = blackScholes({ s: 100, k: 100, r: 0.05, sigma: 0.2, t: 1 });

  it("matches the textbook call and put prices", () => {
    expect(ref.call).toBeCloseTo(10.4506, 3);
    expect(ref.put).toBeCloseTo(5.5735, 3);
  });

  it("satisfies put-call parity", () => {
    expect(ref.call - ref.put).toBeCloseTo(100 - 100 * Math.exp(-0.05), 6);
  });

  it("returns sensible Greeks", () => {
    expect(ref.delta).toBeCloseTo(0.6368, 3);
    expect(ref.gamma).toBeCloseTo(0.01876, 4);
    expect(ref.vega).toBeCloseTo(37.524, 2);
  });

  it("falls back to intrinsic value at expiry", () => {
    expect(blackScholes({ s: 120, k: 100, r: 0.05, sigma: 0.2, t: 0 }).call).toBe(20);
  });
});

describe("rng and gbm", () => {
  it("is deterministic for a seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces terminal prices with the right mean", () => {
    const paths = gbmPaths({ s0: 100, mu: 0.1, sigma: 0.3, years: 1, steps: 50 }, 4000, 7);
    const mean = paths.reduce((acc, p) => acc + p[p.length - 1], 0) / paths.length;
    // E[S_T] = s0 * e^(mu T) = 110.52; allow ~3 standard errors
    expect(Math.abs(mean - 100 * Math.exp(0.1))).toBeLessThan(1.6);
  });
});
