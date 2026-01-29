import type { Page, Surah, MushafLayout, Word } from "./types";
import { loadPage, loadAllPages, getSurahByPage } from "./data-loader";

export type VerseLocation = {
  surah: number;
  verse: number;
  pageNumber: number;
  lineNumber: number;
  wordPosition: number;
};

export type NavigationInfo = {
  prevPage: number | null;
  nextPage: number | null;
  currentSurah: Surah | null;
  surahStartPage: number;
  surahEndPage: number;
};

function parseVerseKeyFromLine(line: { metadata: { verseKey: string } }): {
  surah: number;
  verse: number;
} {
  const [surah, verse] = line.metadata.verseKey.split(":").map(Number);
  return { surah, verse };
}

export async function getPageForVerse(
  verseKey: string,
  layout: MushafLayout = "hafs-v2",
): Promise<{ page: Page | null; verseLocation: VerseLocation | null }> {
  const [chapter, verse] = verseKey.split(":").map(Number);

  if (!chapter || !verse) {
    return { page: null, verseLocation: null };
  }

  const pages = await loadAllPages(layout);

  for (const page of pages) {
    for (const line of page.lines) {
      const { surah, verse: lineVerse } = parseVerseKeyFromLine(line);
      if (surah === chapter && lineVerse === verse) {
        const firstWord = line.words[0];
        const verseLocation: VerseLocation = {
          surah: chapter,
          verse,
          pageNumber: page.pageNumber,
          lineNumber: line.lineNumber,
          wordPosition: firstWord?.position ?? 0,
        };

        return { page, verseLocation };
      }
    }
  }

  return { page: null, verseLocation: null };
}

export async function getVerseLocation(
  chapter: number,
  verse: number,
  layout: MushafLayout = "hafs-v2",
): Promise<VerseLocation | null> {
  const { verseLocation } = await getPageForVerse(
    `${chapter}:${verse}`,
    layout,
  );
  return verseLocation;
}

export async function getNavigation(
  pageNumber: number,
  layout: MushafLayout = "hafs-v2",
): Promise<NavigationInfo> {
  const pages = await loadAllPages(layout);
  const totalPages = pages.length;

  const prevPage = pageNumber > 1 ? pageNumber - 1 : null;
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  const currentSurah = await getSurahByPage(pageNumber);

  let surahStartPage = pageNumber;
  let surahEndPage = pageNumber;

  if (currentSurah) {
    surahStartPage = currentSurah.pages[0];
    surahEndPage = currentSurah.pages[1];
  }

  return {
    prevPage,
    nextPage,
    currentSurah,
    surahStartPage,
    surahEndPage,
  };
}

export async function getPageRangeForSurah(
  surahId: number,
): Promise<[number, number] | null> {
  const surah = await import("./data-loader").then((m) => m.getSurah(surahId));
  return surah ? (surah.pages as [number, number]) : null;
}

export async function getFirstVerseOfPage(
  pageNumber: number,
  layout: MushafLayout = "hafs-v2",
): Promise<VerseLocation | null> {
  const page = await loadPage(layout, pageNumber);
  if (!page || page.lines.length === 0) {
    return null;
  }

  const firstLine = page.lines[0];
  const firstWord = firstLine.words[0];

  if (!firstWord) {
    return null;
  }

  const { surah, verse } = parseVerseKeyFromLine(firstLine);

  return {
    surah,
    verse,
    pageNumber,
    lineNumber: firstLine.lineNumber,
    wordPosition: firstWord.position,
  };
}

export async function getLastVerseOfPage(
  pageNumber: number,
  layout: MushafLayout = "hafs-v2",
): Promise<VerseLocation | null> {
  const page = await loadPage(layout, pageNumber);
  if (!page || page.lines.length === 0) {
    return null;
  }

  const lastLine = page.lines[page.lines.length - 1];
  const endWord = lastLine.words.filter((w) => w.charType === "end")[0];
  const lastWord = lastLine.words[lastLine.words.length - 1];

  const word = endWord || lastWord;
  if (!word) {
    return null;
  }

  const { surah, verse } = parseVerseKeyFromLine(lastLine);

  return {
    surah,
    verse,
    pageNumber,
    lineNumber: lastLine.lineNumber,
    wordPosition: word.position,
  };
}

export function getWordLocation(
  word: Word,
  verseKey?: string,
): VerseLocation {
  if (verseKey) {
    const [surah, verse] = verseKey.split(":").map(Number);
    return {
      surah,
      verse,
      pageNumber: word.pageNumber,
      lineNumber: 0,
      wordPosition: word.position,
    };
  }

  return {
    surah: 0,
    verse: 0,
    pageNumber: word.pageNumber,
    lineNumber: 0,
    wordPosition: word.position,
  };
}
