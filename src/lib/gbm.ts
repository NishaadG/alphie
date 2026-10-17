import { gaussian, mulberry32, type Rng } from "./rng";

export interface GbmParams {
  s0: number;
  mu: number; // annual drift
  sigma: number; // annual volatility
  years: number;
  steps: number;
}

// One geometric Brownian motion path, exact discretisation.
export function gbmPath(p: GbmParams, rng: Rng): number[] {
  const dt = p.years / p.steps;
  const drift = (p.mu - 0.5 * p.sigma * p.sigma) * dt;
  const vol = p.sigma * Math.sqrt(dt);
  const out = [p.s0];
  let s = p.s0;
  for (let i = 0; i < p.steps; i++) {
    s *= Math.exp(drift + vol * gaussian(rng));
    out.push(s);
  }
  return out;
}

export function gbmPaths(p: GbmParams, count: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => gbmPath(p, rng));
}

// A 2D crawl: each step moves a fixed length in a random direction.
export function crawl2d(steps: number, seed: number, stepLen = 1): Array<[number, number]> {
  const rng = mulberry32(seed);
  const pts: Array<[number, number]> = [[0, 0]];
  let x = 0;
  let y = 0;
  for (let i = 0; i < steps; i++) {
    const a = rng() * Math.PI * 2;
    x += Math.cos(a) * stepLen;
    y += Math.sin(a) * stepLen;
    pts.push([x, y]);
  }
  return pts;
}
