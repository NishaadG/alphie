// Scripted Alphie replies. Used when the live chat is unavailable (no key,
// quota reached, network down), so the chat window always answers.
const RULES: Array<[RegExp, string[]]> = [
  [/\b(hi|hello|hey|yo|namaste|hola)\b/i, ["Hiii! *waves rattle* I'm Alphie. Ask me about my toys!", "Goo goo hello! Did you bring snacks or alpha?"]],
  [/\b(beta|teddy)\b/i, ["Beta is my teddy. He just copies the market. I'm going to beat him one day. Maybe tomorrow. After nap."]],
  [/\b(stock|buy|sell|invest|crypto|bitcoin|shares?|portfolio|money|rich)\b/i, [
    "I'm a baby, so I can't give real money advice! But I can tell you diversifying my toys stops me crying when one breaks.",
    "No real advice from me, I'm 11 months old! Grown-ups should ask a licensed grown-up.",
  ]],
  [/\b(black.?scholes|option|call|put|greeks?|delta|gamma|vega|theta)\b/i, ["Options are like... the RIGHT to buy a toy later at today's price. Black-Scholes tells me how much that right costs. Try my bottle!"]],
  [/\b(random walk|brownian|crawl)\b/i, ["My crawl is a random walk! Every step is a coin flip, so nobody knows where I'll end up. Not even me!"]],
  [/\b(monte carlo|simulat)/i, ["Monte Carlo means: imagine lots and lots of futures, then look at all of them. My crib mobile does it!"]],
  [/\b(volatil|sigma|σ|risk)\b/i, ["Volatility is how wobbly something is. My pacifier says σ because I am VERY wobbly before nap time."]],
  [/\b(sleep|nap|tired|bed)\b/i, ["Naps are my best-performing asset. Low risk, high reward. zzz"]],
  [/\b(milk|bottle|food|hungry|snack)\b/i, ["MILK. Liquidity is very important for babies."]],
  [/\b(who are you|what are you|your name|about you)\b/i, ["I'm Alphie! Alpha Brownian-Motion. Baby quant. Born at the opening bell. I build toys that are secretly maths!"]],
  [/\b(age|old)\b/i, ["I'm 0.92 years old. That's almost one whole year of compounding!"]],
  [/\b(love|cute|adorable)\b/i, ["*giggles* Thank you! My cuteness has zero correlation with the market."]],
];

const FALLBACK = [
  "Goo? I didn't understand that, but I'm 87% sure it was nice.",
  "*chews on calculator* Can you ask me about my toys instead?",
  "Ba ba ba... that's baby for 'interesting question, I need a nap first'.",
  "Hmm! My model has no data on that. Want to play with my Galton rattle?",
];

export function babyReply(input: string): string {
  for (const [re, replies] of RULES) {
    if (re.test(input)) return replies[Math.floor(Math.random() * replies.length)];
  }
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}
