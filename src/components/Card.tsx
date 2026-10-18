import { useEffect, useRef, useState, type ReactNode } from "react";
import { blip } from "../lib/audio";
import type { IconName } from "../lib/icons";
import { useApp } from "../lib/store";
import { Icon } from "./Icon";

export type Tint = "pink" | "blue" | "mint" | "butter" | "lilac" | "peach";

interface Props {
  title: string;
  icon?: IconName;
  status?: ReactNode;
  tint?: Tint;
  className?: string;
  id?: string;
  children: ReactNode;
}

// A stitched baby blanket with a scalloped ribbon. In Tantrum Mode it tilts, scatters and can
// be dragged by its ribbon (pointer events, so touch works too).
export function Card({ title, icon = "bottle", status, tint = "pink", className = "", id, children }: Props) {
  const tantrum = useApp((s) => s.chaos);
  const [offset, setOffset] = useState({ x: 0, y: 0, r: 0 });
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const headingId = `${id ?? title.replace(/\W+/g, "-").toLowerCase()}-title`;

  useEffect(() => {
    if (tantrum) {
      const spread = window.innerWidth < 768 ? 8 : 36;
      setOffset({ x: (Math.random() - 0.5) * spread, y: (Math.random() - 0.5) * spread, r: (Math.random() - 0.5) * 9 });
    } else {
      setOffset({ x: 0, y: 0, r: 0 });
    }
  }, [tantrum]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Phones keep the stacked layout (CSS wobbles it instead), so no dragging there.
    if (!tantrum || window.innerWidth < 768 || (e.target as HTMLElement).closest("button, a")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const d = drag.current;
    setOffset((o) => ({ ...o, x: d.ox + e.clientX - d.px, y: d.oy + e.clientY - d.py }));
  };
  const onPointerUp = () => {
    if (drag.current) blip("squeak");
    drag.current = null;
  };

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`card card--${tint} ${tantrum ? "card--tantrum" : ""} ${className}`}
      style={tantrum ? { transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg)` } : undefined}
    >
      <header
        className="card__ribbon"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={tantrum ? { cursor: "grab", touchAction: "none" } : undefined}
      >
        <Icon name={icon} size={34} className="card__icon" />
        <h2 id={headingId}>{title}</h2>
      </header>
      <div className="card__body">{children}</div>
      {status && <footer className="card__status">{status}</footer>}
    </section>
  );
}
