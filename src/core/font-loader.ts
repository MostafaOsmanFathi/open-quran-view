import type { MushafLayout } from "./types";

type FontCache = Record<MushafLayout, Map<number, string>>;

let fontCache: FontCache = {
  "hafs-v2": new Map(),
  "hafs-v4": new Map(),
  "hafs-unicode": new Map(),
};

let surahNameFontUrl: string | null = null;
let surahNameFontLoaded: boolean = false;
let digitalKhattFontLoaded: boolean = false;

export function surahNumberToFontCode(surahNumber: number): string {
  return `surah${String(surahNumber).padStart(3, "0")}`;
}

export async function getSurahNameFontBuffer(): Promise<ArrayBuffer> {
  const fontUrl = new URL("../data/shared/surah-name-v4.woff2", import.meta.url)
    .href;

  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to load surah-name font from ${fontUrl}: ${response.status} ${response.statusText}`,
    );
  }
  return response.arrayBuffer();
}

export async function getSurahNameFontUrl(): Promise<string> {
  if (surahNameFontUrl) {
    return surahNameFontUrl;
  }

  const buffer = await getSurahNameFontBuffer();
  const blob = new Blob([buffer], { type: "font/woff2" });
  surahNameFontUrl = URL.createObjectURL(blob);
  return surahNameFontUrl;
}

export async function loadSurahNameFont(): Promise<void> {
  if (surahNameFontLoaded) return;

  const fontUrl = await getSurahNameFontUrl();
  const fontFace = new FontFace("SurahNameFont", `url(${fontUrl})`);
  await fontFace.load();

  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.add(fontFace);
  } else if ((globalThis as any).fonts) {
    (globalThis as any).fonts.add(fontFace);
  }

  surahNameFontLoaded = true;
}

export async function loadDigitalKhattFont(): Promise<void> {
  if (digitalKhattFontLoaded) return;

  const fontUrl = new URL(
    "../data/fonts/hafs-unicode/digitalkhatt.otf",
    import.meta.url,
  ).href;

  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to load DigitalKhatt font from ${fontUrl}: ${response.status} ${response.statusText}`,
    );
  }

  const buffer = await response.arrayBuffer();
  const fontFace = new FontFace("DigitalKhatt", buffer);
  await fontFace.load();

  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.add(fontFace);
  } else if ((globalThis as any).fonts) {
    (globalThis as any).fonts.add(fontFace);
  }

  digitalKhattFontLoaded = true;
}

export async function getFontBuffer(
  layout: MushafLayout,
  page: number,
): Promise<ArrayBuffer> {
  const fontUrl = new URL(
    `../data/fonts/${layout}/p${page}.woff2`,
    import.meta.url,
  ).href;

  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to load font from ${fontUrl}: ${response.status} ${response.statusText}`,
    );
  }
  return response.arrayBuffer();
}

export async function getFontUrl(
  layout: MushafLayout,
  page: number,
): Promise<string> {
  const cached = fontCache[layout].get(page);
  if (cached) {
    return cached;
  }

  const buffer = await getFontBuffer(layout, page);
  const blob = new Blob([buffer], { type: "font/woff2" });
  const url = URL.createObjectURL(blob);
  fontCache[layout].set(page, url);
  return url;
}

export async function loadFont(
  layout: MushafLayout,
  page: number,
): Promise<void> {
  if (layout === "hafs-unicode") {
    await loadDigitalKhattFont();
    return;
  }

  const fontUrl = await getFontUrl(layout, page);
  const fontFace = new FontFace("QuranFont", `url(${fontUrl})`);
  await fontFace.load();

  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.add(fontFace);
  } else if ((globalThis as any).fonts) {
    // Fallback for workers or other environments if they support the FontLoading API directly
    (globalThis as any).fonts.add(fontFace);
  }
}

export async function preloadAllFonts(layout: MushafLayout): Promise<void> {
  for (let page = 1; page <= 604; page++) {
    await loadFont(layout, page);
  }
}

export function clearFontCache(layout?: MushafLayout): void {
  if (layout) {
    fontCache[layout].clear();
  } else {
    fontCache["hafs-v2"].clear();
    fontCache["hafs-v4"].clear();
    fontCache["hafs-unicode"].clear();
  }
}
