# Quran Core Package Documentation

## Overview

A framework-agnostic Quran page rendering package that returns structured data for building Quran UI components.

---

## Font Strategy

### QCF4 Font System

The Quran is rendered using **QCF4 (Quran Complex Font 4)** fonts, which are **divided into 604 parts** (one per mushaf page).

```
assets/fonts/qcf4/
├── QCF4_QBSML.woff2              # Basmalah only (بسم الله...)
├── QCF4_SURAH.woff2              # Surah names (الفاتحة, البقرة, etc.)
├── QCF4_Hafs_01_W.woff2          # Page 1 (standard)
├── QCF4_Hafs_02_W.woff2          # Page 2
├── QCF4_Hafs_03_W.woff2          # Page 3
...
├── QCF4_Hafs_604_W.woff2         # Page 604
├── QCF4_Tajweed_01_W.woff2       # Page 1 (with tajweed colors)
├── QCF4_Tajweed_02_W.woff2       # Page 2
...
└── QCF4_Tajweed_604_W.woff2      # Page 604 (with tajweed colors)
```

### Font File Mapping

| Font File                 | Usage     | Content                             |
| ------------------------- | --------- | ----------------------------------- |
| `QCF4_QBSML.woff2`        | All pages | Basmalah (بسم الله الرحمن الرحيم)   |
| `QCF4_SURAH.woff2`        | All pages | Surah names (الفاتحة, البقرة, etc.) |
| `QCF4_Hafs_XX_W.woff2`    | Page XX   | Standard text (no colors)           |
| `QCF4_Tajweed_XX_W.woff2` | Page XX   | Text with tajweed coloration        |

### Font Modes

```typescript
type FontMode = "standard" | "tajweed";

interface FontConfig {
  mode: FontMode;
  fonts: {
    basmalah: string; // QCF4_QBSML.woff2
    surah: string; // QCF4_SURAH.woff2
    page: string; // QCF4_Hafs_XXX_W.woff2 or QCF4_Tajweed_XXX_W.woff2
  };
}

// Standard mode (no colors)
const standardConfig: FontConfig = {
  mode: "standard",
  fonts: {
    basmalah: "QCF4_QBSML.woff2",
    surah: "QCF4_SURAH.woff2",
    page: "QCF4_Hafs_001_W.woff2",
  },
};

// Tajweed mode (colored)
const tajweedConfig: FontConfig = {
  mode: "tajweed",
  fonts: {
    basmalah: "QCF4_QBSML.woff2",
    surah: "QCF4_SURAH.woff2",
    page: "QCF4_Tajweed_001_W.woff2",
  },
};
```

### Why 604 Font Files?

Each page has its own font file because:

1. **Smaller bundle size** - Load only the font you need
2. **Faster loading** - No need to download 5MB+ font file
3. **Page isolation** - Each page is self-contained
4. **Tajweed separation** - Standard and tajweed versions are separate

### Font Loading Strategy

```typescript
// For each page, load 3 fonts:
const requiredFonts = {
  basmalah: "QCF4_QBSML.woff2", // Always needed
  surah: "QCF4_SURAH.woff2", // Always needed
  page:
    mode === "tajweed"
      ? `QCF4_Tajweed_${pageNumber.toString().padStart(3, "0")}_W.woff2`
      : `QCF4_Hafs_${pageNumber.toString().padStart(3, "0")}_W.woff2`,
};

// Example for Page 283 in tajweed mode:
const fonts = {
  basmalah: "QCF4_QBSML.woff2",
  surah: "QCF4_SURAH.woff2",
  page: "QCF4_Tajweed_283_W.woff2",
};
```

### Character Rendering

Each glyph in the CSV has a `fontCode` that maps to a character position in the font:

```typescript
// QCF4 fonts use Unicode Private Use Area starting at 0xF100 (61696)
const unicodeChar = 61696 + glyph.fontCode;
const character = String.fromCharCode(unicodeChar);
```

### Tajweed Colors

When using tajweed mode, the font contains pre-colored glyphs:

