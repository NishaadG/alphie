import { useEffect, useRef, useState } from "react";
import { blip } from "../lib/audio";
import { type VisitMemory } from "../lib/memory";
import { flashMood, say, setState, useApp } from "../lib/store";
import { Alphie } from "./Alphie";

function greeting(m: VisitMemory): string {
  if (!m.lastVisit) return "Goo goo! I'm Alphie. Wanna see my toys?";
  const days = Math.floor((Date.now() - m.lastVisit) / 86_400_000);
  const when = days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
  const eggs = m.eggsFound.length ? ` You have ${m.eggsFound.length} stickers on your chart!` : "";
  return `You came back!! Visit #${m.visits + 1}. Last time was ${when}.${eggs}`;
}

// Alphie knows what time it is where you are.
function clockLine(hour: number): string | null {
  if (hour < 5) return `Why are you up at ${hour === 0 ? 12 : hour}am?! Even the market's asleep! Shhh.`;
  if (hour < 8) return "You're up early! Pre-market crawl? I like your style.";
  if (hour >= 21) return "It's past my bedtime… try the Bedtime button? *yawn*";
  return null;
}

const BELLY = ["Hehe! That tickles my portfolio!", "Boop! +2 basis points of giggles.", "Stop! I'm rebalancing!", "*burp* sorry, liquidity event."];
const NAME = ["A", "l", "p", "h", "i", "e"];

export function Hero({ memory }: { memory: VisitMemory }) {
  const speech = useApp((s) => s.speech);
  const asleep = useApp((s) => s.asleep);
  const market = useApp((s) => s.market);
  const [first] = useState(() => greeting(memory));
  const boops = useRef(0);
  const belly = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => say(first, 6000), 500);
    const late = clockLine(new Date().getHours());
    const t2 = late ? window.setTimeout(() => say(late, 6000), 7000) : undefined;
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [first]);

  // At bedtime (bear market) Alphie dozes off if nobody plays with her.
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
    say("Huh?! Did the market open?! …Oh, it's you. Hi!");
    return true;
  };

  const onPacifier = () => {
    if (wake()) return;
    boops.current++;
    blip("squeak");
    if (boops.current >= 7) {
      boops.current = 0;
      setState({ swan: true });
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
    <section className="hero" aria-labelledby="hero-name">
      <div className="hero__stage">
        {speech && (
          <p className="bubble" role="status" aria-live="polite">
            {speech}
          </p>
        )}
        <div className="hero__mat" aria-hidden="true" />
        <div className="hero__alphie" onClick={() => wake()}>
          <Alphie size={250} onPacifier={onPacifier} onBelly={onBelly} />
        </div>
        {asleep && (
          <button type="button" className="btn hero__wake" onClick={() => wake()} data-sound="none">
            Wake her up
          </button>
        )}
      </div>
      <div className="hero__copy">
        <p className="hero__hello crayon">hi, my name is…</p>
        <h1 id="hero-name" className="hero__name" aria-label="Alphie">
          {NAME.map((ch, i) => (
            <span key={i} className={`hero__letter hero__letter--${i}`} aria-hidden="true">
              {ch}
            </span>
          ))}
        </h1>
        <p className="hero__tag">“Born to beat the benchmark. <i>(Sometimes.)</i>”</p>
        <p>
          Alpha Brownian-Motion, <b>Alphie</b> for short, is 11 months old and the tiniest quant in the world. She crawls in random
          walks, prices her bottles with Black-Scholes and is <i>very</i> competitive with her teddy, Beta.
        </p>
        <p className="caption">Psst: she's watching your cursor. Boop her pacifier. Poke her tummy.</p>
      </div>
    </section>
  );
}
