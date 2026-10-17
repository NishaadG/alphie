import { useEffect, useRef } from "react";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  glyph: string;
  hue: string;
}

const GLYPHS = ["✦", "★", "▲", "▼", "✧", "$"];
const HUES = ["#ff8fb4", "#ffd166", "#2f9e6b", "#d1495b", "#7a5fc0", "#5cc8ff"];

// Old-school glitter trail on a single fixed canvas. Particles are capped
// and the loop sleeps when idle, so it costs nothing while nobody moves.
export function SparkleTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const parts: P[] = [];
    let raf = 0;
    let running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= 0.02;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.hue;
        ctx.font = `${10 + p.life * 8}px serif`;
        ctx.fillText(p.glyph, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      if (parts.length) raf = requestAnimationFrame(tick);
      else running = false;
    };

    const spawn = (x: number, y: number, n: number) => {
      for (let i = 0; i < n && parts.length < 120; i++) {
        parts.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.7) * 1.6,
          life: 1,
          glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
          hue: HUES[(Math.random() * HUES.length) | 0],
        });
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    let last = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 24) return;
      last = now;
      spawn(e.clientX, e.clientY, e.pointerType === "touch" ? 2 : 1);
    };
    const onDown = (e: PointerEvent) => spawn(e.clientX, e.clientY, 10);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="sparkles" aria-hidden="true" />;
}
