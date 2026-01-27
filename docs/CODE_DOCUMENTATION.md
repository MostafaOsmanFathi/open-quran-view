# Java-Quran-Web Code Documentation

## Overview

Java-Quran-Web is a client-side single-page application (SPA) that displays the Quran using QCF4 (Quran Complex Font 4) fonts. The app follows a modular architecture with clear separation of concerns.

**Key Features:**

- Display Quran pages using QCF4 fonts
- Navigate by page, surah, or juz
- Click on ayah to see tafseer (Arabic and English)
- Audio playback for individual ayahs
- URL parameter support for direct ayah navigation
- RTL (Right-to-Left) layout

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.html                                │
│  (Entry Point - RTL Layout, Overlays, Loading Screen)           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        QuranApp (app.js)                         │
│  (Main Controller - orchestrates all modules)                   │
│  • Navigation    • Tafseer    • Audio    • URL Routing          │
└──────────┬────────────────┬────────────────┬────────────────────┘
           │                │                │
           ▼                ▼                ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ QuranDataLoader  │ │ PageRenderer     │ │ NavigationBar    │
│ (data-loader.js) │ │ (renderer.js)    │ │ (navigation.js)  │
│                  │ │                  │ │                  │
│ • Load JSON/CSV  │ │ • Render pages   │ │ • Page nav       │
│ • Parse data     │ │ • Load fonts     │ │ • Surah/Juz nav  │
│ • Provide API    │ │ • Render glyphs  │ │ • Keyboard nav   │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## File Structure

| File                | Lines | Purpose                                                 |
| ------------------- | ----- | ------------------------------------------------------- |
| `index.html`        | 100   | Main HTML with RTL layout, overlays, and script loading |
| `js/app.js`         | 851   | Main controller (QuranApp class)                        |
| `js/data-loader.js` | 153   | Data loading and parsing                                |
| `js/renderer.js`    | 422   | Page/glyph rendering with QCF4 fonts                    |
| `js/navigation.js`  | 165   | Navigation controls                                     |

---

## Data Structures

### 1. `suwar.json` - Surah Metadata

**Purpose:** Table of contents for all 114 surahs.

**Structure:**

```json
{
  "suwar": [
    {"name_ar": "الفاتحة", "ayah_count": 7, "start_page": 1},
    {"name_ar": "البقرة", "ayah_count": 286, "start_page": 2},
    {"name_ar": "آل عمران", "ayah_count": 200, "start_page": 50},
    ...
  ]
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `name_ar` | string | Arabic name of the surah |
| `ayah_count` | number | Total number of ayahs in the surah |
| `start_page` | number | Page number where the surah begins |

**Example:**
| Surah | Arabic Name | Verses | Starts on Page |
|-------|-------------|--------|----------------|
| 1 | Al-Fatiha | 7 | 1 |
| 2 | Al-Baqarah | 286 | 2 |
| 3 | Al-Imran | 200 | 50 |

---

### 2. `page_mapping.json` - Page to Surah/Ayah Mapping

**Purpose:** Maps each page to the surah and ayah range it contains.

**Structure:**

```json
{
  "1": [1, 1, 1, 7],
  "2": [2, 1, 2, 5],
  "3": [2, 6, 2, 16],
  ...
}
```

**Format:** `[surah, startAyah, page, endAyah]`

| Index | Meaning       | Example (Page 1) |
| ----- | ------------- | ---------------- |
| 0     | Surah number  | 1                |
| 1     | Starting ayah | 1                |
| 2     | Page number   | 1                |
| 3     | Ending ayah   | 7                |

**Visual Example:**

```
Page 1: ┌─────────────────────────┐
        │  Surah 1 (Al-Fatiha)    │
        │  Ayahs 1-7              │
        └─────────────────────────┘

Page 2: ┌─────────────────────────┐
        │  Surah 2 (Al-Baqarah)   │
        │  Ayahs 1-5              │
        └─────────────────────────┘

Page 3: ┌─────────────────────────┐
        │  Surah 2 (Al-Baqarah)   │
        │  Ayahs 6-16             │
        └─────────────────────────┘
