import type { MushafLayout } from "./types";

type FontCache = Record<MushafLayout, Map<number, string>>;

let fontCache: FontCache = {
  "hafs-v2": new Map(),
  "hafs-v4": new Map(),
  "hafs-unicode": new Map(),
};

export async function getFontUrl(
  layout: MushafLayout,
  page: number,
): Promise<string> {
  const cached = fontCache[layout].get(page);
  if (cached) {
    return cached;
  }

  const fontUrl = `/data/fonts/${layout}/p${page}.woff2`;
  fontCache[layout].set(page, fontUrl);
  return fontUrl;
}

export async function preloadFont(
  layout: MushafLayout,
  page: number,
): Promise<void> {
  await getFontUrl(layout, page);
}

export async function preloadAllFonts(layout: MushafLayout): Promise<void> {
  for (let page = 1; page <= 604; page++) {
    await preloadFont(layout, page);
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
