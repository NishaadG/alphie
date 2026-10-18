import { useEffect } from "react";
import { rememberEgg } from "../lib/memory";
import { Link } from "../lib/router";
import { say } from "../lib/store";
import { usePageTitle } from "./common";

// Alphie random-walked her way off the map. Finding this page counts as a secret.
export default function NotFound() {
  usePageTitle("Lost!");
  useEffect(() => {
    rememberEgg("lost");
    say("Oopsie! I crawled somewhere random again…", 4000);
  }, []);
  return (
    <section className="lost" aria-labelledby="lost-title">
      <svg viewBox="0 0 300 120" className="lost__path" aria-hidden="true">
        <path d="M10 60 L40 40 L60 70 L90 30 L110 80 L140 50 L170 90 L200 35 L230 70 L260 45" fill="none" strokeWidth="4" strokeDasharray="6 8" strokeLinecap="round" />
        <text x="262" y="50" fontSize="30">
          👶
        </text>
        <text x="0" y="75" fontSize="24">
          🏠
        </text>
      </svg>
      <h1 id="lost-title">Oopsie! This page crawled away.</h1>
      <p>Alphie took a random walk and ended up somewhere that doesn't exist. That's what random walks do!</p>
      <Link to="/" className="btn">
        🏠 Crawl back home
      </Link>
    </section>
  );
}