```

---

### 3. `mushaf_metadata.json` - Juz Division and Layout Config

**Purpose:** Contains juz starting pages and layout adjustments.

**Structure:**

```json
{
  "juz_pages": [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, ...],
  "centered_lines": {"1": [1, 2, 3], "2": [5, 6], ...},
  "custom_header_surah_glyph_offset_fix": {"1": 10, ...}
}
```

**Fields:**
| Field | Description |
|-------|-------------|
| `juz_pages` | Array of 30 numbers, each indicating the starting page of a juz |
| `centered_lines` | Object mapping page number to array of line numbers that should be centered |
| `custom_header_surah_glyph_offset_fix` | Object mapping page number to pixel offset for header positioning |

**Juz Pages Table:**
| Juz | Starts on Page |
|-----|----------------|
| 1 | 1 |
| 2 | 22 |
| 3 | 42 |
| 4 | 62 |
| 5 | 82 |
| ... | ... |
| 30 | 582 |

---

### 4. `quran_layout.csv` - Glyph-Level Layout (MOST IMPORTANT)

**Purpose:** Tells the app exactly where to draw each character on each page.

**Structure:**

```csv
Sura,Verse,PageNo,LineNo,FontFile,FontCode,Type
1,0,1,1,0,0,5
1,1,1,2,1,0,1
1,1,1,2,1,1,1
1,1,1,2,1,2,1
1,1,1,2,1,3,1
1,1,1,2,1,4,6
```

**Columns:**
| Column | Meaning | Example |
|--------|---------|---------|
| `Sura` | Surah number (1-114) | 1 = Al-Fatiha, 2 = Al-Baqarah |
| `Verse` | Ayah number (0-286) | 0 = Special marker (surah name, basmalah) |
| `PageNo` | Page number (1-604) | 1 = First page |
| `LineNo` | Line number on page (1-15) | 1-15 |
| `FontFile` | Which QCF4 font file to use (0-62) | 0 = Surah names, 1-62 = Regular text |
| `FontCode` | Character code within the font | 0-65535 |
| `Type` | Glyph type (1-7) | See Type Values below |

**Type Values:**
| Type | Name | Clickable? | Description |
|------|------|------------|-------------|
| 1 | Word | ✅ Yes | Regular word glyph |
| 2 | Waqf | ✅ Yes | Stopping mark (small symbol) |
| 4 | Bismillah | ❌ No | "بسم الله الرحمن الرحيم" |
| 5 | Surah Name | ❌ No | Surah name at top of page |
| 6 | Ayah End | ✅ Yes | End of ayah marker (۝) |
| 7 | Rubu Marker | ✅ Yes | Quarter juz marker |

**FontFile Mapping:**
| FontFile | Font File | Usage |
|----------|-----------|-------|
| 0 | QCF4_QBSML.woff2 | Surah names, basmalah |
| 1-62 | QCF4_Hafs_XX_W.woff2 | Regular Quran text |

---

## How Glyph Mapping Works

### Step-by-Step Process

#### Step 1: Filter by Page

The app filters `quran_layout.csv` to get only glyphs for a specific page.

```javascript
// Example: Get all glyphs for Page 1
const page1Glyphs = layoutData.filter((row) => row.pageNo === 1);
```

**Result:**

```
Page 1 Glyphs:
┌────────────────────────────────────────────────────────────┐
│ Line 1: [1,0,1,1,0,0,5]  ← Surah name "Al-Fatiha"         │
│ Line 2: [1,1,1,2,1,0,1]  ← ٱلْحَمْدُ                       │
│         [1,1,1,2,1,1,1]  ← لِلَّهِ                          │
│         [1,1,1,2,1,2,1]  ← رَبِّ                            │
│         [1,1,1,2,1,3,1]  ← ٱلْعَٰلَمِينَ                     │
│         [1,1,1,2,1,4,6]  ← ۝ (Ayah 1 end)                  │
│ Line 3: [1,2,1,3,1,5,1]  ← ٱلرَّحْمَٰنِ                      │
│         [1,2,1,3,1,6,1]  ← ٱلرَّحِيمِ                       │
│         [1,2,1,3,1,7,1]  ← مَٰلِكِ                           │
│         [1,2,1,3,1,8,1]  ← يَوْمِ                            │
│         [1,2,1,3,1,9,6]  ← ۝ (Ayah 2 end)                  │
└────────────────────────────────────────────────────────────┘
```

#### Step 2: Group by Line

The `groupByLine()` function groups glyphs by `LineNo`:

```javascript
// Result of groupByLine():
{
  1: [{Sura:1, Verse:0, LineNo:1, FontFile:0, FontCode:0, Type:5}],
  2: [{Sura:1, Verse:1, ...}, {Sura:1, Verse:1, ...}, ...],
  3: [{Sura:1, Verse:2, ...}, {Sura:1, Verse:2, ...}, ...],
  ...
}
```

#### Step 3: Group by Ayah (Wrap in `<span>`)

The `renderLine()` function wraps glyphs into ayah groups. Types 4 (basmalah) and 5 (surah-name) are NOT wrapped because they're not clickable.

```html
<!-- Line 2 (Ayah 1) -->
<div class="quran-line" data-line="2">
  <span class="ayah-group" data-surah="1" data-ayah="1">
    <span class="qcf word">ٱلْ</span>
    <span class="qcf word">حَمْ</span>
    <span class="qcf word">دُ</span>
    <span class="qcf ayah-marker">۝</span>
  </span>
