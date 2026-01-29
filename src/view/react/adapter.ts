import type { QuranPage, Riwaya, LineType, PageLine } from "../../core/types";

export type DynamicDataLoader = {
  getFontUrl(pageNumber: number): string;
  loadPage(pageNumber: number): Promise<QuranPage>;
  loadMushafInfo(): Promise<{
    name: string;
    number_of_pages: number;
    lines_per_page: number;
    font_name: string;
  }>;
};

export type LayoutRow = {
  line: number;
  word: number;
  text: string;
  glyph?: number;
};

interface PageRowData {
  page_number: number;
  line_number: number;
  line_type: string;
  is_centered: number;
  first_word_id: string;
  last_word_id: string;
  surah_number: string;
}

export class ReactViewAdapter implements DynamicDataLoader {
  private riwaya: Riwaya;
  private cache: Map<number, QuranPage> = new Map();
  private mushafInfo: {
    name: string;
    number_of_pages: number;
    lines_per_page: number;
    font_name: string;
  } | null = null;

  constructor(riwaya: Riwaya = "hafs-digitalkhatt") {
    this.riwaya = riwaya;
  }

  getFontUrl(pageNumber: number): string {
    return `data/riwaya/${this.riwaya}/fonts/woff2/p${pageNumber}.woff2`;
  }

  async loadMushafInfo(): Promise<{
    name: string;
    number_of_pages: number;
    lines_per_page: number;
    font_name: string;
  }> {
    if (this.mushafInfo) return this.mushafInfo!;

    const response = await fetch(`data/riwaya/${this.riwaya}/pages/info.json`);
    this.mushafInfo = await response.json();
    return this.mushafInfo!;
  }

  async loadPage(pageNumber: number): Promise<QuranPage> {
    if (this.cache.has(pageNumber)) {
      return this.cache.get(pageNumber)!;
    }

    const info = await this.loadMushafInfo();
    if (pageNumber < 1 || pageNumber > info.number_of_pages) {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }

    const response = await fetch(
      `data/riwaya/${this.riwaya}/pages/pages-${pageNumber}.json`,
    );
    const pageData: PageRowData[] = await response.json();

    const quranPage: QuranPage = {
      page_number: pageNumber,
      font_url: this.getFontUrl(pageNumber),
      lines: [],
    };

    for (const row of pageData) {
      const line: PageLine = {
        line_number: row.line_number,
        line_type: row.line_type as LineType,
        is_centered: row.is_centered === 1,
        words: [],
      };

      if (row.surah_number) {
        line.surah_number = parseInt(row.surah_number, 10);
      }

      if (
        row.first_word_id &&
        row.last_word_id &&
        row.line_type !== "header" &&
        row.line_type !== "bismillah"
      ) {
        const startId = parseInt(row.first_word_id, 10);
        const endId = parseInt(row.last_word_id, 10);

        for (let id = startId; id <= endId; id++) {
          line.words.push({
            id,
            position: id - startId + 1,
            text: "",
            pageNumber: row.page_number,
            charType: "word" as const,
            surah: 0,
            verse: 0,
          });
        }
      }

      quranPage.lines.push(line);
    }

    this.cache.set(pageNumber, quranPage);
    return quranPage;
  }
}

export function convertToLayoutRows(page: QuranPage): LayoutRow[] {
  const rows: LayoutRow[] = [];

  for (const line of page.lines) {
    for (let i = 0; i < line.words.length; i++) {
      const word = line.words[i];
      rows.push({
        line: line.line_number,
        word: i,
        text: word.text,
        glyph: word.text.charCodeAt(0),
      });
    }
  }

  return rows;
}
