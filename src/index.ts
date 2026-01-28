import type { Riwaya, QuranPage, MushafInfo, QuranWord } from "./core/types";
import { WordDataLoader } from "./core/word-data-loader";
import { MushafLoader } from "./core/mushaf-loader";

export class OpenQuranView {
  private riwaya: Riwaya;
  private wordLoader: WordDataLoader;
  private mushafLoader: MushafLoader;

  constructor(riwaya: Riwaya = "hafs") {
    this.riwaya = riwaya;
    this.wordLoader = new WordDataLoader(riwaya);
    this.mushafLoader = new MushafLoader(riwaya, this.wordLoader);
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

  getFontUrl(pageNumber: number): string {
    return this.mushafLoader.getFontUrl(pageNumber);
  }

  getWordsInRange(startId: number, endId: number): QuranWord[] {
    return this.wordLoader.getWordsInRange(startId, endId);
  }
}

export function createOpenQuranView(riwaya: Riwaya = "hafs"): OpenQuranView {
  return new OpenQuranView(riwaya);
}
