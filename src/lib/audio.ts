import { getState } from "./store";

// One shared AudioContext, created on the first user gesture (browsers
// block audio before that). Every sound goes through `master`, so mute is
// a single gain change and nothing can play while muted.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (getState().muted) return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master! };
}

export function applyMute(muted: boolean): void {
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(muted ? 0 : 0.5, ctx.currentTime, 0.02);
  if (muted) stopLullaby();
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, peak: number) {
  const a = audio();
  if (!a) return;
  const osc = a.ctx.createOscillator();
  const g = a.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g).connect(a.master);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

export type Blip = "click" | "open" | "close" | "coin" | "up" | "down" | "squeak" | "error";

export function blip(kind: Blip = "click"): void {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  switch (kind) {
    case "click":
      tone(880, t, 0.06, "square", 0.08);
      break;
    case "open":
      tone(523, t, 0.08, "triangle", 0.15);
      tone(784, t + 0.07, 0.12, "triangle", 0.15);
      break;
    case "close":
      tone(784, t, 0.08, "triangle", 0.15);
      tone(523, t + 0.07, 0.12, "triangle", 0.15);
      break;
    case "coin":
      tone(988, t, 0.07, "square", 0.08);
      tone(1319, t + 0.07, 0.2, "square", 0.08);
      break;
    case "up":
      [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.08, 0.15, "triangle", 0.15));
      break;
    case "down":
      [784, 622, 523, 392].forEach((f, i) => tone(f, t + i * 0.1, 0.2, "sawtooth", 0.06));
      break;
    case "squeak":
      {
        const osc = a.ctx.createOscillator();
        const g = a.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.12);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.connect(g).connect(a.master);
        osc.start(t);
        osc.stop(t + 0.2);
      }
      break;
    case "error":
      tone(196, t, 0.25, "square", 0.08);
      break;
  }
}

// Music box lullaby: a random walk mapped onto a pentatonic scale,
// so Alphie's crawl literally becomes the melody.
const PENTA = [0, 2, 4, 7, 9];
let lullabyTimer: number | null = null;

export function noteFromLevel(level: number, base = 72): number {
  const i = Math.round(level);
  const octave = Math.floor(i / PENTA.length);
  const degree = ((i % PENTA.length) + PENTA.length) % PENTA.length;
  const midi = base + octave * 12 + PENTA[degree];
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function playLullaby(walk: number[], onStep?: (i: number) => void): void {
  stopLullaby();
  const a = audio();
  if (!a) return;
  let i = 0;
  const beat = 0.42;
  const step = () => {
    const now = audio();
    if (!now) return stopLullaby();
    const t = now.ctx.currentTime + 0.02;
    const level = Math.max(-6, Math.min(6, walk[i % walk.length]));
    tone(noteFromLevel(level), t, 1.2, "sine", 0.18);
    tone(noteFromLevel(level) * 2, t, 0.5, "triangle", 0.03); // music-box tine shimmer
    if (i % 4 === 0) tone(noteFromLevel(Math.round(level) - 5, 60), t, 1.6, "sine", 0.08);
    onStep?.(i % walk.length);
    i++;
    lullabyTimer = window.setTimeout(step, beat * 1000);
  };
  step();
}

export function stopLullaby(): void {
  if (lullabyTimer !== null) window.clearTimeout(lullabyTimer);
  lullabyTimer = null;
}

export function isLullabyPlaying(): boolean {
  return lullabyTimer !== null;
}
