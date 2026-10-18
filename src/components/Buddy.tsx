import { usePath } from "../lib/router";
import { useApp } from "../lib/store";
import { Alphie } from "./Alphie";

// A little Alphie peeking from the corner on every page except Home (which
// has the big one), so her speech bubbles show up wherever you are.
export function Buddy() {
  const path = usePath();
  const speech = useApp((s) => s.speech);
  if (path === "/") return null;
  return (
    <div className="buddy">
      {speech && (
        <p className="bubble bubble--buddy" role="status" aria-live="polite">
          {speech}
        </p>
      )}
      <Alphie size={78} className="buddy__alphie" />
    </div>
  );
}
