import { useEffect, useState } from "react";
import { mulberry32, gaussian } from "../lib/rng";
import { useApp } from "../lib/store";

const SYMBOLS = ["RATTLE", "NAPTIME", "DIAPR", "MILK", "BETA", "BLOCKS", "BURP", "TEETH", "CRAWL", "NAP50", "BOTTLE", "SOCK"];

interface Quote {
  sym: string;
  price: number;
  chg: number;
}

// A fake nursery stock ticker. Prices drift with the bull/bear toggle, and
// crash hard (and fast) during a tantrum.
export function Ticker() {
  const market = useApp((s) => s.market);
  const tantrum = useApp((s) => s.chaos);
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const rng = mulberry32(2026);
    return SYMBOLS.map((sym) => ({ sym, price: 20 + rng() * 180, chg: 0 }));
  });

  useEffect(() => {
    const rng = mulberry32(Date.now() & 0xffff);
    const bias = tantrum ? -0.06 : market === "bull" ? 0.004 : -0.004;
    const vol = tantrum ? 0.03 : 0.012;
    const id = window.setInterval(
      () => {
        setQuotes((qs) =>
          qs.map((q) => {
            const r = bias + vol * gaussian(rng);
            return { ...q, price: Math.max(0.01, q.price * (1 + r)), chg: r * 100 };
          }),
        );
      },
      tantrum ? 450 : 2000,
    );
    return () => window.clearInterval(id);
  }, [market, tantrum]);

  const row = quotes.map((q) => (
    <span key={q.sym} className="ticker__item">
      <b>{q.sym}</b> {q.price.toFixed(2)}{" "}
      <span className={q.chg >= 0 ? "up" : "down"}>
        {q.chg >= 0 ? "▲" : "▼"}
        {Math.abs(q.chg).toFixed(2)}%
      </span>
    </span>
  ));

  return (
    <div className={`ticker crayon ${tantrum ? "ticker--crash" : ""}`} role="marquee" aria-label="Nursery market ticker, fake prices">
      <div className="ticker__track" aria-hidden="true">
        <div className="ticker__group">{row}</div>
        <div className="ticker__group">{row}</div>
      </div>
    </div>
  );
}
