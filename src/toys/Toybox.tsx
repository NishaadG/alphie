import { BottleBS } from "./BottleBS";
import { GaltonRattle } from "./GaltonRattle";
import { LullabyBox } from "./LullabyBox";
import { MonteCarloMobile } from "./MonteCarloMobile";

export function Toybox() {
  return (
    <section id="toybox" aria-labelledby="toybox-title" className="toybox-wrap">
      <h2 id="toybox-title" className="section-title">
        ~*~ Alphie's Toybox ~*~
        <small>Things she made. They look like toys. They are secretly quant models. Play with them!</small>
      </h2>
      <div className="row toybox">
        <MonteCarloMobile />
        <BottleBS />
        <GaltonRattle />
        <LullabyBox />
      </div>
    </section>
  );
}
