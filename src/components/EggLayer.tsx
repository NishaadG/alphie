import { useEffect, useState } from "react";
import { blip } from "../lib/audio";
import { onKonami, onWord } from "../lib/eggs";
import { navigate } from "../lib/router";
import { collect } from "../lib/stickers";
import { flashMood, say, setState, useApp } from "../lib/store";
import { Icon } from "./Icon";

async function confetti(opts: Record<string, unknown>) {
  const { default: fire } = await import("canvas-confetti");
  void fire({ disableForReducedMotion: true, ...opts });
}

// Global Easter eggs: Konami flash crash, typed "alpha" and "beta", and the black swan
// (set in the store by booping the pacifier seven times).
export function EggLayer() {
  const swan = useApp((s) => s.swan);
  const [crash, setCrash] = useState(false);

  useEffect(() => {
    const offK = onKonami(() => {
      collect("crash");
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
      collect("word");
      flashMood("wow");
      blip("coin");
      say("AL-PHA! 🎉 My very first word!! (Mama is second. Beta is never.)", 5000);
      void confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 }, colors: ["#a34063", "#ffd166", "#8fd6b4", "#9fc9f5"] });
    });
    // Typing the teddy's name opens his secret room.
    const offB = onWord("beta", () => navigate("/beta"));
    return () => {
      offK();
      offW();
      offB();
    };
  }, []);

  useEffect(() => {
    if (!swan) return;
    collect("swan");
    flashMood("tantrum", 3000);
    blip("down");
    say("A BLACK SWAN?! That wasn't in my model!! 😭", 3500);
    void confetti({ particleCount: 60, spread: 120, colors: ["#111111", "#444444", "#ffffff"], shapes: ["circle"] });
    const t = window.setTimeout(() => setState({ swan: false }), 4000);
    return () => window.clearTimeout(t);
  }, [swan]);

  useEffect(() => {
    document.documentElement.classList.toggle("crash", crash);
  }, [crash]);

  return (
    <>
      {swan && (
        <div className="swan" aria-hidden="true">
          <Icon name="swan" size={110} />
        </div>
      )}
      {crash && <div className="crt" aria-hidden="true" />}
    </>
  );
}
