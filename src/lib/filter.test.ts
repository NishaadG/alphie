import { describe, expect, it } from "vitest";
import { isClean, tidy } from "../../api/_lib/filter";
import { babyReply } from "./babyTalk";

describe("guestbook filter", () => {
  it("allows ordinary messages, including words that contain blocked substrings", () => {
    expect(isClean("Alphie loves grapes")).toBe(true);
    expect(isClean("a classy bassoon solo")).toBe(true);
    expect(isClean("so cute!! go beat Beta")).toBe(true);
  });

  it("blocks links and rude words, even with leetspeak", () => {
    expect(isClean("visit www.spam.example")).toBe(false);
    expect(isClean("http://x.y")).toBe(false);
    expect(isClean("sh1t")).toBe(false);
    expect(isClean("FUCKING")).toBe(false);
  });

  it("tidies whitespace, control characters and length", () => {
    expect(tidy("  hi\n\nthere\u0007 ", 50)).toBe("hi there");
    expect(tidy("x".repeat(300), 200)).toHaveLength(200);
    expect(tidy(undefined, 10)).toBe("");
  });
});

describe("scripted baby talk", () => {
  it("never gives financial advice", () => {
    expect(babyReply("what stock should I buy?")).toMatch(/baby|grown-up/i);
  });
  it("always answers something", () => {
    expect(babyReply("qwertyuiop").length).toBeGreaterThan(10);
  });
});
