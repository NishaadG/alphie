import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card";
import { gbmPaths } from "../lib/gbm";
import { randomSeed } from "../lib/rng";
import { useApp } from "../lib/store";
import { cssVar, useCanvas } from "../lib/useCanvas";

const TOYS = ["⭐", "🌙", "🧸", "🦆", "🎈", "🍼", "🐣", "🪀", "☁️", "🦒"];
const COUNT = 10;
const STEPS = 60;

// Crib mobile: each hanging string is a simulated price path (time runs
// downward, sideways sway is the return). Toys dangle at the final price.
export function MonteCarloMobile() {
  const market = useApp((s) => s.market);
  const [sigma, setSigma] = useState(0.3);
  const [mu, setMu] = useState(0.08);
  const [seed, setSeed] = useState(1234);
  const [progress, setProgress] = useState(1);

  const paths = useMemo(() => gbmPaths({ s0: 100, mu, sigma, years: 1, steps: STEPS }, COUNT, seed), [mu, sigma, seed]);

  const finals = paths.map((p) => p[p.length - 1]);
  const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
  const winners = finals.filter((f) => f > 100).length;

  // Re-grow the strings whenever the seed changes.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setProgress(0);
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seed]);

  const { ref } = useCanvas(
    (ctx, w, h) => {
      const ink = cssVar("--ink");
      const barY = 18;
      const top = barY + 6;
      const bottom = h - 34;
      const span = w / (COUNT + 1);
      // the wooden bar
      ctx.fillStyle = cssVar("--accent");
      ctx.fillRect(span * 0.4, barY - 4, w - span * 0.8, 8);
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, barY);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.stroke();

      const n = Math.max(1, Math.floor(progress * STEPS));
      paths.forEach((path, i) => {
        const x0 = span * (i + 1);
        const pxPerPct = span * 0.035;
        ctx.beginPath();
        ctx.moveTo(x0, top);
        let lx = x0;
        let ly = top;
        for (let s = 1; s <= n; s++) {
          lx = x0 + (path[s] - 100) * pxPerPct;
          ly = top + ((bottom - top) * s) / STEPS;
          ctx.lineTo(lx, ly);
        }
        const up = path[n] >= 100;
        ctx.strokeStyle = up ? cssVar("--up") : cssVar("--down");
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "22px serif";
        ctx.textAlign = "center";
        ctx.fillText(TOYS[i % TOYS.length], lx, ly + 24);
      });
    },
    [paths, progress, market],
  );

  return (
    <Card
      title="Monte Carlo Mobile" tint="blue"
      icon="🎠"
      status={
        <>
          <span>Avg toy price: {mean.toFixed(1)}</span>
          <span className={winners >= COUNT / 2 ? "up" : "down"}>
            {winners}/{COUNT} above 100
          </span>
        </>
      }
    >
      <p className="caption">
        Every string on Alphie's crib mobile is one possible future for a stock that starts at 100. Same rules, different luck.
      </p>
      <canvas ref={ref} className="toy-canvas" role="img" aria-label={`${COUNT} simulated price paths. ${winners} ended above their start.`} />
      <div className="controls">
        <label>
          Wobbliness (volatility σ): <b>{Math.round(sigma * 100)}%</b>
          <input type="range" min={0.05} max={0.8} step={0.01} value={sigma} onChange={(e) => setSigma(+e.target.value)} />
        </label>
        <label>
          Growth (drift μ): <b>{Math.round(mu * 100)}%</b>
          <input type="range" min={-0.3} max={0.4} step={0.01} value={mu} onChange={(e) => setMu(+e.target.value)} />
        </label>
        <button type="button" className="btn" onClick={() => setSeed(randomSeed())}>
          🎲 Spin the mobile
        </button>
      </div>
    </Card>
  );
}
