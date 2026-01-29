# Data Generation Guide

> **Reference:** [Quran Foundation API Documentation](https://api-docs.quran.foundation/docs/quickstart)

## Overview

This document describes the scripts used to generate Quran page data, metadata, and fonts for the Open Quran View application.

## Generated Data Structure

```
src/data/
├── metadata/
│   ├── surahs.json    (114 surahs with names, revelation info, page ranges)
│   └── juz.json       (30 juz with verse ranges)
├── pages/
│   ├── hafs-unicode/  (604 pages with word positions)
│   ├── hafs-v2/       (604 pages with QCF v2 glyph codes)
│   └── hafs-v4/       (604 pages with QCF v4 glyph codes)
└── fonts/
    ├── hafs-v2/       (604 .woff2 files, ~25MB)
    └── hafs-v4/       (604 .woff2 files, ~25MB)
```

## Scripts

### 1. fetch-metadata.ts

Generates surah and juz metadata from the Quran.com API.

**Usage:**

```bash
pnpm run script:metadata
```

**Output:**

- `src/data/metadata/surahs.json` - All 114 surahs with:
  - id, nameSimple, nameComplex, nameArabic
  - versesCount, revelationPlace, revelationOrder
  - bismillahPre, pages, translatedName

- `src/data/metadata/juz.json` - All 30 juz with:
  - id, juzNumber, firstVerseId, lastVerseId
  - versesCount, verseMapping

### 2. fetch-pages.ts

Generates page data for all three Mushaf layouts from the Quran.com API.

**Mushaf Configurations:**

| ID | Name | Word Fields | Output |
|----|------|-------------|--------|
| 1 | Hafs QCF V2 | code_v2,text_qpc_hafs,line_number,page_number,position | hafs-v2 |
| 19 | Hafs QCF V4 Tajweed | code_v2,text_qpc_hafs,line_number,page_number,position | hafs-v4 |
| 5 | Hafs Unicode (QPC Hafs) | text_qpc_hafs,line_number,page_number,position | hafs-unicode |

**Usage:**

```bash
pnpm run script:pages
```

**Output:** Each layout produces `pages.json` with 604 pages:

```json
[
  {
    "pageNumber": 1,
    "lines": [
      {
        "lineNumber": 2,
        "words": [
          {
            "id": 1,
            "position": 1,
            "text": "ﱁ",
            "code_v2": "ﱁ",
            "pageNumber": 1,
            "charType": "word"
          }
        ],
        "metadata": {
          "verseId": 1,
          "verseKey": "1:1",
          "chapterId": 1
        }
      }
    ]
  }
]
```

### 3. download-fonts.ts

Downloads page-specific Quranic fonts from verses.quran.foundation.

**Font Sources:**

- V2: `https://verses.quran.foundation/fonts/quran/hafs/v2/woff2/p{PAGE}.woff2`
- V4: `https://verses.quran.foundation/fonts/quran/hafs/v4/colrv1/woff2/p{PAGE}.woff2`

**Usage:**

```bash
pnpm run script:fonts
```

**Output:**

- `src/data/fonts/hafs-v2/` - 604 .woff2 files
- `src/data/fonts/hafs-v4/` - 604 .woff2 files

**Note:** Fonts total ~50MB and may take several minutes to download.

## Environment Setup

Create a `.env` file with Quran.com API credentials:

```env
QURAN_CLIENT_ID=your_client_id
QURAN_CLIENT_SECRET=your_client_secret
```

Get credentials from: <https://quran.com/api>

## Run All Scripts

```bash
# Generate metadata
pnpm run script:metadata

# Generate page data
pnpm run script:pages

# Download fonts
pnpm run script:fonts
```

## Progress Indicators

All scripts use single-line progress with `\r` for clean output:

```
  Fetching surahs: 114/114
  Hafs QCF V2: 604/604
  Downloading QCF V2: 604/604 (604 ok, 0 failed)
```
