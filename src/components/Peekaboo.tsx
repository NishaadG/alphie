import { useEffect, useState } from "react";
import { blip } from "../lib/audio";
import { collect } from "../lib/stickers";
import { say } from "../lib/store";

const LINES = ["Peekaboo!!", "Boo! Did I scare your portfolio?", "I see you!", "Peekaboo! Hiding is my favourite strategy.", "You found me! +1 alpha"];

type Peek = { side: "left" | "right"; top: number } | null;

// Every so often Alphie peeks in from the side of the screen. Catch her
// (click or tap) before she ducks away again.
export function Peekaboo() {
  const [peek, setPeek] = useState<Peek>(null);

  useEffect(() => {
    let t: number;
    const hide = () => {
      setPeek(null);
      t = window.setTimeout(show, 22000 + Math.random() * 20000);
    };
    const show = () => {
      setPeek({ side: Math.random() < 0.5 ? "left" : "right", top: 28 + Math.random() * 34 });
      t = window.setTimeout(hide, 4200);
    };
    t = window.setTimeout(show, 9000);
    return () => window.clearTimeout(t);
  }, []);

  if (!peek) return null;

  const caught = () => {
    blip("giggle");
    collect("peekaboo");
    say(LINES[Math.floor(Math.random() * LINES.length)], 3000);
    setPeek(null);
  };

  return (
    <button
      type="button"
      className={`peek peek--${peek.side}`}
      style={{ top: `${peek.top}vh` }}
      onClick={caught}
      aria-label="Alphie is peeking! Catch her"
      data-sound="none"
    >
      <svg viewBox="0 0 120 104" width="104" height="90" aria-hidden="true">
        <g stroke="#5c4033" strokeWidth="4">
          <circle cx="18" cy="62" r="10" fill="#ffd9c2" />
          <circle cx="102" cy="62" r="10" fill="#ffd9c2" />
          <circle cx="60" cy="60" r="44" fill="#ffd9c2" />
        </g>
        <path d="M54 17 Q57 4 68 8 Q75 12 67 18" fill="none" stroke="#5c4033" strokeWidth="4" strokeLinecap="round" />
        <g transform="translate(34 24) rotate(-18)" stroke="#5c4033" strokeWidth="3" strokeLinejoin="round" fill="#ff9fbd">
          <path d="M0 0 Q-14 -12 -18 -4 Q-19 6 -11 8 Q-4 8 0 0 Z" />
          <path d="M0 0 Q14 -12 18 -4 Q19 6 11 8 Q4 8 0 0 Z" />
          <circle r="4.5" fill="#ffc6d9" />
        </g>
        <ellipse cx="34" cy="74" rx="9" ry="7" fill="#ffb3c6" />
        <ellipse cx="86" cy="74" rx="9" ry="7" fill="#ffb3c6" />
        <g fill="#5c4033">
          <ellipse cx="44" cy="58" rx="6" ry="7.5" />
          <ellipse cx="76" cy="58" rx="6" ry="7.5" />
        </g>
        <circle cx="46" cy="55" r="2.2" fill="#fff" />
        <circle cx="78" cy="55" r="2.2" fill="#fff" />
        <path d="M48 78 Q60 92 72 78 Z" fill="#a34063" stroke="#5c4033" strokeWidth="3" strokeLinejoin="round" />
        {/* little hands gripping the edge of the screen */}
        <g fill="#ffd9c2" stroke="#5c4033" strokeWidth="3.5">
          <ellipse cx="30" cy="98" rx="13" ry="9" />
          <ellipse cx="90" cy="98" rx="13" ry="9" />
        </g>
      </svg>
    </button>
  );
}
