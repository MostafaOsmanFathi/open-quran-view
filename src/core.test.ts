import { describe, it, expect, beforeEach } from "vitest";
import type {
  MushafLayout,
  CharType,
  WordLocation,
  Word,
  Line,
  Page,
  Surah,
  Juz,
} from "./core/types";
import { parseVerseKey, createVerseKey } from "./core/types";
import { NavigationInfo, VerseLocation } from "./core/lookup";
import {
  loadPage,
  loadAllPages,
  loadPages,
  loadSurahs,
  loadJuzs,
  getSurah,
  getJuz,
  getSurahByPage,
  clearCache,
} from "./core/data-loader";
import {
  getPageForVerse,
  getVerseLocation,
  getNavigation,
  getPageRangeForSurah,
  getFirstVerseOfPage,
  getLastVerseOfPage,
  getWordLocation,
} from "./core/lookup";
import { getFontUrl, clearFontCache } from "./core/font-loader";

describe("Core Types", () => {
  describe("MushafLayout", () => {
    it("should accept valid layout values", () => {
      const layouts: MushafLayout[] = ["hafs-v2", "hafs-v4", "hafs-unicode"];
      expect(layouts).toHaveLength(3);
    });
  });

  describe("CharType", () => {
    it("should accept valid char type values", () => {
      const charTypes: CharType[] = ["word", "end", "pause", "rub", "sajdah"];
      expect(charTypes).toHaveLength(5);
    });
  });

  describe("WordLocation", () => {
    it("should have correct structure", () => {
      const location: WordLocation = {
        surah: 1,
        verse: 1,
        position: 1,
      };
      expect(location.surah).toBe(1);
      expect(location.verse).toBe(1);
      expect(location.position).toBe(1);
    });
  });

  describe("Word", () => {
    it("should have correct structure with all required fields", () => {
      const word: Word = {
        id: 1,
        position: 1,
        text: "بِسْمِ",
        pageNumber: 1,
        charType: "word",
        surah: 1,
        verse: 1,
      };
      expect(word.id).toBe(1);
      expect(word.position).toBe(1);
      expect(word.text).toBe("بِسْمِ");
      expect(word.pageNumber).toBe(1);
      expect(word.charType).toBe("word");
      expect(word.surah).toBe(1);
      expect(word.verse).toBe(1);
    });

    it("should accept optional code_v2 field", () => {
      const word: Word = {
        id: 1,
        position: 1,
        text: "بِسْمِ",
        code_v2: "some-code",
        pageNumber: 1,
        charType: "word",
        surah: 1,
        verse: 1,
      };
      expect(word.code_v2).toBe("some-code");
    });
  });

  describe("Line", () => {
    it("should have correct structure", () => {
      const line: Line = {
        lineNumber: 1,
        words: [],
        metadata: {
          verseId: 1,
          verseKey: "1:1",
          chapterId: 1,
        },
      };
      expect(line.lineNumber).toBe(1);
      expect(line.words).toEqual([]);
      expect(line.metadata.verseKey).toBe("1:1");
    });
  });

  describe("Page", () => {
    it("should have correct structure", () => {
      const page: Page = {
        pageNumber: 1,
        lines: [],
      };
      expect(page.pageNumber).toBe(1);
      expect(page.lines).toEqual([]);
    });
  });

  describe("Surah", () => {
    it("should have correct structure", () => {
      const surah: Surah = {
        id: 1,
        nameSimple: "Al-Fatihah",
        nameComplex: "The Opening",
        nameArabic: "ٱلْفَاتِحَة",
        versesCount: 7,
        revelationPlace: "makkah",
        revelationOrder: 5,
        bismillahPre: false,
        pages: [1, 1] as [number, number],
        translatedName: {
          languageName: "english",
          name: "The Opening",
        },
      };
      expect(surah.id).toBe(1);
      expect(surah.nameSimple).toBe("Al-Fatihah");
      expect(surah.versesCount).toBe(7);
      expect(surah.revelationPlace).toBe("makkah");
      expect(surah.pages).toEqual([1, 1]);
    });
  });

  describe("Juz", () => {
    it("should have correct structure", () => {
      const juz: Juz = {
        id: 1,
        juzNumber: 1,
        firstVerseId: 1,
        lastVerseId: 148,
        versesCount: 148,
        verseMapping: {},
      };
      expect(juz.id).toBe(1);
      expect(juz.juzNumber).toBe(1);
      expect(juz.firstVerseId).toBe(1);
    });
  });

  describe("VerseLocation", () => {
    it("should have correct structure", () => {
      const location: VerseLocation = {
        surah: 1,
        verse: 1,
        pageNumber: 1,
        lineNumber: 1,
        wordPosition: 1,
      };
      expect(location.surah).toBe(1);
      expect(location.verse).toBe(1);
      expect(location.pageNumber).toBe(1);
      expect(location.lineNumber).toBe(1);
      expect(location.wordPosition).toBe(1);
    });
  });

  describe("NavigationInfo", () => {
    it("should have correct structure", () => {
      const nav: NavigationInfo = {
        prevPage: null,
        nextPage: 2,
        currentSurah: null,
        surahStartPage: 1,
        surahEndPage: 1,
      };
      expect(nav.prevPage).toBeNull();
      expect(nav.nextPage).toBe(2);
      expect(nav.currentSurah).toBeNull();
      expect(nav.surahStartPage).toBe(1);
      expect(nav.surahEndPage).toBe(1);
    });
  });
});

