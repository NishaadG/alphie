import { RetroWindow } from "./RetroWindow";

const SHEET: Array<[string, string]> = [
  ["Name", "Alphie (Alpha Brownian-Motion)"],
  ["What she is", "A baby quant: 11 months old, one hair curl shaped like an up-tick, a σ pacifier she never lets go of"],
  ["What she does", "Builds nursery toys that are secretly quant models, and tries to beat her teddy, Beta"],
  ["Her story", "Born at the opening bell. Her first crawl was a random walk, and nobody could predict where she'd go"],
  ["Tagline", "Born to beat the benchmark. (Sometimes.)"],
];

export function CharacterSheet() {
  return (
    <RetroWindow title="character_sheet.txt" icon="📋" status={<span>5 fields · 0 errors</span>}>
      <dl className="sheet">
        {SHEET.map(([k, v]) => (
          <div key={k} className="sheet__row">
            <dt className="pixel">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="sheet__stats stat-row" aria-label="Alphie's stats">
        <span className="stat bevel-in">Age 0.92y</span>
        <span className="stat bevel-in">Teeth: 4</span>
        <span className="stat bevel-in up">Giggles ▲</span>
        <span className="stat bevel-in down">Naps ▼</span>
      </div>
    </RetroWindow>
  );
}
