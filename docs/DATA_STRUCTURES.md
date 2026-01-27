# Data Structures

## Overview

This document defines all TypeScript interfaces and data structures used in the package.

---

## Data Source: Quranic Universal Library (QUL)

This project uses layout data from the **Quranic Universal Library** (QUL) by TarteelAI:

- **Website:** https://qul.tarteel.ai/
- **GitHub:** https://github.com/TarteelAI/quranic-universal-library
- **Layout Data:** 19 mushaf layouts available

### QUL Layout Data Format

QUL provides mushaf layout data in multiple formats:

| Format     | Description                | Use Case           |
| ---------- | -------------------------- | ------------------ |
| **CSV**    | Glyph-by-glyph coordinates | Direct rendering   |
| **JSON**   | Structured page/line/glyph | Easy parsing       |
| **SQLite** | Database format            | Large applications |

### Our Data Files

| File                   | Source        | Content                        |
| ---------------------- | ------------- | ------------------------------ |
| `quran_layout.csv`     | QUL KFGQPC V4 | 88,439 glyphs with coordinates |
| `suwar.json`           | QUL           | 114 surah definitions          |
| `page_mapping.json`    | QUL           | Page-to-ayah mapping           |
| `mushaf_metadata.json` | QUL           | Juz, centered lines, offsets   |

---

## Core Types

### GlyphType

```typescript
type GlyphType =
  | 1 // Word - Regular words
  | 2 // Waqf - Stopping mark
  | 4 // Bismallah - "بسم الله..."
  | 5 // Surah Name - "Al-Fatiha"
  | 6 // Ayah End - ۝
  | 7; // Rubu Marker - Quarter marker
```

### FontSource

```typescript
type FontSource =
  | "basmalah" // Basmalah font (بسم الله...)
  | "surah" // Surah name font
  | "page"; // Page-specific font
```

### FontMode

```typescript
type FontMode = "standard" | "tajweed";
```

### Recitation

```typescript
type Recitation = "hafs" | "warsh";
```

---

## Glyph Types

### QuranGlyph

Individual character/glyph in the Quran.

```typescript
interface QuranGlyph {
  /** The actual Unicode character */
  char: string;

  /** Surah number (1-114) */
  surah: number;

  /** Ayah number (0-286, where 0 = surah name/basmalah) */
  ayah: number;

  /** Font code - position in the font file */
  fontCode: number;

  /** Glyph type */
  type: GlyphType;

  /** Which font file this glyph belongs to */
  fontSource: FontSource;

  /** Whether this glyph is clickable */
  isHighlightable: boolean;
}
```

### GlyphType Values

| Value | Name        | Clickable | Font Source | Example        |
| ----- | ----------- | --------- | ----------- | -------------- |
| 1     | Word        | ✅ Yes    | page        | Regular words  |
| 2     | Waqf        | ✅ Yes    | page        | Stopping mark  |
| 4     | Bismallah   | ❌ No     | basmalah    | "بسم الله..."  |
| 5     | Surah Name  | ❌ No     | surah       | "Al-Fatiha"    |
| 6     | Ayah End    | ✅ Yes    | page        | ۝              |
| 7     | Rubu Marker | ✅ Yes    | page        | Quarter marker |

---

## Page Types

### QuranLine

A single line on a page (15 lines per page).

```typescript
interface QuranLine {
  /** Line number (1-15) */
  lineNumber: number;

  /** Whether this line should be centered */
  isCentered: boolean;

  /** All glyphs in this line */
  glyphs: QuranGlyph[];
}
```

### PageMetadata

```typescript
interface PageMetadata {
  /** Juz number (1-30) */
  juz: number;

  /** Page position in the mushaf */
  pageFace: "right" | "left";
}
```

---

## Font Types

### FontConfig

```typescript
interface FontConfig {
  /** Font mode (standard or tajweed) */
  mode: FontMode;

  /** Recitation (hafs or warsh) */
  recitation: Recitation;

  /** Font files needed */
  required: {
    basmalah: string; // QCF4_QBSML.woff2
    surah: string; // QCF4_SURAH.woff2
    page: string; // QCF4_Hafs_XXX_W.woff2 or QCF4_Tajweed_XXX_W.woff2
  };

  /** CSS font-family names (for user to set) */
  fontFamilies: {
    basmalah: string;
    surah: string;
    page: string;
  };
}
```

