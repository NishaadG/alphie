import { useSyncExternalStore } from "react";
import { load, save } from "./memory";

export type Market = "bull" | "bear";

export interface AppState {
  market: Market;
  muted: boolean;
  chaos: boolean;
  asleep: boolean;
  speech: string | null;
  mood: "tantrum" | "wow" | null;
  swan: boolean;
  napping: boolean; // dozed off because nobody moved (dims the room)
  found: string[]; // sticker ids
  toast: string | null; // sticker just earned
}

const prefersDark =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;

let state: AppState = {
  market: load<Market>("market", prefersDark ? "bear" : "bull"),
  muted: load<boolean>("muted", false),
  chaos: false,
  asleep: false,
  speech: null,
  mood: null,
  swan: false,
  napping: false,
  found: load<{ eggsFound?: string[] }>("visit", {}).eggsFound ?? [],
  toast: null,
};

const listeners = new Set<() => void>();

export function getState(): AppState {
  return state;
}

export function setState(patch: Partial<AppState>): void {
  state = { ...state, ...patch };
  if ("market" in patch) save("market", state.market);
  if ("muted" in patch) save("muted", state.muted);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

let speechTimer: number | undefined;
let moodTimer: number | undefined;

// Show a speech bubble from Alphie for a few seconds.
export function say(text: string, ms = 4000): void {
  window.clearTimeout(speechTimer);
  setState({ speech: text });
  speechTimer = window.setTimeout(() => setState({ speech: null }), ms);
}

export function flashMood(mood: "tantrum" | "wow", ms = 2500): void {
  window.clearTimeout(moodTimer);
  setState({ mood });
  moodTimer = window.setTimeout(() => setState({ mood: null }), ms);
}

export function useApp<T>(select: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state));
}
