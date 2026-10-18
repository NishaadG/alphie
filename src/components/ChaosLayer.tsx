import { useEffect, useMemo, useRef } from "react";
import { blip } from "../lib/audio";
import type { IconName } from "../lib/icons";
import { mulberry32 } from "../lib/rng";
import { collect } from "../lib/stickers";
import { say, useApp } from "../lib/store";
import { Icon } from "./Icon";

const THROWN: IconName[] = ["bottle", "rattle", "teddy", "blocks", "duck", "piggy", "star", "music", "heart", "bow"];
const SPEED = 3;

// Tantrum Mode: Alphie melts down and takes the whole nursery market with
// her. Toys get thrown, every chart crashes, and everything on the page runs
// three times faster, as if it's all under pressure.
export function ChaosLayer() {
  const tantrum = useApp((s) => s.chaos);
  const prev = useRef(tantrum);

  const thrown = useMemo(() => {
    const rng = mulberry32(77);
    return THROWN.map((name, i) => ({
      name,
      left: `${4 + ((i * 41) % 88)}%`,
      delay: `${-rng() * 4}s`,
      duration: `${3 + rng() * 2.5}s`,
      drop: `-${10 + Math.floor(rng() * 80)}%`,
    }));
  }, []);

  const crash = useMemo(() => {
    const rng = mulberry32(13);
    let y = 12;
    let d = `M0 ${y}`;
    for (let x = 4; x <= 100; x += 4) {
      y = Math.min(96, Math.max(6, y + 3.6 + (rng() - 0.45) * 12));
      d += ` L${x} ${y.toFixed(1)}`;
    }
    return d;
  }, []);

  useEffect(() => {
    if (prev.current === tantrum) return;
    prev.current = tantrum;
    if (!tantrum) {
      say("Phew… the market recovered. I'm OK now. *hic*", 3500);
      return;
    }
    blip("cry");
    collect("tantrum");
    say("WAAAH!! EVERYTHING IS CRASHING!! SELL THE RATTLES!!", 3500);

    // Under pressure: speed up every CSS animation (new ones too) and GSAP.
    let stopped = false;
    let timeline: { timeScale(n: number): unknown } | null = null;
    const hurry = () => document.getAnimations().forEach((a) => (a.playbackRate = SPEED));
    hurry();
    const id = window.setInterval(hurry, 400);
    const sob = window.setInterval(() => blip("cry"), 9000);
    void import("gsap").then(({ gsap }) => {
      if (stopped) return;
      timeline = gsap.globalTimeline;
      timeline.timeScale(SPEED);
    });
    return () => {
      stopped = true;
      window.clearInterval(id);
      window.clearInterval(sob);
      document.getAnimations().forEach((a) => (a.playbackRate = 1));
      timeline?.timeScale(1);
    };
  }, [tantrum]);

  if (!tantrum) return null;
  return (
    <>
      <div className="chaos-marquee" aria-hidden="true">
        <span>
          ⚠ CIRCUIT BREAKER TRIPPED ⚠ NAP TIME HALTED ▼ MARGIN CALL ON THE MILK ▼ RATTLE −42% ▼ SELL ALL THE BLOCKS ▼ BETA IS SOMEHOW FINE ▼
          WAAAAAH ▼
        </span>
      </div>
      <svg className="crash-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={crash} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="crash-vignette" aria-hidden="true" />
      <p className="crash-stamp" aria-hidden="true">
        MARKET
        <br />
        CRASH!
      </p>
      {thrown.map((t) => (
        <span key={t.name} className="thrown" style={{ left: t.left, animationDelay: t.delay, animationDuration: t.duration }} aria-hidden="true">
          <Icon name={t.name} size={52} />
          <b>▼{t.drop}</b>
        </span>
      ))}
      <p className="sr-only" role="status">
        Tantrum Mode is on. The pretend market is crashing.
      </p>
    </>
  );
}
