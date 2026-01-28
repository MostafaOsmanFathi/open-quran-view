import type { QuranWord } from "./types";

type WordData = {
  id: number;
  surah: string;
  ayah: string;
  word: string;
  location: string;
  text: string;
};

type RawWordData = {
  [key: string]: WordData;
};

export class WordDataLoader {
  private words: Record<string, QuranWord> | null = null;
  private wordsById: Map<number, QuranWord> | null = null;
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath ?? "hafs";
  }

  async loadWords(): Promise<Record<string, QuranWord>> {
    if (this.words) {
      return this.words;
    }

    try {
      const wordsModule = await import(
        `../assets/riwaya/${this.basePath}/word-data.json`
      );
      const rawData: RawWordData = (wordsModule.default ||
        wordsModule) as RawWordData;

      this.words = {};
      this.wordsById = new Map();

      for (const key of Object.keys(rawData)) {
        const word = this.transformWord(rawData[key]);
        this.words[key] = word;
        this.wordsById.set(word.id, word);
      }

      return this.words;
    } catch (error) {
      console.error("Failed to load Quran words:", error);
      throw new Error("Could not load Quran words data.");
    }
  }

  getWordById(id: number): QuranWord | undefined {
    return this.wordsById?.get(id);
  }

  getWordsInRange(startId: number, endId: number): QuranWord[] {
    if (!this.wordsById) {
      throw new Error("Words not loaded. Call loadWords() first.");
    }

    const words: QuranWord[] = [];
    for (let id = startId; id <= endId; id++) {
      const word = this.wordsById.get(id);
      if (word) {
        words.push(word);
      }
    }
    return words;
  }

  private transformWord(data: WordData): QuranWord {
    return {
      id: data.id,
      surah: parseInt(data.surah, 10),
      ayah: parseInt(data.ayah, 10),
      word: parseInt(data.word, 10),
      location: data.location,
      text: data.text,
    };
  }
}
