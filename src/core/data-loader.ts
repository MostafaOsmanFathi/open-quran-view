import type { Page, Surah, Juz, MushafLayout } from "./types";

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
    const module = await import(`../data/pages/${layout}/pages.json`);
    pagesCache[layout] = module.default as Page[];
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
    const module = await import("../data/metadata/surahs.json");
    metadataCache.surahs = module.default as Surah[];
  }
  return metadataCache.surahs!;
}

export async function loadJuzs(): Promise<Juz[]> {
  if (metadataCache.juzs === null) {
    const module = await import("../data/metadata/juz.json");
    metadataCache.juzs = module.default as unknown as Juz[];
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
