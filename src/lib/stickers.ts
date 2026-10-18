import { blip } from "./audio";
import type { IconName } from "./icons";
import { rememberEgg } from "./memory";
import { getState, setState } from "./store";

export interface Sticker {
  id: string;
  name: string;
  icon: IconName;
  hint: string; // shown before it's found
  how: string; // shown after
}

// Alphie's sticker chart: one sticker for every secret and milestone.
export const STICKERS: Sticker[] = [
  { id: "explorer", name: "Explorer", icon: "home", hint: "Crawl into every room.", how: "You visited every room in the nursery." },
  { id: "peekaboo", name: "Peekaboo!", icon: "baby", hint: "She hides at the edges. Be quick.", how: "You caught Alphie peeking." },
  { id: "crawler", name: "Wheee!", icon: "foot", hint: "Someone is crawling on the floor.", how: "You tickled Alphie on the nursery floor." },
  { id: "tantrum", name: "Meltdown", icon: "tantrum", hint: "Some buttons are best left alone.", how: "You crashed the whole nursery market." },
  { id: "bedtime", name: "Night Owl", icon: "moon", hint: "Put the nursery to bed.", how: "You switched on Bedtime (a bear market)." },
  { id: "nap", name: "Shhh…", icon: "cloud", hint: "Sit very, very still.", how: "Alphie dozed off while you watched." },
  { id: "comeback", name: "Come Back!", icon: "heart", hint: "Go away. Then come back.", how: "You left the tab and Alphie missed you." },
  { id: "swan", name: "Black Swan", icon: "swan", hint: "Boop something seven times.", how: "Seven pacifier boops summoned a black swan." },
  { id: "word", name: "First Word", icon: "chat", hint: "Type her favourite word.", how: "You typed “alpha”, her very first word." },
  { id: "crash", name: "Flash Crash", icon: "sparkle", hint: "↑ ↑ ↓ ↓ ← → ← → B A", how: "The Konami code crashed the market." },
  { id: "beta-room", name: "Teddy Spy", icon: "teddy", hint: "Type the teddy's name.", how: "You found Beta's secret (boring) room." },
  { id: "lost", name: "Lost Crawler", icon: "dice", hint: "Crawl somewhere that doesn't exist.", how: "You random-walked off the map." },
  { id: "beat-beta", name: "Shop Keeper", icon: "blocks", hint: "Out-trade Beta at the toy shop.", how: "You beat Beta at Order-Book Blocks." },
  { id: "real-alpha", name: "Real Alpha", icon: "piggy", hint: "Beat buy-and-hold by 10%.", how: "You made 10% alpha in Baby's First Trade." },
  { id: "guestbook", name: "Pen Pal", icon: "pencil", hint: "Leave Alphie a note.", how: "You signed the guestbook." },
  { id: "report", name: "Report Card", icon: "star", hint: "Take your grades home.", how: "You downloaded your report card." },
];

// Award a sticker (once). Shows a little toast and remembers it for next time.
export function collect(id: string): void {
  const { found } = getState();
  if (found.includes(id)) return;
  const sticker = STICKERS.find((s) => s.id === id);
  if (!sticker) return;
  rememberEgg(id);
  blip("coin");
  setState({ found: [...found, id], toast: id });
  window.setTimeout(() => {
    if (getState().toast === id) setState({ toast: null });
  }, 4200);
}
