import { ROOMS } from "../pages/nursery";
import { Link, usePath } from "../lib/router";

// Logo plus the alphabet-block navigation. The blocks spell A-L-P-H-I-E.
export function SiteHeader() {
  const path = usePath();
  const active = (p: string) => (p === "/" ? path === "/" : path.startsWith(p) || (p === "/playroom" && path.startsWith("/toys")));

  return (
    <header className="site-header">
      <Link to="/" className="logo" aria-label="Alphie's Nursery, home">
        <span className="logo__baby" aria-hidden="true">
          👶
        </span>
        <span className="logo__text">
          Alphie's <b>Nursery</b>
        </span>
      </Link>
      <nav aria-label="Nursery rooms">
        <ul className="blocks-nav">
          {ROOMS.map((r, i) => (
            <li key={r.path}>
              <Link
                to={r.path}
                className={`nav-block ${active(r.path) ? "is-here" : ""}`}
                aria-current={active(r.path) ? "page" : undefined}
                style={{ "--block": r.color, "--tilt": `${(i % 2 ? 1 : -1) * (2 + (i % 3))}deg` } as React.CSSProperties}
                data-sound="squeak"
              >
                <span className="nav-block__letter" aria-hidden="true">
                  {r.letter}
                </span>
                <span className="nav-block__label">
                  <span aria-hidden="true">{r.icon}</span> {r.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
