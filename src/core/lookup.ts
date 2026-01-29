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
      for (const word of line.words) {
        if (word.surah === chapter && word.verse === verse) {
          const verseLocation: VerseLocation = {
            surah: chapter,
            verse,
            pageNumber: page.pageNumber,
            lineNumber: line.lineNumber,
            wordPosition: word.position,
          };

          return { page, verseLocation };
        }
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

  return {
    surah: firstWord.surah,
    verse: firstWord.verse,
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

  return {
    surah: word.surah,
    verse: word.verse,
    pageNumber,
    lineNumber: lastLine.lineNumber,
    wordPosition: word.position,
  };
}

export function getWordLocation(word: Word): VerseLocation {
  return {
    surah: word.surah,
    verse: word.verse,
    pageNumber: word.pageNumber,
    lineNumber: 0,
    wordPosition: word.position,
  };
}
