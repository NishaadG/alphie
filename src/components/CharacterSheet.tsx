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
  ["First word", "it's a secret… type it 🤫"],
  ["Favourite toy", "the Black-Scholes bottle"],
];

export function CharacterSheet() {
  return (
    <section className="babybook" aria-labelledby="babybook-title">
      <div className="babybook__page">
        <h2 id="babybook-title" className="babybook__title">
          All About Me <span aria-hidden="true">🎀</span>
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
          <span className="sticker">📏 74 cm</span>
          <span className="sticker">⚖️ 9.2 kg</span>
          <span className="sticker">🦷 4 teeth</span>
          <span className="sticker">😴 14h naps</span>
        </div>
        <div className="babybook__footprint" aria-hidden="true">
          👣 <span className="crayon">my footprint (σ = cute)</span>
        </div>
      </div>
    </section>
  );
}
