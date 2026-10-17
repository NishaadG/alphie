import { useCallback, useEffect, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { CharacterSheet } from "./components/CharacterSheet";
import { EggLayer } from "./components/EggLayer";
import { Hero } from "./components/Hero";
import { SparkleTrail } from "./components/SparkleTrail";
import { Taskbar } from "./components/Taskbar";
import { Ticker } from "./components/Ticker";
import { installClickSounds } from "./lib/clickSounds";
import { recordVisit, type VisitMemory } from "./lib/memory";
import { useApp } from "./lib/store";

// Read once per page load (outside React so StrictMode can't count it twice).
const memory: VisitMemory = recordVisit();

export default function App() {
  const [booted, setBooted] = useState(false);
  const [swan, setSwan] = useState(false);
  const market = useApp((s) => s.market);
  const chaos = useApp((s) => s.chaos);

  useEffect(() => installClickSounds(), []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.market = market;
    root.classList.toggle("chaos", chaos);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", market === "bull" ? "#fff8f1" : "#1f1830");
  }, [market, chaos]);

  const onBooted = useCallback(() => setBooted(true), []);
  const onSwanDone = useCallback(() => setSwan(false), []);

  return (
    <>
      {!booted && <BootScreen onDone={onBooted} fast={memory.visits > 0} />}
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Ticker />
      <main id="main" className="desktop">
        <div className="row row--hero">
          <Hero memory={memory} onSwan={() => setSwan(true)} />
          <CharacterSheet />
        </div>
      </main>
      <Taskbar />
      <SparkleTrail />
      <EggLayer swan={swan} onSwanDone={onSwanDone} />
    </>
  );
}