| Tajweed Rule | Color     | Description        |
| ------------ | --------- | ------------------ |
| Ikhfa        | 🔴 Red    | Hidden letters     |
| Idgham       | 🟢 Green  | Merging letters    |
| Iqlab        | 🔵 Blue   | Conversion letters |
| Ghunna       | 🟡 Yellow | Nasal sound        |
| Madd         | 🟣 Purple | Elongation         |

---

## Data Structures

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

### FontSource

```typescript
type FontSource = "basmalah" | "surah" | "page";
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

### QuranPageData

Complete page data structure.

```typescript
interface QuranPageData {
  /** Page number (1-604) */
  pageNumber: number;

  /** Surahs on this page */
  surahs: Array<{
    id: number;
    name: string;
    startPage: number;
    endPage: number;
  }>;

  /** All 15 lines */
  lines: QuranLine[];

  /** Page metadata */
  metadata: {
    /** Juz number (1-30) */
    juz: number;

    /** Page position in the mushaf */
    pageFace: "right" | "left";
  };

  /** Font configuration for this page */
  fonts: {
    /** Font mode (standard or tajweed) */
    mode: FontMode;

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
  };
}
```

---

## API Reference

### getPageData(pageNumber, options?)

Get complete structured data for a specific page.

```typescript
import { getPageData, FontMode } from "quran-core";

// Standard mode (default)
const pageData = getPageData(1);

// Tajweed mode
const tajweedData = getPageData(1, { mode: "tajweed" });

// Custom font families
const customData = getPageData(1, {
  mode: "standard",
  fontFamilies: {
    basmalah: "quran-basmalah",
    surah: "quran-surah",
    page: "quran-page",
  },
});

console.log(pageData);
/*
{
  pageNumber: 1,
  surahs: [{ id: 1, name: 'الفاتحة', startPage: 1, endPage: 1 }],
  lines: [
    {
      lineNumber: 1,
      isCentered: false,
      glyphs: [
        {
          char: 'ا',
          surah: 1,
          ayah: 0,
          fontCode: 0,
          type: 5,
          fontSource: 'surah',
          isHighlightable: false
        }
      ]
    },
    // ... 14 more lines
  ],
  metadata: {
    juz: 1,
    pageFace: 'right'
  },
  fonts: {
    mode: 'standard',
    required: {
      basmalah: 'QCF4_QBSML.woff2',
      surah: 'QCF4_SURAH.woff2',
      page: 'QCF4_Hafs_001_W.woff2'
    },
    fontFamilies: {
      basmalah: 'quran-basmalah',
      surah: 'quran-surah',
      page: 'quran-page'
    }
  }
}
*/
```

### Options

```typescript
interface GetPageOptions {
  /** Font mode: standard or tajweed */
  mode?: FontMode;

  /** Custom font family names */
  fontFamilies?: {
    basmalah?: string;
    surah?: string;
    page?: string;
  };
}
```

### getPageFromAyah(surah, ayah)

Find which page contains a specific ayah.

```typescript
import { getPageFromAyah } from "quran-core";

const page = getPageFromAyah(2, 255); // Ayat Al-Kursi
console.log(page); // 283
```

### getAyahPosition(surah, ayah)

Get detailed position of an ayah.

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

## Usage Examples

### Vanilla JavaScript

```javascript
import { getPageData } from "quran-core";

async function renderPage(pageNumber, options = {}) {
  const data = getPageData(pageNumber, options);

  // Load fonts
  await loadFonts(data.fonts);

  // Render each line
  data.lines.forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.className = "quran-line";
    if (line.isCentered) lineEl.classList.add("centered");

    line.glyphs.forEach((glyph) => {
      const span = document.createElement("span");
      span.textContent = glyph.char;
      span.dataset.surah = glyph.surah;
      span.dataset.ayah = glyph.ayah;

      // Apply correct font family based on glyph source
      span.style.fontFamily = data.fonts.fontFamilies[glyph.fontSource];

      if (glyph.isHighlightable) {
        span.classList.add("quran-word");
        span.addEventListener("click", () => {
          console.log("Clicked:", glyph.surah, glyph.ayah);
        });
      }

      lineEl.appendChild(span);
    });

    document.getElementById("page").appendChild(lineEl);
  });
}

