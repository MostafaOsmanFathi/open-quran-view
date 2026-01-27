import { RiwayaMetadata, SurahMetadata, AssetFetcher, Recitation } from './types';

export class DynamicDataLoader {
  private fetcher: AssetFetcher;
  private recitation: Recitation;
  private cache: {
    surahs?: SurahMetadata[];
    riwaya: Record<string, RiwayaMetadata[]>;
  } = { riwaya: {} };

  constructor(fetcher: AssetFetcher, recitation: Recitation = 'hafs') {
    this.fetcher = fetcher;
    this.recitation = recitation;
  }

  setRecitation(recitation: Recitation) {
    this.recitation = recitation;
  }

  async getSurahs(): Promise<SurahMetadata[]> {
    if (!this.cache.surahs) {
      this.cache.surahs = await this.fetcher.fetchJSON<SurahMetadata[]>('data/shared/suras.json');
    }
    return this.cache.surahs;
  }

  async getRiwayaData(): Promise<RiwayaMetadata[]> {
    if (!this.cache.riwaya[this.recitation]) {
      this.cache.riwaya[this.recitation] = await this.fetcher.fetchJSON<RiwayaMetadata[]>(
        `data/riwaya/${this.recitation}/metadata.json`
      );
    }
    return this.cache.riwaya[this.recitation];
  }

  async getVersesForPage(page: number): Promise<RiwayaMetadata[]> {
    const data = await this.getRiwayaData();
    return data.filter(row => row.page === page);
  }

  async getVerse(surah: number, ayah: number): Promise<RiwayaMetadata | undefined> {
    const data = await this.getRiwayaData();
    return data.find(row => row.sora === surah && row.aya_no === ayah);
  }

  getFontUrl(page: number): string {
    // KFGQPC fonts are now located in data/riwaya/${recitation}/fonts/
    // Example: data/riwaya/hafs/fonts/hafs.18.woff2
    // Note: The specific font version/name might vary, current structure uses index-based or single file.
    return this.fetcher.getAssetUrl(`data/riwaya/${this.recitation}/fonts/${this.recitation}.woff2`);
  }
}

export * from './types';
export * from './fetcher';
