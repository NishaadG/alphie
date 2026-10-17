import { useCallback, useEffect, useRef } from "react";

export type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

// Canvas sized to its CSS box (HiDPI-aware). Redraws on resize, when
// `deps` change, or whenever the returned `redraw` is called (for loops).
// `draw` receives CSS-pixel dimensions.
export function useCanvas(draw: Draw, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  const redraw = useCallback(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    drawRef.current(ctx, width, height);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ro = new ResizeObserver(redraw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [redraw]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(redraw, deps);

  return { ref, redraw };
}

export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
