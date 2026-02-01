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
import type { VerseLocation, NavigationInfo } from "./core/lookup";
import { parseVerseKey, createVerseKey } from "./core/types";
import { getWordLocation } from "./core/lookup";
import { clearCache } from "./core/data-loader";

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

    it("should handle colon-only input", () => {
      const result = parseVerseKey(":");
      expect(result.surah).toBe(NaN);
      expect(result.verse).toBe(NaN);
    });

    it("should handle partial input", () => {
      const result = parseVerseKey("1:");
      expect(result.surah).toBe(1);
      expect(result.verse).toBe(NaN);
    });

    it("should handle input with leading zeros", () => {
      const result = parseVerseKey("001:007");
      expect(result.surah).toBe(1);
      expect(result.verse).toBe(7);
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

    it("should create verse key with leading zeros", () => {
      const result = createVerseKey(1, 7);
      expect(result).toBe("1:7");
    });
  });
});

describe("getWordLocation", () => {
  beforeEach(() => {
    clearCache();
  });

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
    expect(location.wordPosition).toBe(1);
  });

  it("should return location with lineNumber 0 when no verseKey provided", () => {
    const word: Word = {
      id: 1,
      position: 5,
      text: "اللَّهِ",
      pageNumber: 1,
      charType: "word",
      surah: 1,
      verse: 2,
    };
    const location = getWordLocation(word, "1:2");
    expect(location.surah).toBe(1);
    expect(location.verse).toBe(2);
    expect(location.pageNumber).toBe(1);
    expect(location.wordPosition).toBe(5);
    expect(location.lineNumber).toBe(0);
  });

  it("should handle word with different position", () => {
    const word: Word = {
      id: 10,
      position: 10,
      text: "الرَّحْمَٰنِ",
      pageNumber: 1,
      charType: "word",
      surah: 1,
      verse: 1,
    };
    const location = getWordLocation(word, "1:1");
    expect(location.surah).toBe(1);
    expect(location.verse).toBe(1);
    expect(location.wordPosition).toBe(10);
  });
});
