import { useEffect, useRef, useState } from "react";
import { applyMute } from "../lib/audio";
import { setState, useApp } from "../lib/store";

const LINKS = [
  ["#hello", "👶 Meet Alphie"],
  ["#toybox", "🧸 Toybox"],
  ["#story", "📖 Her Story"],
  ["#crib", "🛏️ 3D Crib"],
  ["#chat", "💬 Ask Alphie"],
  ["#guestbook", "📝 Guestbook"],
] as const;

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <time className="taskbar__clock pixel bevel-in" dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </time>
  );
}

export function Taskbar() {
  const { muted, market, chaos } = useApp((s) => s);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const toggleMute = () => {
    applyMute(!muted);
    setState({ muted: !muted });
  };

  return (
    <nav className="taskbar bevel-out" aria-label="Taskbar">
      <div className="taskbar__start" ref={menuRef}>
        <button
          type="button"
          className="btn98 taskbar__startbtn"
          aria-expanded={open}
          aria-controls="start-menu"
          onClick={() => setOpen((o) => !o)}
          data-sound="open"
        >
          <span aria-hidden="true">🍼</span> <b>Start</b>
        </button>
        {open && (
          <div id="start-menu" className="startmenu bevel-out" role="menu">
            <div className="startmenu__side pixel" aria-hidden="true">
              AlphieOS<b>98</b>
            </div>
            <ul>
              {LINKS.map(([href, label]) => (
                <li key={href}>
                  <a role="menuitem" href={href} onClick={() => setOpen(false)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="taskbar__tray">
        <button
          type="button"
          className="btn98"
          aria-pressed={market === "bear"}
          onClick={() => setState({ market: market === "bull" ? "bear" : "bull" })}
          data-sound={market === "bull" ? "down" : "up"}
          title="Switch between bull (day) and bear (night) market"
        >
          <span aria-hidden="true">{market === "bull" ? "🐂" : "🐻"}</span>
          <span className="taskbar__label">{market === "bull" ? "Bull" : "Bear"}</span>
        </button>
        <button
          type="button"
          className="btn98"
          aria-pressed={chaos}
          onClick={() => setState({ chaos: !chaos })}
          title="Chaos Mode"
        >
          <span aria-hidden="true">🌀</span>
          <span className="taskbar__label">Chaos</span>
        </button>
        <button
          type="button"
          className="btn98 taskbar__mute"
          aria-pressed={muted}
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          onClick={toggleMute}
          data-sound="none"
        >
          <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
          <span className="taskbar__label">{muted ? "Muted" : "Sound"}</span>
        </button>
        <Clock />
      </div>
    </nav>
  );
}
