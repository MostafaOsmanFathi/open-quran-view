# Resources and Data

This document describes the external resources, fonts, and data files used by `open-quran-view`.

## Data Sources

The project consumes data from the **Quranic Universal Library (QUL)** by TarteelAI.

- **Website**: [qul.tarteel.ai](https://qul.tarteel.ai/)
- **GitHub**: [TarteelAI/quranic-universal-library](https://github.com/TarteelAI/quranic-universal-library)

### Selected Layout

We use the **KFGQPC V4 (1441H Print)** layout. This is the latest official print from the King Fahd Glorious Quran Printing Complex, featuring a standard 15-line format.

## Font System

### QCF4 Fonts

The library utilizes **Quran Complex Font 4 (QCF4)**. These fonts are provided in a split format (one file per page) to optimize web loading times.

#### Storage Structure

```text
assets/fonts/qcf4/
├── QCF4_QBSML.woff2              # Shared: Basmalah (بسم الله...)
├── QCF4_SURAH.woff2              # Shared: Surah names
├── QCF4_Hafs_001_W.woff2         # Page 1 (Hafs recitation)
├── QCF4_Hafs_002_W.woff2         # Page 2
└── QCF4_Tajweed_001_W.woff2      # Page 1 (Tajweed colored)
```

### Font Loading Strategy

To render a single page, the library expects 3 font files to be available:

1. **Shared Basmalah**: `QCF4_QBSML.woff2`
2. **Shared Surah Names**: `QCF4_SURAH.woff2`
3. **Page Text**: `QCF4_[Recitation]_[Page]_W.woff2`

To render a single page, the library expects 3 font files to be available:

1.  **Shared Basmalah**: `QCF4_QBSML.woff2`
2.  **Shared Surah Names**: `QCF4_SURAH.woff2`
3.  **Page Text**: `QCF4_[Recitation]_[Page]_W.woff2`

### Character Mapping

Glyphs are mapped to the Unicode Private Use Area (PUA) starting at `0xF100` (61696).

```javascript
const unicodeChar = 61696 + glyph.fontCode;
const character = String.fromCharCode(unicodeChar);
```

## Data Files

The logic in `src/core` relies on several key files located in the `data/` directory:

| File | Purpose |
| :--- | :--- |
| `quran_layout.csv` | Coordinates and glyph metadata for 88,439 characters. |
| `suwar.json` | Metadata for the 114 Surahs (names, start/end pages). |
| `page_mapping.json` | Ayah-to-page relationships for all 604 pages. |
| `mushaf_metadata.json` | Juz boundaries and layout-specific metadata. |

## Organization Naming

**QPC** (Quran Printing Complex) and **KFGQPC** (King Fahd Glorious Quran Printing Complex) refer to the same organization. "KFGQPC" is the current official name.
