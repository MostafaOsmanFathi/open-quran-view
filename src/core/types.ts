export type Riwaya = "hafs-v2" | "hafs-v4" | "hafs-unicode";

export type FontInfo = {
  family: string;
  version: string;
  url: string;
  fallbackUrl?: string;
};

export const RIWAYA_FONTS: Record<Riwaya, FontInfo> = {
  "hafs-v2": {
    family: "HafsV2",
    version: "QCFv2",
    url: "https://verses.quran.foundation/Hafs/v2/arial.ttf",
  },
  "hafs-v4": {
    family: "HafsV4",
    version: "QCFv4",
    url: "https://verses.quran.foundation/Hafs/v4/arial.ttf",
  },
  "hafs-unicode": {
    family: "HafsUnicode",
    version: "HafsUnicode",
    url: "https://verses.quran.foundation/Hafs/Unicode/arial.ttf",
  },
};

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
