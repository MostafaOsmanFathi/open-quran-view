export type MushafLayout = "hafs-v2" | "hafs-v4" | "hafs-unicode";

export type CharType = "word" | "end" | "pause" | "rub" | "sajdah";

export type WordLocation = {
  surah: number;
  verse: number;
  position: number;
};

export type Word = {
  id: number;
  position: number;
  text: string;
  code_v2?: string;
  pageNumber: number;
  charType: CharType;
} & WordLocation;

export type LineMetadata = {
  verseId: number;
  verseKey: string;
  chapterId: number;
};

export type Line = {
  lineNumber: number;
  words: Word[];
  metadata: LineMetadata;
};

export type Page = {
  pageNumber: number;
  lines: Line[];
};

export type TranslatedName = {
  languageName: string;
  name: string;
};

export type Surah = {
  id: number;
  nameSimple: string;
  nameComplex: string;
  nameArabic: string;
  versesCount: number;
  revelationPlace: "makkah" | "madinah";
  revelationOrder: number;
  bismillahPre: boolean;
  pages: [number, number];
  translatedName: TranslatedName;
};

export type Juz = {
  id: number;
  juzNumber: number;
  firstVerseId: number;
  lastVerseId: number;
  versesCount: number;
  verseMapping: Record<string, string>;
};

export type FontConfig = {
  family: string;
  baseUrl: string;
  extension: string;
};

export const MUSHAF_FONTS: Record<MushafLayout, FontConfig> = {
  "hafs-v2": {
    family: "QCF V2",
    baseUrl: "https://verses.quran.foundation/fonts/quran/hafs/v2/woff2",
    extension: "woff2",
  },
  "hafs-v4": {
    family: "QCF V4",
    baseUrl: "https://verses.quran.foundation/fonts/quran/hafs/v4/colrv1/woff2",
    extension: "woff2",
  },
  "hafs-unicode": {
    family: "QPC Hafs",
    baseUrl: "https://verses.quran.foundation/fonts/quran/hafs/unicode/woff2",
    extension: "woff2",
  },
};

export function getFontUrl(layout: MushafLayout, page: number): string {
  const font = MUSHAF_FONTS[layout];
  return `${font.baseUrl}/p${page}.${font.extension}`;
}

export function parseVerseKey(verseKey: string): {
  surah: number;
  verse: number;
} {
  const [surah, verse] = verseKey.split(":").map(Number);
  return { surah, verse };
}

export function createVerseKey(surah: number, verse: number): string {
  return `${surah}:${verse}`;
}
