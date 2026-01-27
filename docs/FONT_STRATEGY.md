# Font Strategy

## Overview

The Quran is rendered using **QCF4 (Quran Complex Font 4)** fonts developed by **KFGQPC**. This document explains the font system, including QPC vs KFGQPC, Hafs vs Warsh recitations, and Standard vs Tajweed modes.

---

## Data Sources

### Primary Source: Quranic Universal Library (QUL)

This project uses data from the **Quranic Universal Library** (QUL) by TarteelAI:

- **Website:** https://qul.tarteel.ai/
- **GitHub:** https://github.com/TarteelAI/quranic-universal-library
- **Resources:** 19 mushaf layouts, 17 font packages, translations, tafsirs, and more

### QUL Resources Used

| Resource        | Source                         | Status      |
| --------------- | ------------------------------ | ----------- |
| **Layout Data** | KFGQPC V4 (1441H Print)        | ✅ Official |
| **Fonts**       | QCF4 Hafs                      | ✅ Official |
| **Tafseer**     | Arabic Muyassar, English Sahih | ✅ Official |

---

## Mushaf Layouts Available on QUL

QUL provides **19 mushaf layouts** (12 approved, 7 WIP):

### KFGQPC Madani Layouts (Standard Arabic)

| Layout Version | Print Year | Lines | Status      |
| -------------- | ---------- | ----- | ----------- |
| KFGQPC V1      | 1405H      | 15    | ✅ Approved |
| KFGQPC V2      | 1421H      | 15    | ✅ Approved |
| KFGQPC V4      | 1441H      | 15    | ✅ Approved |

### Indopak Layouts (South Asian Script)

| Layout                | Lines | Status      |
| --------------------- | ----- | ----------- |
| Indopak (Qudratullah) | 15    | ✅ Approved |
| Indopak (Taj Company) | 13    | ✅ Approved |
| Indopak (Taj Company) | 16    | ✅ Approved |
| KFGQPC Nastaleeq      | 15    | ✅ Approved |

### Our Selection

**This project uses KFGQPC V4 (1441H Print)** layout because:

- Most recent official print from King Fahd Complex
- Standard 15-line format
- Widely used in digital Quran applications
- Compatible with QCF4 fonts

---

## QPC vs KFGQPC - Same Organization!

**QPC** and **KFGQPC** are the **SAME organization** - just different names over time:

| Name       | Full Name                                 | Status                |
| ---------- | ----------------------------------------- | --------------------- |
| **QPC**    | Quran Printing Complex                    | Old abbreviation      |
| **KFGQPC** | King Fahd Glorious Quran Printing Complex | Current official name |

### What This Means

```
QPC (Old Name)
    ↓
KFGQPC (New Name - Current)
    ↓
Same Fonts, Same Layouts, Same Everything!
```

### Common Misconception

| Misconception                                | Reality               |
| -------------------------------------------- | --------------------- |
| "QPC and KFGQPC are different"               | ❌ Same organization  |
| "QPC fonts are different from KFGQPC fonts"  | ❌ Same QCF4 fonts    |
| "QPC layout is different from KFGQPC layout" | ❌ Same mushaf layout |

### Our Package

| Component     | Source                                    | Status      |
| ------------- | ----------------------------------------- | ----------- |
| **Layout**    | KFGQPC V4 (1441H Print)                   | ✅ Official |
| **Fonts**     | QCF4 Hafs                                 | ✅ Official |
| **Publisher** | King Fahd Glorious Quran Printing Complex | ✅ Official |

---

## Font System

### QCF4 Font Structure

The QCF4 font system is divided into **604 parts** (one per mushaf page):

```
assets/fonts/qcf4/
├── QCF4_QBSML.woff2              # Basmalah (بسم الله...)
├── QCF4_SURAH.woff2              # Surah names (الفاتحة, البقرة, etc.)
├── QCF4_Hafs_001_W.woff2         # Page 1 (Hafs - Standard)
├── QCF4_Hafs_002_W.woff2         # Page 2 (Hafs - Standard)
├── ...
├── QCF4_Hafs_604_W.woff2         # Page 604 (Hafs - Standard)
├── QCF4_Tajweed_001_W.woff2      # Page 1 (Hafs - Tajweed)
├── QCF4_Tajweed_002_W.woff2      # Page 2 (Hafs - Tajweed)
├── ...
├── QCF4_Tajweed_604_W.woff2      # Page 604 (Hafs - Tajweed)
├── QCF4_Warsh_001_W.woff2        # Page 1 (Warsh - when available)
├── QCF4_Warsh_002_W.woff2        # Page 2 (Warsh - when available)
├── ...
└── QCF4_Warsh_604_W.woff2        # Page 604 (Warsh - when available)
```

### Why 604 Font Files?

Each page has its own font file because:

1. **Smaller bundle size** - Load only the font you need
2. **Faster loading** - No need to download 5MB+ font file
3. **Page isolation** - Each page is self-contained
4. **Tajweed separation** - Standard and tajweed versions are separate

---

## Font Categories

