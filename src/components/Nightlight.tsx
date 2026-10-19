import { useRef, useState } from "react";
import { blip } from "../lib/audio";
import type { IconName } from "../lib/icons";
import { collect } from "../lib/stickers";
import { say, setState, useApp } from "../lib/store";
import { Card } from "./Card";
import { Icon } from "./Icon";

interface Dream {
  icon: IconName;
  text: string;
  x: number; // % across the dream layer
  y: number; // % down
}

const DREAMS: Dream[] = [
  { icon: "bottle", text: "unlimited milk, zero volatility", x: 18, y: 24 },
  { icon: "teddy", text: "Beta, losing (for once)", x: 44, y: 18 },
  { icon: "piggy", text: "a piggy bank full of alpha", x: 82, y: 26 },
  { icon: "duck", text: "a rubber-duck index fund", x: 20, y: 74 },
  { icon: "swan", text: "the black swan, fast asleep", x: 56, y: 66 },
  { icon: "star", text: "a gold star from the market", x: 82, y: 76 },
];
const REACH = 13; // how close (in %) the light must come to see a dream

// The nightlight: the dream layer is dark, and your cursor (or finger, or the
// arrow keys) is a little nightlight that shows what Alphie is dreaming about.
export function Nightlight() {
  const bedtime = useApp((s) => s.market === "bear");
  const [light, setLight] = useState({ x: 50, y: 50 });
  const [seen, setSeen] = useState<number[]>([]);
  const box = useRef<HTMLDivElement>(null);

  const shine = (x: number, y: number) => {
    const p = { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) };
    setLight(p);
    const hit = DREAMS.findIndex((d, i) => !seen.includes(i) && Math.hypot(d.x - p.x, (d.y - p.y) * 0.6) < REACH);
    if (hit < 0) return;
    const next = [...seen, hit];
    setSeen(next);
    blip("coin");
    if (next.length === DREAMS.length) {
      collect("dreams");
      say("You saw ALL my dreams!! Now tuck me in. *yawn*", 4000);
    }
  };

  const onPointer = (e: React.PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    shine(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = 6;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    shine(light.x + m[0], light.y + m[1]);
  };

  return (
    <Card title="Nightlight" icon="moon" tint="lilac" status={`${seen.length}/${DREAMS.length} dreams`}>
      <p>
        The room's dark, so Alphie's dreams are hidden. Move your nightlight over the dark (mouse, finger or arrow keys) to see what she
        dreams about.
      </p>
      <div
        ref={box}
        className={`dream ${bedtime ? "dream--bedtime" : ""}`}
        style={{ "--x": `${light.x}%`, "--y": `${light.y}%` } as React.CSSProperties}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onKeyDown={onKey}
        tabIndex={0}
        role="group"
        aria-label="Dream layer. Use the arrow keys to move the nightlight."
      >
        <div className="dream__glow" aria-hidden="true" />
        <ul className="dream__dreams">
          {DREAMS.map((d, i) => (
            <li key={d.text} className={seen.includes(i) ? "is-seen" : ""} style={{ left: `${d.x}%`, top: `${d.y}%` }}>
              <Icon name={d.icon} size={58} />
              <span>{d.text}</span>
            </li>
          ))}
        </ul>
        <div className="dream__dark" aria-hidden="true" />
      </div>
      <p className="sr-only" role="status">
        {seen.length ? `Dreams seen: ${seen.map((i) => DREAMS[i].text).join(", ")}.` : ""}
      </p>
      {!bedtime && (
        <button type="button" className="btn" onClick={() => setState({ market: "bear" })}>
          <Icon name="moon" size={22} /> Turn off the big light (Bedtime)
        </button>
      )}
    </Card>
  );
}
