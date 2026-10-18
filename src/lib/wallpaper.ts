import { iconGroup, type IconName } from "./icons";

// Nursery wallpaper: each room gets its own tiny repeating print, built from
// Alphie's icons and set as a CSS variable on <html>.
export type Room = "home" | "play" | "story" | "nap" | "monitor" | "guest";

const PRINTS: Record<Room, IconName[]> = {
  home: ["duck", "heart", "star", "bottle"],
  play: ["blocks", "rattle", "teddy", "star"],
  story: ["duck", "book", "star", "cloud"],
  nap: ["moon", "star", "cloud", "sparkle"],
  monitor: ["cloud", "heart", "duck", "music"],
  guest: ["heart", "bow", "pencil", "star"],
};

// A half-drop layout: four motifs per 240px tile, each tilted a little.
const SPOTS: Array<[number, number, number]> = [
  [22, 26, -12],
  [142, 62, 10],
  [80, 146, 8],
  [196, 182, -14],
];

const cache = new Map<string, string>();

export function wallpaper(room: Room, night: boolean): string {
  const key = `${room}-${night}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const motifs = night ? PRINTS.nap : PRINTS[room];
  const ink = night ? "#f6eaff" : "#5c4033";
  const body = SPOTS.map(([x, y, r], i) => iconGroup(motifs[i % motifs.length], x, y, 30, r, ink)).join("");
  // Two tiny accent dots between the motifs keep the print from looking sparse.
  const dots = `<g fill="${night ? "#fff8c4" : "#f3a9c0"}"><circle cx="100" cy="40" r="2.5"/><circle cx="30" cy="110" r="2.5"/><circle cx="170" cy="130" r="2.5"/><circle cx="130" cy="216" r="2.5"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><g opacity="${night ? 0.2 : 0.32}">${body}${dots}</g></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  cache.set(key, url);
  return url;
}

export function roomFor(path: string): Room {
  if (path.startsWith("/playroom") || path.startsWith("/toys")) return "play";
  if (path.startsWith("/storybook")) return "story";
  if (path.startsWith("/nap-room")) return "nap";
  if (path.startsWith("/monitor")) return "monitor";
  if (path.startsWith("/guestbook")) return "guest";
  return "home";
}
