# Package Structure

## Overview

This document describes the file and directory structure of the Quran Core package.

---

## Directory Structure

```
quran-core/
│
├── src/                              # Source TypeScript files
│   ├── index.ts                      # Main export (entry point)
│   ├── types.ts                      # TypeScript interfaces
│   ├── data-loader.ts                # Load CSV/JSON files
│   ├── page-builder.ts               # Build QuranPageData
│   └── font-utils.ts                 # Font URL helpers
│
├── data/                             # Data files (copied from source)
│   ├── quran_layout.csv              # 88,439 glyphs - Position of each character
│   ├── suwar.json                    # 114 surahs - Names and metadata
│   ├── page_mapping.json             # 604 pages - Surah/ayah per page
│   └── mushaf_metadata.json          # Juz pages, centered lines, etc.
│
├── assets/                           # Font files (copied from source)
│   └── fonts/
│       └── qcf4/
│           ├── QCF4_QBSML.woff2              # Basmalah (بسم الله...)
│           ├── QCF4_SURAH.woff2              # Surah names
│           ├── QCF4_Hafs_001_W.woff2         # Page 1 (standard)
│           ├── QCF4_Hafs_002_W.woff2         # Page 2 (standard)
│           ├── ... (602 more standard files)
│           ├── QCF4_Hafs_604_W.woff2         # Page 604 (standard)
│           ├── QCF4_Tajweed_001_W.woff2      # Page 1 (tajweed)
│           ├── QCF4_Tajweed_002_W.woff2      # Page 2 (tajweed)
│           ├── ... (602 more tajweed files)
│           └── QCF4_Tajweed_604_W.woff2      # Page 604 (tajweed)
│
├── dist/                             # Compiled JavaScript (generated)
│   ├── index.js
│   ├── index.d.ts
│   ├── index.js.map
│   ├── types.js
│   ├── types.d.ts
│   ├── data-loader.js
│   ├── data-loader.d.ts
│   ├── data-loader.js.map
│   ├── page-builder.js
│   ├── page-builder.d.ts
│   ├── page-builder.js.map
│   ├── font-utils.js
│   ├── font-utils.d.ts
│   └── font-utils.js.map
│
├── docs/                             # Documentation
│   ├── README.md                     # Entry point for docs
│   ├── ARCHITECTURE.md               # System architecture
│   ├── DATA_STRUCTURES.md            # TypeScript interfaces
│   ├── FONT_STRATEGY.md              # Font system
│   ├── API_REFERENCE.md              # Function documentation
│   ├── USAGE_EXAMPLES.md             # Code examples
│   └── PACKAGE_STRUCTURE.md          # This file
│
├── tests/                            # Test files
│   ├── data-loader.test.ts
│   ├── page-builder.test.ts
│   └── api.test.ts
│
├── .gitignore
├── .npmignore
├── .eslintrc.json
├── .prettierrc
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md                         # Package README (npm)
```

---

## Source Files

### index.ts (Entry Point)

```typescript
// Main exports
export { getPageData } from "./page-builder";
export { getPageFromAyah } from "./page-builder";
export { getAyahPosition } from "./page-builder";
export { getJuzPages } from "./page-builder";
export { getSurahInfo } from "./page-builder";
export { getAllSurahs } from "./page-builder";
export { getPageInfo } from "./page-builder";

// Types
export * from "./types";
```

### types.ts

```typescript
// Core types
export type GlyphType = 1 | 2 | 4 | 5 | 6 | 7;
export type FontSource = "basmalah" | "surah" | "page";
export type FontMode = "standard" | "tajweed";
export type Recitation = "hafs" | "warsh";

// Interfaces
export interface QuranGlyph {
  /* ... */
}
export interface QuranLine {
  /* ... */
}
export interface QuranPageData {
  /* ... */
}
export interface SurahInfo {
  /* ... */
}
export interface PageMetadata {
  /* ... */
}
export interface FontConfig {
  /* ... */
}
export interface GetPageOptions {
  /* ... */
}
export interface AyahPosition {
  /* ... */
}

// Raw data types
export interface QuranGlyphRaw {
  /* ... */
}
export interface PageMapping {
  /* ... */
}
export interface MushafMetadata {
  /* ... */
}
```

### data-loader.ts

```typescript
import * as fs from "fs";
import * as path from "path";

interface RawData {
  layout: QuranGlyphRaw[];
  suwar: SurahInfo[];
  pageMapping: PageMapping;
  metadata: MushafMetadata;
}

class DataLoader {
  private data: RawData | null = null;

  async loadAll(): Promise<RawData> {
    if (this.data) return this.data;

    // Load all files in parallel
    const [layout, suwar, pageMapping, metadata] = await Promise.all([
      this.loadCSV("quran_layout.csv"),
      this.loadJSON("suwar.json"),
      this.loadJSON("page_mapping.json"),
      this.loadJSON("mushaf_metadata.json"),
    ]);

    this.data = { layout, suwar, pageMapping, metadata };
    return this.data;
  }

  private async loadCSV(filename: string): Promise<QuranGlyphRaw[]> {
    const csv = await fs.promises.readFile(
      path.join(__dirname, "..", "data", filename),
      "utf-8",
    );
    // Parse CSV...
  }

  private async loadJSON(filename: string): Promise<any> {
    const json = await fs.promises.readFile(
      path.join(__dirname, "..", "data", filename),
      "utf-8",
    );
    return JSON.parse(json);
  }

  getData(): RawData {
    if (!this.data) {
      throw new Error("Data not loaded. Call loadAll() first.");
    }
    return this.data;
  }
}

export const dataLoader = new DataLoader();
```

