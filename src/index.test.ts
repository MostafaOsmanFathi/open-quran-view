import { describe, it, expect } from "vitest";
import { createOpenQuranView } from "./index";
import type { QuranPage, QuranWord } from "./core/types";

describe("OpenQuranView", () => {
  describe("createOpenQuranView", () => {
    it("creates an instance with default riwaya", () => {
      const quran = createOpenQuranView();
      expect(quran).toBeDefined();
    });

    it("creates an instance with hafs riwaya", () => {
      const quran = createOpenQuranView("hafs");
      expect(quran).toBeDefined();
    });
  });

  describe("getFontUrl", () => {
    it("returns correct font URL for page 1", () => {
      const quran = createOpenQuranView("hafs");
      const url = quran.getFontUrl(1);
      expect(url).toBe("data/riwaya/hafs/fonts/woff2/p1.woff2");
    });

    it("returns correct font URL for page 604", () => {
      const quran = createOpenQuranView("hafs");
      const url = quran.getFontUrl(604);
      expect(url).toBe("data/riwaya/hafs/fonts/woff2/p604.woff2");
    });
  });

  describe("getWordsInRange", () => {
    it("requires words to be loaded first", async () => {
      const quran = createOpenQuranView("hafs");
      expect(() => quran.getWordsInRange(1, 5)).toThrow("Words not loaded");
    });
  });
});

describe("Types", () => {
  it("QuranWord has correct shape", () => {
    const word: QuranWord = {
      id: 1,
      surah: 1,
      ayah: 1,
      word: 1,
      location: "1:1:1",
      text: "ﱁ",
    };
    expect(word.id).toBe(1);
    expect(word.text).toBe("ﱁ");
  });

  it("QuranPage has correct shape", () => {
    const page: QuranPage = {
      page_number: 1,
      font_url: "data/riwaya/hafs/fonts/woff2/p1.woff2",
      lines: [],
    };
    expect(page.page_number).toBe(1);
    expect(page.lines).toEqual([]);
  });
});
