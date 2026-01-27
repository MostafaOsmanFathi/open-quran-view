# Data Structures and API

This document covers the TypeScript interfaces and public API structures used in `open-quran-view`.

## Core Types

### LayoutRow

Represents a single glyph (character/word) on a page with its precise coordinates.

```typescript
export interface LayoutRow {
  surah: number;  // Surah number (1-114)
  ayah: number;   // Ayah number
  page: number;   // Page number (1-604)
  line: number;   // Line number (1-15)
  word: number;   // Word index in the ayah
  x: number;      // Horizontal coordinate
  y: number;      // Vertical coordinate
  w: number;      // Width of glyph
  h: number;      // Height of glyph
  glyph: number;  // Character code for the font
}
```

### Recitation

Supported Quranic recitations (requires corresponding font files).

```typescript
export type Recitation = 
  | 'Hafs' 
  | 'Warsh' 
  | 'Qaloon' 
  | 'Doori' 
  | 'Shuba' 
  | 'Soussi' 
  | 'Bazzi' 
  | 'Qunbul' 
  | 'Khalaf';
```

## Loader API

### DynamicDataLoader

The primary class for fetching and processing Quranic data.

```typescript
class DynamicDataLoader {
  constructor(fetcher: AssetFetcher);

  /** Fetches metadata including juz boundaries and centered lines */
  async getMetadata(): Promise<MushafMetadata>;

  /** Fetches surah/ayah map for all pages */
  async getPageMapping(): Promise<PageMapping>;

  /** Returns an array of glyphs for a specific page */
  async getLayoutForPage(page: number): Promise<LayoutRow[]>;

  /** Generates the asset URL for a specific font file */
  getFontUrl(recitation: Recitation, page: number): string;
}
```

### Font Loading Strategy

To render a single page, the library expects 3 font files to be available:

1.  **Shared Basmalah**: `QCF4_QBSML.woff2`
2.  **Shared Surah Names**: `QCF4_SURAH.woff2`
3.  **Page Text**: `QCF4_[Recitation]_[Page]_W.woff2`

### AssetFetcher

Abstraction for platform-specific asset loading (Web vs Native).

```typescript
export interface AssetFetcher {
  fetchJSON<T>(path: string): Promise<T>;
  fetchText(path: string): Promise<string>;
  getAssetUrl(path: string): string;
}
```
