// Tiny guestbook filter. Alphie is a baby: no links and no rude words.
const BLOCKED = [
  "fuck", "shit", "bitch", "cunt", "dick", "pussy", "asshole", "bastard", "slut", "whore",
  "nigger", "nigga", "faggot", "retard", "rape", "porn", "nazi",
];

const LINK = /(https?:\/\/|www\.|\.(com|net|org|io|xyz|ru|in)\b)/i;

function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[0@]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/[5$]/g, "s")
    .split(/[^a-z*]+/)
    .filter(Boolean);
}

// Word-start matching, so "grapes" passes but "fucking" does not.
export function isClean(text: string): boolean {
  if (LINK.test(text)) return false;
  return !words(text).some((w) => BLOCKED.some((b) => w.startsWith(b)));
}

export function tidy(text: unknown, max: number): string {
  return String(text ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
