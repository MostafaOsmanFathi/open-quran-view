export interface RiwayaMetadata {
  id: number;
  jozz: number;
  sora: number;
  sora_name_en: string;
  sora_name_ar: string;
  page: number;
  line_start: number;
  line_end: number;
  aya_no: number;
  aya_text: string;
  aya_text_emlaey: string;
}

export interface SurahMetadata {
  number: number;
  name: string;
  name_en: string;
  verse_count: number;
  revelation_place: 'Meccan' | 'Medinan';
}

export interface AssetFetcher {
  fetchJSON<T>(path: string): Promise<T>;
  fetchText(path: string): Promise<string>;
  getAssetUrl(path: string): string;
}

export type Recitation = 'hafs' | 'warsh' | 'qaloon' | 'doori' | 'shuba' | 'soussi' | 'bazzi' | 'qunbul' | 'khalaf';
