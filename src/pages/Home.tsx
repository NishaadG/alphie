import { CharacterSheet } from "../components/CharacterSheet";
import { Hero } from "../components/Hero";
import { type VisitMemory } from "../lib/memory";
import { Link } from "../lib/router";
import { usePageTitle } from "./common";
import { ROOMS } from "./nursery";

export default function Home({ memory }: { memory: VisitMemory }) {
  usePageTitle("Home");
  return (
    <>
      <Hero memory={memory} />
      <CharacterSheet />
      <section aria-labelledby="doors-title">
        <h2 id="doors-title" className="section-title">
          Come play in my rooms!
        </h2>
        <ul className="doors">
          {ROOMS.slice(1).map((r) => (
            <li key={r.path}>
              <Link to={r.path} className="door" style={{ "--door": r.color } as React.CSSProperties} data-sound="open">
                <span className="door__icon" aria-hidden="true">
                  {r.icon}
                </span>
                <span className="door__label">{r.label}</span>
                <span className="door__blurb">{r.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
