import { useEffect } from "react";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { collect } from "../lib/stickers";
import { usePageTitle } from "./common";
import "../styles/beta.css";

// Beta's secret room: the teddy's own homepage. He's a passive index fund,
// so it is (on purpose) the most boring page on the internet.
export default function BetaRoom() {
  usePageTitle("Beta's Homepage");
  useEffect(() => collect("beta-room"), []);

  return (
    <article className="beta" aria-labelledby="beta-title">
      <Icon name="teddy" size={110} className="beta__teddy" />
      <h1 id="beta-title">Beta's Homepage</h1>
      <p className="beta__sub">(est. whenever the market was)</p>
      <hr />
      <p>
        Hello. I am Beta. I am a teddy bear and a passive index fund. I own a tiny piece of everything and I never do anything. Every
        year I return exactly what the market returns.
      </p>
      <p>Alphie says this is boring. Alphie is correct. Alphie also cries a lot.</p>
      <table className="beta__table">
        <caption>My statistics</caption>
        <tbody>
          <tr>
            <th scope="row">Trades this year</th>
            <td>0</td>
          </tr>
          <tr>
            <th scope="row">Tantrums</th>
            <td>0</td>
          </tr>
          <tr>
            <th scope="row">Alpha</th>
            <td>0.00%</td>
          </tr>
          <tr>
            <th scope="row">Beta</th>
            <td>1.00 (obviously)</td>
          </tr>
        </tbody>
      </table>
      <svg className="beta__chart" viewBox="0 0 300 80" role="img" aria-label="A perfectly straight line">
        <line x1="10" y1="60" x2="290" y2="20" />
      </svg>
      <p className="beta__caption">My performance (same as the market, which is the point).</p>
      <p>
        Visitors: I don't count visitors. Counting would be active management.
      </p>
      <hr />
      <p>
        <Link to="/">Leave</Link> (I won't notice).
      </p>
    </article>
  );
}
