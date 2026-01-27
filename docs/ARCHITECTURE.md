# Architecture

## Overview

The Quran Core package follows a modular architecture with clear separation of concerns:

---

## Data Source: Quranic Universal Library (QUL)

This project uses data from the **Quranic Universal Library** (QUL) by TarteelAI:

- **Website:** https://qul.tarteel.ai/
- **GitHub:** https://github.com/TarteelAI/quranic-universal-library
- **License:** Open source (check QUL for specific terms)

### QUL Resources Used

| Resource          | Description                        | Format |
| ----------------- | ---------------------------------- | ------ |
| **Mushaf Layout** | KFGQPC V4 (1441H) page coordinates | CSV    |
| **Surah Info**    | 114 surah definitions              | JSON   |
| **Page Mapping**  | Page-to-ayah relationships         | JSON   |
| **Metadata**      | Juz, centered lines, offsets       | JSON   |

### Why QUL?

1. **Comprehensive** - 19 mushaf layouts, 17 font packages, 209 translations
2. **Standardized** - Consistent data format across resources
3. **Open Source** - Freely available for projects
4. **Maintained** - Active development and bug fixes
5. **Community** - Discord support and GitHub issues

```
┌─────────────────────────────────────────────────────────────────┐
│                     quran-core Package                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ data-loader  │───▶│ page-builder │───▶│    index     │      │
│  │    .ts       │    │     .ts      │    │    .ts       │      │
│  │              │    │              │    │              │      │
│  │ • Load CSV   │    │ • Group by   │    │ • getPageData│      │
│  │ • Parse JSON │    │   line       │    │ • API export │      │
│  │ • Cache data │    │ • Add meta   │    │              │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ↓                    ↓                    ↓
    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │    data/    │      │   types.ts  │      │   Your      │
    │  CSV/JSON   │      │             │      │  Framework  │
    │   files     │      │ Interfaces  │      │  (React,    │
    │             │      │             │      │  Vue, RN)   │
    └─────────────┘      └─────────────┘      └─────────────┘
```

---

## Modules

### 1. data-loader.ts

**Purpose:** Load and parse all data files.

**Responsibilities:**

- Load `quran_layout.csv` (88,439 glyphs)
- Load `suwar.json` (114 surahs)
- Load `page_mapping.json` (604 pages)
- Load `mushaf_metadata.json` (juz, centered lines)
- Cache loaded data for performance

**Output:**

```typescript
interface RawData {
  layout: QuranGlyphRaw[];
  suwar: SurahInfo[];
  pageMapping: PageMapping;
  metadata: MushafMetadata;
}
```

---

### 2. page-builder.ts

**Purpose:** Transform raw data into structured QuranPageData.

**Responsibilities:**

- Filter glyphs by page number
- Group glyphs by line (1-15)
- Identify centered lines
- Calculate juz number
- Determine page face (right/left)
- Build font configuration

**Output:**

```typescript
interface QuranPageData {
  pageNumber: number;
  surahs: SurahInfo[];
  lines: QuranLine[];
  metadata: PageMetadata;
  fonts: FontConfig;
}
```

---

### 3. index.ts

**Purpose:** Main export and public API.

**Exports:**

```typescript
export { getPageData } from "./page-builder";
export { getPageFromAyah } from "./page-builder";
export { getAyahPosition } from "./page-builder";
export * from "./types";
```

---

## Data Flow

### Initialization

```
1. User calls getPageData(1)
           │
           ▼
2. Check cache for page 1
           │
           ▼
3. If not cached:
   ├── Load quran_layout.csv (once)
   ├── Load suwar.json (once)
   ├── Load page_mapping.json (once)
   └── Load mushaf_metadata.json (once)
           │
           ▼
4. Parse CSV into glyph objects
           │
           ▼
5. Build QuranPageData for page 1
           │
           ▼
6. Cache and return
```

### Per-Page Request

```
getPageData(pageNumber, options)
           │
           ▼
┌─────────────────────────────────────┐
│ 1. Filter glyphs by pageNumber      │
│ 2. Group by line (1-15)             │
│ 3. Add metadata                     │
│ 4. Build font config                │
│ 5. Return QuranPageData             │
└─────────────────────────────────────┘
           │
           ▼
User renders the data however they want
```

---

## Caching Strategy

```typescript
class PageCache {
  private cache: Map<number, QuranPageData> = new Map();
  private rawData: RawData | null = null;

  getPage(pageNumber: number): QuranPageData {
    // Check cache first
    if (this.cache.has(pageNumber)) {
      return this.cache.get(pageNumber)!;
    }

    // Build and cache
    const data = this.buildPage(pageNumber);
    this.cache.set(pageNumber, data);
    return data;
  }

  // Pre-load all pages
  preloadAll(): void {
    for (let i = 1; i <= 604; i++) {
      this.getPage(i);
    }
  }
}
```

---

## Performance Characteristics

| Operation                 | Time   | Notes              |
| ------------------------- | ------ | ------------------ |
| Initial load (all data)   | ~100ms | One-time, cached   |
| Get single page           | ~1ms   | After initial load |
| Pre-load all pages        | ~500ms | Optional           |
| Memory (all pages cached) | ~10MB  | Glyph data only    |

---

## Extension Points

### Adding New Recitations

```typescript
// types.ts
type Recitation = "hafs" | "warsh" | "qalun" | "ibn-kathir";

// page-builder.ts
function buildPage(pageNumber: number, options: Options): QuranPageData {
  const recitation = options.recitation || "hafs";

  switch (recitation) {
    case "hafs":
      return buildHafsPage(pageNumber);
    case "warsh":
      return buildWarshPage(pageNumber);
    default:
      return buildHafsPage(pageNumber);
  }
}
```

### Adding New Font Modes

```typescript
// Current: 'standard', 'tajweed'
// Future: 'colored', 'outline', etc.

function buildFontConfig(pageNumber: number, mode: FontMode): FontConfig {
  const baseFont = mode === "tajweed" ? "Tajweed" : "Hafs";
  return {
    mode,
    required: {
      basmalah: "QCF4_QBSML.woff2",
      surah: "QCF4_SURAH.woff2",
      page: `QCF4_${baseFont}_${pad(pageNumber, 3)}_W.woff2`,
    },
  };
}
```
