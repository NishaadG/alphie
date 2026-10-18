import { useEffect, useRef, useState } from "react";
import { Card } from "../components/Card";
import { blip } from "../lib/audio";
import { mulberry32, randomSeed } from "../lib/rng";
import { useApp } from "../lib/store";
import { cssVar, useCanvas } from "../lib/useCanvas";

const ROWS = 9;
const BINS = ROWS + 1;
const SPEED = 0.16; // rows per frame

interface Ball {
  row: number; // fractional while falling
  path: number[]; // 0 = left, 1 = right at each peg
}

interface Sim {
  balls: Ball[];
  queue: number;
  bins: number[];
  rights: number;
  bounces: number;
}

const rightsBefore = (b: Ball, row: number) => b.path.slice(0, row).reduce((a, c) => a + c, 0);

// The Rattle of Large Numbers: every shake drops beads through a Galton
// board. Each bounce is a coin flip, and together they pile up into a bell.
export function GaltonRattle() {
  const market = useApp((s) => s.market);
  const sim = useRef<Sim>({ balls: [], queue: 0, bins: Array(BINS).fill(0), rights: 0, bounces: 0 });
  const rng = useRef(mulberry32(randomSeed()));
  const [stats, setStats] = useState({ rights: 0, bounces: 0 });
  const [running, setRunning] = useState(false);

  const { ref, redraw } = useCanvas(
    (ctx, w, h) => {
      const s = sim.current;
      const boardH = h * 0.6;
      const gap = w / (BINS + 1);
      const rowH = boardH / (ROWS + 1);
      ctx.fillStyle = cssVar("--ink");
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= r; c++) {
          ctx.beginPath();
          ctx.arc(w / 2 + (c - r / 2) * gap, (r + 1) * rowH, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = cssVar("--accent");
      for (const b of s.balls) {
        const r = Math.floor(b.row);
        const col = rightsBefore(b, r) + (b.path[r] ?? 0) * (b.row - r);
        ctx.beginPath();
        ctx.arc(w / 2 + (col - b.row / 2) * gap, (b.row + 0.6) * rowH, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      const max = Math.max(1, ...s.bins);
      const baseY = h - 4;
      const top = boardH + 8;
      s.bins.forEach((v, i) => {
        const x = w / 2 + (i - ROWS / 2) * gap;
        const bh = ((baseY - top) * v) / max;
        ctx.fillStyle = i === 0 || i === BINS - 1 ? cssVar("--down") : cssVar("--up");
        ctx.fillRect(x - gap * 0.38, baseY - bh, gap * 0.76, bh);
      });
    },
    [market],
  );

  // Animation loop: only runs while beads are queued or falling.
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let lastSpawn = 0;
    const tick = (t: number) => {
      const s = sim.current;
      if (s.queue > 0 && t - lastSpawn > 70) {
        lastSpawn = t;
        s.queue--;
        s.balls.push({ row: 0, path: Array.from({ length: ROWS }, () => (rng.current() < 0.5 ? 0 : 1)) });
      }
      let landed = 0;
      s.balls = s.balls.filter((b) => {
        b.row += SPEED;
        if (b.row < ROWS) return true;
        const rights = rightsBefore(b, ROWS);
        s.bins[rights]++;
        s.rights += rights;
        s.bounces += ROWS;
        landed++;
        return false;
      });
      if (landed) {
        setStats({ rights: s.rights, bounces: s.bounces });
        if (Math.random() < 0.4) blip("coin");
      }
      redraw();
      if (s.queue > 0 || s.balls.length) raf = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, redraw]);

  const shake = (n: number) => {
    sim.current.queue += n;
    setRunning(true);
  };

  const tidy = () => {
    const s = sim.current;
    s.bins = Array(BINS).fill(0);
    s.rights = 0;
    s.bounces = 0;
    setStats({ rights: 0, bounces: 0 });
    redraw();
  };

  // Phones: actually shake the rattle (Android exposes motion events without a prompt).
  useEffect(() => {
    let last = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      if (Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0) > 25 && performance.now() - last > 800) {
        last = performance.now();
        sim.current.queue += 10;
        setRunning(true);
      }
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, []);

  const share = stats.bounces ? stats.rights / stats.bounces : 0.5;

  return (
    <Card
      title="Rattle of Large Numbers" tint="mint"
      icon="rattle"
      status={
        <>
          <span>Bounces: {stats.bounces}</span>
          <span>Right: {(share * 100).toFixed(1)}%</span>
        </>
      }
    >
      <p className="caption">
        Each bead bounces left or right at random, like a coin flip. One bead is chaos. Hundreds of beads always make the same
        bell shape. (On a phone, try shaking it!)
      </p>
      <canvas
        ref={ref}
        className="toy-canvas toy-canvas--tall"
        role="img"
        aria-label={`Galton board. ${stats.bounces} bounces so far, ${(share * 100).toFixed(1)} percent went right.`}
      />
      <div className="controls">
        <button type="button" className="btn" onClick={() => shake(20)} data-sound="squeak">
          Shake (20 beads)
        </button>
        <button type="button" className="btn" onClick={() => shake(100)} data-sound="squeak">
          Big shake (100)
        </button>
        <button type="button" className="btn" onClick={tidy}>
          Tidy up
        </button>
      </div>
      <div className="meter well" aria-hidden="true">
        <div className="meter__fill" style={{ width: `${share * 100}%` }} />
        <span className="meter__mid" />
      </div>
      <p className="caption crayon">Law of large numbers: the more you shake, the closer that bar sits to 50%.</p>
    </Card>
  );
}
