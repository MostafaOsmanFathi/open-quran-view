# open-quran-view Documentation

> [!TIP]
> Use the [**Documentation Index**](INDEX.md) for a categorized view of all available documents.

## Overview

A framework-agnostic Quran page rendering package that returns structured data for building Quran UI components.

---

## Quick Links

| Topic                                     | Description                            |
| ----------------------------------------- | -------------------------------------- |
| [Architecture](ARCHITECTURE.md)           | System architecture and modules        |
| [Data Structures](DATA_STRUCTURES.md)     | TypeScript interfaces and data formats |
| [Font Strategy](FONT_STRATEGY.md)         | QCF4 fonts, Hafs vs Warsh, Tajweed     |
| [API Reference](API_REFERENCE.md)         | Function documentation and examples    |
| [Usage Examples](USAGE_EXAMPLES.md)       | Vanilla JS, React, React Native        |
| [Package Structure](PACKAGE_STRUCTURE.md) | File organization                      |

---

## At a Glance

```typescript
import { getPageData } from "quran-core";

// Get page data
const page = getPageData(1);

// Render in your framework
page.lines.forEach((line) => {
  line.glyphs.forEach((glyph) => {
    console.log(glyph.char); // The Arabic character
  });
});
```

---

## Key Facts

| Attribute          | Value                                              |
| ------------------ | -------------------------------------------------- |
| **Publisher**      | KFGQPC (King Fahd Glorious Quran Printing Complex) |
| **Layout**         | KFGQPC V4 (1441H Print)                            |
| **Recitation**     | Hafs (Warsh supported when fonts available)        |
| **Pages**          | 604                                                |
| **Lines per page** | 15                                                 |
| **Total Surahs**   | 114                                                |
| **Font Mode**      | Standard or Tajweed                                |

> **Note:** QPC and KFGQPC are the same organization (Quran Printing Complex → King Fahd Glorious Quran Printing Complex). The fonts and layouts are identical.

---

## Installation

```bash
npm install quran-core
```

---

## Basic Usage

```typescript
import { getPageData, FontMode } from "quran-core";

// Standard mode (default)
const pageData = getPageData(1);

// Tajweed mode
const tajweedData = getPageData(1, { mode: "tajweed" });

// Access the data
console.log(pageData.pageNumber); // 1
console.log(pageData.lines.length); // 15
console.log(pageData.surahs); // [{ id: 1, name: 'الفاتحة', ... }]
console.log(pageData.fonts.required); // { basmalah, surah, page }
```

---

## Font System

The package uses **QCF4 (Quran Complex Font 4)** fonts:

```
assets/fonts/qcf4/
├── QCF4_QBSML.woff2              # Basmalah (بسم الله...)
├── QCF4_SURAH.woff2              # Surah names
├── QCF4_Hafs_001_W.woff2         # Page 1 (Hafs)
├── QCF4_Hafs_002_W.woff2         # Page 2
├── ...
├── QCF4_Hafs_604_W.woff2         # Page 604
├── QCF4_Tajweed_001_W.woff2      # Page 1 (Tajweed)
├── ...
└── QCF4_Tajweed_604_W.woff2      # Page 604 (Tajweed)
```

**Per page, load 3 fonts:**

1. `QCF4_QBSML.woff2` - Basmalah (always needed)
2. `QCF4_SURAH.woff2` - Surah names (always needed)
3. `QCF4_Hafs_XXX_W.woff2` - Page-specific text

---

## Supported Recitations

| Recitation | Status         | Font Files             |
| ---------- | -------------- | ---------------------- |
| **Hafs**   | ✅ Ready       | QCF4_Hafs_XXX_W.woff2  |
| **Warsh**  | 🔲 Needs fonts | QCF4_Warsh_XXX_W.woff2 |

---

## Framework Support

| Framework     | Support | Notes                              |
| ------------- | ------- | ---------------------------------- |
| Vanilla JS    | ✅ Full | Use returned data to render        |
| React         | ✅ Full | React component wrapper available  |
| React Native  | ✅ Full | Native component wrapper available |
| Vue           | ✅ Full | Use returned data                  |
| Web Component | ✅ Full | Native `<quran-page>` available    |

---

## Data Flow

```
┌─────────────────────────────────────────────────┐
│              quran-core package                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   data-loader.ts                                │
│   ├── Load CSV/JSON files                       │
│   └── Parse into objects                        │
│              ↓                                  │
│   page-builder.ts                               │
│   ├── Group glyphs by line                      │
│   ├── Add metadata (juz, pageFace)              │
│   └── Return QuranPageData                      │
│              ↓                                  │
│   index.ts (Main Export)                        │
│   ├── getPageData(page, options)                │
│   ├── getPageFromAyah(surah, ayah)              │
│   └── getAyahPosition(surah, ayah)              │
│                                                 │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│              Your Application                   │
│                                                 │
│   const data = getPageData(1);                  │
│   // Render however you want!                   │
│   // <span>, <Text>, <View>, etc.               │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## License

MIT License
