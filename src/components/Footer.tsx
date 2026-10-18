import { HitCounter } from "./HitCounter";

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
  return (
    <footer className="footer">
      <div className="footer__construction puffy crayon" aria-hidden="true">
        <b>🚧 UNDER CONSTRUCTION 🚧</b> <span>(babies are always growing)</span>
      </div>

      <HitCounter />

      <nav className="webring" aria-label="Nursery webring">
        <span className="crayon">« prev</span>
        <b>🍼 The Nursery Webring 🍼</b>
        <span className="crayon">next »</span>
      </nav>

      <p className="footer__badges crayon" aria-hidden="true">
        <span className="badge">BEST VIEWED IN ANY BROWSER</span>
        <span className="badge">MADE WITH MILK</span>
        <span className="badge">σ-POWERED</span>
      </p>

      <details className="credits puffy">
        <summary>📜 Credits & licences</summary>
        <p>
          Alphie, her art, sounds and toys are original: the character is drawn in hand-written SVG, every sound is synthesised live
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
        <p>Emoji are rendered by your device's own emoji font.</p>
      </details>

      <p className="footer__disclaimer">
        <b>Fake money, fake tickers, real maths.</b> Nothing on this site is financial advice. Alphie is a baby.
      </p>
      <p className="footer__secret caption">
        Psst… some things here react to <kbd>↑↑↓↓←→←→BA</kbd>. And Alphie's favourite word is a secret.
      </p>
    </footer>
  );
}
