import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store";

export type Mood = "happy" | "worried" | "tantrum" | "sleep" | "wow";

interface Props {
  mood?: Mood;
  size?: number;
  onPacifier?: () => void;
  onBelly?: () => void;
  className?: string;
}

const EYE_L = { x: 78, y: 104 };
const EYE_R = { x: 122, y: 104 };
const MAX_LOOK = 5;

// Alphie, hand-drawn in SVG. Her pupils follow the pointer (mouse or touch).
export function Alphie({ mood, size = 220, onPacifier, onBelly, className = "" }: Props) {
  const market = useApp((s) => s.market);
  const asleep = useApp((s) => s.asleep);
  const flash = useApp((s) => s.mood);
  const svgRef = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  const face: Mood = asleep ? "sleep" : flash ?? mood ?? (market === "bull" ? "happy" : "worried");

  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const r = svg.getBoundingClientRect();
        const cx = r.left + (r.width * 100) / 200;
        const cy = r.top + (r.height * 104) / 240;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, dist / 200) * MAX_LOOK;
        setLook({ x: (dx / dist) * k, y: (dy / dist) * k });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, []);

  useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2500 + Math.random() * 3000);
    };
    loop();
    return () => window.clearTimeout(t);
  }, []);

  const eyesClosed = face === "sleep" || blink;
  const label = {
    happy: "Alphie smiling, the market is up",
    worried: "Alphie looking worried, the market is down",
    tantrum: "Alphie having a tantrum",
    sleep: "Alphie fast asleep",
    wow: "Alphie amazed",
  }[face];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 240"
      width={size}
      height={(size * 240) / 200}
      role="img"
      aria-label={label}
      className={`alphie alphie--${face} ${className}`}
    >
      {/* body / onesie with a tiny candlestick print */}
      <g className="alphie__body" onClick={onBelly}>
        <path d="M48 178 Q50 150 100 148 Q150 150 152 178 L158 232 Q100 244 42 232 Z" fill="#cfe6ff" stroke="#5c4033" strokeWidth="4" />
        <g stroke="#5c4033" strokeWidth="2">
          <line x1="78" y1="182" x2="78" y2="212" />
          <rect x="74" y="188" width="8" height="14" fill="#2f9e6b" />
          <line x1="100" y1="176" x2="100" y2="206" />
          <rect x="96" y="184" width="8" height="12" fill="#d1495b" />
          <line x1="122" y1="186" x2="122" y2="220" />
          <rect x="118" y="192" width="8" height="18" fill="#2f9e6b" />
        </g>
      </g>
      {/* arms */}
      <path d="M52 172 Q28 180 30 200" fill="none" stroke="#5c4033" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="203" r="9" fill="#ffd9c2" stroke="#5c4033" strokeWidth="4" />
      <path d="M148 172 Q172 180 170 200" fill="none" stroke="#5c4033" strokeWidth="4" strokeLinecap="round" />
      <circle cx="170" cy="203" r="9" fill="#ffd9c2" stroke="#5c4033" strokeWidth="4" />

      {/* head */}
      <g className="alphie__head">
        <circle cx="34" cy="104" r="13" fill="#ffd9c2" stroke="#5c4033" strokeWidth="4" />
        <circle cx="166" cy="104" r="13" fill="#ffd9c2" stroke="#5c4033" strokeWidth="4" />
        <circle cx="100" cy="100" r="68" fill="#ffd9c2" stroke="#5c4033" strokeWidth="4" />
        {/* the single hair curl, shaped like an up-tick */}
        <path d="M92 34 Q96 14 112 20 Q122 26 110 34" fill="none" stroke="#5c4033" strokeWidth="4" strokeLinecap="round" />
        <circle cx="62" cy="128" r="10" fill="#ffb3c6" opacity="0.7" />
        <circle cx="138" cy="128" r="10" fill="#ffb3c6" opacity="0.7" />

        {/* eyes */}
        {[EYE_L, EYE_R].map((e, i) =>
          eyesClosed ? (
            <path
              key={i}
              d={`M${e.x - 12} ${e.y} Q${e.x} ${e.y + 9} ${e.x + 12} ${e.y}`}
              fill="none"
              stroke="#5c4033"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : (
            <g key={i}>
              <ellipse cx={e.x} cy={e.y} rx="14" ry={face === "wow" ? 17 : 15} fill="#fff" stroke="#5c4033" strokeWidth="3" />
              <circle cx={e.x + look.x} cy={e.y + look.y} r="8" fill="#5c4033" />
              <circle cx={e.x + look.x + 3} cy={e.y + look.y - 3} r="2.6" fill="#fff" />
            </g>
          ),
        )}

        {/* brows react to the market */}
        {face === "worried" && (
          <g stroke="#5c4033" strokeWidth="3" strokeLinecap="round">
            <line x1="66" y1="82" x2="86" y2="86" />
            <line x1="134" y1="82" x2="114" y2="86" />
          </g>
        )}
        {face === "tantrum" && (
          <g stroke="#5c4033" strokeWidth="4" strokeLinecap="round">
            <line x1="64" y1="80" x2="88" y2="90" />
            <line x1="136" y1="80" x2="112" y2="90" />
          </g>
        )}

        {/* mouth + sigma pacifier */}
        {face === "tantrum" ? (
          <ellipse cx="100" cy="140" rx="16" ry="12" fill="#a34063" stroke="#5c4033" strokeWidth="3" />
        ) : (
          <g
            className="alphie__paci"
            onClick={onPacifier}
            role={onPacifier ? "button" : undefined}
            tabIndex={onPacifier ? 0 : undefined}
            aria-label={onPacifier ? "Boop Alphie's pacifier" : undefined}
            onKeyDown={(ev) => {
              if (onPacifier && (ev.key === "Enter" || ev.key === " ")) {
                ev.preventDefault();
                onPacifier();
              }
            }}
          >
            <ellipse cx="100" cy="142" rx="22" ry="12" fill="#a34063" stroke="#5c4033" strokeWidth="3" />
            <circle cx="100" cy="142" r="9" fill="#ffe9a8" stroke="#5c4033" strokeWidth="2" />
            <text x="100" y="147" textAnchor="middle" fontSize="14" fontFamily="serif" fontWeight="700" fill="#5c4033">
              σ
            </text>
          </g>
        )}
      </g>

      {face === "sleep" && (
        <text x="160" y="44" className="alphie__zzz" fontFamily="VT323, monospace" fontSize="26" fill="currentColor">
          z Z z
        </text>
      )}
    </svg>
  );
}
