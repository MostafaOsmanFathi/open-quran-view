# Core Module Documentation

> Complete reference for the `@open-quran-view/core` module including exports, types, functions, and test specifications.

---

## Table of Contents

1. [Module Structure](#module-structure)
2. [Exports Overview](#exports-overview)
3. [Type Definitions](#type-definitions)
4. [Helper Functions](#helper-functions)
5. [Data Loading Functions](#data-loading-functions)
6. [Font Loading Functions](#font-loading-functions)
7. [Lookup Functions](#lookup-functions)
8. [Test Specifications](#test-specifications)

---

## Module Structure

```
src/core/
├── index.ts       # Main exports
├── types.ts       # TypeScript type definitions
├── data-loader.ts # Data loading with caching
├── font-loader.ts # Font URL generation
└── lookup.ts      # Navigation and verse lookup
```

---

## Exports Overview

```typescript
// Types
export type { MushafLayout, CharType, WordLocation, Word, Line, Page, Surah, Juz };
export type { VerseLocation, NavigationInfo };

// Helper Functions
export { parseVerseKey, createVerseKey };

// Data Loading
export { loadPage, loadAllPages, loadPages, loadSurahs, loadJuzs };
export { getSurah, getJuz, getSurahByPage, clearCache };

// Font Loading
export { getFontUrl, loadFont, clearFontCache };

// Lookup Functions
export { getPageForVerse, getVerseLocation, getNavigation };
export { getWordLocation, getPageRangeForSurah };
export { getFirstVerseOfPage, getLastVerseOfPage };
```

---

## Type Definitions

### MushafLayout
```typescript
type MushafLayout = "hafs-v2" | "hafs-v4" | "hafs-unicode";
```

| Value | Description |
|-------|-------------|
| `hafs-v2` | QCF V2 (Madani) - Recommended default |
| `hafs-v4` | QCF V4 Tajweed with color rules |
| `hafs-unicode` | Simple Unicode text |

---

### CharType
```typescript
type CharType = "word" | "end" | "pause" | "rub" | "sajdah";
```

| Value | Description |
|-------|-------------|
| `word` | Regular word |
| `end` | End of verse |
| `pause` | Prostration mark |
| `rub` | Rub el Hizb marker |
| `sajdah` | Sajdah (prostration) marker |

---

### WordLocation
```typescript
type WordLocation = {
  surah: number;     // Chapter number (1-114)
  verse: number;     // Verse number
  position: number;  // Position within verse
};
```

---

### Word
```typescript
type Word = {
  id: number;           // Unique word identifier
  position: number;     // Position within verse
  text: string;         // Arabic text
  code_v2?: string;     // QCF glyph code (optional)
  pageNumber: number;   // Mushaf page number
  charType: CharType;   // Character type
} & WordLocation;       // Extends WordLocation
```

**Example:**
```typescript
{
  id: 1,
  position: 1,
  text: "بِسْمِ",
  code_v2: "ﱁ",
  pageNumber: 1,
  charType: "word",
  surah: 1,
  verse: 1
}
```

---

### LineMetadata
```typescript
type LineMetadata = {
  verseId: number;      // Verse identifier
  verseKey: string;     // "surah:verse" format
  chapterId: number;    // Chapter number
};
```

---

### Line
```typescript
type Line = {
  lineNumber: number;   // Line number on page (1-15)
  words: Word[];        // Words on this line
  metadata: LineMetadata;
};
```

**Example:**
```typescript
{
  lineNumber: 2,
  words: [
    { id: 1, position: 1, text: "بِسْمِ", pageNumber: 1, charType: "word", surah: 1, verse: 1 }
  ],
  metadata: {
    verseId: 1,
    verseKey: "1:1",
    chapterId: 1
  }
}
```

---

### Page
```typescript
type Page = {
  pageNumber: number;   // Page number (1-604)
  lines: Line[];        // Lines on this page
};
```

**Structure:**
```typescript
{
  pageNumber: 1,
  lines: [
    { lineNumber: 1, words: [...], metadata: {...} },
    { lineNumber: 2, words: [...], metadata: {...} },
    // ... 15 lines per page
  ]
}
```

---

### Surah
```typescript
type Surah = {
  id: number;              // Surah number (1-114)
  nameSimple: string;      // "Al-Fatihah"
  nameComplex: string;     // "The Opening"
  nameArabic: string;      // "ٱلْفَاتِحَة"
  versesCount: number;     // Number of verses
  revelationPlace: "makkah" | "madinah";
  revelationOrder: number; // Order of revelation
  bismillahPre: boolean;   // Bismillah before surah
  pages: [number, number]; // [startPage, endPage]
  translatedName: {
    languageName: string;  // "english"
    name: string;          // "The Opening"
  };
};
```

**Example (Al-Fatihah):**
```typescript
{
  id: 1,
  nameSimple: "Al-Fatihah",
  nameComplex: "The Opening",
  nameArabic: "ٱلْفَاتِحَة",
  versesCount: 7,
  revelationPlace: "makkah",
  revelationOrder: 5,
  bismillahPre: false,
  pages: [1, 1],
  translatedName: { languageName: "english", name: "The Opening" }
}
```

---

### Juz
```typescript
type Juz = {
  id: number;                    // Juz ID (1-90, duplicated)
  juzNumber: number;             // Juz number (1-30)
  firstVerseId: number;          // First verse ID
  lastVerseId: number;           // Last verse ID
  versesCount: number;           // Number of verses
  verseMapping: Record<string, string>; // Verse mappings
};
```

**Example (Juz 1 - Amma):**
```typescript
{
  id: 1,
  juzNumber: 1,
  firstVerseId: 1,
  lastVerseId: 148,
  versesCount: 148,
  verseMapping: { "1": "1", "2": "1", ... }
}
```

---

### VerseLocation
```typescript
type VerseLocation = {
  surah: number;       // Chapter number
  verse: number;       // Verse number
  pageNumber: number;  // Page number
  lineNumber: number;  // Line number
  wordPosition: number;// Position of first word
};
```

---

### NavigationInfo
```typescript
type NavigationInfo = {
  prevPage: number | null;    // Previous page number or null
  nextPage: number | null;    // Next page number or null
  currentSurah: Surah | null; // Current surah metadata or null
  surahStartPage: number;     // First page of current surah
  surahEndPage: number;       // Last page of current surah
};
```

---

## Helper Functions

### parseVerseKey
```typescript
function parseVerseKey(verseKey: string): { surah: number; verse: number };
```

Parses a verse key string into its components.

| Input | Output |
|-------|--------|
| `"1:1"` | `{ surah: 1, verse: 1 }` |
| `"2:255"` | `{ surah: 2, verse: 255 }` |
| `"invalid"` | `{ surah: NaN, verse: NaN }` |
| `""` | `{ surah: NaN, verse: NaN }` |

---

### createVerseKey
```typescript
function createVerseKey(surah: number, verse: number): string;
```

Creates a verse key string from components.

| Input | Output |
|-------|--------|
| `(1, 1)` | `"1:1"` |
| `(2, 255)` | `"2:255"` |

---

## Data Loading Functions

### loadPages
```typescript
async function loadPages(
  layout: MushafLayout,
  pageNumber?: number
): Promise<Page | Page[] | null>;
```

Loads page data with optional specific page filter.

| Parameters | Description |
|------------|-------------|
| `layout` | Mushaf layout (`hafs-v2`, `hafs-v4`, `hafs-unicode`) |
| `pageNumber` | Optional specific page number (1-604) |

| Usage | Returns |
|-------|---------|
| `loadPages("hafs-v2")` | All 604 pages as `Page[]` |
| `loadPages("hafs-v2", 1)` | Single `Page` for page 1 |
| `loadPages("hafs-v2", 999)` | `null` (invalid page) |

---

### loadPage
```typescript
async function loadPage(
  layout: MushafLayout,
  pageNumber: number
): Promise<Page | null>;
```

Loads a single page by number. Convenience wrapper around `loadPages`.

| Parameters | Description |
|------------|-------------|
| `layout` | Mushaf layout |
| `pageNumber` | Page number (1-604) |

| Returns | Description |
|---------|-------------|
| `Page` | Page data if valid |
| `null` | If page number is invalid (< 1 or > 604) |

---

### loadAllPages
```typescript
async function loadAllPages(layout: MushafLayout): Promise<Page[]>;
```

Loads all pages for a layout. Wrapper around `loadPages`.

| Returns | Description |
|---------|-------------|
| `Page[]` | Array of all 604 pages |

---

### loadSurahs
```typescript
async function loadSurahs(): Promise<Surah[]>;
```

Loads all 114 surah metadata.

| Returns | Description |
|---------|-------------|
| `Surah[]` | Array of all surahs |

**Expected Result:** 114 surahs, first surah is Al-Fatihah (id: 1)

---

### loadJuzs
```typescript
async function loadJuzs(): Promise<Juz[]>;
```

Loads all juz metadata.

| Returns | Description |
|---------|-------------|
| `Juz[]` | Array of all juz entries |

**Expected Result:** 60 entries (each juz appears twice with ids 1-30 and 61-90)

---

### getSurah
```typescript
async function getSurah(id: number): Promise<Surah | null>;
```

Gets surah by ID.

| Parameters | Description |
|------------|-------------|
| `id` | Surah number (1-114) |

| Returns | Description |
|---------|-------------|
| `Surah` | Surah metadata if found |
| `null` | If ID is invalid |

**Expected Result:** `getSurah(1)` returns Al-Fatihah

---

### getJuz
```typescript
async function getJuz(id: number): Promise<Juz | null>;
```

Gets juz by ID.

| Parameters | Description |
|------------|-------------|
| `id` | Juz ID (1-90) |

| Returns | Description |
|---------|-------------|
| `Juz` | Juz metadata if found |
| `null` | If ID is invalid |

**Expected Result:** `getJuz(1)` returns first juz entry

---

### getSurahByPage
```typescript
async function getSurahByPage(pageNumber: number): Promise<Surah | null>;
```

Gets surah that contains the given page number.

| Parameters | Description |
|------------|-------------|
| `pageNumber` | Page number (1-604) |

| Returns | Description |
|---------|-------------|
| `Surah` | Surah that contains the page |
| `null` | If page is invalid |

**Expected Result:** `getSurahByPage(1)` returns Al-Fatihah

---

### clearCache
```typescript
function clearCache(layout?: MushafLayout): void;
```

Clears the data loader cache.

| Parameters | Description |
|------------|-------------|
| `layout?` | Specific layout to clear, or undefined for all |

| Usage | Effect |
|-------|--------|
| `clearCache("hafs-v2")` | Clears only hafs-v2 pages cache |
| `clearCache()` | Clears all caches (pages, surahs, juzs) |

---

## Font Loading Functions

### getFontUrl
```typescript
async function getFontUrl(
  layout: MushafLayout,
  page: number
): Promise<string>;
```

Generates the font URL for a specific layout and page.

| Parameters | Description |
|------------|-------------|
| `layout` | Mushaf layout |
| `page` | Page number (1-604) |

| Layout | Example Output |
|--------|----------------|
| `hafs-v2` | `/data/fonts/hafs-v2/p1.woff2` |
| `hafs-v4` | `/data/fonts/hafs-v4/p180.woff2` |
| `hafs-unicode` | `/data/fonts/hafs-unicode/p604.woff2` |

**Behavior:** Returns local URL path, caches result for subsequent calls

---

### loadFont
```typescript
async function loadFont(
  layout: MushafLayout,
  page: number
): Promise<void>;
```

Loads a font and adds it to `document.fonts`.

| Parameters | Description |
|------------|-------------|
| `layout` | Mushaf layout |
| `page` | Page number |

**Behavior:**
1. Gets font URL via `getFontUrl()`
2. Creates `FontFace` object
3. Loads and adds to document fonts

---

### clearFontCache
```typescript
function clearFontCache(layout?: MushafLayout): void;
```

Clears the font URL cache.

| Parameters | Description |
|------------|-------------|
| `layout?` | Specific layout to clear, or undefined for all |

| Usage | Effect |
|-------|--------|
| `clearFontCache("hafs-v2")` | Clears only hafs-v2 font cache |
| `clearFontCache()` | Clears all font caches |

---

## Lookup Functions

### getPageForVerse
```typescript
async function getPageForVerse(
  verseKey: string,
  layout?: MushafLayout
): Promise<{ page: Page | null; verseLocation: VerseLocation | null }>;
```

Finds the page and location for a specific verse.

| Parameters | Description |
|------------|-------------|
| `verseKey` | Verse key in "surah:verse" format |
| `layout` | Mushaf layout (default: "hafs-v2") |

| Input | Expected Output |
|-------|-----------------|
| `"1:1"` | Page 1, VerseLocation for Al-Fatihah 1 |
| `"2:255"` | Page 242, VerseLocation for Ayatul Kursi |
| `"invalid"` | `{ page: null, verseLocation: null }` |
| `"999:999"` | `{ page: null, verseLocation: null }` |

---

### getVerseLocation
```typescript
async function getVerseLocation(
  chapter: number,
  verse: number,
  layout?: MushafLayout
): Promise<VerseLocation | null>;
```

Gets the location of a specific verse.

| Parameters | Description |
|------------|-------------|
| `chapter` | Chapter number |
| `verse` | Verse number |
| `layout` | Mushaf layout (default: "hafs-v2") |

| Input | Expected Output |
|-------|-----------------|
| `(1, 1)` | VerseLocation for verse 1:1 |
| `(999, 999)` | `null` (invalid) |

---

### getNavigation
```typescript
async function getNavigation(
  pageNumber: number,
  layout?: MushafLayout
): Promise<NavigationInfo>;
```

Gets navigation information for a page.

| Parameters | Description |
|------------|-------------|
| `pageNumber` | Page number |
| `layout` | Mushaf layout (default: "hafs-v2") |

| Page | Expected Output |
|------|-----------------|
| 1 | `prevPage: null`, `nextPage: 2`, `currentSurah: Al-Fatihah` |
| 604 | `prevPage: 603`, `nextPage: null`, `currentSurah: An-Nas` |

---

### getWordLocation
```typescript
function getWordLocation(
  word: Word,
  verseKey?: string
): VerseLocation;
```

Gets the location of a word.

| Parameters | Description |
|------------|-------------|
| `word` | Word object |
| `verseKey?` | Optional verse key override |

| Input | Output |
|-------|--------|
| `word` with `"1:1"` | `VerseLocation` with surah=1, verse=1 |
| `word` without key | `VerseLocation` with surah=0, verse=0 |

---

### getPageRangeForSurah
```typescript
async function getPageRangeForSurah(
  surahId: number
): Promise<[number, number] | null>;
```

Gets the start and end page for a surah.

| Parameters | Description |
|------------|-------------|
| `surahId` | Surah number (1-114) |

| Input | Expected Output |
|-------|-----------------|
| 1 | `[1, 1]` (Al-Fatihah) |
| 2 | `[2, 49]` (Al-Baqarah) |
| 999 | `null` (invalid) |

---

### getFirstVerseOfPage
```typescript
async function getFirstVerseOfPage(
  pageNumber: number,
  layout?: MushafLayout
): Promise<VerseLocation | null>;
```

Gets the first verse location on a page.

| Parameters | Description |
|------------|-------------|
| `pageNumber` | Page number |
| `layout` | Mushaf layout |

| Input | Expected Output |
|-------|-----------------|
| 1 | VerseLocation for first verse of page 1 |
| 999 | `null` (invalid) |

---

### getLastVerseOfPage
```typescript
async function getLastVerseOfPage(
  pageNumber: number,
  layout?: MushafLayout
): Promise<VerseLocation | null>;
```

Gets the last verse location on a page.

| Parameters | Description |
|------------|-------------|
| `pageNumber` | Page number |
| `layout` | Mushaf layout |

| Input | Expected Output |
|-------|-----------------|
| 1 | VerseLocation for last verse of page 1 |
| 999 | `null` (invalid) |

---

## Test Specifications

### Core Types Tests (9 tests)

| Test | Expected Result |
|------|-----------------|
| `MushafLayout accepts valid values` | Array `["hafs-v2", "hafs-v4", "hafs-unicode"]` has length 3 |
| `CharType accepts valid values` | Array `["word", "end", "pause", "rub", "sajdah"]` has length 5 |
| `WordLocation has correct structure` | `{ surah: 1, verse: 1, position: 1 }` equals expected |
| `Word has correct structure` | All fields present, `code_v2` optional |
| `Line has correct structure` | `lineNumber`, `words[]`, `metadata` present |
| `Page has correct structure` | `pageNumber`, `lines[]` present |
| `Surah has correct structure` | All fields match Al-Fatihah structure |
| `Juz has correct structure` | All fields match juz structure |
| `VerseLocation has correct structure` | All location fields present |
| `NavigationInfo has correct structure` | Navigation fields present |

---

### Helper Functions Tests (6 tests)

| Test | Input | Expected |
|------|-------|----------|
| `parseVerseKey valid` | `"1:1"` | `{ surah: 1, verse: 1 }` |
| `parseVerseKey different numbers` | `"2:255"` | `{ surah: 2, verse: 255 }` |
| `parseVerseKey invalid` | `"invalid"` | `{ surah: NaN, verse: NaN }` |
| `parseVerseKey empty` | `""` | `{ surah: NaN, verse: NaN }` |
| `createVerseKey` | `(1, 1)` | `"1:1"` |
| `createVerseKey different` | `(2, 255)` | `"2:255"` |

---

### Font Loader Tests (7 tests)

| Test | Input | Expected |
|------|-------|----------|
| `getFontUrl hafs-v2` | `"hafs-v2", 1` | `"/data/fonts/hafs-v2/p1.woff2"` |
| `getFontUrl hafs-v4` | `"hafs-v4", 180` | `"/data/fonts/hafs-v4/p180.woff2"` |
| `getFontUrl hafs-unicode` | `"hafs-unicode", 1` | `"/data/fonts/hafs-unicode/p1.woff2"` |
| `getFontUrl different pages` | `"hafs-v2", 1, 2` | URLs are different |
| `getFontUrl caches` | Same call twice | Same URL returned |
| `clearFontCache specific` | After `getFontUrl` | Cache cleared for layout |
| `clearFontCache all` | After `getFontUrl` | All caches cleared |

---

### Data Loader Tests (19 tests)

| Test | Expected Result |
|------|-----------------|
| `loadPages all pages` | Returns array > 0 |
| `loadPages specific page` | Returns Page with correct `pageNumber` |
| `loadPages invalid page` | Returns `null` |
| `loadPage success` | Page with `lines[]` array |
| `loadPage invalid` | Returns `null` |
| `loadPage page 0` | Returns `null` |
| `loadPage negative` | Returns `null` |
| `loadAllPages hafs-v2` | 604 pages, page 1 to 604 |
| `loadAllPages multiple layouts` | All layouts return pages |
| `loadAllPages caches` | Same array reference on second call |
| `getSurah valid` | Returns Al-Fatihah (id: 1) |
| `getSurah invalid` | Returns `null` |
| `getJuz valid` | Returns juz with matching id |
| `getJuz invalid` | Returns `null` |
| `getSurahByPage valid` | Returns surah containing page |
| `getSurahByPage invalid` | Returns `null` |
| `clearCache specific` | Allows reload of specific layout |
| `clearCache all` | Allows reload of all data |
| `clearCache preserves other layouts` | Other layouts unaffected |

---

### Data Loading Tests (10 tests)

| Test | Expected Result |
|------|-----------------|
| `load pages JSON hafs-v2` | Page 1 has lines > 0 |
| `load pages JSON hafs-v4` | Page 1 has correct pageNumber |
| `load all 604 pages hafs-v2` | `pages.length === 604` |
| `load all 604 pages hafs-v4` | `pages.length === 604` |
| `load surahs JSON` | `surahs.length === 114`, first is Al-Fatihah |
| `load juzs JSON` | `juzs.length === 60`, last has `juzNumber: 30`, `id: 90` |
| `font URL hafs-v2` | p1 and p604 URLs correct |
| `font URL hafs-v4` | p1 and p604 URLs correct |
| `font URLs unique` | Each page has unique URL |
| `font URLs cached` | Same URL returned on repeat calls |

---

### Lookup Functions Tests (17 tests)

| Test | Input | Expected |
|------|-------|----------|
| `getPageForVerse valid` | `"1:1"` | Page + VerseLocation not null |
| `getPageForVerse invalid` | `"invalid"` | Both null |
| `getPageForVerse non-existent` | `"999:999"` | Both null |
| `getPageForVerse default` | `"1:1"` (no layout) | Returns page (default: hafs-v2) |
| `getVerseLocation valid` | `(1, 1)` | Location not null |
| `getVerseLocation invalid` | `(999, 999)` | Returns `null` |
| `getNavigation first page` | `1` | `prevPage: null`, `nextPage > 1` |
| `getNavigation last page` | `604` | `nextPage: null`, `prevPage < 604` |
| `getNavigation boundaries` | Any page | `surahStartPage <= surahEndPage` |
| `getPageRangeForSurah valid` | `1` | `[1, 1]` (Al-Fatihah) |
| `getPageRangeForSurah invalid` | `999` | Returns `null` |
| `getFirstVerseOfPage valid` | `1` | Location with pageNumber 1 |
| `getFirstVerseOfPage invalid` | `999` | Returns `null` |
| `getLastVerseOfPage valid` | `1` | Location with pageNumber 1 |
| `getLastVerseOfPage invalid` | `999` | Returns `null` |
| `getWordLocation with key` | Word + "1:1" | surah=1, verse=1 |
| `getWordLocation no key` | Word only | surah=0, verse=0 |

---

## Summary

| Category | Count |
|----------|-------|
| Total Tests | 70 |
| Type Tests | 10 |
| Helper Function Tests | 6 |
| Font Loader Tests | 7 |
| Data Loader Tests | 19 |
| Data Loading Tests | 10 |
| Lookup Function Tests | 17 |

**All tests pass with the current implementation.**
