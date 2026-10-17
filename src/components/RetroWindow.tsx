import { useEffect, useRef, useState, type ReactNode } from "react";
import { blip } from "../lib/audio";
import { useApp } from "../lib/store";

interface Props {
  title: string;
  icon?: string;
  status?: ReactNode;
  className?: string;
  id?: string;
  children: ReactNode;
}

// A Win98-style window. In Chaos Mode it tilts, scatters and can be
// dragged around by its title bar (pointer events, so touch works too).
export function RetroWindow({ title, icon = "🍼", status, className = "", id, children }: Props) {
  const chaos = useApp((s) => s.chaos);
  const [collapsed, setCollapsed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0, r: 0 });
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const headingId = `${id ?? title.replace(/\W+/g, "-").toLowerCase()}-title`;

  useEffect(() => {
    if (chaos) {
      const spread = window.innerWidth < 768 ? 10 : 40;
      setOffset({
        x: (Math.random() - 0.5) * spread,
        y: (Math.random() - 0.5) * spread,
        r: (Math.random() - 0.5) * 8,
      });
    } else {
      setOffset({ x: 0, y: 0, r: 0 });
    }
  }, [chaos]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Phones keep the stacked layout (CSS wobbles it instead), so no dragging there.
    if (!chaos || window.innerWidth < 768 || (e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const d = drag.current;
    setOffset((o) => ({ ...o, x: d.ox + e.clientX - d.px, y: d.oy + e.clientY - d.py }));
  };
  const onPointerUp = () => {
    if (drag.current) blip("click");
    drag.current = null;
  };

  const toggle = () => setCollapsed((c) => !c);

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`win bevel-out ${collapsed ? "win--collapsed" : ""} ${chaos ? "win--chaos" : ""} ${className}`}
      style={chaos ? { transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg)` } : undefined}
    >
      <div
        className="win__title"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={chaos ? { cursor: "grab", touchAction: "none" } : undefined}
      >
        <span aria-hidden="true">{icon}</span>
        <h2 id={headingId}>{title}</h2>
        <button
          type="button"
          className="btn98 win__ctrl"
          onClick={toggle}
          data-sound={collapsed ? "open" : "close"}
          aria-expanded={!collapsed}
          aria-label={collapsed ? `Restore ${title}` : `Minimise ${title}`}
        >
          {collapsed ? "□" : "_"}
        </button>
      </div>
      <div className="win__body">{children}</div>
      {status && <div className="win__status">{status}</div>}
    </section>
  );
}