describe("Helper Functions", () => {
  describe("parseVerseKey", () => {
    it("should parse valid verse key", () => {
      const result = parseVerseKey("1:1");
      expect(result.surah).toBe(1);
      expect(result.verse).toBe(1);
    });

    it("should parse verse key with different numbers", () => {
      const result = parseVerseKey("2:255");
      expect(result.surah).toBe(2);
      expect(result.verse).toBe(255);
    });

    it("should return NaN for invalid input", () => {
      const result = parseVerseKey("invalid");
      expect(result.surah).toBe(NaN);
      expect(result.verse).toBe(NaN);
    });

    it("should handle empty string", () => {
      const result = parseVerseKey("");
      expect(result.surah).toBe(NaN);
      expect(result.verse).toBe(NaN);
    });
  });

  describe("createVerseKey", () => {
    it("should create valid verse key", () => {
      const result = createVerseKey(1, 1);
      expect(result).toBe("1:1");
    });

    it("should create verse key with different numbers", () => {
      const result = createVerseKey(2, 255);
      expect(result).toBe("2:255");
    });
  });
});

describe("Font Loader", () => {
  beforeEach(() => {
    clearFontCache();
  });

  describe("getFontUrl", () => {
    it("should return correct local URL for hafs-v2 layout", async () => {
      const url = await getFontUrl("hafs-v2", 1);
      expect(url).toBe("/data/fonts/hafs-v2/p1.woff2");
    });

    it("should return correct local URL for hafs-v4 layout", async () => {
      const url = await getFontUrl("hafs-v4", 180);
      expect(url).toBe("/data/fonts/hafs-v4/p180.woff2");
    });

    it("should return correct local URL for hafs-unicode layout", async () => {
      const url = await getFontUrl("hafs-unicode", 1);
      expect(url).toBe("/data/fonts/hafs-unicode/p1.woff2");
    });

    it("should generate different URLs for different pages", async () => {
      const url1 = await getFontUrl("hafs-v2", 1);
      const url2 = await getFontUrl("hafs-v2", 2);
      expect(url1).not.toBe(url2);
    });

    it("should cache font URLs", async () => {
      const url1 = await getFontUrl("hafs-v2", 1);
      const url2 = await getFontUrl("hafs-v2", 1);
      expect(url1).toBe(url2);
    });
  });

  describe("clearFontCache", () => {
    it("should clear cache for specific layout", async () => {
      const url1 = await getFontUrl("hafs-v2", 1);
      clearFontCache("hafs-v2");
      const url2 = await getFontUrl("hafs-v2", 1);
      expect(url1).toBe(url2);
    });

    it("should clear all caches when no layout specified", async () => {
      const url1 = await getFontUrl("hafs-v2", 1);
      const url3 = await getFontUrl("hafs-v4", 1);
      clearFontCache();
      const url2 = await getFontUrl("hafs-v2", 1);
      const url4 = await getFontUrl("hafs-v4", 1);
      expect(url1).toBe(url2);
      expect(url3).toBe(url4);
    });
  });
});

