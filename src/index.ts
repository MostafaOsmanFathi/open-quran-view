import type { QuranPage, MushafInfo, QuranWord } from "./core/types";
import { WordDataLoader } from "./core/word-data-loader";
import { MushafLoader } from "./core/mushaf-loader";

export class OpenQuranView {
  private wordLoader: WordDataLoader;
  private mushafLoader: MushafLoader;

  constructor() {
    this.wordLoader = new WordDataLoader();
    this.mushafLoader = new MushafLoader("hafs-digitalkhatt", this.wordLoader);
  }

  async getMushafInfo(): Promise<MushafInfo> {
    return this.mushafLoader.loadMushafInfo();
  }

  async getPage(pageNumber: number): Promise<QuranPage> {
    return this.mushafLoader.loadPage(pageNumber);
  }

  async getWordById(id: number): Promise<QuranWord | undefined> {
    return this.wordLoader.getWordById(id);
  }

  getFontUrl(): string {
    return this.mushafLoader.getFontUrl();
  }

  getWordsInRange(startId: number, endId: number): QuranWord[] {
    return this.wordLoader.getWordsInRange(startId, endId);
  }
}

export function createOpenQuranView(): OpenQuranView {
  return new OpenQuranView();
}
