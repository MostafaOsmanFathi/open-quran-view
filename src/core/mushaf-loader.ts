import type {
  PageLine,
  QuranPage,
  MushafInfo,
  LineType,
  Riwaya,
  QulLayout,
  QulLayoutPageLine,
} from "./types";
import { RIWAYA_FONTS } from "./types";
import type { WordDataLoader } from "./word-data-loader";

const LAYOUT_BASE_PATH = "../assets/riwaya/";

export class MushafLoader {
  private riwaya: Riwaya;
  private wordLoader: WordDataLoader;
  private mushafInfo: MushafInfo | null = null;
  private qulLayout: QulLayout | null = null;

  constructor(riwaya: Riwaya = "hafs-v2", wordLoader: WordDataLoader) {
    this.riwaya = riwaya;
    this.wordLoader = wordLoader;
  }

  async loadMushafInfo(): Promise<MushafInfo> {
    if (this.mushafInfo) {
      return this.mushafInfo;
    }

    const layout = await this.loadQulLayout();
    this.mushafInfo = layout.info;
    return this.mushafInfo;
  }

  private async loadQulLayout(): Promise<QulLayout> {
    if (this.qulLayout) {
      return this.qulLayout;
    }

    const layoutPath = `${LAYOUT_BASE_PATH}${this.riwaya}/layout.json`;

    try {
      const layoutModule = await import(layoutPath);
      const layoutData = layoutModule.default || layoutModule;
      this.qulLayout = layoutData as unknown as QulLayout;
      return this.qulLayout;
    } catch (error) {
      console.error(
        `Failed to load layout.json for riwaya: ${this.riwaya}`,
        error,
      );
      throw new Error(
        `Could not load layout data for riwaya "${this.riwaya}". Ensure ${layoutPath} exists.`,
      );
    }
  }

  async loadPage(pageNumber: number): Promise<QuranPage> {
    const info = await this.loadMushafInfo();

    if (pageNumber < 1 || pageNumber > info.number_of_pages) {
      throw new Error(
        `Invalid page number: ${pageNumber}. Must be between 1 and ${info.number_of_pages}`,
      );
    }

    const layout = await this.loadQulLayout();
    const pageLines: QulLayoutPageLine[] =
      layout.pages[String(pageNumber)] || [];

    await this.wordLoader.loadWords();

    const lines: PageLine[] = pageLines.map((row) => ({
      line_number: row.line_number,
      line_type: row.line_type as LineType,
      surah_number: row.surah_number ?? undefined,
      is_centered: row.is_centered,
      words: this.getWordsForLine(row),
    }));

    return {
      page_number: pageNumber,
      font_url: this.getFontUrl(),
      lines,
    };
  }

  getFontUrl(): string {
    return RIWAYA_FONTS[this.riwaya].url;
  }

  getRiwaya(): Riwaya {
    return this.riwaya;
  }

  private getWordsForLine(
    row: QulLayoutPageLine,
  ): ReturnType<WordDataLoader["getWordsInRange"]> {
    if (row.line_type === "surah_name" || row.line_type === "basmallah") {
      return [];
    }

    if (row.first_word_id === null || row.last_word_id === null) {
      return [];
    }

    return this.wordLoader.getWordsInRange(row.first_word_id, row.last_word_id);
  }
}
