export type Riwaya = "hafs-digitalkhatt";

export type LineType = "surah_name" | "ayah" | "basmallah";

export type QuranWord = {
  id: number;
  surah: number;
  ayah: number;
  word: number;
  location: string;
  text: string;
};

export type PageLine = {
  line_number: number;
  line_type: LineType;
  surah_number?: number;
  is_centered: boolean;
  words: QuranWord[];
};

export type QuranPage = {
  page_number: number;
  font_url: string;
  lines: PageLine[];
};

export type MushafInfo = {
  name: string;
  number_of_pages: number;
  lines_per_page: number;
  font_name: string;
};

export type QulLayoutPageLine = {
  line_number: number;
  line_type: LineType;
  is_centered: boolean;
  first_word_id: number | null;
  last_word_id: number | null;
  surah_number: number | null;
};

export type QulLayout = {
  info: MushafInfo;
  pages: Record<string, QulLayoutPageLine[]>;
};

export type SurahMetadata = {
  id: number;
  name: string;
  name_simple: string;
  name_arabic: string;
  revelation_order: number;
  revelation_place: "makkah" | "madinah";
  verses_count: number;
  bismillah_pre: boolean;
};
