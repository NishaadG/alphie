import { useEffect, useState } from "react";
import { blip } from "../lib/audio";
import { onKonami, onWord } from "../lib/eggs";
import { rememberEgg } from "../lib/memory";
import { flashMood, say } from "../lib/store";

export type Egg = "swan" | "crash" | null;

async function confetti(opts: Record<string, unknown>) {
  const { default: fire } = await import("canvas-confetti");
  void fire({ disableForReducedMotion: true, ...opts });
}

// Global Easter eggs: Konami flash crash, typed "alpha", and the black swan
// (triggered from the pacifier, so it is passed in as `swan`).
export function EggLayer({ swan, onSwanDone }: { swan: boolean; onSwanDone: () => void }) {
  const [crash, setCrash] = useState(false);

  useEffect(() => {
    const offK = onKonami(() => {
      rememberEgg("crash");
      setCrash(true);
      blip("down");
      flashMood("tantrum", 3200);
      say("FLASH CRASH!! Everybody stay calm!! WAAAH!!", 3200);
      window.setTimeout(() => {
        setCrash(false);
        blip("up");
        say("…and we're back. Markets recover, so do babies.");
      }, 3200);
    });
    const offW = onWord("alpha", () => {
      rememberEgg("word");
      flashMood("wow");
      blip("coin");
      say("AL-PHA! 🎉 My very first word!! (Mama is second. Beta is never.)", 5000);
      void confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 }, colors: ["#a34063", "#ffd166", "#2f9e6b"] });
    });
    return () => {
      offK();
      offW();
    };
  }, []);

  useEffect(() => {
    if (!swan) return;
    rememberEgg("swan");
    flashMood("tantrum", 3000);
    blip("down");
    say("A BLACK SWAN?! That wasn't in my model!! 😭", 3500);
    void confetti({ particleCount: 60, spread: 120, colors: ["#111111", "#444444", "#ffffff"], shapes: ["circle"] });
    const t = window.setTimeout(onSwanDone, 4000);
    return () => window.clearTimeout(t);
  }, [swan, onSwanDone]);

  useEffect(() => {
    document.documentElement.classList.toggle("crash", crash);
  }, [crash]);

  return (
    <>
      {swan && (
        <div className="swan" aria-hidden="true">
          🦢
        </div>
      )}
      {crash && <div className="crt" aria-hidden="true" />}
    </>
  );
}
