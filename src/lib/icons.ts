// Alphie's sticker icons: hand-drawn SVG on a 48x48 grid, cocoa outline and
// pastel fill, so they match her own drawing. Stored as markup strings so the
// same art can be used inline (Icon) and baked into wallpaper tiles.

const P = "#ffc6d9"; // pink
const B = "#c3e0ff"; // blue
const M = "#bdeed5"; // mint
const Y = "#ffe48f"; // butter
const L = "#dccbff"; // lilac
const O = "#ffd2b5"; // peach
const W = "#fffdfa"; // white
const S = "#ffd9c2"; // skin
const T = "#dcae80"; // teddy
const K = "#5c4033"; // cocoa ink
const R = "#a34063"; // berry

export const ICONS = {
  home: `<path d="M12 23h24v18H12z" fill="${Y}"/><path d="M6 25 24 8l18 17z" fill="${P}"/><path d="M20 41v-8a4 4 0 0 1 8 0v8" fill="${B}"/><circle cx="31" cy="29" r="2.4" fill="${W}"/>`,
  teddy: `<circle cx="13" cy="13" r="6" fill="${T}"/><circle cx="35" cy="13" r="6" fill="${T}"/><circle cx="24" cy="25" r="14" fill="${T}"/><ellipse cx="24" cy="30.5" rx="6.5" ry="5" fill="#f4d7b6"/><ellipse cx="24" cy="28.4" rx="2.4" ry="1.7" fill="${K}" stroke="none"/><circle cx="18.5" cy="21.5" r="1.9" fill="${K}" stroke="none"/><circle cx="29.5" cy="21.5" r="1.9" fill="${K}" stroke="none"/><path d="M21.5 32.5q2.5 2 5 0" stroke-width="2"/>`,
  book: `<path d="M4 15v25q10-3 20 2 10-5 20-2V15" fill="${M}"/><path d="M24 14Q15 8 7 11v26q9-2 17 3z" fill="${W}"/><path d="M24 14q9-6 17-3v26q-9-2-17 3z" fill="${P}"/><path d="M11 18q4-1 8 1M11 24q4-1 8 1M29 19q4-2 8-1M29 25q4-2 8-1" stroke-width="2"/>`,
  moon: `<path d="M27 6a18 18 0 1 0 15 27 15 15 0 0 1-15-27z" fill="${Y}"/><path d="M13 24q3 2.5 6 0" stroke-width="2.2"/><circle cx="18" cy="31" r="2.4" fill="${P}" stroke="none"/><path d="M38 9v7M34.5 12.5h7" stroke-width="2.2"/>`,
  sun: `<path d="M24 4v5M24 39v5M4 24h5M39 24h5M10 10l3.5 3.5M34.5 34.5 38 38M38 10l-3.5 3.5M13.5 34.5 10 38"/><circle cx="24" cy="24" r="10.5" fill="${Y}"/><circle cx="20.5" cy="22.5" r="1.6" fill="${K}" stroke="none"/><circle cx="27.5" cy="22.5" r="1.6" fill="${K}" stroke="none"/><path d="M20.5 27q3.5 3 7 0" stroke-width="2"/>`,
  monitor: `<path d="M29 12l4-8"/><circle cx="33.5" cy="4.5" r="2" fill="${P}"/><rect x="12" y="12" width="24" height="31" rx="7" fill="${B}"/><circle cx="24" cy="24" r="6.5" fill="${W}"/><path d="M21 22h6M20.5 25h7" stroke-width="1.8"/><circle cx="19" cy="36" r="2.3" fill="${P}"/><circle cx="29" cy="36" r="2.3" fill="${M}"/>`,
  pencil: `<path d="m11 31 22-22 6 6-22 22z" fill="${P}"/><path d="m21 21 4-4 6 6-4 4z" fill="${Y}"/><path d="m11 31-5 11 11-5z" fill="${O}"/><path d="m7.5 38.5 2 2" stroke-width="3"/>`,
  mobile: `<path d="M24 3v5M7 13q17-9 34 0"/><path d="M11 12v13M24 8v21M37 12v11" stroke-width="2"/><path d="m11 25 1.6 3.3 3.6.4-2.7 2.5.7 3.6-3.2-1.8-3.2 1.8.7-3.6-2.7-2.5 3.6-.4z" fill="${Y}"/><circle cx="24" cy="34" r="5" fill="${P}"/><path d="M33 27a4.5 4.5 0 1 0 8 0q-4 2-8 0z" fill="${B}"/>`,
  bottle: `<path d="M19 12q5-12 10 0z" fill="#ffcf8a"/><rect x="16" y="12" width="16" height="6" rx="2" fill="${P}"/><rect x="14" y="18" width="20" height="25" rx="6" fill="${W}"/><path d="M14.5 29h19v8a5.5 5.5 0 0 1-5.5 5.5h-8a5.5 5.5 0 0 1-5.5-5.5z" fill="#fff0c9" stroke="none"/><rect x="14" y="18" width="20" height="25" rx="6"/><path d="M28 23h3M28 28h3M28 33h3" stroke-width="2"/>`,
  rattle: `<path d="m26 26 11 11" stroke-width="8"/><path d="m26 26 11 11" stroke="${Y}" stroke-width="3"/><circle cx="39.5" cy="39.5" r="4.5" fill="${B}"/><circle cx="19" cy="19" r="12" fill="${P}"/><circle cx="15" cy="15" r="2" fill="${W}" stroke="none"/><circle cx="22" cy="13" r="1.6" fill="${W}" stroke="none"/><circle cx="23" cy="22" r="2" fill="${W}" stroke="none"/><circle cx="14" cy="23" r="1.6" fill="${W}" stroke="none"/><path d="M4 10l-2-1M6 5 5 2" stroke-width="2"/>`,
  music: `<path d="M17 12l20-5v6l-20 5z" fill="${K}"/><path d="M17 12v22M37 7v22"/><ellipse cx="13" cy="35" rx="5" ry="3.8" fill="${L}"/><ellipse cx="33" cy="30" rx="5" ry="3.8" fill="${L}"/>`,
  blocks: `<rect x="5" y="26" width="17" height="17" rx="3" fill="${P}"/><rect x="26" y="26" width="17" height="17" rx="3" fill="${B}"/><rect x="15" y="8" width="17" height="17" rx="3" fill="${Y}" transform="rotate(-8 23.5 16.5)"/><path d="M10 38l3.5-8 3.5 8M12 35h3" stroke-width="2"/><circle cx="34.5" cy="34.5" r="3.5" stroke-width="2"/><path d="M21 19.5q2.5-6 5 0" stroke-width="2"/>`,
  piggy: `<circle cx="23" cy="8" r="4" fill="${Y}"/><path d="m28 18 3-8 4 9" fill="${P}"/><ellipse cx="24" cy="28" rx="16" ry="12" fill="${P}"/><path d="M13 37v5h5v-3M29 39v3h5v-5" fill="${P}"/><ellipse cx="39.5" cy="27" rx="3.8" ry="4.8" fill="#ffadc6"/><circle cx="38.6" cy="25.6" r=".9" fill="${K}" stroke="none"/><circle cx="38.6" cy="28.6" r=".9" fill="${K}" stroke="none"/><circle cx="32" cy="23" r="1.7" fill="${K}" stroke="none"/><path d="M19 17.5h7M8 27q-5-1-3-5 2-2 2 1" stroke-width="2"/>`,
  speaker: `<path d="M7 19h8l10-8v26l-10-8H7z" fill="${M}"/><path d="M31 18q4 6 0 12M36 13q7 11 0 22"/>`,
  speakerOff: `<path d="M7 19h8l10-8v26l-10-8H7z" fill="${M}"/><path d="m31 19 10 10m0-10-10 10"/>`,
  tantrum: `<path d="M14 9q-2-4 1-6M24 7q-2-4 1-6M34 9q-2-4 1-6" stroke-width="2"/><circle cx="24" cy="28" r="16" fill="#ffb9a6"/><path d="m13 21 7 3M35 21l-7 3"/><circle cx="18" cy="27.5" r="2" fill="${K}" stroke="none"/><circle cx="30" cy="27.5" r="2" fill="${K}" stroke="none"/><ellipse cx="24" cy="36" rx="5.5" ry="4.2" fill="${R}"/>`,
  crib: `<rect x="8" y="16" width="32" height="20" fill="${L}"/><path d="M8 30h32v6H8z" fill="${B}"/><path d="M15 16v14M21 16v14M27 16v14M33 16v14" stroke-width="2"/><path d="M8 10v34M40 10v34M8 16h32M8 36h32"/><circle cx="8" cy="8" r="2.5" fill="${P}"/><circle cx="40" cy="8" r="2.5" fill="${P}"/>`,
  chat: `<path d="M8 12q0-5 5-5h22q5 0 5 5v14q0 5-5 5H21l-9 8v-8q-4 0-4-5z" fill="${W}"/><circle cx="17" cy="19" r="2" fill="${K}" stroke="none"/><circle cx="24" cy="19" r="2" fill="${K}" stroke="none"/><circle cx="31" cy="19" r="2" fill="${K}" stroke="none"/>`,
  heart: `<path d="M24 41C8 31 5 20 11 14c5-5 11-3 13 2 2-5 8-7 13-2 6 6 3 17-13 27z" fill="${P}"/><path d="M14 19q1-3 4-3.5" stroke="${W}" stroke-width="2.4"/>`,
  star: `<path d="m24 6 4.9 11.7 12.6 1-9.6 8.3 3 12.3L24 32.7l-10.9 6.6 3-12.3-9.6-8.3 12.6-1z" fill="${Y}"/><path d="M15.5 21.5q1.5-2 3.5-2" stroke="${W}" stroke-width="2"/>`,
  duck: `<path d="M8 29q0 12 15 12t17-11q1-6-3-7-3 4-9 3-10-1-20 3z" fill="${Y}"/><circle cx="20" cy="17" r="8.5" fill="${Y}"/><path d="M12 16q-7 0-6 3.5 3 3 7 1" fill="#ffb35c"/><circle cx="19" cy="15" r="1.7" fill="${K}" stroke="none"/><path d="M21 32q6 4 11-1" stroke-width="2"/>`,
  bow: `<path d="M24 24Q12 11 7 17q-3 8 2 13 7 3 15-6z" fill="${P}"/><path d="M24 24q12-13 17-7 3 8-2 13-7 3-15-6z" fill="${P}"/><path d="m22 26-5 12 4-1 2 3 1-13M26 26l5 12-4-1-2 3-1-13" fill="${P}"/><circle cx="24" cy="24" r="4.2" fill="#ff9fbd"/>`,
  foot: `<ellipse cx="23" cy="31" rx="9.5" ry="12" fill="${O}"/><circle cx="14" cy="15" r="3.2" fill="${O}"/><circle cx="19.5" cy="11.5" r="3" fill="${O}"/><circle cx="25.5" cy="10.5" r="2.8" fill="${O}"/><circle cx="31" cy="12.5" r="2.5" fill="${O}"/><circle cx="34.5" cy="17" r="2.2" fill="${O}"/>`,
  dice: `<rect x="9" y="9" width="30" height="30" rx="8" fill="${W}" transform="rotate(-8 24 24)"/><g fill="${K}" stroke="none"><circle cx="17" cy="18" r="2.6"/><circle cx="31" cy="16" r="2.6"/><circle cx="24" cy="24" r="2.6"/><circle cx="17" cy="32" r="2.6"/><circle cx="31" cy="30" r="2.6"/></g>`,
  bell: `<path d="M24 6.5v3"/><path d="M13 34q3-3 3-12 0-10 8-10t8 10q0 9 3 12z" fill="${Y}"/><circle cx="24" cy="38" r="3.2" fill="${Y}"/><path d="M11 34h26M6 16q-2 4 0 8M42 16q2 4 0 8"/>`,
  baby: `<circle cx="9" cy="27" r="4" fill="${S}"/><circle cx="39" cy="27" r="4" fill="${S}"/><circle cx="24" cy="27" r="15.5" fill="${S}"/><path d="M22 12q0-7 6-6 4 2-1 6"/><circle cx="18.5" cy="25" r="2.3" fill="${K}" stroke="none"/><circle cx="29.5" cy="25" r="2.3" fill="${K}" stroke="none"/><circle cx="14.5" cy="31" r="2.8" fill="#ffb3c6" stroke="none"/><circle cx="33.5" cy="31" r="2.8" fill="#ffb3c6" stroke="none"/><ellipse cx="24" cy="34" rx="6" ry="3.6" fill="${R}" stroke-width="2"/><circle cx="24" cy="34" r="2.2" fill="${Y}" stroke="none"/>`,
  drop: `<path d="M24 6q11 14 11 22a11 11 0 0 1-22 0q0-8 11-22z" fill="${W}"/><path d="M18 28q0 4 3.5 6" stroke="${B}" stroke-width="2.4"/>`,
  cloud: `<path d="M13 37a7.5 7.5 0 0 1-.5-15 10 10 0 0 1 19-4 8 8 0 0 1 9 8.5A5.5 5.5 0 0 1 39 37z" fill="${W}"/>`,
  ruler: `<rect x="5" y="17" width="38" height="14" rx="2.5" fill="${Y}" transform="rotate(-18 24 24)"/><path d="m12.5 24.5-1.5-4.5M18 22.6l-2.2-6.6M23.5 20.8 22 16.3M29 19l-2.2-6.6M34.5 17.2 33 12.7" stroke-width="2"/>`,
  scale: `<circle cx="24" cy="12" r="4.5" fill="${W}"/><path d="M12 42 16 18h16l4 24z" fill="${L}"/><path d="M20 30h8" stroke-width="2.2"/>`,
  tooth: `<path d="M14 11q10-6 20 0 5 8-1 19-2 11-5 11-2 0-3-8-1-3-2 0-1 8-3 8-3 0-5-11-6-11-1-19z" fill="${W}"/><path d="M18 15q2-2 5-1.5" stroke="${B}" stroke-width="2"/>`,
  sparkle: `<path d="M24 5q2 17 19 19-17 2-19 19-2-17-19-19 17-2 19-19z" fill="${Y}"/>`,
  broom: `<path d="M31 6 21 26"/><path d="M14 23l12 6-4 13q-6 1-14-4z" fill="${Y}"/><path d="m13 32 7 4M15 28l7 4" stroke-width="2"/>`,
  swan: `<path d="M9 30q0 12 17 12 15 0 17-15-7 4-13 1-5-2-9 1z" fill="#3a3150"/><path d="M17 32q-6-9 0-16 4-5-1-8" stroke-width="8.5"/><path d="M17 32q-6-9 0-16 4-5-1-8" stroke="#3a3150" stroke-width="3.6"/><path d="M12 7 5 10.5l7 .5" fill="#e0475f"/><circle cx="14.6" cy="7.6" r="1.3" fill="#fff" stroke="none"/><path d="M25 34q7 3 12-3" stroke="#fff" stroke-width="2"/>`,
} as const;

export type IconName = keyof typeof ICONS;

const attrs = (ink: string) => `fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"`;

// One icon as a positioned SVG group, for baking into wallpaper tiles.
export function iconGroup(name: IconName, x: number, y: number, size: number, rotate = 0, ink = K): string {
  const s = size / 48;
  return `<g transform="translate(${x} ${y}) rotate(${rotate} ${size / 2} ${size / 2}) scale(${s})" ${attrs(ink)}>${ICONS[name]}</g>`;
}

const images = new Map<IconName, HTMLImageElement>();

// An icon as an <img> for canvas toys. Calls onLoad the first time it's ready.
export function iconImage(name: IconName, onLoad: () => void): HTMLImageElement {
  let img = images.get(name);
  if (!img) {
    img = new Image();
    img.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96" height="96">${iconGroup(name, 0, 0, 48)}</svg>`)}`;
    images.set(name, img);
  }
  if (!img.complete) img.addEventListener("load", onLoad, { once: true });
  return img;
}