describe("Data Loader", () => {
  beforeEach(() => {
    clearCache();
  });

  describe("loadPages", () => {
    it("should load all pages for a layout", async () => {
      const pages = await loadPages("hafs-v2");
      expect(pages).toBeDefined();
      expect(Array.isArray(pages)).toBe(true);
      if (Array.isArray(pages)) {
        expect(pages.length).toBeGreaterThan(0);
      }
    });

    it("should load a specific page by number", async () => {
      const page = await loadPages("hafs-v2", 1);
      expect(page).not.toBeNull();
      if (page && !Array.isArray(page)) {
        expect(page.pageNumber).toBe(1);
      }
    });

    it("should return null for invalid page number", async () => {
      const page = await loadPages("hafs-v2", 999);
      expect(page).toBeNull();
    });
  });

  describe("loadPage", () => {
    it("should load a page successfully", async () => {
      const page = await loadPage("hafs-v2", 1);
      expect(page).not.toBeNull();
      expect(page?.pageNumber).toBe(1);
      expect(page?.lines).toBeDefined();
      expect(Array.isArray(page?.lines)).toBe(true);
    });

    it("should return null for invalid page number", async () => {
      const page = await loadPage("hafs-v2", 999);
      expect(page).toBeNull();
    });

    it("should return null for page 0", async () => {
      const page = await loadPage("hafs-v2", 0);
      expect(page).toBeNull();
    });

    it("should return null for negative page numbers", async () => {
      const page = await loadPage("hafs-v2", -1);
      expect(page).toBeNull();
    });
  });

  describe("loadAllPages", () => {
    it("should load all pages for a layout", async () => {
      const pages = await loadAllPages("hafs-v2");
      expect(pages).toBeDefined();
      expect(pages.length).toBeGreaterThan(0);
      expect(pages[0]?.pageNumber).toBe(1);
      expect(pages[pages.length - 1]?.pageNumber).toBe(pages.length);
    });

    it("should have pages for different layouts", async () => {
      const hafsV2 = await loadAllPages("hafs-v2");
      const hafsV4 = await loadAllPages("hafs-v4");
      const hafsUnicode = await loadAllPages("hafs-unicode");

      expect(hafsV2.length).toBeGreaterThan(0);
      expect(hafsV4.length).toBeGreaterThan(0);
      expect(hafsUnicode.length).toBeGreaterThan(0);
    });

    it("should cache loaded pages", async () => {
      const pages1 = await loadAllPages("hafs-v2");
      const pages2 = await loadAllPages("hafs-v2");
      expect(pages1).toBe(pages2);
    });
  });

  describe("getSurah", () => {
    it("should return surah by ID", async () => {
      const surah = await getSurah(1);
      expect(surah).not.toBeNull();
      expect(surah?.id).toBe(1);
      expect(surah?.nameSimple).toBe("Al-Fatihah");
    });

    it("should return null for invalid surah ID", async () => {
      const surah = await getSurah(999);
      expect(surah).toBeNull();
    });
  });

  describe("getJuz", () => {
    it("should return juz by ID", async () => {
      const juz = await getJuz(1);
      expect(juz).not.toBeNull();
      expect(juz?.id).toBe(1);
      expect(juz?.juzNumber).toBe(1);
    });

    it("should return null for invalid juz ID", async () => {
      const juz = await getJuz(999);
      expect(juz).toBeNull();
    });
  });

  describe("getSurahByPage", () => {
    it("should return surah for a valid page", async () => {
      const surah = await getSurahByPage(1);
      expect(surah).not.toBeNull();
      expect(surah?.id).toBe(1);
    });

    it("should return null for page outside any surah range", async () => {
      const surah = await getSurahByPage(999);
      expect(surah).toBeNull();
    });
  });

  describe("clearCache", () => {
    it("should allow reloading pages after clearing specific layout cache", async () => {
      const pages1 = await loadAllPages("hafs-v2");
      clearCache("hafs-v2");
      const pages2 = await loadAllPages("hafs-v2");
      expect(pages1.length).toBe(pages2.length);
      expect(pages1[0]?.pageNumber).toBe(pages2[0]?.pageNumber);
    });

    it("should allow reloading all data after clearing all caches", async () => {
      const pages1 = await loadAllPages("hafs-v2");
      const surahs1 = await getSurah(1);
      clearCache();
      const pages2 = await loadAllPages("hafs-v2");
      const surahs2 = await getSurah(1);
      expect(pages1.length).toBe(pages2.length);
      expect(surahs1?.id).toBe(surahs2?.id);
    });

    it("should not affect other layouts when clearing specific layout", async () => {
      await loadAllPages("hafs-v2");
      const hafsV4 = await loadAllPages("hafs-v4");
      clearCache("hafs-v2");
      const hafsV4After = await loadAllPages("hafs-v4");
      expect(hafsV4.length).toBe(hafsV4After.length);
    });
  });
});

