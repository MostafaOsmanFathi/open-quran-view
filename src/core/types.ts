export type Riwaya = "hafs";

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

export type DataLoader = {
  loadWords(): Promise<Record<string, QuranWord>>;
  loadPages(pageNumber: number): Promise<QuranPage>;
  loadMushafInfo(): Promise<MushafInfo>;
  getFontUrl(pageNumber: number): string;
};