</div>

<!-- Line 3 (Ayah 2) -->
<div class="quran-line" data-line="3">
  <span class="ayah-group" data-surah="1" data-ayah="2">
    <span class="qcf word">ٱلْ</span>
    <span class="qcf word">رَحْ</span>
    <span class="qcf word">مَٰنِ</span>
    <span class="qcf ayah-marker">۝</span>
  </span>
</div>
```

#### Step 4: Convert FontCode to Unicode Character

Each `FontCode` maps to a Unicode character in the QCF4 font:

```javascript
// QCF4 fonts use Private Use Area starting at 0xF100 (61696)
const unicodeChar = 61696 + glyph.fontCode;

// Examples:
glyph.FontCode = 0   → Character = 61696 + 0 = 0xF100  → 'ٱلْ'
glyph.FontCode = 1   → Character = 61696 + 1 = 0xF101  → 'حَمْ'
glyph.FontCode = 4   → Character = 61696 + 4 = 0xF104  → '۝'
```

---

## Visual Result - Page 1

```
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │  الجُزْءُ الأَوَّل    ◨    سُورَةُ  │  │  ← Header (Juz + Surah)
│  │              الفاتحة               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ      ← Line 2 (Ayah 1)
│         ۝                                 │
│  ٱلرَّحْمَٰنِ ٱلرَّحِيمِ                  ← Line 3 (Ayah 2)
│         ۝                                 │
│  مَٰلِكِ يَوْمِ ٱلدِّينِ                  ← Line 4 (Ayah 3)
│         ۝                                 │
│  إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ    ← Line 5 (Ayah 4)
│         ۝                                 │
│  ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ          ← Line 6 (Ayah 5)
│         ۝                                 │
│  صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ       ← Line 7 (Ayah 6)
│         ۝                                 │
│  غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا        ← Line 8 (Ayah 7)
│  ٱلضَّآلِّينَ                            │
│                                         │
│  ← ١ →                              ١    ← Footer (Page 1)
└─────────────────────────────────────────┘
```

---

## Data Flow

### 1. Initialization Phase

```
DOMContentReady
        │
        ▼
QuranApp.init()
        │
        ▼
QuranDataLoader.loadAll()
        │
        ├── Load suwar.json
        ├── Load page_mapping.json
        ├── Load mushaf_metadata.json
        └── Load quran_layout.csv
        │
        ▼
PageRenderer.init()
        │
        ▼
Render Page 1 (or URL param page)
        │
        ├── getPageLayout(1)
        ├── Load QCF4 fonts
        ├── groupByLine()
        ├── renderLine() for each line
        └── Add header/footer
```

### 2. Runtime Phase (User Interactions)

```
User Actions:
  • Click navigation arrows/buttons
  • Click header/footer (opens overlay)
  • Click ayah (shows tafseer)
  • Keyboard (← → arrows, Space)
  • URL params (?surah=2&ayah=6)
        │
        ▼
QuranApp.renderPage(n)
        │
        ├── Get layout data for page n
        ├── Load required fonts
        ├── Group glyphs by line
        ├── Render each line
        └── Setup ayah highlighting
```

---

## Public API (QuranApp)

```javascript
// Navigate to and highlight any ayah
await quranApp.goToAyah(surah, ayah, { persistent: true, scroll: true });

// Clear persistent highlight
quranApp.clearPersistentHighlight();

// Highlight ayah on current page
quranApp.highlightAyah(surah, ayah);

// Remove all highlights
quranApp.removeAllHighlights();
```

---

## URL Parameters

| Format            | Example    | Description                 |
| ----------------- | ---------- | --------------------------- |
| `?surah=2&ayah=6` | `?s=2&a=6` | Navigate to Surah 2, Ayah 6 |
| `#page/604`       | -          | Navigate to page 604        |

---

## Key Code Snippets

### QuranDataLoader - Loading Data

