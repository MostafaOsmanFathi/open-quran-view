import type { QuranPage, MushafInfo, QuranWord, Riwaya } from "./core/types";
import { WordDataLoader } from "./core/word-data-loader";
import { MushafLoader } from "./core/mushaf-loader";

export class OpenQuranView {
  private wordLoader: WordDataLoader;
  private mushafLoader: MushafLoader;

  constructor(riwaya: Riwaya = "hafs-v2") {
    this.wordLoader = new WordDataLoader();
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

  getFontUrl(): string {
    return this.mushafLoader.getFontUrl();
  }

  getRiwaya(): Riwaya {
    return this.mushafLoader.getRiwaya();
  }

  getWordsInRange(startId: number, endId: number): QuranWord[] {
    return this.wordLoader.getWordsInRange(startId, endId);
  }
}

export function createOpenQuranView(riwaya: Riwaya = "hafs-v2"): OpenQuranView {
  return new OpenQuranView(riwaya);
}

export type { Riwaya } from "./core/types";