describe("Data Loading", () => {
  beforeEach(() => {
    clearCache();
  });

  describe("JSON Files", () => {
    it("should load pages JSON for hafs-v2 layout", async () => {
      const page = await loadPage("hafs-v2", 1);
      expect(page).not.toBeNull();
      expect(page?.pageNumber).toBe(1);
      expect(page?.lines).toBeDefined();
      expect(page?.lines.length).toBeGreaterThan(0);
    });

    it("should load pages JSON for hafs-v4 layout", async () => {
      const page = await loadPage("hafs-v4", 1);
      expect(page).not.toBeNull();
      expect(page?.pageNumber).toBe(1);
    });

    it("should load all 604 pages for hafs-v2 layout", async () => {
      const pages = await loadAllPages("hafs-v2");
      expect(pages.length).toBe(604);
      expect(pages[0]?.pageNumber).toBe(1);
      expect(pages[pages.length - 1]?.pageNumber).toBe(604);
    });

    it("should load all 604 pages for hafs-v4 layout", async () => {
      const pages = await loadAllPages("hafs-v4");
      expect(pages.length).toBe(604);
    });

    it("should load surahs JSON", async () => {
      const surahs = await loadSurahs();
      expect(surahs.length).toBe(114);
      expect(surahs[0]?.id).toBe(1);
      expect(surahs[0]?.nameSimple).toBe("Al-Fatihah");
    });

    it("should load juzs JSON", async () => {
      const juzs = await loadJuzs();
      expect(juzs.length).toBe(60);
      expect(juzs[0]?.juzNumber).toBe(1);
      expect(juzs[juzs.length - 1]?.juzNumber).toBe(30);
      expect(juzs[juzs.length - 1]?.id).toBe(90);
    });
  });

  describe("Font Files", () => {
    it("should return correct URL for hafs-v2 fonts", async () => {
      const url1 = await getFontUrl("hafs-v2", 1);
      const url604 = await getFontUrl("hafs-v2", 604);
      expect(url1).toBe("/data/fonts/hafs-v2/p1.woff2");
      expect(url604).toBe("/data/fonts/hafs-v2/p604.woff2");
    });

    it("should return correct URL for hafs-v4 fonts", async () => {
      const url1 = await getFontUrl("hafs-v4", 1);
      const url604 = await getFontUrl("hafs-v4", 604);
      expect(url1).toBe("/data/fonts/hafs-v4/p1.woff2");
      expect(url604).toBe("/data/fonts/hafs-v4/p604.woff2");
    });

    it("should generate unique URLs for each page", async () => {
      const url1 = await getFontUrl("hafs-v2", 1);
      const url2 = await getFontUrl("hafs-v2", 2);
      expect(url1).not.toBe(url2);
    });

    it("should cache font URLs", async () => {
      const url1a = await getFontUrl("hafs-v2", 1);
      const url1b = await getFontUrl("hafs-v2", 1);
      expect(url1a).toBe(url1b);
    });
  });
});

