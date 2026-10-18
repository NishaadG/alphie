import { Crawler } from "./Crawler";
import { HitCounter } from "./HitCounter";
import { Link } from "../lib/router";
import { STICKERS } from "../lib/stickers";
import { useApp } from "../lib/store";
import { Icon } from "./Icon";

const CREDITS: Array<[string, string, string]> = [
  ["Fredoka font", "Milena Brandão, SIL Open Font License", "https://fonts.google.com/specimen/Fredoka"],
  ["Sniglet font", "Haley Fiege, SIL Open Font License", "https://fonts.google.com/specimen/Sniglet"],
  ["Gaegu font", "JIKJI SOFT, SIL Open Font License", "https://fonts.google.com/specimen/Gaegu"],
  ["VT323 font", "Peter Hull, SIL Open Font License", "https://fonts.google.com/specimen/VT323"],
  ["React", "MIT", "https://react.dev"],
  ["GSAP + ScrollTrigger", "GreenSock standard license (free)", "https://gsap.com"],
  ["three.js", "MIT", "https://threejs.org"],
  ["canvas-confetti", "ISC, Kiril Vatev", "https://github.com/catdad/canvas-confetti"],
  ["Upstash Redis", "guestbook + hit counter storage", "https://upstash.com"],
  ["Vite", "MIT", "https://vite.dev"],
];

export function Footer() {
  const found = useApp((s) => s.found.length);
  return (
    <footer className="footer">
      <Crawler />
      <div className="footer__rug">
      <div className="footer__construction puffy crayon" aria-hidden="true">
        <b>🚧 UNDER CONSTRUCTION 🚧</b> <span>(babies are always growing)</span>
      </div>

      <HitCounter />

      <nav className="webring" aria-label="Nursery webring">
        <span className="crayon">« prev</span>
        <b>
          <Icon name="bottle" size={26} /> The Nursery Webring <Icon name="bottle" size={26} />
        </b>
        <span className="crayon">next »</span>
      </nav>

      <Link to="/stickers" className="btn footer__stickers">
        <Icon name="star" size={24} /> My sticker chart: {found}/{STICKERS.length}
      </Link>

      <p className="footer__badges crayon" aria-hidden="true">
        <span className="badge">BEST VIEWED IN ANY BROWSER</span>
        <span className="badge">MADE WITH MILK</span>
        <span className="badge">σ-POWERED</span>
      </p>

      <details className="credits puffy">
        <summary>Credits & licences</summary>
        <p>
          Alphie, her art, icons, sounds and toys are original: the character and every sticker icon are drawn in hand-written SVG, every sound is synthesised live
          with the Web Audio API, and the 3D crib is built from primitive shapes in code. Libraries and fonts used:
        </p>
        <ul>
          {CREDITS.map(([name, license, href]) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noreferrer noopener">
                {name}
              </a>{" "}
              · {license}
            </li>
          ))}
        </ul>
        <p>The few emoji left (guestbook stickers, tantrum confetti) are rendered by your device's own emoji font.</p>
      </details>

      <p className="footer__disclaimer">
        <b>Fake money, fake tickers, real maths.</b> Nothing on this site is financial advice. Alphie is a baby.
      </p>
      <p className="footer__secret caption">
        Psst… some things here react to <kbd>↑↑↓↓←→←→BA</kbd>. And Alphie's favourite word is a secret.
      </p>
      </div>
    </footer>
  );
}
