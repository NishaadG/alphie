// The nursery's rooms (pages) and the toys on the playroom shelf.
export interface Room {
  path: string;
  label: string;
  letter: string; // shown on the alphabet block in the nav
  icon: string;
  color: string;
  blurb: string;
}

export const ROOMS: Room[] = [
  { path: "/", label: "Home", letter: "A", icon: "🏠", color: "var(--pink)", blurb: "Meet Alphie" },
  { path: "/playroom", label: "Playroom", letter: "L", icon: "🧸", color: "var(--blue)", blurb: "Six toys that are secretly maths" },
  { path: "/storybook", label: "Storybook", letter: "P", icon: "📖", color: "var(--mint)", blurb: "How Alphie came to be" },
  { path: "/nap-room", label: "Nap Room", letter: "H", icon: "🌙", color: "var(--lilac)", blurb: "3D crib and her lullaby" },
  { path: "/monitor", label: "Baby Monitor", letter: "I", icon: "📻", color: "var(--butter)", blurb: "Talk to Alphie" },
  { path: "/guestbook", label: "Guestbook", letter: "E", icon: "📝", color: "var(--peach)", blurb: "Sign her baby book" },
];

export interface ToyInfo {
  slug: string;
  name: string;
  icon: string;
  tint: "pink" | "blue" | "mint" | "butter" | "lilac" | "peach";
  oneLiner: string;
  idea: string; // the grown-up idea behind the toy
  howTo: string;
}

export const TOYS: ToyInfo[] = [
  {
    slug: "mobile",
    name: "Monte Carlo Mobile",
    icon: "🎠",
    tint: "blue",
    oneLiner: "A crib mobile where every string is a possible future.",
    idea: "Monte Carlo simulation: run lots of random futures and look at all of them together.",
    howTo: "Make it wobblier or growier with the sliders, then spin it for new futures.",
  },
  {
    slug: "bottle",
    name: "The Black-Scholes Bottle",
    icon: "🍼",
    tint: "butter",
    oneLiner: "The milk shows what a promise is worth.",
    idea: "Option pricing: the Black-Scholes formula gives a fair price for the right to buy later.",
    howTo: "Move the sliders and watch the milk and the four little dials (the Greeks).",
  },
  {
    slug: "rattle",
    name: "Rattle of Large Numbers",
    icon: "🪇",
    tint: "mint",
    oneLiner: "Shake it: random beads always make a bell.",
    idea: "The law of large numbers and the central limit theorem, as a Galton board.",
    howTo: "Press shake (or shake your phone!) and watch the bell curve grow.",
  },
  {
    slug: "lullaby",
    name: "Random-Walk Lullaby Box",
    icon: "🎶",
    tint: "lilac",
    oneLiner: "Alphie's wobbly crawl, played as a music box.",
    idea: "A random walk: every step goes up or down by chance.",
    howTo: "Wind it up to hear the song. Roll a new crawl for a new tune.",
  },
  {
    slug: "blocks",
    name: "Order-Book Blocks",
    icon: "🧱",
    tint: "peach",
    oneLiner: "Run a toy shop and out-trade Beta the teddy.",
    idea: "Market making: quote a buy and a sell price, earn the gap, watch out for sneaky traders.",
    howTo: "Pick your gap and lean, open the shop, and finish the round ahead of Beta.",
  },
  {
    slug: "first-trade",
    name: "Baby's First Trade",
    icon: "🐷",
    tint: "pink",
    oneLiner: "Fake milk money, one wobbly stock, one smug teddy.",
    idea: "Alpha: how much better you did than just buying and holding.",
    howTo: "Buy and sell RATTLE. Your piggy bank is saved for next time.",
  },
];
