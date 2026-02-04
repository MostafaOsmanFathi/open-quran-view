import type { Page, Surah, Juz, MushafLayout } from "./types";
import { getPagesUrl, getMetadataUrl } from "./static/data";

type PagesCache = Record<MushafLayout, Page[] | null>;
type MetadataCache = {
  surahs: Surah[] | null;
  juzs: Juz[] | null;
};

let pagesCache: PagesCache = {
  "hafs-v2": null,
  "hafs-v4": null,
  "hafs-unicode": null,
};

let metadataCache: MetadataCache = {
  surahs: null,
  juzs: null,
};

export async function loadPages(
  layout: MushafLayout,
  pageNumber?: number,
): Promise<Page | Page[] | null> {
  if (pagesCache[layout] === null) {
    const pagesUrl = getPagesUrl(layout);
    const response = await fetch(pagesUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to load pages from ${pagesUrl}: ${response.status} ${response.statusText}`,
      );
    }
    pagesCache[layout] = await response.json();
  }

  const pages = pagesCache[layout]!;

  if (pageNumber !== undefined) {
    const pageIndex = pageNumber - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) {
      return null;
    }
    return pages[pageIndex];
  }

  return pages;
}

export async function loadPage(
  layout: MushafLayout,
  pageNumber: number,
): Promise<Page | null> {
  return (await loadPages(layout, pageNumber)) as Page | null;
}

export async function loadAllPages(layout: MushafLayout): Promise<Page[]> {
  return (await loadPages(layout)) as Page[];
}

export async function loadSurahs(): Promise<Surah[]> {
  if (metadataCache.surahs === null) {
    const surahsUrl = getMetadataUrl("surahs");
    const response = await fetch(surahsUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to load surahs from ${surahsUrl}: ${response.status} ${response.statusText}`,
      );
    }
    metadataCache.surahs = await response.json();
  }
  return metadataCache.surahs!;
}

export async function loadJuzs(): Promise<Juz[]> {
  if (metadataCache.juzs === null) {
    const juzsUrl = getMetadataUrl("juz");
    const response = await fetch(juzsUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to load juzs from ${juzsUrl}: ${response.status} ${response.statusText}`,
      );
    }
    metadataCache.juzs = await response.json();
  }
  return metadataCache.juzs!;
}

export async function getSurah(id: number): Promise<Surah | null> {
  const surahs = await loadSurahs();
  return surahs.find((s) => s.id === id) || null;
}

export async function getJuz(id: number): Promise<Juz | null> {
  const juzs = await loadJuzs();
  return juzs.find((j) => j.id === id) || null;
}

export async function getSurahByPage(
  pageNumber: number,
): Promise<Surah | null> {
  const surahs = await loadSurahs();
  return (
    surahs.find((s) => pageNumber >= s.pages[0] && pageNumber <= s.pages[1]) ||
    null
  );
}

export function clearCache(layout?: MushafLayout): void {
  if (layout) {
    pagesCache[layout] = null;
  } else {
    pagesCache = {
      "hafs-v2": null,
      "hafs-v4": null,
      "hafs-unicode": null,
    };
    metadataCache = {
      surahs: null,
      juzs: null,
    };
  }
}
