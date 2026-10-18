import { Icon } from "./Icon";

// The character sheet, as a page from a baby book: printed prompts with
// the answers "handwritten" in crayon.
const SHEET: Array<[string, string]> = [
  ["My name is", "Alphie (Alpha Brownian-Motion)"],
  ["I am", "a baby quant, 11 months old, with one up-tick hair curl and a σ pacifier I never let go of"],
  ["I love to", "build toys that are secretly quant models, and beat my teddy, Beta"],
  ["My story", "I was born at the opening bell. My first crawl was a random walk and nobody could guess where I'd go"],
  ["My motto", "Born to beat the benchmark. (Sometimes.)"],
];

const FIRSTS: Array<[string, string]> = [
  ["First crawl", "a random walk"],
  ["First tooth", "day 182 (a bull run)"],
  ["First word", "it's a secret… type it"],
  ["Favourite toy", "the Black-Scholes bottle"],
];

export function CharacterSheet() {
  return (
    <section className="babybook" aria-labelledby="babybook-title">
      <div className="babybook__page">
        <h2 id="babybook-title" className="babybook__title">
          All About Me <Icon name="bow" size={40} className="babybook__bow" />
        </h2>
        <dl className="babybook__list">
          {SHEET.map(([k, v]) => (
            <div key={k} className="babybook__row">
              <dt>{k}</dt>
              <dd className="crayon">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="babybook__page babybook__page--right">
        <h3 className="babybook__subtitle">My Firsts</h3>
        <ul className="babybook__firsts">
          {FIRSTS.map(([k, v]) => (
            <li key={k}>
              <span>{k}:</span> <span className="crayon">{v}</span>
            </li>
          ))}
        </ul>
        <div className="babybook__stats" aria-label="Alphie's measurements">
          <span className="sticker">
            <Icon name="ruler" size={24} /> 74 cm
          </span>
          <span className="sticker">
            <Icon name="scale" size={24} /> 9.2 kg
          </span>
          <span className="sticker">
            <Icon name="tooth" size={24} /> 4 teeth
          </span>
          <span className="sticker">
            <Icon name="moon" size={24} /> 14h naps
          </span>
        </div>
        <div className="babybook__footprint" aria-hidden="true">
          <Icon name="foot" size={44} />
          <Icon name="foot" size={44} className="babybook__foot2" /> <span className="crayon">my footprints (σ = cute)</span>
        </div>
      </div>
    </section>
  );
}
