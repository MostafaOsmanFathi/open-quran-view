import { describe, it, expect } from "vitest";
import { createOpenQuranView } from "./index";

describe("OpenQuranView", () => {
  describe("createOpenQuranView", () => {
    it("creates an instance", () => {
      const quran = createOpenQuranView();
      expect(quran).toBeDefined();
    });
  });

  describe("getFontUrl", () => {
    it("returns correct font URL", () => {
      const quran = createOpenQuranView();
      const url = quran.getFontUrl();
      expect(url).toContain("hafs-digitalkhatt/DigitalKhattV2.ttf");
    });
  });

  describe("getWordsInRange", () => {
    it("requires words to be loaded first", async () => {
      const quran = createOpenQuranView();
      expect(() => quran.getWordsInRange(1, 5)).toThrow("Words not loaded");
    });
  });
});
