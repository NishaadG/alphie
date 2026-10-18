import { Link } from "../lib/router";
import { PageTitle } from "./common";
import { TOYS } from "./nursery";

// The toy shelf: every toy gets its own page.
export default function Playroom() {
  return (
    <>
      <PageTitle icon="🧸" title="Playroom" sub="Alphie made all of these. They look like toys. They are secretly maths. Pick one!" />
      <ul className="shelf">
        {TOYS.map((t, i) => (
          <li key={t.slug}>
            <Link to={`/toys/${t.slug}`} className={`toy-tile toy-tile--${t.tint}`} style={{ "--tilt": `${(i % 2 ? 1 : -1) * 1.5}deg` } as React.CSSProperties} data-sound="open">
              <span className="toy-tile__icon" aria-hidden="true">
                {t.icon}
              </span>
              <span className="toy-tile__name">{t.name}</span>
              <span className="toy-tile__line">{t.oneLiner}</span>
              <span className="toy-tile__go">Play ▶</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="shelf__plank" aria-hidden="true" />
    </>
  );
}
