import { useEffect, useRef, useState, type FormEvent } from "react";
import { blip } from "../lib/audio";
import { babyReply } from "../lib/babyTalk";
import { Card } from "./Card";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = ["What's a random walk?", "Who is Beta?", "Explain options like I'm a baby", "Should I buy stocks?"];

export function AskAlphie() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "Goo! Ask me anything about my toys or quant stuff. I'm a baby, so no real money advice!" }]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<"live" | "scripted" | null>(null);
  const logRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  const send = async (content: string) => {
    const q = content.trim().slice(0, 400);
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setText("");
    setBusy(true);
    let reply: string;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // the greeting is client-side only, so skip it
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { reply: string; source: "live" | "scripted" };
      reply = data.reply;
      setSource(data.source);
    } catch {
      reply = babyReply(q);
      setSource("scripted");
    }
    setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    setBusy(false);
    blip("squeak");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };

  return (
    <Card
      title="Baby Monitor" tint="blue"
      icon="💬"
      id="chat"
      status={
        <>
          <span>{busy ? "Alphie is typing…" : "Online"}</span>
          <span>{source === "live" ? "🧠 live brain" : source === "scripted" ? "🍼 baby brain" : ""}</span>
        </>
      }
    >
      <div className="chat">
        <ol className="chat__log well" ref={logRef} aria-live="polite" aria-label="Chat with Alphie">
          {msgs.map((m, i) => (
            <li key={i} className={`chat__msg chat__msg--${m.role}`}>
              {m.role === "assistant" && (
                <span className="chat__avatar" aria-hidden="true">
                  👶
                </span>
              )}
              <p>
                <span className="sr-only">{m.role === "assistant" ? "Alphie: " : "You: "}</span>
                {m.content}
              </p>
            </li>
          ))}
          {busy && (
            <li className="chat__msg chat__msg--assistant chat__typing" aria-hidden="true">
              <p>• • •</p>
            </li>
          )}
        </ol>
        <div className="chat__chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="btn chat__chip" onClick={() => void send(s)} disabled={busy}>
              {s}
            </button>
          ))}
        </div>
        <form className="chat__form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="chat-input">
            Message Alphie
          </label>
          <input id="chat-input" className="field" value={text} onChange={(e) => setText(e.target.value)} maxLength={400} placeholder="Type to Alphie…" autoComplete="off" />
          <button type="submit" className="btn" disabled={busy || !text.trim()}>
            Send
          </button>
        </form>
      </div>
    </Card>
  );
}