### page-builder.ts

```typescript
import { dataLoader } from "./data-loader";
import {
  QuranPageData,
  QuranLine,
  QuranGlyph,
  GetPageOptions,
  SurahInfo,
  PageMetadata,
  FontConfig,
} from "./types";

export function getPageData(
  pageNumber: number,
  options: GetPageOptions = {},
): QuranPageData {
  // Validate page number
  if (pageNumber < 1 || pageNumber > 604) {
    throw new Error("Page number must be between 1 and 604");
  }

  const data = dataLoader.getData();
  const mode = options.mode || "standard";
  const recitation = options.recitation || "hafs";

  // Filter glyphs by page
  const pageGlyphs = data.layout.filter((g) => g.pageNo === pageNumber);

  // Group by line
  const lines = groupByLine(pageGlyphs);

  // Build surahs list
  const surahs = getSurahsForPage(pageNumber, data);

  // Build metadata
  const metadata = buildMetadata(pageNumber, data);

  // Build font config
  const fonts = buildFontConfig(
    pageNumber,
    mode,
    recitation,
    options.fontFamilies,
  );

  return {
    pageNumber,
    surahs,
    lines,
    metadata,
    fonts,
  };
}

function groupByLine(glyphs: QuranGlyphRaw[]): QuranLine[] {
  // Group glyphs by line number
  // Return QuranLine[]
}

function getSurahsForPage(pageNumber: number, data: RawData): SurahInfo[] {
  // Find surahs that appear on this page
  // Return SurahInfo[]
}

function buildMetadata(pageNumber: number, data: RawData): PageMetadata {
  // Calculate juz
  // Determine pageFace (right/left)
  // Return PageMetadata
}

function buildFontConfig(
  pageNumber: number,
  mode: string,
  recitation: string,
  customFontFamilies?: GetPageOptions["fontFamilies"],
): FontConfig {
  // Build font config
  // Return FontConfig
}

// Other exports
export function getPageFromAyah(surah: number, ayah: number): number {
  /* ... */
}
export function getAyahPosition(surah: number, ayah: number): AyahPosition {
  /* ... */
}
export function getJuzPages(): number[] {
  /* ... */
}
export function getSurahInfo(surahNumber: number): SurahInfo | undefined {
  /* ... */
}
export function getAllSurahs(): SurahInfo[] {
  /* ... */
}
export function getPageInfo(
  pageNumber: number,
): [number, number, number, number] | undefined {
  /* ... */
}
```

---

## Package.json

```json
{
  "name": "quran-core",
  "version": "1.0.0",
  "description": "Framework-agnostic Quran page rendering package",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "module": "dist/index.js",
  "files": ["dist/", "data/", "assets/"],
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "prepublishOnly": "npm run build && npm test"
  },
  "keywords": ["quran", "islam", "hafs", "kfgqpc", "qcf4"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/quran-core.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/quran-core/issues"
  },
  "homepage": "https://github.com/yourusername/quran-core#readme"
}
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## .npmignore

```
# Source files
src/
tests/

# Configuration
.eslintrc.json
.prettierrc
tsconfig.json
jest.config.js

# Git
.git/
.gitignore

# IDE
.idea/
.vscode/

# Node
node_modules/
npm-debug.log

# Documentation (optional - already in 'files' array)
docs/
```

---

## Installation Size

| Component           | Size       | Notes               |
| ------------------- | ---------- | ------------------- |
| dist/ (compiled JS) | ~200 KB    | TypeScript compiled |
| data/ (CSV/JSON)    | ~5 MB      | All data files      |
| assets/ (fonts)     | ~5 MB      | All font files      |
| **Total**           | **~10 MB** | Full installation   |

---

## Importing the Package

### ES Modules

```typescript
import { getPageData } from "quran-core";
```

### CommonJS

```javascript
const { getPageData } = require("quran-core");
```

### CDN (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/quran-core@1.0.0/dist/index.umd.js"></script>
<script>
  const { getPageData } = quranCore;
</script>
```

---

## Browser Support

| Browser | Version | Status           |
| ------- | ------- | ---------------- |
| Chrome  | 90+     | ✅ Full Support  |
| Firefox | 88+     | ✅ Full Support  |
| Safari  | 14+     | ✅ Full Support  |
| Edge    | 90+     | ✅ Full Support  |
| IE11    | -       | ❌ Not Supported |

---

## Dependencies

**None!** The package is pure TypeScript/JavaScript with no external dependencies.

---

## Dev Dependencies

```json
{
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "@types/node": "^18.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```
