import { useEffect, useState } from "react";

const LINES = [
  "Warming the bottle… 37°C 🍼",
  "Finding the σ pacifier… found!",
  "Counting toes… 10 ✓",
  "Winding up the crib mobile…",
  "Waking Alphie up… 👶",
];

// A soft "waking up" screen with a duck progress bar. Skippable with any key
// or tap, and skipped entirely for repeat visits and reduced motion.
export function BootScreen({ onDone, fast }: { onDone: () => void; fast: boolean }) {
  const [shown, setShown] = useState(1);
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (fast || reduced) {
      onDone();
      return;
    }
    const id = window.setInterval(() => setShown((n) => n + 1), 380);
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
  const progress = Math.min(1, shown / LINES.length);

  return (
    <div className="boot" role="status" aria-live="polite">
      <div className="boot__inner">
        <div className="boot__mobile" aria-hidden="true">
          <span>⭐</span>
          <span>🌙</span>
          <span>☁️</span>
          <span>🦆</span>
        </div>
        <p className="boot__title">Alphie's Nursery</p>
        <p className="boot__line crayon">{LINES[Math.min(shown, LINES.length) - 1]}</p>
        <div className="boot__bar" aria-hidden="true">
          <div className="boot__fill" style={{ width: `${progress * 100}%` }}>
            <span className="boot__duck">🐥</span>
          </div>
        </div>
        <p className="boot__hint">tap anywhere to skip</p>
      </div>
    </div>
  );
}
