export interface OptionInput {
  s: number; // spot
  k: number; // strike
  r: number; // risk-free rate
  sigma: number; // volatility
  t: number; // years to expiry
}

export interface OptionResult {
  call: number;
  put: number;
  delta: number; // call delta
  gamma: number;
  vega: number; // per 1.00 change in sigma
  theta: number; // call theta, per year
}

// Abramowitz-Stegun 7.1.26 erf approximation (max error ~1.5e-7).
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

export const normCdf = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));
export const normPdf = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

export function blackScholes({ s, k, r, sigma, t }: OptionInput): OptionResult {
  if (t <= 0 || sigma <= 0) {
    const call = Math.max(s - k, 0);
    return { call, put: Math.max(k - s, 0), delta: s > k ? 1 : 0, gamma: 0, vega: 0, theta: 0 };
  }
  const sqrtT = Math.sqrt(t);
  const d1 = (Math.log(s / k) + (r + 0.5 * sigma * sigma) * t) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  const disc = Math.exp(-r * t);
  const call = s * normCdf(d1) - k * disc * normCdf(d2);
  const put = k * disc * normCdf(-d2) - s * normCdf(-d1);
  return {
    call,
    put,
    delta: normCdf(d1),
    gamma: normPdf(d1) / (s * sigma * sqrtT),
    vega: s * normPdf(d1) * sqrtT,
    theta: -(s * normPdf(d1) * sigma) / (2 * sqrtT) - r * k * disc * normCdf(d2),
  };
}
