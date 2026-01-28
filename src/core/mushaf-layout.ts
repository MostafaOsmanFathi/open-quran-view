import type {
  PageLine,
  QuranPage,
  MushafInfo,
  LineType,
  Riwaya,
} from "./types";
import type { WordDataLoader } from "./word-loader";

type PageRow = {
  page_number: number;
  line_number: number;
  line_type: string;
  is_centered: number;
  first_word_id: string;
  last_word_id: string;
  surah_number: string;
};

export class MushafLayoutLoader {
  private riwaya: Riwaya;
  private wordLoader: WordDataLoader;
  private mushafInfo: MushafInfo | null = null;
  private pagesDir: string;
  private fontDir: string;

  constructor(riwaya: Riwaya = "hafs", wordLoader: WordDataLoader) {
    this.riwaya = riwaya;
    this.wordLoader = wordLoader;
    this.pagesDir = `data/riwaya/${riwaya}/pages`;
    this.fontDir = `data/riwaya/${riwaya}/fonts`;
  }

  async loadMushafInfo(): Promise<MushafInfo> {
    if (this.mushafInfo) {
      return this.mushafInfo;
    }

    const response = await fetch(`${this.pagesDir}/info.json`);
    if (!response.ok) {
      throw new Error(`Failed to load mushaf info: ${response.statusText}`);
    }

    this.mushafInfo = (await response.json()) as MushafInfo;
    return this.mushafInfo;
  }

  async loadPage(pageNumber: number): Promise<QuranPage> {
    const info = await this.loadMushafInfo();

    if (pageNumber < 1 || pageNumber > info.number_of_pages) {
      throw new Error(
        `Invalid page number: ${pageNumber}. Must be between 1 and ${info.number_of_pages}`,
      );
    }

    const response = await fetch(`${this.pagesDir}/pages-${pageNumber}.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to load page ${pageNumber}: ${response.statusText}`,
      );
    }

    const pageRows: PageRow[] = await response.json();

    await this.wordLoader.loadWords();

    const lines: PageLine[] = pageRows.map((row) => ({
      line_number: row.line_number,
      line_type: row.line_type as LineType,
      surah_number: row.surah_number
        ? parseInt(row.surah_number, 10)
        : undefined,
      is_centered: row.is_centered === 1,
      words: this.getWordsForLine(row),
    }));

    return {
      page_number: pageNumber,
      font_url: this.getFontUrl(pageNumber),
      lines,
    };
  }

  getFontUrl(pageNumber: number): string {
    const extension = "woff2";
    return `${this.fontDir}/woff2/p${pageNumber}.${extension}`;
  }

  private getWordsForLine(
    row: PageRow,
  ): ReturnType<WordDataLoader["getWordsInRange"]> {
    if (row.line_type === "surah_name" || row.line_type === "basmallah") {
      return [];
    }

    const startId = parseInt(row.first_word_id, 10);
    const endId = parseInt(row.last_word_id, 10);

    if (isNaN(startId) || isNaN(endId)) {
      return [];
    }

    return this.wordLoader.getWordsInRange(startId, endId);
  }
}
