import { useEffect } from "react";
import { blip } from "./audio";
import { iconGroup, type IconName } from "./icons";
import { load, save } from "./memory";
import { collect } from "./stickers";
import { getState, say, setState } from "./store";

// Small app-wide behaviours that make the nursery feel alive.

const CRYING_FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="34" r="26" fill="#ffd9c2" stroke="#5c4033" stroke-width="3"/><path d="M18 26l9 4-9 4M46 26l-9 4 9 4" fill="none" stroke="#5c4033" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 38q-4 8 0 10 4-2 0-10zM47 38q-4 8 0 10 4-2 0-10z" fill="#8fd0ff" stroke="#4a8fc4" stroke-width="1.5"/><ellipse cx="32" cy="47" rx="7" ry="6" fill="#a34063" stroke="#5c4033" stroke-width="2.5"/><path d="M30 8 q4 -6 6 2" stroke="#5c4033" stroke-width="3" fill="none"/></svg>`,
  );

// Leave the tab and Alphie cries in the tab title (and favicon) until you
// come back.
export function useTabTricks(): void {
  useEffect(() => {
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const normalIcon = icon?.href ?? "/favicon.svg";
    let savedTitle = document.title;
    let restore: number | undefined;
    const onChange = () => {
      if (document.hidden) {
        window.clearTimeout(restore);
        savedTitle = document.title.startsWith("Yay") ? savedTitle : document.title;
        document.title = "Come back!! WAAAH 😭";
        if (icon) icon.href = CRYING_FAVICON;
      } else {
        document.title = "Yay!! You're back!! 💖";
        if (icon) icon.href = normalIcon;
        say("You came back!! I missed you SO much (for 4 seconds).", 3500);
        collect("comeback");
        restore = window.setTimeout(() => (document.title = savedTitle), 2200);
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => {
      window.clearTimeout(restore);
      document.removeEventListener("visibilitychange", onChange);
    };
  }, []);
}

const NAP_AFTER = 60_000;

// If nobody moves for a minute, Alphie dozes off on every page and the room
// dims. Any movement wakes her up.
export function useIdleNap(): void {
  useEffect(() => {
    let t = 0;
    const doze = () => {
      const s = getState();
      if (s.chaos || s.asleep) return arm();
      setState({ asleep: true, napping: true });
      collect("nap");
    };
    const arm = () => {
      window.clearTimeout(t);
      t = window.setTimeout(doze, NAP_AFTER);
    };
    const activity = () => {
      if (getState().napping) {
        setState({ asleep: false, napping: false });
        blip("up");
        say("Huh?! You woke me up!! …OK fine, I'm awake. Hi.", 3000);
      }
      arm();
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, activity, { passive: true }));
    arm();
    return () => {
      window.clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, activity));
    };
  }, []);
}

function cursor(name: IconName, rotate: number, hot: [number, number], fallback: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${iconGroup(name, 1, 1, 30, rotate)}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hot[0]} ${hot[1]}, ${fallback}`;
}

// Custom cursors: a rattle normally, a shaking rattle over things you can
// click, and a bottle while she's having a tantrum.
export function useCursors(): void {
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--cur-main", cursor("rattle", 0, [6, 6], "auto"));
    root.setProperty("--cur-click", cursor("rattle", -30, [6, 10], "pointer"));
    root.setProperty("--cur-tantrum", cursor("bottle", -25, [10, 4], "auto"));
  }, []);
}

const ROOM_PATHS = ["/", "/playroom", "/storybook", "/nap-room", "/monitor", "/guestbook"];

// Remember which rooms you've crawled into; all six earns a sticker.
export function useExplorer(path: string): void {
  useEffect(() => {
    const room = path.startsWith("/toys") ? "/playroom" : path;
    if (!ROOM_PATHS.includes(room)) return;
    const seen = load<string[]>("rooms", []);
    if (!seen.includes(room)) {
      const next = [...seen, room];
      save("rooms", next);
      if (ROOM_PATHS.every((r) => next.includes(r))) collect("explorer");
    }
  }, [path]);
}
