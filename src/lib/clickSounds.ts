import { blip, type Blip } from "./audio";

// Every button and link clicks. Elements choose their sound with
// data-sound="coin" etc., or opt out with data-sound="none".
export function installClickSounds(): () => void {
  const handler = (e: MouseEvent) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("button, a, [role='button'], summary");
    if (!el) return;
    const sound = el.dataset.sound ?? "click";
    if (sound !== "none") blip(sound as Blip);
  };
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}
