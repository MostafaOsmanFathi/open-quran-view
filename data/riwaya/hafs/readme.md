# Riwaya: Hafs (KFGQPC Uthmanic Data)

This folder contains the text and layout data for the **Hafs** recitation/script, sourced from the King Fahd Glorious Qur'an Printing Complex (KFGQPC).

## Data Information

- **Recitation (Riwaya):** Hafs
- **Font:** KFGQPC Hafs Uthmanic Script
- **Version:** 0.18
- **Date:** 2021-10-25
- **Update:** 10.0

### Modification History & Fixes

- **Verses/Text:**
  - Modified word (كلا) with (Alif Madd) for proper display across software and devices.
  - Added non-breaking spaces before aya marks in the `aya_text` column.
  - Added non-breaking spaces after jozz/hizb symbols.
  - Fixed shapes with final (ي) not rendering properly with Adobe products (e.g., Sura Al-Baqarah:18).
  - Modified word (فادارأتم) in Sura Al-Baqarah:72 for better platform compatibility.
  - Removed Kashida from various locations in `aya_text_emlaey` column.
  - Modified Sura Al-Baqarah:285 in `aya_text`.
- **Metadata/Layout:**
  - Adjusted Jozz numbers for Sura An-Naml (27) Aya 56-59 from (19) to (20).
  - Encoded files as UTF-8-BOM for improved compatibility.
  - Added Ayamark Symbol support for HTML rendering.

## Files

- `layout.csv`: Tabular data mapping verses to pages and lines.
- `metadata.json`: The same data in JSON format for easier application use.
- `fonts/`: Contains the specific KFGQPC fonts (WOFF2/TTF) required for this layout.

## Data Schema (Columns)

The data in `metadata.json` and `layout.csv` follows this structure:

| # | Column | Type | Description |
| :--- | :--- | :--- | :--- |
| 1 | `id` | int | Auto-increment unique identifier. |
| 2 | `jozz` | int | Juz' (Jozz) Number. |
| 3 | `sora_no` | int | Surah (Sora) Number (1-114). |
| 4 | `sora_name_en` | varchar | Surah Name in English transliteration. |
| 5 | `sora_name_ar` | varchar | Surah Name in Arabic (requires UthmanicHafs font). |
| 6 | `page` | int | Page Number in the Mushaf (1-604). |
| 7 | `line_start`| int | Starting line of the Verse (Aya) on the page. |
| 8 | `line_end` | int | Ending line of the Verse (Aya) on the page. |
| 9 | `aya_no` | int | Verse (Aya) Number within the Surah. |
| 10 | `aya_text` | text | Verse text rendered with KFGQPC UthmanicHafs font. |
| 11 | `aya_text_emlaey` | text | Emlaey (Simple) text for search and indexing. |

## Data Source

The original data and font files can be found at:
[thetruetruth/quran-data-kfgqpc (Hafs)](https://github.com/thetruetruth/quran-data-kfgqpc/blob/main/hafs/)
