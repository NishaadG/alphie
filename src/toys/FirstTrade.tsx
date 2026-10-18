import { useEffect, useRef, useState } from "react";
import { Card } from "../components/Card";
import { blip } from "../lib/audio";
import { load, save } from "../lib/memory";
import { alpha, betaReturn, catchUp, isPortfolio, myReturn, newPortfolio, tick, trade, value, type Portfolio } from "../lib/paperTrade";
import { mulberry32, randomSeed } from "../lib/rng";
import { collect } from "../lib/stickers";
import { flashMood, say, useApp } from "../lib/store";
import { cssVar, useCanvas } from "../lib/useCanvas";

const KEY = "first-trade";
const DRIFT = { bull: 0.0015, bear: -0.0015 };

const pct = (x: number) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(1)}%`;

function restore(): { p: Portfolio; away: number | null } {
  const saved = load<unknown>(KEY, null);
  if (!isPortfolio(saved)) return { p: newPortfolio(Date.now()), away: null };
  const before = saved.price;
  const { p, steps } = catchUp(saved, Date.now(), mulberry32(randomSeed()));
  return { p, away: steps > 5 ? p.price / before - 1 : null };
}

// Paper trading with fake milk money. Beta buys RATTLE at the start and
// never sells; the score is your alpha: how much better you did than Beta.
export function FirstTrade() {
  const market = useApp((s) => s.market);
  const [{ p: initial, away }] = useState(restore);
  const [p, setP] = useState<Portfolio>(initial);
  const rng = useRef(mulberry32(randomSeed()));
  const celebrated = useRef(false);

  useEffect(() => {
    if (away === null) return;
    const t = window.setTimeout(() => say(`While you were away, RATTLE moved ${pct(away)}! Check my piggy bank.`, 5000), 7000);
    return () => window.clearTimeout(t);
  }, [away]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setP((prev) => tick(prev, DRIFT[market], rng.current, Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [market]);

  useEffect(() => {
    save(KEY, p);
    if (alpha(p) > 0.1 && p.trades > 0 && !celebrated.current) {
      celebrated.current = true;
      collect("real-alpha");
      flashMood("wow");
      blip("up");
      say("10% ALPHA?! I'm a REAL Alpha now!! 🎉");
    }
  }, [p]);

  const { ref } = useCanvas(
    (ctx, w, h) => {
      const hist = p.history;
      const lo = Math.min(...hist, p.startPrice) * 0.995;
      const hi = Math.max(...hist, p.startPrice) * 1.005;
      const y = (v: number) => h - 6 - ((v - lo) / (hi - lo)) * (h - 12);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = cssVar("--ink-soft");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y(p.startPrice));
      ctx.lineTo(w, y(p.startPrice));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      hist.forEach((v, i) => {
        const x = (i / Math.max(1, hist.length - 1)) * w;
        if (i === 0) ctx.moveTo(x, y(v));
        else ctx.lineTo(x, y(v));
      });
      ctx.strokeStyle = p.price >= p.startPrice ? cssVar("--up") : cssVar("--down");
      ctx.lineWidth = 2.5;
      ctx.stroke();
    },
    [p.history, market],
  );

  const doTrade = (qty: number) => {
    const next = trade(p, qty);
    if (next === p) {
      blip("error");
      say(qty > 0 ? "Not enough milk money!" : "I don't have any RATTLE to sell!", 2200);
      return;
    }
    blip(qty > 0 ? "coin" : "close");
    setP(next);
  };

  const reset = () => {
    setP(newPortfolio(Date.now(), p.price));
    celebrated.current = false;
    say("New piggy bank! Beta's buying in again too.", 2500);
  };

  const a = alpha(p);
  const maxBuy = Math.floor(p.cash / p.price);

  return (
    <Card
      title="Baby's First Trade" tint="pink"
      icon="piggy"
      status={
        <>
          <span>{p.trades} trades</span>
          <span className={a >= 0 ? "up" : "down"}>alpha {pct(a)}</span>
        </>
      }
    >
      <p className="caption">
        1,000 fake milk coins and one wobbly stock. Beta bought RATTLE at the start and never sells. Beat him and that difference is
        called <b>alpha</b>. Your piggy bank is saved for next time!
      </p>
      <div className="ft__quote">
        <span className="crayon ft__sym">RATTLE</span>
        <b className="ft__px">{p.price.toFixed(2)}</b>
        <span className={p.price >= p.startPrice ? "up" : "down"}>{pct(betaReturn(p))} since start</span>
      </div>
      <canvas ref={ref} className="toy-canvas ft__chart" role="img" aria-label={`RATTLE price chart, now ${p.price.toFixed(2)}`} />
      <div className="stat-row ft__stats">
        <span className="stat well">Milk {p.cash.toFixed(0)}</span>
        <span className="stat well">RATTLE ×{p.shares}</span>
        <span className="stat well">You {pct(myReturn(p))}</span>
        <span className="stat well">Beta {pct(betaReturn(p))}</span>
      </div>
      <div className="controls">
        <button type="button" className="btn" onClick={() => doTrade(1)} disabled={maxBuy < 1} data-sound="none">
          Buy 1
        </button>
        <button type="button" className="btn" onClick={() => doTrade(maxBuy)} disabled={maxBuy < 1} data-sound="none">
          Buy all ({maxBuy})
        </button>
        <button type="button" className="btn" onClick={() => doTrade(-1)} disabled={p.shares < 1} data-sound="none">
          Sell 1
        </button>
        <button type="button" className="btn" onClick={() => doTrade(-p.shares)} disabled={p.shares < 1} data-sound="none">
          Sell all
        </button>
        <button type="button" className="btn" onClick={reset}>
          New piggy bank
        </button>
      </div>
      <p className="caption crayon">Total: {value(p).toFixed(2)} milk coins. Bull markets drift up, bear markets drift down (try the Playtime / Bedtime button!).</p>
    </Card>
  );
}
