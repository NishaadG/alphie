import { useEffect, useState } from "react";
import { blip } from "../lib/audio";
import { collect } from "../lib/stickers";
import { say, useApp } from "../lib/store";

// Alphie crawling across the nursery floor in a (literal) random walk: each
// step she flips a coin for left or right.
export function Crawler() {
  const [pos, setPos] = useState({ x: 20, facing: 1 });
  const tantrum = useApp((s) => s.chaos);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setPos((p) => {
        if (!tantrum && Math.random() < 0.25) return p; // a little sit-down
        let dir = Math.random() < 0.5 ? -1 : 1;
        if (p.x < 8) dir = 1;
        if (p.x > 86) dir = -1;
        const step = tantrum ? 8 + Math.random() * 14 : 4 + Math.random() * 7;
        return { x: Math.min(92, Math.max(4, p.x + dir * step)), facing: dir };
      });
    }, tantrum ? 450 : 1400);
    return () => window.clearInterval(id);
  }, [tantrum]);

  return (
    <div className="crawler" aria-hidden="true">
      <div className="crawler__baby" style={{ left: `${pos.x}%`, transitionDuration: tantrum ? "0.4s" : undefined }}>
        <svg
          viewBox="0 0 120 84"
          width="96"
          height="67"
          style={{ transform: `scaleX(${pos.facing})` }}
          onClick={() => {
            blip("giggle");
            say("Wheee! Random walk!", 2500);
            collect("crawler");
          }}
        >
          <g stroke="#5c4033" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <g className="crawler__limb crawler__limb--b">
              <path d="M30 58 L22 74" fill="none" strokeWidth="11" />
              <path d="M30 58 L22 74" fill="none" stroke="#ffd9c2" strokeWidth="5" />
              <ellipse cx="18" cy="76" rx="9" ry="5" fill="#ffd9c2" />
            </g>
            <g className="crawler__limb crawler__limb--a">
              <path d="M70 58 L74 75" fill="none" strokeWidth="10" />
              <path d="M70 58 L74 75" fill="none" stroke="#ffd9c2" strokeWidth="4" />
              <circle cx="75" cy="77" r="5.5" fill="#ffd9c2" />
            </g>
            <ellipse cx="48" cy="52" rx="32" ry="19" fill="#cfe6ff" />
            <path d="M40 44v16M50 40v16" strokeWidth="2" />
            <rect x="37" y="47" width="6" height="8" fill="#2f9e6b" strokeWidth="2" />
            <rect x="47" y="44" width="6" height="7" fill="#d1495b" strokeWidth="2" />
            <circle cx="88" cy="36" r="24" fill="#ffd9c2" />
            <circle cx="79" cy="40" r="6" fill="#ffd9c2" strokeWidth="3" />
            <path d="M86 12 Q90 2 99 6 Q103 10 96 14" fill="none" />
            <g transform="translate(72 16) rotate(-30)" fill="#ff9fbd" strokeWidth="2.5">
              <path d="M0 0 Q-10 -9 -13 -3 Q-14 4 -8 6 Q-3 6 0 0 Z" />
              <path d="M0 0 Q10 -9 13 -3 Q14 4 8 6 Q3 6 0 0 Z" />
            </g>
            <ellipse cx="97" cy="33" rx="4" ry="5" fill="#5c4033" stroke="none" />
            <circle cx="98.5" cy="31.5" r="1.5" fill="#fff" stroke="none" />
            <ellipse cx="100" cy="44" rx="6" ry="4" fill="#ffb3c6" stroke="none" />
            <ellipse cx="111" cy="44" rx="4" ry="7" fill="#a34063" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}
