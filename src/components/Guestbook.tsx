import { useCallback, useEffect, useState, type FormEvent } from "react";
import { blip } from "../lib/audio";
import { say } from "../lib/store";
import { RetroWindow } from "./RetroWindow";

interface Entry {
  name: string;
  message: string;
  mood: string;
  at: number;
}

const MOODS = ["🍼", "🧸", "🐂", "🐻", "⭐", "🦆", "🎈", "💖"];

const SAMPLE: Entry[] = [
  { name: "Beta (the teddy)", message: "I matched the market again. You're welcome.", mood: "🧸", at: Date.UTC(2026, 9, 17, 12) },
  { name: "Alphie's Mum", message: "So proud of my little quant. Please stop pricing the bath water.", mood: "💖", at: Date.UTC(2026, 9, 17, 11) },
];

function ago(at: number): string {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState(MOODS[0]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook");
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { entries: Entry[] };
      setEntries(data.entries);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  // Live-ish: refresh every 30s while the tab is visible.
  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 30000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, message, mood }),
      });
      const data = (await res.json().catch(() => ({}))) as { entry?: Entry; error?: string };
      if (!res.ok || !data.entry) {
        blip("error");
        setNote(data.error ?? "The guestbook is napping. Try again in a bit!");
        return;
      }
      setEntries((list) => [data.entry!, ...list]);
      setMessage("");
      blip("up");
      setNote("Signed! Alphie is reading it now.");
      say(`Ooh, a note from ${data.entry.name}! *happy kicks*`);
    } catch {
      blip("error");
      setNote("The guestbook is napping. Try again in a bit!");
    } finally {
      setBusy(false);
    }
  };

  const shown = online ? entries : SAMPLE;

  return (
    <RetroWindow
      title="guestbook.htm — Sign my wall!"
      icon="📝"
      id="guestbook"
      status={
        <>
          <span>{online === null ? "connecting…" : online ? `${entries.length} notes` : "offline: showing examples"}</span>
          <span>{online ? "● live" : "○"}</span>
        </>
      }
    >
      <form className="gb-form" onSubmit={submit}>
        <div className="gb-form__row">
          <label>
            Your name
            <input className="field98" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="Anonymous Baby" />
          </label>
          <fieldset className="gb-moods">
            <legend>Sticker</legend>
            {MOODS.map((m) => (
              <label key={m} className={`gb-mood ${m === mood ? "is-on" : ""}`}>
                <input type="radio" name="mood" value={m} checked={m === mood} onChange={() => setMood(m)} className="sr-only" />
                <span aria-hidden="true">{m}</span>
                <span className="sr-only">sticker {m}</span>
              </label>
            ))}
          </fieldset>
        </div>
        <label>
          Your message
          <textarea
            className="field98"
            value={message}
            maxLength={200}
            rows={3}
            required
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something nice to Alphie (no links, she's a baby)"
          />
        </label>
        <div className="gb-form__foot">
          <span className="pixel">{200 - message.length} chars left</span>
          <button type="submit" className="btn98" disabled={busy || !message.trim() || online === false} data-sound="none">
            {busy ? "Sending…" : "✍️ Sign it"}
          </button>
        </div>
        {note && (
          <p className="caption" role="status">
            {note}
          </p>
        )}
      </form>
      <ol className="gb-list">
        {shown.map((e, i) => (
          <li key={`${e.at}-${i}`} className="gb-entry bevel-in">
            <span className="gb-entry__mood" aria-hidden="true">
              {e.mood}
            </span>
            <div>
              <p className="gb-entry__head">
                <b>{e.name}</b> <span className="pixel">{ago(e.at)}</span>
              </p>
              <p className="gb-entry__msg">{e.message}</p>
            </div>
          </li>
        ))}
      </ol>
    </RetroWindow>
  );
}
