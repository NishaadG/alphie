import { useEffect, useState } from "react";

const LINES = [
  "AlphieOS 98  (c) Nursery Capital Mgmt",
  "Checking diaper ............ OK",
  "Warming bottle ............. 37.0°C",
  "Loading random walk ........ OK",
  "Calibrating volatility ..... σ = cute",
  "Beating the benchmark ...... (sometimes)",
];

// Fake BIOS boot. Skippable with any key or tap, and skipped for repeat visits.
export function BootScreen({ onDone, fast }: { onDone: () => void; fast: boolean }) {
  const [shown, setShown] = useState(0);
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (fast || reduced) {
      onDone();
      return;
    }
    const id = window.setInterval(() => setShown((n) => n + 1), 260);
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [fast, reduced, onDone]);

  useEffect(() => {
    if (shown > LINES.length + 1) onDone();
  }, [shown, onDone]);

  if (fast || reduced) return null;

  return (
    <div className="boot pixel" role="status" aria-live="polite">
      <div className="boot__inner">
        {LINES.slice(0, shown).map((l) => (
          <p key={l}>{l}</p>
        ))}
        <p className="boot__cursor">█</p>
        <p className="boot__hint">press any key or tap to skip</p>
      </div>
    </div>
  );
}