### 1. Shared Fonts (Used on All Pages)

| Font File          | Content                           | Usage         |
| ------------------ | --------------------------------- | ------------- |
| `QCF4_QBSML.woff2` | Basmalah (بسم الله الرحمن الرحيم) | Type 4 glyphs |
| `QCF4_SURAH.woff2` | Surah names                       | Type 5 glyphs |

### 2. Page-Specific Fonts

| Font Pattern               | Content                        | Usage           |
| -------------------------- | ------------------------------ | --------------- |
| `QCF4_Hafs_XXX_W.woff2`    | Page XXX text (Hafs, Standard) | Type 1, 2, 6, 7 |
| `QCF4_Tajweed_XXX_W.woff2` | Page XXX text (Hafs, Tajweed)  | Type 1, 2, 6, 7 |
| `QCF4_Warsh_XXX_W.woff2`   | Page XXX text (Warsh)          | Type 1, 2, 6, 7 |

---

## Font Modes

### Standard Mode (Default)

Standard rendering without tajweed colors.

```typescript
const standardConfig: FontConfig = {
  mode: "standard",
  recitation: "hafs",
  fonts: {
    basmalah: "QCF4_QBSML.woff2",
    surah: "QCF4_SURAH.woff2",
    page: "QCF4_Hafs_001_W.woff2",
  },
};
```

### Tajweed Mode

Text with tajweed coloration (colors embedded in font).

```typescript
const tajweedConfig: FontConfig = {
  mode: "tajweed",
  recitation: "hafs",
  fonts: {
    basmalah: "QCF4_QBSML.woff2",
    surah: "QCF4_SURAH.woff2",
    page: "QCF4_Tajweed_001_W.woff2",
  },
};
```

#### Tajweed Colors

When using tajweed mode, the font contains pre-colored glyphs:

| Tajweed Rule | Color     | Description        |
| ------------ | --------- | ------------------ |
| Ikhfa        | 🔴 Red    | Hidden letters     |
| Idgham       | 🟢 Green  | Merging letters    |
| Iqlab        | 🔵 Blue   | Conversion letters |
| Ghunna       | 🟡 Yellow | Nasal sound        |
| Madd         | 🟣 Purple | Elongation         |

---

## Recitations

### Hafs (Current - Ready)

The standard Hafs recitation from Nafi' al-Madani.

```typescript
// Hafs mode (default)
const hafsConfig: FontConfig = {
  mode: "standard",
  recitation: "hafs",
  fonts: {
    basmalah: "QCF4_QBSML.woff2",
    surah: "QCF4_SURAH.woff2",
    page: "QCF4_Hafs_001_W.woff2",
  },
};
```

### Warsh (Future - Needs Fonts)

The Warsh recitation from Nafi' al-Madani (different transmission).

```typescript
// Warsh mode (when fonts available)
const warshConfig: FontConfig = {
  mode: "standard",
  recitation: "warsh",
  fonts: {
    basmalah: "QCF4_Warsh_QBSML.woff2",
    surah: "QCF4_Warsh_SURAH.woff2",
    page: "QCF4_Warsh_001_W.woff2",
  },
};
```

#### Hafs vs Warsh

| Aspect           | Hafs                  | Warsh                  |
| ---------------- | --------------------- | ---------------------- |
| **Reciter**      | Hafs ibn Sulaiman     | War-sh ibn al-Mughirah |
| **Transmission** | Nafi' al-Madani       | Nafi' al-Madani        |
| **Font Files**   | QCF4_Hafs_XXX_W.woff2 | QCF4_Warsh_XXX_W.woff2 |
| **Layout Data**  | quran_layout.csv      | quran_layout_warsh.csv |
| **Glyph Shapes** | Standard Hafs         | Different Warsh shapes |
| **Status**       | ✅ Ready              | 🔲 Needs fonts         |

---

## Font Loading

### Per Page: 3 Fonts Maximum

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

// Example for Page 283 in standard mode:
const fonts = {
  basmalah: "QCF4_QBSML.woff2",
  surah: "QCF4_SURAH.woff2",
  page: "QCF4_Hafs_283_W.woff2",
};
```

### Font Loading Example

```typescript
async function loadFonts(fonts: FontConfig["required"]) {
  // Load basmalah font
  const basmalahStyle = document.createElement("style");
  basmalahStyle.textContent = `
    @font-face {
      font-family: 'quran-basmalah';
      src: url('/fonts/qcf4/${fonts.basmalah}');
    }
  `;
  document.head.appendChild(basmalahStyle);

  // Load surah font
  const surahStyle = document.createElement("style");
  surahStyle.textContent = `
    @font-face {
      font-family: 'quran-surah';
      src: url('/fonts/qcf4/${fonts.surah}');
    }
  `;
  document.head.appendChild(surahStyle);

  // Load page font
  const pageStyle = document.createElement("style");
  pageStyle.textContent = `
    @font-face {
      font-family: 'quran-page';
      src: url('/fonts/qcf4/${fonts.page}');
    }
  `;
  document.head.appendChild(pageStyle);
}
```

---

## Character Rendering

### Unicode Mapping

Each glyph in the CSV has a `fontCode` that maps to a character position in the font:

```typescript
// QCF4 fonts use Unicode Private Use Area starting at 0xF100 (61696)
const unicodeChar = 61696 + glyph.fontCode;
const character = String.fromCharCode(unicodeChar);

