# Alphie's Homepage

A retro personal website for **Alphie** (Alpha Brownian-Motion), a baby quant who crawls in random walks and builds nursery toys that are secretly quant models.

> "Born to beat the benchmark. (Sometimes.)"

## Character sheet

| | |
|---|---|
| Name | Alphie (Alpha Brownian-Motion) |
| What she is | An 11-month-old baby quant with an up-tick hair curl and a σ pacifier |
| What she does | Builds toys that are secretly quant models, and tries to beat her teddy, Beta |
| Her story | Born at the opening bell. Her first crawl was a random walk |
| Tagline | Born to beat the benchmark. (Sometimes.) |

## What's inside

- **AlphieOS 98 desktop**: Win98-style windows, Start menu, taskbar clock, fake nursery stock ticker.
- **Alphie herself**: hand-drawn SVG; eyes follow your cursor or finger, moods follow the market, she naps in a bear market.
- **Toybox** (all playable, all real maths):
  - *Monte Carlo Mobile*: crib-mobile strings are simulated geometric Brownian motion paths.
  - *Black-Scholes Bottle*: milk level is a call option price; the Greeks are dials.
  - *Rattle of Large Numbers*: a Galton board that builds a bell curve (shake your phone).
  - *Lullaby Box*: a random walk turned into a music-box melody with the Web Audio API.
- **Scroll story**: five scenes along a crawl path that draws itself as you scroll (GSAP ScrollTrigger).
- **3D crib**: low-poly Alphie and Beta in three.js, lazy-loaded.
- **Ask Alphie**: in-character chat with a live model and a scripted fallback.
- **Guestbook, hit-counter odometer, sparkle trail, click sounds with mute, bull/bear day/night toggle, Chaos Mode, visitor memory.**
- A few hidden surprises.

## Run it

```bash
npm install
npm run dev      # front end only; the API routes fall back gracefully
npm test         # maths, filter and fallback tests
npm run build
```

The `api/` folder holds serverless functions (Vercel). They need these environment variables:

| Variable | Used by |
|---|---|
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL`, `KV_REST_API_TOKEN`) | guestbook, hit counter, rate limits |
| `GEMINI_API_KEY` (optional `GEMINI_MODEL`, default `gemini-flash-latest`) | Ask Alphie live replies |

Without them, the site still works: the counter shows your own visits, the guestbook shows examples, and Alphie answers from her scripted baby brain.

## Credits

Fonts: Fredoka and VT323 (SIL Open Font License). Libraries: React, GSAP, three.js, canvas-confetti, Upstash Redis, Vite. All character art, sounds and 3D models are original and made in code. Full list in the site footer.

Fake money, fake tickers, real maths. Nothing here is financial advice.
