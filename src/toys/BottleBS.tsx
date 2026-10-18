import { useState } from "react";
import { Card } from "../components/Card";
import { blackScholes } from "../lib/blackScholes";

interface DialProps {
  label: string;
  value: number;
  min: number;
  max: number;
  fmt: (v: number) => string;
}

// A half-moon gauge with a needle, like the dial on a bottle warmer.
function Dial({ label, value, min, max, fmt }: DialProps) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = Math.PI * (1 - t);
  const nx = 30 + 22 * Math.cos(angle);
  const ny = 32 - 22 * Math.sin(angle);
  return (
    <figure className="dial">
      <svg viewBox="0 0 60 40" width="72" height="48" aria-hidden="true">
        <path d="M6 32 A24 24 0 0 1 54 32" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
        <line x1="30" y1="32" x2={nx} y2={ny} stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="30" cy="32" r="3" fill="var(--accent)" />
      </svg>
      <figcaption>
        <span className="crayon">{label}</span> {fmt(value)}
      </figcaption>
    </figure>
  );
}

// The Black-Scholes bottle: milk level is the call option's price
// as a share of the spot price.
export function BottleBS() {
  const [s, setS] = useState(100);
  const [k, setK] = useState(100);
  const [sigma, setSigma] = useState(0.2);
  const [t, setT] = useState(1);
  const r = 0.05;
  const res = blackScholes({ s, k, r, sigma, t });
  const fill = Math.max(0.02, Math.min(1, res.call / s / 0.5));

  const milkTop = 40 + (1 - fill) * 140;

  return (
    <Card
      title="The Black-Scholes Bottle" tint="butter"
      icon="🍼"
      status={
        <>
          <span>Call {res.call.toFixed(2)}</span>
          <span>Put {res.put.toFixed(2)}</span>
        </>
      }
    >
      <p className="caption">
        How much is the <i>right</i> (not the duty) to buy a toy at a set price later? The milk shows the fair price of that
        right, worked out with Black-Scholes.
      </p>
      <div className="bottle">
        <svg viewBox="0 0 120 200" className="bottle__svg" role="img" aria-label={`Bottle ${Math.round(fill * 100)}% full. Call option worth ${res.call.toFixed(2)}.`}>
          <defs>
            <clipPath id="bottle-clip">
              <path d="M30 40 h60 v130 a14 14 0 0 1 -14 14 h-32 a14 14 0 0 1 -14 -14 z" />
            </clipPath>
          </defs>
          <path d="M48 6 q12 -8 24 0 v14 h-24 z" fill="var(--accent)" />
          <rect x="40" y="20" width="40" height="20" rx="4" fill="var(--butter)" stroke="var(--ink)" strokeWidth="3" />
          <g clipPath="url(#bottle-clip)">
            <rect x="0" y={milkTop} width="120" height="200" fill="#fff" className="bottle__milk" />
            <path d={`M0 ${milkTop} q15 -6 30 0 t30 0 t30 0 t30 0 v6 h-120 z`} fill="#fff" className="bottle__wave" />
          </g>
          <path d="M30 40 h60 v130 a14 14 0 0 1 -14 14 h-32 a14 14 0 0 1 -14 -14 z" fill="none" stroke="var(--ink)" strokeWidth="3" />
          {[70, 100, 130, 160].map((y) => (
            <line key={y} x1="30" x2="42" y1={y} y2={y} stroke="var(--ink)" strokeWidth="2" />
          ))}
          <text x="60" y="120" textAnchor="middle" fontFamily="Gaegu, cursive" fontSize="22" fill="var(--accent)">
            {res.call.toFixed(1)}
          </text>
        </svg>
        <div className="dials">
          <Dial label="Δ delta" value={res.delta} min={0} max={1} fmt={(v) => v.toFixed(2)} />
          <Dial label="Γ gamma" value={res.gamma} min={0} max={0.06} fmt={(v) => v.toFixed(3)} />
          <Dial label="ν vega" value={res.vega} min={0} max={60} fmt={(v) => v.toFixed(1)} />
          <Dial label="Θ theta" value={-res.theta} min={0} max={20} fmt={(v) => (-v).toFixed(1)} />
        </div>
      </div>
      <div className="controls controls--grid">
        <label>
          Toy price now: <b>{s}</b>
          <input type="range" min={50} max={150} value={s} onChange={(e) => setS(+e.target.value)} />
        </label>
        <label>
          Agreed price: <b>{k}</b>
          <input type="range" min={50} max={150} value={k} onChange={(e) => setK(+e.target.value)} />
        </label>
        <label>
          Fussiness σ: <b>{Math.round(sigma * 100)}%</b>
          <input type="range" min={0.05} max={0.8} step={0.01} value={sigma} onChange={(e) => setSigma(+e.target.value)} />
        </label>
        <label>
          Months until bedtime: <b>{Math.round(t * 12)}</b>
          <input type="range" min={1 / 12} max={2} step={1 / 12} value={t} onChange={(e) => setT(+e.target.value)} />
        </label>
      </div>
    </Card>
  );
}