// Examples:
glyph.fontCode = 0   → Character = 61696 + 0 = 0xF100  → 'ا'
glyph.fontCode = 1   → Character = 61696 + 1 = 0xF101  → 'ل'
glyph.fontCode = 4   → Character = 61696 + 4 = 0xF104  → '۝'
```

---

## Font File Sizes

```
assets/fonts/qcf4/
│
├── QCF4_QBSML.woff2              # ~45 KB - Basmalah (shared)
├── QCF4_SURAH.woff2              # ~45 KB - Surah names (shared)
│
├── QCF4_Hafs_001_W.woff2         # ~8 KB - Page 1 (standard)
├── QCF4_Hafs_002_W.woff2         # ~8 KB - Page 2 (standard)
├── QCF4_Hafs_003_W.woff2         # ~8 KB - Page 3 (standard)
│   ...
├── QCF4_Hafs_604_W.woff2         # ~8 KB - Page 604 (standard)
│
├── QCF4_Tajweed_001_W.woff2      # ~8 KB - Page 1 (tajweed)
├── QCF4_Tajweed_002_W.woff2      # ~8 KB - Page 2 (tajweed)
│   ...
├── QCF4_Tajweed_604_W.woff2      # ~8 KB - Page 604 (tajweed)
│
├── QCF4_Warsh_001_W.woff2        # ~8 KB - Page 1 (warsh) [when available]
├── QCF4_Warsh_002_W.woff2        # ~8 KB - Page 2 (warsh) [when available]
│   ...
└── QCF4_Warsh_604_W.woff2        # ~8 KB - Page 604 (warsh) [when available]

Total (Hafs only): ~4.9 MB (604 × 8 KB + 90 KB shared)
Total (Hafs + Tajweed): ~9.8 MB
Total (All recitations): ~14.7 MB
```

---

## QUL Font Resources

QUL provides **17 font packages** for Quran rendering:

### Available Font Types on QUL

| Font Category     | Description                           | Formats    |
| ----------------- | ------------------------------------- | ---------- |
| **QCF4 Hafs**     | Standard QCF4 fonts (Hafs recitation) | WOFF2, TTF |
| **QCF4 Tajweed**  | Tajweed-colored QCF4 fonts            | WOFF2, TTF |
| **QCF4 Warsh**    | Warsh recitation fonts                | WOFF2, TTF |
| **Indopak Fonts** | Nastaleeq script fonts                | OTF, TTF   |
| **Unicode Quran** | Standard Unicode Arabic fonts         | TTF        |

### Getting Fonts from QUL

1. Visit: https://qul.tarteel.ai/resources
2. Filter by: "Quran Fonts"
3. Download: QCF4 Hafs or QCF4 Tajweed package
4. Extract and organize by page number

### Alternative Font Sources

| Source                | URL                          | Notes           |
| --------------------- | ---------------------------- | --------------- |
| **QuranFont.com**     | https://quranfont.com/       | Paid (~ $30-50) |
| **King Fahd Complex** | https://qurancomplex.gov.sa/ | Official source |
| **QUL GitHub**        | See QUL resources            | Free downloads  |

---

## Getting Warsh Fonts

### Option A: QuranFont.com (Recommended)

**Website:** https://quranfont.com/

- QCF Warsh Font Pack
- Price: ~$30-50 USD
- Includes all 604 page fonts + basmalah + surah names

### Option B: GitHub (Free)

Search for these repositories:

```
qcf4 warsh 604
quran warsh font split
kfgqpc warsh fonts
```

### Option C: King Fahd Complex

**Website:** https://qurancomplex.gov.sa/

- Official source
- Sometimes requires registration
- May need to split fonts yourself

---

## Layout Differences

### Mushaf Al-Madinah vs KFGQPC V4

| Surah             | Mushaf Al-Madinah (V2) | KFGQPC V4 (1441H) |
| ----------------- | ---------------------- | ----------------- |
| Al-Ahqaf (46)     | Page 440               | Page 502          |
| Al-Ghashiyah (88) | Page 604               | Page 592          |

**Your data uses KFGQPC V4 (1441H) layout.**

---

## Font Configuration API

### getPageData with Font Options

```typescript
import { getPageData, FontMode, Recitation } from "quran-core";

// Standard Hafs (default)
getPageData(1);

// Tajweed Hafs
getPageData(1, { mode: "tajweed" });

// Custom font families
getPageData(1, {
  mode: "standard",
  fontFamilies: {
    basmalah: "my-basmalah-font",
    surah: "my-surah-font",
    page: "my-page-font",
  },
});

// Warsh (when fonts available)
getPageData(1, { recitation: "warsh" });
```
