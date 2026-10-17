import { useEffect, useState } from "react";
import { load } from "../lib/memory";

const DIGITS = 7;

async function fetchHits(): Promise<number | null> {
  let counted = false;
  try {
    counted = sessionStorage.getItem("alphie:counted") === "1";
  } catch {
    // no session storage: count once per page load instead
  }
  try {
    const res = await fetch("/api/counter", { method: counted ? "GET" : "POST" });
    if (!res.ok) return null;
    const { hits } = (await res.json()) as { hits: number };
    try {
      sessionStorage.setItem("alphie:counted", "1");
    } catch {
      // ignore
    }
    return hits;
  } catch {
    return null;
  }
}

// A vintage odometer: each digit is a rolling column of 0-9.
export function HitCounter() {
  const [hits, setHits] = useState<number | null>(null);
  const [live, setLive] = useState(true);

  useEffect(() => {
    let alive = true;
    void fetchHits().then((n) => {
      if (!alive) return;
      if (n === null) {
        setLive(false);
        setHits(load<{ visits: number }>("visit", { visits: 1 }).visits);
      } else setHits(n);
    });
    return () => {
      alive = false;
    };
  }, []);

  const digits = String(hits ?? 0).padStart(DIGITS, "0").slice(-DIGITS).split("");

  return (
    <div className="hitcounter" aria-live="polite">
      <span className="hitcounter__label pixel">{live ? "You are visitor #" : "Your visits here:"}</span>
      <span className="odometer bevel-in" role="img" aria-label={hits === null ? "Counting visitors" : `${hits} visits`}>
        {digits.map((d, i) => (
          <span key={i} className="odometer__digit">
            <span className="odometer__col" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
              {"0123456789".split("").map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
