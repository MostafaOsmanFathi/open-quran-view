# Layout Systems Research: open-quran-view

## KFGQPC Data Analysis Correction

**Date**: January 27, 2026
**Status**: VERIFIED

---

## Executive Summary

The `open-quran-view` library leverages layout data from both QUL (Hafs) and the KFGQPC repository. This research verifies that the KFGQPC data provides essential layout information for all 9 core recitations.

### What Each Recitation Folder Contains

```text
recitation-name/
├── text/
│   ├── csv/
│   │   └── hafs.csv (or warsh.csv, etc.)
│   │       Contains: id, jozz, sora, sora_name_en, sora_name_ar,
│   │                 page, line_start, line_end, aya_no,
│   │                 aya_text, aya_text_emlaey
│   ├── json/
│   ├── html/
│   ├── sql/
│   ├── xlsx/
│   └── xml/
└── font/
    ├── recitation.X.ttf
    ├── recitation.X.woff
    └── recitation.X.woff2
```

---

## Part 1: What the CSV Layout Data Provides

### CSV Structure Analysis

```csv
id,jozz,sora,sora_name_en,sora_name_ar,page,line_start,line_end,aya_no,aya_text,aya_text_emlaey

1,1,1,Al-Fātiḥah,الفَاتِحة,1,2,2,1,"بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ١","بسم الله الرحمن الرحيم"
```

### Fields Breakdown

| Field | Type | Description | Layout Value |
| :--- | :--- | :--- | :--- |
| `id` | Int | Sequential ayah ID | Indexing |
| `jozz` | Int | Juz number (1-30) | Layout metadata (Verified) |
| `sora` | Int | Surah number (1-114) | Text organization |
| `sora_name_en` | String | English surah name | Metadata |
| `sora_name_ar` | String | Arabic surah name | Metadata |
| **`page`** | **Int** | **Page number** | CRITICAL LAYOUT DATA |
| **`line_start`** | **Int** | **Starting line number** | CRITICAL LAYOUT DATA |
| **`line_end`** | **Int** | **Ending line number** | CRITICAL LAYOUT DATA |
| `aya_no` | Int | Ayah number within surah | Text organization |
| `aya_text` | String | Uthmanic script text | Text rendering |
| `aya_text_emlaey` | String | Simplified/Imla'i text | Search/accessibility |

### Key Discovery

The CSV provides **ayah-level layout data**:

- Which page each ayah appears on
- Which line(s) each ayah occupies
- Page and line boundaries for all 6,236 ayahs

---

## Part 2: Comparison of Layout Systems

### KFGQPC Layout (Ayah-Level)

**Granularity**: Ayah-level positioning

```text
Line 2-2: Ayah 1:1 (Al-Fatiha verse 1)
Line 3-3: Ayah 1:2 (Al-Fatiha verse 2)
Line 4-4: Ayah 1:3 (Al-Fatiha verse 3)
Line 4-4: Ayah 1:4 (Al-Fatiha verse 4) -- Same line!
Line 5-5: Ayah 1:5 (Al-Fatiha verse 5)
Line 5-6: Ayah 1:6 (Al-Fatiha verse 6) -- Spans 2 lines!
Line 6-8: Ayah 1:7 (Al-Fatiha verse 7) -- Spans 3 lines!
```

**What it provides**:

- Page number for each ayah
- Line range for each ayah
- Juz boundaries
- Ayah text (both Uthmanic and Imla'i)

**What it does NOT provide**:

- Word-by-word positioning
- Glyph coordinates (x, y positions)
- Character-level layout
- Exact pixel positioning

### QUL Layout (Word/Glyph-Level)

**Granularity**: Character/glyph-level positioning

```json
{
  "page": 1,
  "line": 2,
  "words": [
    {
      "position": 1,
      "text": "بِسۡمِ",
      "x": 450,
      "y": 120,
      "width": 60,
      "height": 40
    },
    {
      "position": 2,
      "text": "ٱللَّهِ",
      "x": 380,
      "y": 120,
      "width": 50,
      "height": 40
    }
  ]
}
```

**What it provides**:

- Page number
- Line number
- Word positioning
- Glyph coordinates (x, y, width, height)
- Exact character placement

---

## Part 3: Layout Comparison Table

| Feature | KFGQPC CSV | QUL Layout | open-quran-view |
| :--- | :--- | :--- | :--- |
| **Granularity** | Ayah-level | Word/glyph-level | Word/glyph-level |
| **Page numbers** | Yes | Yes | Yes |
| **Line numbers** | Yes (range) | Yes (exact) | Yes |
| **Word positions** | No | Yes | Yes |
| **Glyph coords** | No | Yes (x,y) | Yes |
| **Recitations** | 9 recitations | Hafs only | Hafs only |
| **Font system** | Unicode (1 file) | QPC glyph (604 files) | QCF4 (604 files) |
| **Use case** | Ayah lookup | Exact Mushaf rendering | Exact Mushaf rendering |

---

## Part 4: What You Can Build With KFGQPC Data

### Scenario 1: Ayah-Level Mushaf Display

**Possible**: YES

```typescript
interface AyahLayout {
  ayahId: number;
  surah: number;
  ayah: number;
  page: number;
  lineStart: number;
  lineEnd: number;
  text: string;
}

function getPageAyahs(pageNumber: number, recitation: string): AyahLayout[] {
  const csv = loadCSV(`${recitation}/text/csv/${recitation}.csv`);
  return csv.filter((row) => row.page === pageNumber);
}
```

**Limitations**:
- No exact word positioning within lines
- Cannot guarantee pixel-perfect match to printed Mushaf
- Line breaks within ayahs are approximate

### Scenario 2: Line-by-Line Display

**Possible**: YES

### Scenario 3: Search & Navigation

**Possible**: YES

---

## Part 5: Recitation-Specific Page Counts (Verified)

| Recitation | Pages | Status |
| :--- | :--- | :--- |
| **Hafs** | 604 | Complete |
| **Hafs Smart** | 604 | Complete |
| **Warsh** | 623 | Complete |
| **Qaloon** | 631 | Complete |
| **Shouba** | 604 | Complete |
| **Doori** | 605 | Complete |
| **Soosi** | 604 | Complete |
| **Bazzi** | 604 | Complete |
| **Qumbul** | 604 | Complete |

---

## Part 6: Example - Page 1 Comparison Across Recitations

### Hafs Page 1

```csv
id,jozz,sora,page,line_start,line_end,aya_no,aya_text
1,1,1,1,2,2,1,"بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ١"
2,1,1,1,3,3,2,"ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ٢"
```

---

## Part 7: Final Recommendations

The KFGQPC repository provides ayah-level page and line information for all 9 recitations. This is valuable for supporting multiple recitations where pixel-perfect word positioning is not required.

### Summary of Systems

1.  **QUL**: Word/glyph-level layout (Hafs only).
2.  **KFGQPC**: Ayah-level layout (9 recitations).
3.  **open-quran-view**: Uses QUL's glyph-level system for Hafs.

### Long-Term Strategy

- **Phase 1**: Keep current Hafs system (proven, pixel-perfect).
- **Phase 2**: Add KFGQPC support for other recitations (ayah-level).
- **Phase 3**: Transition other recitations to glyph-level as data becomes available.
