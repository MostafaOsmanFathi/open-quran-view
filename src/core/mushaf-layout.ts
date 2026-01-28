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

function getAssetUrl(relativePath: string): string {
  const assetBaseUrl = new URL("../../assets/", import.meta.url).href;
  return `${assetBaseUrl}${relativePath}`;
}

export class MushafLayoutLoader {
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

    const infoPath = `riwaya/${this.riwaya}/pages/info.json`;
    const response = await fetch(getAssetUrl(infoPath));
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

    const pagePath = `riwaya/${this.riwaya}/pages/pages-${pageNumber}.json`;
    const response = await fetch(getAssetUrl(pagePath));
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
    const fontPath = `riwaya/${this.riwaya}/fonts/woff2/p${pageNumber}.${extension}`;
    return getAssetUrl(fontPath);
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
