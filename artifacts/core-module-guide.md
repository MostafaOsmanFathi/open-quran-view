# Core Module

> Framework-agnostic core for Quran page rendering and data access.

## Structure

```
core/
├── types.ts       # TypeScript types for pages, words, surahs, fonts
├── data-loader.ts # Dynamic data loading with caching
├── font-loader.ts # Font URL generation and caching
├── lookup.ts      # Navigation and verse lookup helpers
└── index.ts       # Main exports
```

## Exports

```typescript
// Types
export type { MushafLayout, Word, Line, Page, Surah, Juz, WordLocation, VerseLocation, NavigationInfo };

// Data Loading
export { loadPage, loadAllPages, loadSurahs, loadJuzs, getSurah, getJuz, getSurahByPage, clearCache };

// Font Loading
export { getFontUrl, loadFont, clearFontCache };

// Lookup Helpers
export { getPageForVerse, getVerseLocation, getNavigation, getWordLocation, getPageRangeForSurah, getFirstVerseOfPage, getLastVerseOfPage };

// Utilities
export { parseVerseKey, createVerseKey };
```

## Data Loading (Dynamic Imports)

All data is loaded dynamically via `import()` for tree-shaking:

```typescript
import { loadPage, loadSurahs, getSurah } from "@open-quran-view/core";

// Load single page (lazy)
const page = await loadPage("hafs-v2", 1);

// Load all pages
const allPages = await loadAllPages("hafs-v2");

// Load surah metadata
const surahs = await loadSurahs();
const surah = await getSurah(1);
```

## Types

### MushafLayout
```typescript
type MushafLayout = "hafs-v2" | "hafs-v4" | "hafs-unicode";
```

### Word Type (with location)
```typescript
type WordLocation = {
  surah: number;
  verse: number;
  position: number;
};

type Word = {
  id: number;
  position: number;
  text: string;
  code_v2?: string;
  pageNumber: number;
  charType: "word" | "end" | "pause" | "rub" | "sajdah";
} & WordLocation;
```

### Line & Page
```typescript
type LineMetadata = {
  verseId: number;
  verseKey: string;
  chapterId: number;
};

type Line = {
  lineNumber: number;
  words: Word[];
  metadata: LineMetadata;
};

type Page = {
  pageNumber: number;
  lines: Line[];
};
```

### Surah Metadata
```typescript
type Surah = {
  id: number;
  nameSimple: string;
  nameComplex: string;
  nameArabic: string;
  versesCount: number;
  revelationPlace: "makkah" | "madinah";
  revelationOrder: number;
  bismillahPre: boolean;
  pages: [number, number];
  translatedName: {
    languageName: string;
    name: string;
  };
};
```

### Juz Metadata
```typescript
type Juz = {
  id: number;
  juzNumber: number;
  firstVerseId: number;
  lastVerseId: number;
  versesCount: number;
  verseMapping: Record<string, string>;
};
```

## Lookup Helpers

### Get Page for Verse
```typescript
import { getPageForVerse } from "@open-quran-view/core";

const { page, verseLocation } = await getPageForVerse("2:255", "hafs-v2");
// verseLocation: { surah: 2, verse: 255, pageNumber: 242, lineNumber: ..., wordPosition: ... }
```

### Get Navigation
```typescript
import { getNavigation } from "@open-quran-view/core";

const nav = await getNavigation(1, "hafs-v2");
// nav: { prevPage: null, nextPage: 2, currentSurah: {...}, surahStartPage: 1, surahEndPage: 1 }
```

### Get Word Location (for click handlers)
```typescript
import { getWordLocation } from "@open-quran-view/core";

// When a word is clicked in the UI
function onWordClick(word: Word) {
  const location = getWordLocation(word);
  // location: { surah: 1, verse: 1, pageNumber: 1, lineNumber: 2, wordPosition: 1 }
  console.log(`Clicked ${location.surah}:${location.verse}`);
}
```

### Get Verse Location
```typescript
import { getVerseLocation } from "@open-quran-view/core";

const location = await getVerseLocation(1, 1, "hafs-v2");
// location: { surah: 1, verse: 1, pageNumber: 1, lineNumber: 2, wordPosition: 1 }
```

## Font Configuration

```typescript
import { getFontUrl, loadFont } from "@open-quran-view/core";

const fontUrl = getFontUrl("hafs-v2", 1);
// Returns: "/data/fonts/hafs-v2/p1.woff2"

// Load font for a page
await loadFont("hafs-v2", 1);
// Loads FontFace and adds to document.fonts
```

## Verse Key Helpers

```typescript
import { parseVerseKey, createVerseKey } from "@open-quran-view/core";

parseVerseKey("2:255");  // { surah: 2, verse: 255 }
createVerseKey(2, 255);  // "2:255"
```

## Views Integration

Views use core to get structured data, then render with their own components:

```typescript
// View code (pseudo)
import { loadPage, getFontUrl, type Word } from "@open-quran-view/core";

function QuranPageView({ pageNumber, layout }) {
  const page = await loadPage(layout, pageNumber);
  const fontUrl = getFontUrl(layout, pageNumber);

  return (
    <div className="quran-page">
      {page.lines.map(line => (
        <div className="line" key={line.lineNumber}>
          {line.words.map(word => (
            <WordSpan
              key={word.id}
              word={word}
              onClick={() => handleWordClick(word)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function handleWordClick(word: Word) {
  console.log(`Surah ${word.surah}, Verse ${word.verse}`);
  // Each word has surah and verse built-in!
}
```

## Caching

Data is cached in memory after first load. Clear with:

```typescript
import { clearCache } from "@open-quran-view/core";

// Clear specific layout cache
clearCache("hafs-v2");

// Clear all caches
clearCache();
```