async function loadFonts(fonts) {
  // Load basmalah font
  const basmalahStyle = document.createElement("style");
  basmalahStyle.textContent = `
    @font-face {
      font-family: '${fonts.fontFamilies.basmalah}';
      src: url('/fonts/qcf4/${fonts.required.basmalah}');
    }
  `;
  document.head.appendChild(basmalahStyle);

  // Load surah font
  const surahStyle = document.createElement("style");
  surahStyle.textContent = `
    @font-face {
      font-family: '${fonts.fontFamilies.surah}';
      src: url('/fonts/qcf4/${fonts.required.surah}');
    }
  `;
  document.head.appendChild(surahStyle);

  // Load page font
  const pageStyle = document.createElement("style");
  pageStyle.textContent = `
    @font-face {
      font-family: '${fonts.fontFamilies.page}';
      src: url('/fonts/qcf4/${fonts.required.page}');
    }
  `;
  document.head.appendChild(pageStyle);
}

// Usage
renderPage(1); // Standard mode
renderPage(1, { mode: "tajweed" }); // Tajweed mode
```

### React Component

```tsx
import React from 'react';
import { getPageData, FontMode } from 'quran-core';
import './QuranPage.css';

interface QuranPageProps {
  page: number;
  mode?: FontMode;
  onPress?: (surah: number, ayah: number) => void;
  onLongPress?: (surah: number, ayah: number) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({
  page,
  mode = 'standard',
  onPress,
  onLongPress
}) => {
  const data = getPageData(page, { mode });

  return (
    <div className={`quran-page page-${data.metadata.pageFace}`}>
      {/* Header */}
      <header className="page-header">
        <span className="juz">الجُزْءُ {data.metadata.juz}</span>
        <span className="surah">
          سُورَةُ {data.surahs.map(s => s.name).join(' - ')}
        </span>
      </header>

      {/* Lines */}
      <div className="page-content">
        {data.lines.map(line => (
          <div
            key={line.lineNumber}
            className={`quran-line ${line.isCentered ? 'centered' : ''}`}
          >
            {line.glyphs.map((glyph, index) => (
              <span
                key={index}
                className={`quran-glyph ${glyph.isHighlightable ? 'highlightable' : ''}`}
                style={{ fontFamily: data.fonts.fontFamilies[glyph.fontSource] }}
                data-surah={glyph.surah}
                data-ayah={glyph.ayah}
                onClick={() => onPress?.(glyph.surah, glyph.ayah)}
                onContextMenu={() => onLongPress?.(glyph.surah, glyph.ayah)}
              >
                {glyph.char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="page-footer">
        <span className="page-number">{page}</span>
      </footer>
    </div>
  );
};

// Usage
<QuranPage page={1} />                           // Standard mode
<QuranPage page={1} mode="tajweed" />           // Tajweed mode
<QuranPage page={1} onPress={(s, a) => {}} />   // With click handler
```

### React Native

```tsx
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { getPageData } from "quran-core";

interface QuranPageProps {
  page: number;
  onPress?: (surah: number, ayah: number) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({ page, onPress }) => {
  const data = getPageData(page);

  return (
    <View style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>
        سُورَةُ {data.surahs.map((s) => s.name).join(" - ")}
      </Text>

      {/* Lines */}
      <View style={styles.content}>
        {data.lines.map((line) => (
          <View key={line.lineNumber} style={styles.line}>
            {line.glyphs.map((glyph, index) => (
              <Text
                key={index}
                style={styles.glyph}
                onPress={() => onPress?.(glyph.surah, glyph.ayah)}
              >
                {glyph.char}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f5dc" },
  header: { fontSize: 18, textAlign: "center", marginVertical: 10 },
  content: { flex: 1 },
  line: { flexDirection: "row", flexWrap: "wrap" },
  glyph: { fontSize: 24 },
});
```

---

## CSS Styling

```css
/* Page container */
.quran-page {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f5dc;
  direction: rtl;
}

/* Page face (odd = right, even = left) */
.quran-page.page-right {
  /* Odd pages - right side of book */
}

.quran-page.page-left {
  /* Even pages - left side of book */
}

/* Lines */
.quran-line {
  min-height: 40px;
  display: flex;
  align-items: center;
}

.quran-line.centered {
  justify-content: center;
}

/* Glyphs - font family set inline via data.fonts.fontFamilies */
.quran-glyph {
  font-size: 24px;
  margin: 0 1px;
}

.quran-glyph.highlightable {
  cursor: pointer;
}

.quran-glyph.highlightable:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Header/Footer */
.page-header,
.page-footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-size: 14px;
  color: #666;
}

/* Tajweed mode colors (if using standard fonts with CSS coloring) */
.quran-glyph[data-tajweed="ikhfa"] {
  color: #e74c3c;
}
.quran-glyph[data-tajweed="idgham"] {
  color: #27ae60;
}
.quran-glyph[data-tajweed="iqlab"] {
  color: #3498db;
}
.quran-glyph[data-tajweed="ghunna"] {
  color: #f1c40f;
}
.quran-glyph[data-tajweed="madd"] {
  color: #9b59b6;
}
```

---

## Font File Structure

```
assets/fonts/qcf4/
│
├── QCF4_QBSML.woff2              # ~45 KB - Basmalah (بسم الله...)
├── QCF4_SURAH.woff2              # ~45 KB - Surah names
│
├── QCF4_Hafs_001_W.woff2         # ~8 KB - Page 1 (standard)
├── QCF4_Hafs_002_W.woff2         # ~8 KB - Page 2 (standard)
├── QCF4_Hafs_003_W.woff2         # ~8 KB - Page 3 (standard)
│   ...
├── QCF4_Hafs_100_W.woff2         # ~8 KB - Page 100 (standard)
│   ...
├── QCF4_Hafs_604_W.woff2         # ~8 KB - Page 604 (standard)
│
├── QCF4_Tajweed_001_W.woff2      # ~8 KB - Page 1 (tajweed)
├── QCF4_Tajweed_002_W.woff2      # ~8 KB - Page 2 (tajweed)
├── QCF4_Tajweed_003_W.woff2      # ~8 KB - Page 3 (tajweed)
│   ...
├── QCF4_Tajweed_604_W.woff2      # ~8 KB - Page 604 (tajweed)
│
Total: ~9.6 MB
  - Standard: ~4.8 MB (604 × 8 KB)
  - Tajweed: ~4.8 MB (604 × 8 KB)
  - Shared: ~90 KB (QBSML + SURAH)
```

---

## Data Files

```
data/
├── quran_layout.csv              # 88,439 glyphs - Position of each character
├── suwar.json                    # 114 surahs - Names and metadata
├── page_mapping.json             # 604 pages - Surah/ayah per page
└── mushaf_metadata.json          # Juz pages, centered lines, etc.
```

---

## Package Structure

```
quran-core/
├── src/
│   ├── index.ts                  # Main exports
│   ├── types.ts                  # TypeScript interfaces
│   ├── data-loader.ts            # Load CSV/JSON files
│   ├── page-builder.ts           # Build QuranPageData
│   └── font-utils.ts             # Font URL helpers
├── data/
│   ├── quran_layout.csv
│   ├── suwar.json
│   ├── page_mapping.json
│   └── mushaf_metadata.json
├── assets/
│   └── fonts/
│       └── qcf4/
│           ├── QCF4_QBSML.woff2              # Basmalah
│           ├── QCF4_SURAH.woff2              # Surah names
│           ├── QCF4_Hafs_001_W.woff2         # Page 1 (standard)
│           ├── QCF4_Hafs_002_W.woff2         # Page 2 (standard)
│           ├── ... (602 more standard files)
│           ├── QCF4_Hafs_604_W.woff2         # Page 604 (standard)
│           ├── QCF4_Tajweed_001_W.woff2      # Page 1 (tajweed)
│           ├── QCF4_Tajweed_002_W.woff2      # Page 2 (tajweed)
│           ├── ... (602 more tajweed files)
│           └── QCF4_Tajweed_604_W.woff2      # Page 604 (tajweed)
├── package.json
└── tsconfig.json
```

---

## Installation

```bash
npm install quran-core
```

---

## Dependencies

- None (pure TypeScript/JavaScript)

---

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ with polyfills

---

## Performance

- **Initial load:** ~50KB (data files)
- **Per page:** ~16KB (2 font files)
- **Parse time:** < 1ms per page
- **Memory:** ~10MB for all data

---

## License

MIT License