```javascript
async loadAll() {
  const [suwar, pageMapping, mushafMetadata, layoutCSV] = await Promise.all([
    fetch(`${this.dataPath}/suwar.json`).then(r => r.json()),
    fetch(`${this.dataPath}/page_mapping.json`).then(r => r.json()),
    fetch(`${this.dataPath}/mushaf_metadata.json`).then(r => r.json()),
    fetch(`${this.dataPath}/quran_layout.csv`).then(r => r.text()),
  ]);

  this.suwar = suwar.suwar || suwar;
  this.pageMapping = pageMapping;
  this.mushafMetadata = mushafMetadata;
  this.layoutData = this.parseCSV(layoutCSV);
}
```

### QuranDataLoader - Parse CSV

```javascript
parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const row = {
        sura: parseInt(values[0]),
        verse: parseInt(values[1]),
        pageNo: parseInt(values[2]),
        lineNo: parseInt(values[3]),
        fontFile: parseInt(values[4]),
        fontCode: parseInt(values[5]),
        type: parseInt(values[6]),
      };
      data.push(row);
    }
  }

  return data;
}
```

### PageRenderer - Group by Line

```javascript
groupByLine(layoutData) {
  const lines = {};

  layoutData.forEach(glyph => {
    const lineNo = glyph.lineNo;
    if (!lines[lineNo]) {
      lines[lineNo] = [];
    }
    lines[lineNo].push(glyph);
  });

  return lines;
}
```

### PageRenderer - Render Glyph

```javascript
renderGlyph(glyph) {
  const span = document.createElement('span');
  span.style.fontFamily = `qcf4${glyph.fontFile}`;

  // QCF4 fonts use Unicode Private Use Area starting at 0xF100 (61696)
  const unicodeChar = 61696 + glyph.fontCode;
  span.textContent = String.fromCharCode(unicodeChar);

  span.dataset.type = glyph.type;
  span.dataset.sura = glyph.sura;
  span.dataset.verse = glyph.verse;

  span.classList.add('qcf');
  if (glyph.type === 1) span.classList.add('word');
  if (glyph.type === 6) span.classList.add('ayah-marker');

  return span;
}
```

---

## CSS Classes

| Class                   | Element        | Description                   |
| ----------------------- | -------------- | ----------------------------- |
| `.quran-page`           | Page container | Main wrapper for a page       |
| `.quran-line`           | Line container | Wrapper for each line (1-15)  |
| `.ayah-group`           | Ayah wrapper   | Groups all glyphs of one ayah |
| `.qcf`                  | Glyph span     | Base class for all glyphs     |
| `.word`                 | Word glyph     | Regular word                  |
| `.ayah-marker`          | End marker     | Ayah ending symbol (۝)        |
| `.basmalah`             | Bismillah      | Bismillah text                |
| `.surah-name`           | Surah name     | Surah name at top             |
| `.highlighted-verse`    | Ayah group     | Currently hovered ayah        |
| `.persistent-highlight` | Ayah group     | URL-navigated ayah (yellow)   |

---

## Navigation Flow Example

```
User wants to see Surah 2, Ayah 255 (Ayat Al-Kursi)
                    │
                    ▼
         ┌──────────────────────┐
         │  Look up in suwar.json
         │  Surah 2 starts on page 2
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │  Look up in page_mapping.json
         │  Find which page has Ayah 255
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │  Result: Page 283
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │  Look up in quran_layout.csv
         │  Get all glyphs for Page 283
         │  Group them by ayah
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │  Render with QCF4 fonts
         │  Highlight Ayah 255
         └──────────────────────┘
```

---

## Important Notes

1. **Same ayah can span multiple lines:** The app groups all glyphs with the same `Verse` number into one `<span class="ayah-group">`, even if they're on different lines.

2. **Hover highlighting:** When hovering over any part of an ayah, the entire ayah (across all lines) is highlighted.

3. **Type 4 and 5 are not clickable:** Basmallah (Type 4) and Surah names (Type 5) are not wrapped in ayah-group spans.

4. **15 lines per page:** The Mushaf Madina has exactly 15 lines per page. Empty lines are added if needed.

5. **RTL layout:** The page uses `dir="rtl"` and CSS to position elements correctly for Arabic text.

---

## Dependencies

- **QCF4 Fonts:** Located in `assets/fonts/qcf4/`
- **Tafseer Files:** Located in `assets/tafseer/`
  - `ar.muyassar.txt` - Arabic tafseer
  - `en.sahih.txt` - English translation

---

## Version Info

- **App Version:** 1.8
- **Data Loader Version:** 1.0
- **Renderer Version:** 1.0
- **Total Glyphs:** 88,439 rows in quran_layout.csv
- **Total Pages:** 604
- **Total Surahs:** 114
- **Total Juz:** 30
