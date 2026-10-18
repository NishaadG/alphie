import type { ComponentType } from "react";
import { Link } from "../lib/router";
import { BottleBS } from "../toys/BottleBS";
import { FirstTrade } from "../toys/FirstTrade";
import { GaltonRattle } from "../toys/GaltonRattle";
import { LullabyBox } from "../toys/LullabyBox";
import { MonteCarloMobile } from "../toys/MonteCarloMobile";
import { OrderBookBlocks } from "../toys/OrderBookBlocks";
import { usePageTitle } from "./common";
import NotFound from "./NotFound";
import { TOYS } from "./nursery";

const COMPONENTS: Record<string, ComponentType> = {
  mobile: MonteCarloMobile,
  bottle: BottleBS,
  rattle: GaltonRattle,
  lullaby: LullabyBox,
  blocks: OrderBookBlocks,
  "first-trade": FirstTrade,
};

export default function ToyPage({ slug }: { slug: string }) {
  const i = TOYS.findIndex((t) => t.slug === slug);
  const toy = TOYS[i];
  usePageTitle(toy?.name ?? "Lost toy");
  if (!toy) return <NotFound />;
  const Toy = COMPONENTS[slug];
  const prev = TOYS[(i - 1 + TOYS.length) % TOYS.length];
  const next = TOYS[(i + 1) % TOYS.length];

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/playroom">🧸 Playroom</Link> <span aria-hidden="true">›</span> <span aria-current="page">{toy.name}</span>
      </nav>
      <div className="toy-layout">
        <div className="toy-layout__main">
          <Toy />
        </div>
        <aside className={`idea-card idea-card--${toy.tint}`} aria-label="About this toy">
          <p className="idea-card__label crayon">the big idea</p>
          <p className="idea-card__idea">{toy.idea}</p>
          <p className="idea-card__label crayon">how to play</p>
          <p>{toy.howTo}</p>
        </aside>
      </div>
      <nav className="toy-pager" aria-label="More toys">
        <Link to={`/toys/${prev.slug}`} className="btn">
          ◀ {prev.icon} {prev.name}
        </Link>
        <Link to={`/toys/${next.slug}`} className="btn">
          {next.icon} {next.name} ▶
        </Link>
      </nav>
    </>
  );
}
