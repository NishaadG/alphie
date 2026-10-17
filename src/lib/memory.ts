// localStorage wrapper. Storage can be missing or throw (private mode,
// blocked site data), so every access is guarded and falls back silently.
const PREFIX = "alphie:";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable; the site still works, it just forgets
  }
}

export interface VisitMemory {
  visits: number;
  lastVisit: number | null;
  eggsFound: string[];
}

// Read the previous visit, then record this one.
export function recordVisit(): VisitMemory {
  const prev = load<VisitMemory>("visit", { visits: 0, lastVisit: null, eggsFound: [] });
  save<VisitMemory>("visit", { ...prev, visits: prev.visits + 1, lastVisit: Date.now() });
  return prev;
}

export function rememberEgg(id: string): void {
  const v = load<VisitMemory>("visit", { visits: 1, lastVisit: Date.now(), eggsFound: [] });
  if (!v.eggsFound.includes(id)) save("visit", { ...v, eggsFound: [...v.eggsFound, id] });
}
