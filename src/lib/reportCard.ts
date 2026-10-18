import { iconImage, type IconName } from "./icons";
import { load, type VisitMemory } from "./memory";
import { alpha, isPortfolio } from "./paperTrade";
import { STICKERS } from "./stickers";
import { getState } from "./store";

interface Line {
  subject: string;
  grade: string;
  note: string;
  icon: IconName;
}

function gradeFor(score: number): string {
  if (score >= 0.9) return "A+";
  if (score >= 0.7) return "A";
  if (score >= 0.5) return "B";
  if (score >= 0.3) return "C";
  return "D";
}

// Grades come from what this visitor actually did on the site.
export function reportLines(): { lines: Line[]; comment: string } {
  const trade = load<unknown>("first-trade", null);
  const shop = load("shop", { rounds: 0, wins: 0, best: 0 });
  const visit = load<VisitMemory>("visit", { visits: 1, lastVisit: null, eggsFound: [] });
  const found = getState().found.length;

  let tradeLine: Line;
  let alphaGrade = "C";
  if (isPortfolio(trade) && trade.trades > 0) {
    const a = alpha(trade);
    alphaGrade = a > 0.1 ? "A+" : a > 0.03 ? "A" : a > 0 ? "B" : a > -0.05 ? "C" : "D";
    tradeLine = { subject: "Beating Beta", grade: alphaGrade, note: `${a >= 0 ? "+" : ""}${(a * 100).toFixed(1)}% alpha in Baby's First Trade`, icon: "piggy" };
  } else {
    tradeLine = { subject: "Beating Beta", grade: "Inc.", note: "hasn't traded yet (still teething)", icon: "piggy" };
  }

  const shopLine: Line =
    shop.rounds > 0
      ? { subject: "Toy Shop", grade: gradeFor(shop.wins / shop.rounds + 0.2), note: `won ${shop.wins} of ${shop.rounds} rounds against Beta`, icon: "blocks" }
      : { subject: "Toy Shop", grade: "Inc.", note: "never opened the shop", icon: "blocks" };

  const lines: Line[] = [
    tradeLine,
    shopLine,
    { subject: "Finding Secrets", grade: gradeFor(found / STICKERS.length + 0.15), note: `${found} of ${STICKERS.length} stickers found`, icon: "star" },
    {
      subject: "Visiting Alphie",
      grade: visit.visits >= 5 ? "A+" : visit.visits >= 3 ? "A" : "B",
      note: visit.visits > 1 ? `came back ${visit.visits} times` : "first visit (come back soon!)",
      icon: "heart",
    },
    { subject: "Effort", grade: "A+", note: "very good at pressing buttons", icon: "rattle" },
  ];

  const comment =
    alphaGrade === "A+" || alphaGrade === "A"
      ? "Outstanding! Beat the benchmark. Beta is sulking in the corner."
      : `A+ for effort, ${alphaGrade} for alpha. Will make a fine quant once she can hold a pencil.`;
  return { lines, comment };
}

const loadIcon = (name: IconName) =>
  new Promise<HTMLImageElement>((resolve) => {
    const img = iconImage(name, () => resolve(img));
    if (img.complete) resolve(img);
  });

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// Draw the report card as a PNG.
export async function drawReportCard(): Promise<Blob> {
  const W = 900;
  const H = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const { lines, comment } = reportLines();

  await Promise.all(["64px Sniglet", "30px Fredoka", "30px Gaegu"].map((f) => document.fonts.load(f).catch(() => null)));
  const icons = await Promise.all([...lines.map((l) => l.icon), "baby", "bow", "teddy"].map((n) => loadIcon(n as IconName)));

  const ink = "#5c4033";
  // paper with soft pink stripes
  ctx.fillStyle = "#fff8f1";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255, 196, 214, 0.28)";
  for (let x = 36; x < W; x += 72) ctx.fillRect(x, 0, 36, H);
  // blanket border
  roundRect(ctx, 24, 24, W - 48, H - 48, 40);
  ctx.fillStyle = "#fffdfa";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = ink;
  ctx.stroke();
  roundRect(ctx, 44, 44, W - 88, H - 88, 26);
  ctx.setLineDash([12, 10]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(92, 64, 51, 0.35)";
  ctx.stroke();
  ctx.setLineDash([]);

  // header
  ctx.drawImage(icons[lines.length], 70, 70, 130, 130);
  ctx.drawImage(icons[lines.length + 1], 150, 60, 60, 60);
  ctx.fillStyle = "#a34063";
  ctx.font = "72px Sniglet, sans-serif";
  ctx.fillText("Report Card", 225, 150);
  ctx.fillStyle = ink;
  ctx.font = "32px Gaegu, cursive";
  ctx.fillText(`Alphie's Nursery · ${new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}`, 228, 196);

  // subjects
  const colors = ["#ffd6e5", "#cfe6ff", "#fff1b8", "#c9f0dc", "#e6d9ff"];
  lines.forEach((l, i) => {
    const y = 240 + i * 130;
    roundRect(ctx, 70, y, W - 140, 110, 24);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.drawImage(icons[i], 92, y + 20, 70, 70);
    ctx.fillStyle = ink;
    ctx.font = "600 36px Fredoka, sans-serif";
    ctx.fillText(l.subject, 186, y + 50);
    ctx.font = "30px Gaegu, cursive";
    ctx.fillText(l.note, 186, y + 88);
    // grade sticker
    ctx.beginPath();
    ctx.arc(W - 140, y + 55, 44, 0, Math.PI * 2);
    ctx.fillStyle = "#fffdfa";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#a34063";
    ctx.stroke();
    ctx.fillStyle = "#a34063";
    ctx.font = `${l.grade.length > 2 ? 34 : 50}px Sniglet, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(l.grade, W - 140, y + 55 + (l.grade.length > 2 ? 12 : 18));
    ctx.textAlign = "left";
  });

  // teacher's comment
  const cy = 240 + lines.length * 130 + 10;
  ctx.fillStyle = ink;
  ctx.font = "600 30px Fredoka, sans-serif";
  ctx.fillText("Teacher's comment:", 76, cy + 20);
  ctx.font = "34px Gaegu, cursive";
  ctx.fillStyle = "#3b4fa0";
  const words = comment.split(" ");
  let line = "";
  let ly = cy + 64;
  for (const w of words) {
    if (ctx.measureText(line + w).width > W - 290) {
      ctx.fillText(line, 76, ly);
      line = "";
      ly += 40;
    }
    line += w + " ";
  }
  ctx.fillText(line, 76, ly);
  ctx.drawImage(icons[lines.length + 2], W - 190, H - 200, 110, 110);
  ctx.fillStyle = ink;
  ctx.font = "28px Gaegu, cursive";
  ctx.fillText("signed: Beta (the teddy), Head Teacher", 76, H - 92);
  ctx.font = "22px Fredoka, sans-serif";
  ctx.fillStyle = "#8a6a5b";
  ctx.fillText("Fake money, real maths. Not financial advice.", 76, H - 60);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("no blob"))), "image/png"));
}
