import { describe, expect, it } from "vitest";
import { ICONS } from "./icons";
import { STICKERS } from "./stickers";

describe("sticker chart", () => {
  it("has unique ids and real icons", () => {
    expect(new Set(STICKERS.map((s) => s.id)).size).toBe(STICKERS.length);
    for (const s of STICKERS) expect(ICONS[s.icon]).toBeTruthy();
  });
});
