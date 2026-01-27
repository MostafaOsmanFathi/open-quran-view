export interface MushafMetadata {
  juz_pages: number[];
  mushaf_pgs: number[];
  centered_lines: Record<string, number[]>;
  custom_header_surah_glyph_offset_fix: Record<string, number>;
}

export type PageMapping = Record<string, [number, number, number, number]>;

export interface LayoutRow {
  ayah: number;
  surah: number;
  page: number;
  line: number;
  word: number;
  x: number;
  y: number;
  w: number;
  h: number;
  glyph: string | number;
}

export interface AssetFetcher {
  fetchJSON<T>(path: string): Promise<T>;
  fetchText(path: string): Promise<string>;
  getAssetUrl(path: string): string;
}

export type Recitation = 'Hafs' | 'Warsh' | 'Qaloon' | 'Doori' | 'Shuba' | 'Soussi' | 'Bazzi' | 'Qunbul' | 'Khalaf';
