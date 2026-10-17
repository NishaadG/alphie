import { useEffect, useRef, useState } from "react";
import { blip } from "../lib/audio";
import { type VisitMemory } from "../lib/memory";
import { flashMood, say, setState, useApp } from "../lib/store";
import { Alphie } from "./Alphie";
import { RetroWindow } from "./RetroWindow";

interface Props {
  memory: VisitMemory;
  onSwan: () => void;
}

function greeting(m: VisitMemory): string {
  if (!m.lastVisit) return "Goo goo! I'm Alphie. Wanna see my toys?";
  const days = Math.floor((Date.now() - m.lastVisit) / 86_400_000);
  const when = days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
  const eggs = m.eggsFound.length ? ` You found ${m.eggsFound.length} of my secrets!` : "";
  return `Welcome back! Visit #${m.visits + 1}. Last time was ${when}.${eggs}`;
}

const BELLY = ["Hehe! That tickles my portfolio!", "Boop! +2 basis points of giggles.", "Stop! I'm rebalancing!", "*burp* sorry, liquidity event."];

export function Hero({ memory, onSwan }: Props) {
  const speech = useApp((s) => s.speech);
  const asleep = useApp((s) => s.asleep);
  const market = useApp((s) => s.market);
  const [first] = useState(() => greeting(memory));
  const boops = useRef(0);
  const belly = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => say(first, 6000), 400);
    return () => window.clearTimeout(t);
  }, [first]);

  // In a bear market Alphie dozes off if nobody plays with her.
  useEffect(() => {
    if (market !== "bear") {
      setState({ asleep: false });
      return;
    }
    let t = window.setTimeout(() => setState({ asleep: true }), 20000);
    const reset = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setState({ asleep: true }), 20000);
    };
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [market]);

  const wake = () => {
    if (!asleep) return false;
    setState({ asleep: false });
    flashMood("wow");
    blip("up");
    say("Huh?! Did the market open?! ...Oh, it's you. Hi!");
    return true;
  };

  const onPacifier = () => {
    if (wake()) return;
    boops.current++;
    blip("squeak");
    if (boops.current >= 7) {
      boops.current = 0;
      onSwan();
    } else if (boops.current >= 4) {
      say(`${7 - boops.current} more boops and something RARE happens…`);
    }
  };

  const onBelly = () => {
    if (wake()) return;
    blip("squeak");
    say(BELLY[belly.current++ % BELLY.length], 2500);
  };

  return (
    <RetroWindow title="hello_world.exe — Meet Alphie" icon="👶" id="hello" status={<><span>Mood: {asleep ? "zzz" : market === "bull" ? "bullish" : "bearish"}</span><span>σ 0.20</span></>}>
      <div className="hero">
        <div className="hero__stage">
          {speech && (
            <p className="bubble" role="status" aria-live="polite">
              {speech}
            </p>
          )}
          <div className="hero__alphie" onClick={() => wake()}>
            <Alphie onPacifier={onPacifier} onBelly={onBelly} />
          </div>
          {asleep && (
            <button type="button" className="btn98 hero__wake" onClick={() => wake()} data-sound="none">
              ⏰ Wake her up
            </button>
          )}
        </div>
        <div className="hero__copy">
          <h1 className="hero__name">
            Alphie<span className="pixel">.exe</span>
          </h1>
          <p className="hero__tag">“Born to beat the benchmark. <i>(Sometimes.)</i>”</p>
          <p>
            Alpha Brownian-Motion, <b>Alphie</b> for short, is 11 months old and already a junior quant. She crawls in random
            walks, prices her bottles with Black-Scholes and is <i>very</i> competitive with her teddy, Beta.
          </p>
          <p className="caption">Psst: she's watching your cursor. Boop her pacifier. Poke her belly.</p>
        </div>
      </div>
    </RetroWindow>
  );
}
