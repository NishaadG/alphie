import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store";
import { Card } from "./Card";

// Window shell for the 3D crib. Three.js is only downloaded when this
// window scrolls near the viewport, so it never slows the first load.
export function Crib3D() {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const market = useApp((s) => s.market);
  const marketRef = useRef(market);
  const api = useRef<{ setNight: (night: boolean) => void; dispose: () => void } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || api.current) return;
        io.disconnect();
        setState("loading");
        try {
          const { mountCrib } = await import("./crib3dScene");
          if (disposed) return;
          api.current = mountCrib(el, marketRef.current === "bear");
          setState("ready");
        } catch {
          setState("failed");
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      disposed = true;
      io.disconnect();
      api.current?.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    marketRef.current = market;
    api.current?.setNight(market === "bear");
  }, [market]);

  return (
    <Card title="Alphie's 3D Crib" tint="lilac" icon="crib" id="crib" status={<><span>drag to spin</span><span>{state === "ready" ? "WebGL ✓" : state}</span></>}>
      <p className="caption">A low-poly Alphie in her crib, with the mobile spinning overhead. Drag (or swipe) to turn it.</p>
      <div ref={host} className="crib3d well" role="img" aria-label="3D model of Alphie sitting in her crib">
        {state !== "ready" && (
          <p className="crib3d__msg crayon">{state === "failed" ? "Your browser can't do 3D, but Alphie still loves you." : "Loading 3D crib…"}</p>
        )}
      </div>
    </Card>
  );
}
