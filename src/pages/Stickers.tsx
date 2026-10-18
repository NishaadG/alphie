import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Icon } from "../components/Icon";
import { drawReportCard } from "../lib/reportCard";
import { collect, STICKERS } from "../lib/stickers";
import { say, useApp } from "../lib/store";
import { PageTitle } from "./common";

// The sticker chart: every secret and milestone on the site, found or not.
export default function Stickers() {
  const found = useApp((s) => s.found);
  const done = found.length === STICKERS.length;

  useEffect(() => {
    if (!done) return;
    say("ALL THE STICKERS?! You're the best grown-up EVER!!", 5000);
    void import("canvas-confetti").then(({ default: fire }) => fire({ particleCount: 140, spread: 100, disableForReducedMotion: true }));
  }, [done]);

  return (
    <>
      <PageTitle
        icon="star"
        title="Sticker Chart"
        sub={`You've found ${found.length} of ${STICKERS.length} stickers. Every secret in the nursery earns one. Hints are under the empty spots!`}
      />
      <div className="sticker-progress" role="progressbar" aria-valuemin={0} aria-valuemax={STICKERS.length} aria-valuenow={found.length} aria-label="Stickers found">
        <span style={{ width: `${(found.length / STICKERS.length) * 100}%` }} />
      </div>
      <ul className="sticker-chart">
        {STICKERS.map((s, i) => {
          const got = found.includes(s.id);
          return (
            <li key={s.id} className={`sticker-spot ${got ? "is-found" : ""}`} style={{ "--tilt": `${((i * 7) % 9) - 4}deg` } as React.CSSProperties}>
              <span className="sticker-spot__art">{got ? <Icon name={s.icon} size={64} /> : <span className="sticker-spot__q">?</span>}</span>
              <b>{got ? s.name : "???"}</b>
              <span className="sticker-spot__text">{got ? s.how : s.hint}</span>
            </li>
          );
        })}
      </ul>
      <ReportCard />
    </>
  );
}

function ReportCard() {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url]);

  const make = async () => {
    setBusy(true);
    try {
      const blob = await drawReportCard();
      const next = URL.createObjectURL(blob);
      setUrl(next);
      const a = document.createElement("a");
      a.href = next;
      a.download = "alphie-report-card.png";
      a.click();
      collect("report");
      say("Ooh! Put it on the fridge!!", 3000);
    } catch {
      say("Uh oh, my crayons broke. Try again?", 3000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="My Report Card" icon="pencil" tint="butter" id="report">
      <p>
        Grades for everything you did here: your alpha in Baby's First Trade, your toy-shop record against Beta, how many secrets you
        found and how often you came back. Signed by the head teacher (a teddy).
      </p>
      <button type="button" className="btn" onClick={() => void make()} disabled={busy}>
        <Icon name="star" size={22} /> {busy ? "Colouring it in…" : "Make my report card (PNG)"}
      </button>
      {url && <img className="report-preview" src={url} alt="Your report card from Alphie's Nursery" />}
    </Card>
  );
}