describe("Lookup Functions", () => {
  beforeEach(() => {
    clearCache();
  });

  describe("getPageForVerse", () => {
    it("should return page and location for valid verse", async () => {
      const result = await getPageForVerse("1:1", "hafs-v2");
      expect(result.page).not.toBeNull();
      expect(result.verseLocation).not.toBeNull();
      expect(result.verseLocation?.surah).toBe(1);
      expect(result.verseLocation?.verse).toBe(1);
    });

    it("should return null for invalid verse key", async () => {
      const result = await getPageForVerse("invalid", "hafs-v2");
      expect(result.page).toBeNull();
      expect(result.verseLocation).toBeNull();
    });

    it("should return null for non-existent verse", async () => {
      const result = await getPageForVerse("999:999", "hafs-v2");
      expect(result.page).toBeNull();
      expect(result.verseLocation).toBeNull();
    });

    it("should default to hafs-v2 layout", async () => {
      const result = await getPageForVerse("1:1");
      expect(result.page).not.toBeNull();
    });
  });

  describe("getVerseLocation", () => {
    it("should return verse location for valid chapter and verse", async () => {
      const location = await getVerseLocation(1, 1, "hafs-v2");
      expect(location).not.toBeNull();
      expect(location?.surah).toBe(1);
      expect(location?.verse).toBe(1);
    });

    it("should return null for invalid chapter or verse", async () => {
      const location = await getVerseLocation(999, 999, "hafs-v2");
      expect(location).toBeNull();
    });
  });

  describe("getNavigation", () => {
    it("should return navigation info for first page", async () => {
      const nav = await getNavigation(1, "hafs-v2");
      expect(nav.prevPage).toBeNull();
      expect(nav.nextPage).toBeGreaterThan(1);
      expect(nav.currentSurah).not.toBeNull();
    });

    it("should return navigation info for last page", async () => {
      const pages = await loadAllPages("hafs-v2");
      const nav = await getNavigation(pages.length, "hafs-v2");
      expect(nav.nextPage).toBeNull();
      expect(nav.prevPage).toBeLessThan(pages.length);
    });

    it("should return correct page boundaries for surah", async () => {
      const nav = await getNavigation(1, "hafs-v2");
      expect(nav.surahStartPage).toBeDefined();
      expect(nav.surahEndPage).toBeDefined();
      expect(nav.surahStartPage).toBeLessThanOrEqual(nav.surahEndPage);
    });
  });

  describe("getPageRangeForSurah", () => {
    it("should return page range for valid surah", async () => {
      const range = await getPageRangeForSurah(1);
      expect(range).not.toBeNull();
      expect(range!.length).toBe(2);
      expect(range![0]).toBeLessThanOrEqual(range![1]);
    });

    it("should return null for invalid surah", async () => {
      const range = await getPageRangeForSurah(999);
      expect(range).toBeNull();
    });
  });

  describe("getFirstVerseOfPage", () => {
    it("should return first verse location for valid page", async () => {
      const location = await getFirstVerseOfPage(1, "hafs-v2");
      expect(location).not.toBeNull();
      expect(location?.pageNumber).toBe(1);
      expect(location?.surah).toBeDefined();
      expect(location?.verse).toBeDefined();
    });

    it("should return null for invalid page", async () => {
      const location = await getFirstVerseOfPage(999, "hafs-v2");
      expect(location).toBeNull();
    });
  });

  describe("getLastVerseOfPage", () => {
    it("should return last verse location for valid page", async () => {
      const location = await getLastVerseOfPage(1, "hafs-v2");
      expect(location).not.toBeNull();
      expect(location?.pageNumber).toBe(1);
      expect(location?.surah).toBeDefined();
      expect(location?.verse).toBeDefined();
    });

    it("should return null for invalid page", async () => {
      const location = await getLastVerseOfPage(999, "hafs-v2");
      expect(location).toBeNull();
    });
  });

  describe("getWordLocation", () => {
    it("should return verse location for a word with verseKey", () => {
      const word: Word = {
        id: 1,
        position: 1,
        text: "بِسْمِ",
        pageNumber: 1,
        charType: "word",
        surah: 1,
        verse: 1,
      };
      const location = getWordLocation(word, "1:1");
      expect(location.surah).toBe(1);
      expect(location.verse).toBe(1);
      expect(location.pageNumber).toBe(1);
      expect(location.wordPosition).toBe(1);
    });

    it("should return zero surah and verse when no verseKey provided", () => {
      const word: Word = {
        id: 1,
        position: 1,
        text: "بِسْمِ",
        pageNumber: 1,
        charType: "word",
        surah: 1,
        verse: 1,
      };
      const location = getWordLocation(word);
      expect(location.surah).toBe(0);
      expect(location.verse).toBe(0);
      expect(location.pageNumber).toBe(1);
    });
  });
});
