# API Reference

## Overview

This document provides detailed API documentation for all exported functions.

---

## Main Functions

### getPageData()

Get complete structured data for a specific page.

**Signature:**

```typescript
function getPageData(
  pageNumber: number,
  options?: GetPageOptions,
): QuranPageData;
```

**Parameters:**

| Parameter    | Type           | Required | Description           |
| ------------ | -------------- | -------- | --------------------- |
| `pageNumber` | number         | Yes      | Page number (1-604)   |
| `options`    | GetPageOptions | No       | Configuration options |

**Options:**

```typescript
interface GetPageOptions {
  /** Font mode: standard or tajweed */
  mode?: "standard" | "tajweed";

  /** Recitation: hafs or warsh */
  recitation?: "hafs" | "warsh";

  /** Custom font family names */
  fontFamilies?: {
    basmalah?: string;
    surah?: string;
    page?: string;
  };
}
```

**Returns:** `QuranPageData`

**Examples:**

```typescript
import { getPageData } from "quran-core";

// Basic usage
const pageData = getPageData(1);
console.log(pageData.pageNumber); // 1
console.log(pageData.lines.length); // 15

// Tajweed mode
const tajweedPage = getPageData(1, { mode: "tajweed" });

// Custom font families
const customPage = getPageData(1, {
  mode: "standard",
  fontFamilies: {
    basmalah: "my-basmalah",
    surah: "my-surah",
    page: "my-page",
  },
});

// Warsh (when fonts available)
const warshPage = getPageData(1, { recitation: "warsh" });
```

---

### getPageFromAyah()

Find which page contains a specific ayah.

**Signature:**

```typescript
function getPageFromAyah(
  surah: number,
  ayah: number,
  options?: GetPageFromAyahOptions,
): number;
```

**Parameters:**

| Parameter | Type                   | Required | Description           |
| --------- | ---------------------- | -------- | --------------------- |
| `surah`   | number                 | Yes      | Surah number (1-114)  |
| `ayah`    | number                 | Yes      | Ayah number (1-286)   |
| `options` | GetPageFromAyahOptions | No       | Configuration options |

**Returns:** `number` - Page number (1-604)

**Examples:**

```typescript
import { getPageFromAyah } from "quran-core";

// Ayat Al-Kursi (Surah 2, Ayah 255)
const page = getPageFromAyah(2, 255);
console.log(page); // 283

// First ayah of Surah Al-Fatiha
const page1 = getPageFromAyah(1, 1);
console.log(page1); // 1

// Last ayah of the Quran (Surah 110)
const lastPage = getPageFromAyah(110, 3);
console.log(lastPage); // 604
```

---

### getAyahPosition()

Get detailed position of an ayah.

**Signature:**

```typescript
function getAyahPosition(
  surah: number,
  ayah: number,
  options?: GetPageFromAyahOptions,
): AyahPosition;
```

**Parameters:**

| Parameter | Type                   | Required | Description           |
| --------- | ---------------------- | -------- | --------------------- |
| `surah`   | number                 | Yes      | Surah number (1-114)  |
| `ayah`    | number                 | Yes      | Ayah number (1-286)   |
| `options` | GetPageFromAyahOptions | No       | Configuration options |

**Returns:** `AyahPosition`

```typescript
interface AyahPosition {
  page: number; // Page number containing the ayah
  line: number; // Line number within the page
  glyphIndex: number; // Index within the line's glyphs
}
```

**Examples:**

```typescript
import { getAyahPosition } from "quran-core";

const position = getAyahPosition(2, 255);
console.log(position);
/*
{
  page: 283,
  line: 5,
  glyphIndex: 12
}
*/
```

---

### getJuzPages()

Get the starting page of each juz.

**Signature:**

```typescript
function getJuzPages(): number[];
```

**Returns:** Array of 30 page numbers (one for each juz)

**Examples:**

```typescript
import { getJuzPages } from "quran-core";

const juzPages = getJuzPages();
console.log(juzPages);
/*
[1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 
 201, 222, 242, 262, 282, 302, 322, 342, 362, 
 382, 402, 422, 442, 462, 482, 502, 522, 542, 
 562, 582]
*/
```

---

### getSurahInfo()

Get information about a specific surah.

**Signature:**

```typescript
function getSurahInfo(surahNumber: number): SurahInfo | undefined;
```

**Parameters:**

| Parameter     | Type   | Required | Description          |
| ------------- | ------ | -------- | -------------------- |
| `surahNumber` | number | Yes      | Surah number (1-114) |

**Returns:** `SurahInfo | undefined`

**Examples:**

```typescript
import { getSurahInfo } from "quran-core";

const surah = getSurahInfo(1);
console.log(surah);
/*
{
  id: 1,
  name: "الفاتحة",
  startPage: 1,
  endPage: 1,
  ayahCount: 7
}
*/
```

---

### getAllSurahs()

Get information about all surahs.

**Signature:**

```typescript
function getAllSurahs(): SurahInfo[];
```

**Returns:** Array of all 114 SurahInfo objects

**Examples:**

```typescript
import { getAllSurahs } from "quran-core";

const allSurahs = getAllSurahs();
console.log(allSurahs.length); // 114
console.log(allSurahs[0]); // Al-Fatihah
console.log(allSurahs[113]); // An-Nas
```

---

### getPageInfo()

Get page mapping information.

**Signature:**

```typescript
function getPageInfo(
  pageNumber: number,
): [number, number, number, number] | undefined;
```

**Parameters:**

| Parameter    | Type   | Required | Description         |
| ------------ | ------ | -------- | ------------------- |
| `pageNumber` | number | Yes      | Page number (1-604) |

**Returns:** `[surah, startAyah, page, endAyah]` or `undefined`

**Examples:**

```typescript
import { getPageInfo } from "quran-core";

const info = getPageInfo(1);
console.log(info);
/*
[1, 1, 1, 7]
// Surah 1, Ayahs 1-7, Page 1
*/
```

---

## Type Exports

### All Types

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
```

---

## Error Handling

### Invalid Page Number

```typescript
import { getPageData } from "quran-core";

try {
  const page = getPageData(0); // Invalid
} catch (error) {
  console.error(error.message); // "Page number must be between 1 and 604"
}
```

### Invalid Surah/Ayah

```typescript
import { getPageFromAyah } from "quran-core";

const page = getPageFromAyah(0, 1); // Invalid surah
// Returns: undefined
```

---

## Performance Notes

| Operation                 | Time   | Notes                |
| ------------------------- | ------ | -------------------- |
| First call (any function) | ~100ms | Loads all data files |
| Subsequent calls          | ~1ms   | Data is cached       |
| Preload all pages         | ~500ms | Optional, one-time   |

---

## Complete Example

```typescript
import {
  getPageData,
  getPageFromAyah,
  getAyahPosition,
  getJuzPages,
  getSurahInfo,
  getAllSurahs,
} from "quran-core";

// Get a page
const page = getPageData(1);

// Find which page has Ayat Al-Kursi
const pageNum = getPageFromAyah(2, 255);

// Get detailed position
const position = getAyahPosition(2, 255);

// Get juz boundaries
const juzPages = getJuzPages();

// Get surah info
const alBaqarah = getSurahInfo(2);

// Get all surahs
const allSurahs = getAllSurahs();
```
