import { useEffect, useMemo, useRef } from "react";
import { mulberry32 } from "../lib/rng";

interface Scene {
  time: string;
  title: string;
  art: string[];
  text: string;
  chart?: "up" | "down" | "frontier" | "walk" | "flat";
}

const SCENES: Scene[] = [
  {
    time: "09:15:00",
    title: "The Opening Bell",
    art: ["🔔", "👶", "📈"],
    chart: "up",
    text: "Alphie was born the very second the market opened. The bell rang, she yelled, and every screen in the hospital turned green. The nurses called it a coincidence. Alphie called it her first trade.",
  },
  {
    time: "Month 7",
    title: "A Random Walk",
    art: ["👶", "↔️", "🧸"],
    chart: "walk",
    text: "Her first crawl went left. Then right. Then under the sofa. Grown-ups placed bets on where she'd end up and every single one of them lost. That's a random walk: each step a coin flip, no one can call the next one.",
  },
  {
    time: "Month 8",
    title: "The Great Drawdown",
    art: ["🍼", "💥", "😭"],
    chart: "down",
    text: "One morning she dropped her bottle. Milk portfolio: down 30%. There was a tantrum of historic volatility. Afterwards she learned the most important rule in finance: losses happen. Keep a burp cloth handy.",
  },
  {
    time: "Month 9",
    title: "Beta, the Teddy",
    art: ["🧸", "⚖️", "🦆"],
    chart: "flat",
    text: "Beta the teddy never tries anything. He just goes wherever the market goes. To beat him, Alphie stopped betting everything on one rattle. Blocks, ducks, socks: when one wobbles down another wobbles up. Diversification!",
  },
  {
    time: "Today",
    title: "Junior Quant",
    art: ["👩‍🔬", "👶", "⭐"],
    chart: "frontier",
    text: "Now Alphie builds toys that are secretly models, and lives on the efficient frontier: the most play for the least crying. Does she beat the benchmark? Sometimes. And sometimes is enough.",
  },
];

function MiniChart({ kind }: { kind: NonNullable<Scene["chart"]> }) {
  const d = {
    up: "M4 52 L20 44 L32 47 L46 30 L60 34 L76 12",
    down: "M4 14 L18 18 L30 12 L42 40 L56 50 L76 46",
    walk: "M4 30 L14 22 L24 34 L34 26 L44 40 L54 20 L64 32 L76 24",
    flat: "M4 32 L20 30 L36 33 L52 29 L76 31",
    frontier: "M8 54 Q14 18 76 10",
  }[kind];
  return (
    <svg viewBox="0 0 80 60" className="scene__chart" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {kind === "frontier" && <text x="38" y="26" fontSize="12">⭐</text>}
    </svg>
  );
}

// Alphie's origin, told in scenes along her crawl path. The path draws
// itself as you scroll (GSAP ScrollTrigger), with a baby at its tip.
export function Story() {
  const root = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const babyRef = useRef<HTMLDivElement>(null);

  const d = useMemo(() => {
    const rng = mulberry32(915);
    let x = 50;
    let path = "M50 0";
    const steps = 24;
    for (let i = 1; i <= steps; i++) {
      x = Math.max(12, Math.min(88, x + (rng() - 0.5) * 34));
      const y = (1000 * i) / steps;
      const cy = y - 1000 / steps / 2;
      path += ` Q${(x + 50) / 2 + (rng() - 0.5) * 20} ${cy} ${x} ${y}`;
    }
    return path;
  }, []);

  useEffect(() => {
    const section = root.current;
    const path = pathRef.current;
    const baby = babyRef.current;
    if (!section || !path || !baby) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("story--static");
      return;
    }

    let cleanup = () => {};
    let cancelled = false;
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 0.6,
          onUpdate: (self) => {
            const at = len * self.progress;
            path.style.strokeDashoffset = `${len - at}`;
            const pt = path.getPointAtLength(at);
            baby.style.left = `${pt.x}%`;
            baby.style.top = `${pt.y / 10}%`;
          },
        });
        gsap.utils.toArray<HTMLElement>(".scene").forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            x: i % 2 ? 60 : -60,
            rotate: i % 2 ? 3 : -3,
            duration: 0.8,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
          gsap.from(el.querySelectorAll(".scene__art span"), {
            y: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 0.5,
            ease: "bounce.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          });
        });
      }, section);
      cleanup = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section id="story" ref={root} className="story" aria-labelledby="story-title">
      <h2 id="story-title" className="section-title">
        ~*~ Alphie's Story ~*~
        <small>Scroll down to follow her crawl.</small>
      </h2>
      <div className="story__track">
        <svg className="story__path" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d={d} className="story__path-bg" vectorEffect="non-scaling-stroke" />
          <path ref={pathRef} d={d} className="story__path-fg" vectorEffect="non-scaling-stroke" />
        </svg>
        <div ref={babyRef} className="story__baby" aria-hidden="true">
          👶
        </div>
        <ol className="story__scenes">
          {SCENES.map((s, i) => (
            <li key={s.title} className={`scene win bevel-out ${i % 2 ? "scene--right" : ""}`}>
              <div className="win__title">
                <span aria-hidden="true">🎞️</span>
                <h3>
                  Scene {i + 1}: {s.title}
                </h3>
                <span className="pixel scene__time">{s.time}</span>
              </div>
              <div className="win__body scene__body">
                <div className="scene__art" aria-hidden="true">
                  {s.art.map((a, j) => (
                    <span key={j}>{a}</span>
                  ))}
                </div>
                {s.chart && <MiniChart kind={s.chart} />}
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
