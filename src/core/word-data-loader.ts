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

  async loadWords(): Promise<Record<string, QuranWord>> {
    if (this.words) {
      return this.words;
    }

    const assetUrl = this.getAssetUrl("word-data.json");
    const response = await fetch(assetUrl);
    if (!response.ok) {
      throw new Error(`Failed to load word-data.json: ${response.statusText}`);
    }
    const rawData: RawWordData = await response.json();

    this.words = {};
    this.wordsById = new Map();

    for (const key of Object.keys(rawData)) {
      const word = this.transformWord(rawData[key]);
      this.words[key] = word;
      this.wordsById.set(word.id, word);
    }

    return this.words;
  }

  private getAssetUrl(file: string): string {
    const baseUrl = new URL(
      "../../assets/riwaya/hafs-digitalkhatt",
      import.meta.url,
    );
    return new URL(file, baseUrl).href;
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
