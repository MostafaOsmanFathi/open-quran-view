import type {
  PageLine,
  QuranPage,
  MushafInfo,
  LineType,
  Riwaya,
} from "./types";
import type { WordDataLoader } from "./word-data-loader";

type PageRow = {
  page_number: number;
  line_number: number;
  line_type: string;
  is_centered: number;
  first_word_id: string;
  last_word_id: string;
  surah_number: string;
};

export class MushafLoader {
  private riwaya: Riwaya;
  private wordLoader: WordDataLoader;
  private mushafInfo: MushafInfo | null = null;

  constructor(riwaya: Riwaya = "hafs", wordLoader: WordDataLoader) {
    this.riwaya = riwaya;
    this.wordLoader = wordLoader;
  }

  async loadMushafInfo(): Promise<MushafInfo> {
    if (this.mushafInfo) {
      return this.mushafInfo;
    }

    try {
      const infoModule = await import(
        `../assets/riwaya/${this.riwaya}/pages/info.json`
      );
      this.mushafInfo = (infoModule.default || infoModule) as MushafInfo;
      return this.mushafInfo;
    } catch (error) {
      console.error("Failed to load mushaf info:", error);
      throw new Error("Could not load mushaf info.");
    }
  }

  async loadPage(pageNumber: number): Promise<QuranPage> {
    const info = await this.loadMushafInfo();

    if (pageNumber < 1 || pageNumber > info.number_of_pages) {
      throw new Error(
        `Invalid page number: ${pageNumber}. Must be between 1 and ${info.number_of_pages}`,
      );
    }

    try {
      const pageModule = await import(
        `../assets/riwaya/${this.riwaya}/pages/pages-${pageNumber}.json`
      );
      const pageRows: PageRow[] = (pageModule.default ||
        pageModule) as PageRow[];

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
    } catch (error) {
      console.error(`Failed to load page ${pageNumber}:`, error);
      throw new Error(`Could not load page ${pageNumber}.`);
    }
  }

  getFontUrl(pageNumber: number): string {
    const assetBaseUrl = new URL("../assets/riwaya", import.meta.url).href;
    const extension = "ttf";
    return `${assetBaseUrl}${this.riwaya}/fonts/${extension}/p${pageNumber}.${extension}`;
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
