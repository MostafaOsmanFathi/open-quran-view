import type {
  PageLine,
  QuranPage,
  MushafInfo,
  LineType,
  Riwaya,
  QulLayout,
  QulLayoutPageLine,
} from "./types";
import type { WordDataLoader } from "./word-data-loader";

export class MushafLoader {
  private riwaya: Riwaya;
  private wordLoader: WordDataLoader;
  private mushafInfo: MushafInfo | null = null;
  private qulLayout: QulLayout | null = null;

  constructor(
    riwaya: Riwaya = "hafs-digitalkhatt",
    wordLoader: WordDataLoader,
  ) {
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

    const assetUrl = this.getAssetUrl("layout.json");
    const response = await fetch(assetUrl);
    if (!response.ok) {
      throw new Error(`Failed to load layout.json: ${response.statusText}`);
    }
    this.qulLayout = (await response.json()) as QulLayout;
    return this.qulLayout;
  }

  private getAssetUrl(file: string): string {
    const baseUrl = new URL(
      "../../assets/riwaya/hafs-digitalkhatt",
      import.meta.url,
    );
    return new URL(file, baseUrl).href;
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
    const qulAssetBaseUrl = new URL("../../new-assets", import.meta.url).href;
    return `${qulAssetBaseUrl}/riwaya/hafs-digitalkhatt/DigitalKhattV2.ttf`;
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
