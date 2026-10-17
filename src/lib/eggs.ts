// Keyboard Easter-egg detectors. Each returns an unsubscribe function.
const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

function isTyping(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
}

export function onSequence(sequence: string[], fire: () => void): () => void {
  let pos = 0;
  const handler = (e: KeyboardEvent) => {
    if (isTyping(e)) return;
    const key = e.key.toLowerCase();
    if (key === sequence[pos]) {
      pos++;
      if (pos === sequence.length) {
        pos = 0;
        fire();
      }
    } else {
      pos = key === sequence[0] ? 1 : 0;
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}

export const onKonami = (fire: () => void) => onSequence(KONAMI, fire);
export const onWord = (word: string, fire: () => void) => onSequence(word.toLowerCase().split(""), fire);