### FontConfig Default Values

```typescript
const defaultFontFamilies = {
  basmalah: "quran-basmalah",
  surah: "quran-surah",
  page: "quran-page",
};
```

---

## Surah Types

### SurahInfo

```typescript
interface SurahInfo {
  /** Surah number (1-114) */
  id: number;

  /** Arabic name */
  name: string;

  /** Page where surah starts */
  startPage: number;

  /** Page where surah ends */
  endPage: number;

  /** Total ayah count (optional) */
  ayahCount?: number;
}
```

---

## Main Type

### QuranPageData

Complete page data structure returned by `getPageData()`.

```typescript
interface QuranPageData {
  /** Page number (1-604) */
  pageNumber: number;

  /** Surahs on this page */
  surahs: SurahInfo[];

  /** All 15 lines */
  lines: QuranLine[];

  /** Page metadata */
  metadata: PageMetadata;

  /** Font configuration for this page */
  fonts: FontConfig;
}
```

---

## Options Types

### GetPageOptions

```typescript
interface GetPageOptions {
  /** Font mode: standard or tajweed */
  mode?: FontMode;

  /** Recitation: hafs or warsh */
  recitation?: Recitation;

  /** Custom font family names */
  fontFamilies?: {
    basmalah?: string;
    surah?: string;
    page?: string;
  };
}
```

### GetPageFromAyahOptions

```typescript
interface GetPageFromAyahOptions {
  /** Recitation: hafs or warsh */
  recitation?: Recitation;
}
```

---

## Position Types

### AyahPosition

```typescript
interface AyahPosition {
  /** Page number containing the ayah */
  page: number;

  /** Line number within the page */
  line: number;

  /** Index within the line's glyphs */
  glyphIndex: number;
}
```

---

## Raw Data Types

### QuranGlyphRaw

Raw glyph data from CSV (before processing).

```typescript
interface QuranGlyphRaw {
  /** Surah number */
  sura: number;

  /** Ayah number */
  verse: number;

  /** Page number */
  pageNo: number;

  /** Line number (1-15) */
  lineNo: number;

  /** Font file number */
  fontFile: number;

  /** Font code for character */
  fontCode: number;

  /** Glyph type */
  type: number;
}
```

### PageMapping

```typescript
interface PageMapping {
  [pageNumber: string]: [
    surah: number,
    startAyah: number,
    page: number,
    endAyah: number,
  ];
}
```

### MushafMetadata

```typescript
interface MushafMetadata {
  /** Starting page of each juz (30 elements) */
  juz_pages: number[];

  /** Pages with centered lines */
  centered_lines: {
    [pageNumber: string]: number[];
  };

  /** Header offset fixes */
  custom_header_surah_glyph_offset_fix: {
    [pageNumber: string]: number;
  };
}
```

---

## Example Data

### Sample QuranPageData

```json
{
  "pageNumber": 1,
  "surahs": [
    {
      "id": 1,
      "name": "الفاتحة",
      "startPage": 1,
      "endPage": 1,
      "ayahCount": 7
    }
  ],
  "lines": [
    {
      "lineNumber": 1,
      "isCentered": false,
      "glyphs": [
        {
          "char": "ا",
          "surah": 1,
          "ayah": 0,
          "fontCode": 0,
          "type": 5,
          "fontSource": "surah",
          "isHighlightable": false
        }
      ]
    },
    {
      "lineNumber": 2,
      "isCentered": false,
      "glyphs": [
        {
          "char": "ال",
          "surah": 1,
          "ayah": 1,
          "fontCode": 0,
          "type": 1,
          "fontSource": "page",
          "isHighlightable": true
        },
        {
          "char": "ح",
          "surah": 1,
          "ayah": 1,
          "fontCode": 1,
          "type": 1,
          "fontSource": "page",
          "isHighlightable": true
        }
      ]
    }
  ],
  "metadata": {
    "juz": 1,
    "pageFace": "right"
  },
  "fonts": {
    "mode": "standard",
    "recitation": "hafs",
    "required": {
      "basmalah": "QCF4_QBSML.woff2",
      "surah": "QCF4_SURAH.woff2",
      "page": "QCF4_Hafs_001_W.woff2"
    },
    "fontFamilies": {
      "basmalah": "quran-basmalah",
      "surah": "quran-surah",
      "page": "quran-page"
    }
  }
}
```
