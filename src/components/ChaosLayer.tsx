import { useEffect, useMemo } from "react";
import { blip } from "../lib/audio";
import { say, useApp } from "../lib/store";

const STICKERS = ["🌀", "✨", "🦆", "📈", "📉", "🍼", "🎈", "⭐", "🧸", "💾"];

// Extra decorations that only exist in Chaos Mode. Sticker positions are
// percentages, so they stay on screen at any size.
export function ChaosLayer() {
  const chaos = useApp((s) => s.chaos);
  const stickers = useMemo(
    () =>
      STICKERS.map((s, i) => ({
        s,
        left: `${(i * 37) % 92 + 2}%`,
        top: `${((i * 53) % 70) + 12}%`,
        delay: `${-i * 0.4}s`,
      })),
    [],
  );

  useEffect(() => {
    if (!chaos) return;
    blip("up");
    say("TANTRUM!! WAAAH!! Everything is going EVERYWHERE!!", 3500);
  }, [chaos]);

  if (!chaos) return null;
  return (
    <>
      <div className="chaos-marquee" aria-hidden="true">
        <span>★ ALPHIE IS HAVING A TANTRUM ★ DRAG THE CARDS AROUND ★ NAP TIME IS CANCELLED ★ SIGN MY GUESTBOOK ★ NO BETAS ALLOWED ★</span>
      </div>
      {stickers.map((st, i) => (
        <span key={i} className="chaos-sticker" style={{ left: st.left, top: st.top, animationDelay: st.delay }} aria-hidden="true">
          {st.s}
        </span>
      ))}
    </>
  );
}
