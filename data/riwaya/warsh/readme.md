# Riwaya: Warsh (KFGQPC Uthmanic Data)

This folder contains the text and layout data for the **Warsh** recitation/script, sourced from the King Fahd Glorious Qur'an Printing Complex (KFGQPC).

## Data Information

- **Recitation (Riwaya):** Warsh
- **Font:** KFGQPC Warsh Uthmanic Script
- **Version:** 0.10
- **Date:** 2021-08-05
- **Update:** 4.0

### Modification History & Fixes

- **Verses/Text:**
  - Added non-breaking spaces before aya marks in the `aya_text` column.
  - Added non-breaking spaces after jozz/hizb symbols.
  - Added a space in Sura An-Naḥl:123 between the aya number and the last word.
  - Added the sign of hizb in Sura Al-‘Ankabūt:7.
  - Added/Removed Waqf (stop) signs at various places.
  - Added/Removed Sajda (prostration) signs at various places.
  - Modified Sura Al-Anfāl (line 11) to contain 9 words instead of 11.
  - Removed Sajda marks from Suras 22, 53, 84, and 96.
- **Metadata/Layout:**
  - Encoded files as UTF-8-BOM.
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
| 3 | `page` | string | Page Number (Ayat spanning two pages are separated by `–`). |
| 4 | `sura_no` | int | Surah Number (1-114). |
| 5 | `sora_name_en` | varchar | Surah Name in English transliteration. |
| 6 | `sora_name_ar` | varchar | Surah Name in Arabic (requires UthmanicWarsh font). |
| 7 | `aya_no` | int | Verse (Aya) Number within the Surah. |
| 8 | `line_start`| int | Starting line of the Verse (Aya) on the page. |
| 9 | `line_end` | int | Ending line of the Verse (Aya) on the page. |
| 10 | `aya_text` | text | Verse text rendered with KFGQPC UthmanicWarsh font. |

## Data Source

The original data and font files can be found at:
[thetruetruth/quran-data-kfgqpc (Warsh)](https://github.com/thetruetruth/quran-data-kfgqpc/blob/main/hafs/)
> [!NOTE]
> Although the link points to the `hafs` parent directory, it contains the relevant `warsh` subfolder in the repository structure.
