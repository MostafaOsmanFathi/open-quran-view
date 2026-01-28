import type { QuranWord } from "./types";

type WordData = {
  id: number;
  surah: string;
  ayah: string;
  word: string;
  location: string;
  text: string;
};

interface RawWordData {
  [key: string]: WordData;
}

function getAssetUrl(relativePath: string): string {
  const assetBaseUrl = new URL("../../assets/", import.meta.url).href;
  return `${assetBaseUrl}${relativePath}`;
}

export class WordDataLoader {
  private words: Record<string, QuranWord> | null = null;
  private wordsById: Map<number, QuranWord> | null = null;
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath ?? getAssetUrl("riwaya/hafs");
  }

  async loadWords(): Promise<Record<string, QuranWord>> {
    if (this.words) {
      return this.words;
    }

    const response = await fetch(`${this.basePath}/qpc-v2.json`);
    if (!response.ok) {
      throw new Error(`Failed to load Quran words: ${response.statusText}`);
    }

    const rawData: RawWordData = await response.json();

    this.words = {};
    this.wordsById = new Map();

    for (const key of Object.keys(rawData)) {
      const word = this.transformWord(key, rawData[key]);
      this.words[key] = word;
      this.wordsById.set(word.id, word);
    }

    return this.words;
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

  private transformWord(key: string, data: WordData): QuranWord {
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
