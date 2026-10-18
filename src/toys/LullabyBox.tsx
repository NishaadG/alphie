import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card";
import { applyMute, playLullaby, stopLullaby } from "../lib/audio";
import { mulberry32, randomSeed } from "../lib/rng";
import { setState, useApp } from "../lib/store";

const LENGTH = 32;

// A ±1 random walk, nudged back towards the middle so the tune stays singable.
function walk(seed: number): number[] {
  const rng = mulberry32(seed);
  const out = [0];
  for (let i = 1; i < LENGTH; i++) {
    const prev = out[i - 1];
    const pull = prev > 3 ? 0.35 : prev < -3 ? 0.65 : 0.5;
    out.push(prev + (rng() < pull ? 1 : -1));
  }
  return out;
}

// Music box: Alphie's random-walk crawl becomes the lullaby melody.
export function LullabyBox() {
  const muted = useApp((s) => s.muted);
  const [seed, setSeed] = useState(17);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const notes = useMemo(() => walk(seed), [seed]);

  useEffect(() => {
    if (playing && !muted) playLullaby(notes, setStep);
    else {
      stopLullaby();
      setStep(-1);
    }
    return () => stopLullaby();
  }, [playing, muted, notes]);

  const toggle = () => {
    if (!playing && muted) {
      applyMute(false);
      setState({ muted: false });
    }
    setPlaying((p) => !p);
  };

  return (
    <Card
      title="Random-Walk Lullaby Box" tint="lilac"
      icon="music"
      status={
        <>
          <span>{playing ? "♪ playing" : "■ stopped"}</span>
          <span>tune #{seed}</span>
        </>
      }
    >
      <p className="caption">
        Alphie's crawl goes up or down one step at a time, at random. Turn each step into a note and you get her bedtime song.
      </p>
      <div className="musicbox well" role="img" aria-label="Music box drum showing the notes of the random-walk melody">
        {notes.map((n, i) => (
          <span
            key={i}
            className={`musicbox__pin ${i === step ? "is-on" : ""}`}
            style={{ bottom: `${50 + n * 7}%`, left: `${(i / (LENGTH - 1)) * 94 + 3}%` }}
          />
        ))}
        {step >= 0 && <span className="musicbox__head" style={{ left: `${(step / (LENGTH - 1)) * 94 + 3}%` }} />}
      </div>
      <div className="controls">
        <button type="button" className="btn" onClick={toggle} aria-pressed={playing} data-sound="none">
          {playing ? "■ Stop" : "▶ Wind it up"}
        </button>
        <button type="button" className="btn" onClick={() => setSeed(randomSeed() % 10000)}>
          New crawl, new song
        </button>
      </div>
      {muted && <p className="caption">Sound is muted. Winding it up turns sound back on.</p>}
    </Card>
  );
}
