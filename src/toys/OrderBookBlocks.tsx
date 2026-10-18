import { useEffect, useRef, useState } from "react";
import { Card } from "../components/Card";
import { blip } from "../lib/audio";
import { BETA_QUOTE, MAX_INV, newMarket, pnl, quotes, ROUND_TICKS, step, type Fill, type MMState, type Quote } from "../lib/marketMaker";
import { rememberEgg } from "../lib/memory";
import { mulberry32, randomSeed } from "../lib/rng";
import { flashMood, say } from "../lib/store";

const LEVELS = 4; // price rows shown above and below the mid
const STEP = 0.25;
const TICK_MS = 550;

function fillText(f: Fill): string {
  const who = f.who === "alphie" ? "Alphie" : "Beta";
  const verb = f.side === "buy" ? "bought a block from" : "sold a block to";
  return `${f.informed ? "🕵️ A sneaky baby" : "🧒 A baby"} ${verb} ${who} at ${f.price.toFixed(2)}`;
}

// Market making with alphabet blocks: show a buy price and a sell price,
// earn the gap, and try to finish the round ahead of Beta.
export function OrderBookBlocks() {
  const [q, setQ] = useState<Quote>({ half: 0.6, skew: 0 });
  const [s, setS] = useState<MMState>(() => newMarket());
  const [running, setRunning] = useState(false);
  const [last, setLast] = useState<Fill | null>(null);
  const qRef = useRef(q);
  qRef.current = q;
  const rng = useRef(mulberry32(randomSeed()));
  const sRef = useRef(s);

  // The simulation lives in a ref; React state only mirrors it for rendering.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (sRef.current.tick >= ROUND_TICKS) return;
      const { state, fill } = step(sRef.current, qRef.current, rng.current);
      sRef.current = state;
      setS(state);
      if (fill) {
        setLast(fill);
        blip(fill.who === "alphie" ? (fill.informed ? "down" : "coin") : "click");
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [running]);

  const done = s.tick >= ROUND_TICKS;
  const alphiePnl = pnl(s.alphie, s.mid);
  const betaPnl = pnl(s.beta, s.mid);

  useEffect(() => {
    if (!done || !running) return;
    setRunning(false);
    if (alphiePnl > betaPnl) {
      rememberEgg("beat-beta");
      blip("up");
      flashMood("wow");
      say(`I BEAT BETA by ${(alphiePnl - betaPnl).toFixed(2)}! Market maker supreme! 👑`);
    } else {
      blip("down");
      flashMood("tantrum", 1800);
      say("Beta won?! He doesn't even TRY! Rematch!!");
    }
  }, [done, running, alphiePnl, betaPnl]);

  const start = () => {
    rng.current = mulberry32(randomSeed());
    sRef.current = newMarket();
    setS(sRef.current);
    setLast(null);
    setRunning(true);
  };

  const a = quotes(s.mid, q);
  const b = quotes(s.mid, BETA_QUOTE);
  const center = Math.round(s.mid / STEP) * STEP;
  const rows = Array.from({ length: LEVELS * 2 + 1 }, (_, i) => Math.round((center + (LEVELS - i) * STEP) * 100) / 100);
  const near = (price: number, row: number) => Math.abs(price - row) < STEP / 2;
  const lastRow = last && last.tick === s.tick - 1 ? last.price : null;

  return (
    <Card
      title="Order-Book Blocks" tint="peach"
      icon="🧱"
      status={
        <>
          <span>
            Round {Math.min(s.tick, ROUND_TICKS)}/{ROUND_TICKS}
          </span>
          <span className={alphiePnl >= betaPnl ? "up" : "down"}>
            {alphiePnl >= betaPnl ? "Alphie leads" : "Beta leads"}
          </span>
        </>
      }
    >
      <p className="caption">
        Alphie trades blocks with other babies. She shows a price to <b>buy</b> (green) and a price to <b>sell</b> (red), and keeps
        the gap. Too small a gap and sneaky babies win; too big and nobody trades with her. Beat Beta!
      </p>
      <div className="ob">
        <ol className="ob__ladder well" aria-label="Order book">
          {rows.map((row) => {
            const askSide = row > s.mid;
            return (
              <li key={row} className={`ob__row ${askSide ? "ob__row--ask" : "ob__row--bid"} ${lastRow !== null && near(lastRow, row) ? "is-hit" : ""}`}>
                <span className="ob__px crayon">{row.toFixed(2)}</span>
                <span className="ob__blocks">
                  {(near(a.ask, row) || near(a.bid, row)) && <span className="block block--alphie" title="Alphie's price">A</span>}
                  {(near(b.ask, row) || near(b.bid, row)) && <span className="block block--beta" title="Beta's price">β</span>}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="ob__side">
          <div className="ob__score">
            <div className="stat well">
              <span className="crayon">Alphie</span> <b className={alphiePnl >= 0 ? "up" : "down"}>{alphiePnl.toFixed(2)}</b>
            </div>
            <div className="stat well">
              <span className="crayon">Beta</span> <b className={betaPnl >= 0 ? "up" : "down"}>{betaPnl.toFixed(2)}</b>
            </div>
          </div>
          <p className="ob__mid crayon">Fair price: {s.mid.toFixed(2)}</p>
          <div className="ob__inv" aria-label={`Alphie holds ${s.alphie.inv} blocks`}>
            <span className="crayon">Crib:</span>
            {s.alphie.inv === 0 ? (
              <span className="caption">empty</span>
            ) : (
              Array.from({ length: Math.abs(s.alphie.inv) }, (_, i) => (
                <span key={i} className={`block block--mini ${s.alphie.inv < 0 ? "block--owed" : ""}`} aria-hidden="true">
                  {s.alphie.inv < 0 ? "?" : "■"}
                </span>
              ))
            )}
            {Math.abs(s.alphie.inv) >= MAX_INV && <span className="caption down"> full!</span>}
          </div>
          <p className="ob__log" role="status" aria-live="polite">
            {last ? fillText(last) : running ? "Waiting for babies…" : "Press start to open the toy shop."}
          </p>
        </div>
      </div>
      <div className="controls">
        <label>
          Gap (half-spread): <b>{q.half.toFixed(2)}</b>
          <input type="range" min={0.1} max={1.5} step={0.05} value={q.half} onChange={(e) => setQ({ ...q, half: +e.target.value })} />
        </label>
        <label>
          Lean (skew): <b>{q.skew > 0 ? "+" : ""}{q.skew.toFixed(2)}</b>
          <input type="range" min={-1} max={1} step={0.05} value={q.skew} onChange={(e) => setQ({ ...q, skew: +e.target.value })} />
        </label>
        <button type="button" className="btn" onClick={start} disabled={running}>
          {done ? "🔁 Rematch" : running ? "Trading…" : "▶ Open the shop"}
        </button>
      </div>
      {done && (
        <p className={`ob__result ${alphiePnl > betaPnl ? "up" : "down"}`} role="status">
          {alphiePnl > betaPnl ? "🏆 Alphie beat Beta!" : "🧸 Beta wins this round."} Tip: lean your prices down when your crib is full.
        </p>
      )}
    </Card>
  );
}
