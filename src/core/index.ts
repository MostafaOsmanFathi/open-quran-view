import { MushafMetadata, PageMapping, LayoutRow, AssetFetcher, Recitation } from './types';

export class DynamicDataLoader {
  private fetcher: AssetFetcher;
  private cache: {
    metadata?: MushafMetadata;
    mapping?: PageMapping;
    layout: Record<string, LayoutRow[]>;
  } = { layout: {} };

  constructor(fetcher: AssetFetcher) {
    this.fetcher = fetcher;
  }

  async getMetadata(): Promise<MushafMetadata> {
    if (!this.cache.metadata) {
      this.cache.metadata = await this.fetcher.fetchJSON<MushafMetadata>('data/mushaf_metadata.json');
    }
    return this.cache.metadata;
  }

  async getPageMapping(): Promise<PageMapping> {
    if (!this.cache.mapping) {
      this.cache.mapping = await this.fetcher.fetchJSON<PageMapping>('data/page_mapping.json');
    }
    return this.cache.mapping;
  }

  async getLayoutForPage(page: number): Promise<LayoutRow[]> {
    const cacheKey = `p${page}`;
    if (!this.cache.layout[cacheKey]) {
      // In a real implementation, we might fetch a per-page CSV or a full CSV and filter.
      // Based on the current repo, it's one large CSV. We'll handle slicing or full load.
      const csv = await this.fetcher.fetchText('data/quran_layout.csv');
      this.cache.layout[cacheKey] = this.parseCSV(csv).filter(row => row.page === page);
    }
    return this.cache.layout[cacheKey];
  }

  getFontUrl(recitation: Recitation, page: number): string {
    const pageStr = page.toString().padStart(page < 10 ? 2 : 1, '0');
    return this.fetcher.getAssetUrl(`assets/fonts/qcf4/QCF4_${recitation}_${pageStr}_W.woff2`);
  }

  private parseCSV(csv: string): LayoutRow[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).filter(l => l.trim()).map(line => {
      const values = line.split(',');
      const row: any = {};
      headers.forEach((h, i) => {
        const val = values[i];
        row[h.trim()] = isNaN(val as any) ? val : Number(val);
      });
      return row as LayoutRow;
    });
  }
}

export * from './types';
export * from './fetcher';
