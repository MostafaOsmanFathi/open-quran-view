# Mushaf Versions Comparison Guide

> Comprehensive comparison of Quran Mushaf layouts available via Quran Foundation API.

---

## Table of Contents

1. [Quick Answer](#quick-answer)
2. [The Three Main Versions](#the-three-main-versions)
3. [Side-by-Side Comparison](#side-by-side-comparison)
4. [Technical Differences](#technical-differences)
5. [When to Use Each](#when-to-use-each)
6. [Migration Recommendations](#migration-recommendations)
7. [Summary](#summary)

---

## Quick Answer

### Recommended: Mushaf Madinah V2 (QCF V2) - ID: 1

**Why?**

- ✅ Most modern and actively maintained
- ✅ Used by Quran.com (production-tested)
- ✅ Best font rendering quality
- ✅ Regularly updated with corrections
- ✅ 604 pages matching physical Mushaf

---

## The Three Main Versions

### 1. 📘 Mushaf Madinah V2 (QCF V2)

| Property | Details |
|----------|---------|
| **Mushaf ID** | `1` |
| **Font** | Quran Complex Font V2 (QCF V2) |
| **Type** | Glyph-based (604 page-specific fonts) |
| **Total Pages** | 604 |
| **Lines per Page** | 15 |
| **Source** | Medina Mushaf (King Fahd Complex) |
| **Status** | ✅ **Current/Recommended** |
| **Updates** | Actively maintained |

**Description:**

- Modern version of the official Medina Mushaf
- Uses advanced glyph-based rendering (QCF V2)
- Pixel-perfect match to physical printed Mushaf
- Each page has its own optimized font file
- Most accurate representation of the official Saudi Mushaf

**Best For:**

- ✅ Production apps requiring high quality
- ✅ Apps needing exact Mushaf page layout
- ✅ Reading apps with Mushaf view
- ✅ Apps targeting global audience

**Font URL Pattern:**

```
https://verses.quran.foundation/fonts/quran/hafs/v2/woff2/p{PAGE}.woff2
```

**API Request:**

```bash
curl -H "x-auth-token: TOKEN" \
  "https://apis.quran.foundation/content/api/v4/verses/by_page/1?mushaf=1&words=true&word_fields=code_v2,text_qpc_hafs"
```

---

### 2. 📗 King Fahd Complex (KFGQPC Hafs)

| Property | Details |
|----------|---------|
| **Mushaf ID** | `5` |
| **Font** | QPC Hafs (Unicode-based) |
| **Type** | Unicode (single font file) |
| **Total Pages** | 604 |
| **Lines per Page** | 15 |
| **Source** | King Fahd Quran Printing Complex |
| **Status** | ⚠️ Older/Legacy |
| **Updates** | Less frequent |

**Description:**

- Uses standard Unicode text (`text_qpc_hafs` field)
- Single font file for entire Quran
- Simpler implementation (no per-page fonts)
- **Not the same as QCF V2** despite same source

**Best For:**

- ⚠️ Simple apps with limited requirements
- ⚠️ Quick prototypes
- ⚠️ When you need simple Unicode text only
- ❌ **NOT recommended for production**

**Font URL:**

```
https://verses.quran.foundation/fonts/quran/hafs/uthmanic_hafs/UthmanicHafs1Ver18.woff2
```

**API Request:**

```bash
curl -H "x-auth-token: TOKEN" \
  "https://apis.quran.foundation/content/api/v4/verses/by_page/1?mushaf=5&words=true&word_fields=text_qpc_hafs"
```

---

### 3. 🎨 Tajweed (QCF V4)

| Property | Details |
|----------|---------|
| **Mushaf ID** | `19` |
| **Font** | Quran Complex Font V4 Tajweed |
| **Type** | Glyph-based with color (604 page-specific fonts) |
| **Total Pages** | 604 |
| **Lines per Page** | 15 |
| **Source** | Medina Mushaf with Tajweed coloring |
| **Status** | ✅ **Current (for Tajweed)** |
| **Updates** | Actively maintained |

**Description:**

- Built on QCF V2 architecture
- **Adds colored Tajweed rules** to the text
- Each letter colored based on Tajweed pronunciation rules
- Supports multiple themes (light, dark, sepia)
- Same layout as QCF V2, just with colors

**Best For:**

- ✅ Educational apps (teaching Tajweed)
- ✅ Learning/practice applications
- ✅ Apps for Quran memorization with Tajweed
- ⚠️ **Only if you need Tajweed colors**

**Font URL Pattern (COLRv1):**

```
https://verses.quran.foundation/fonts/quran/hafs/v4/colrv1/woff2/p{PAGE}.woff2
```

**Font URL Pattern (OT-SVG for Firefox dark mode):**

```
https://verses.quran.foundation/fonts/quran/hafs/v4/ot-svg/dark/woff2/p{PAGE}.woff2
```

**API Request:**

```bash
curl -H "x-auth-token: TOKEN" \
  "https://apis.quran.foundation/content/api/v4/verses/by_page/1?mushaf=19&words=true&word_fields=code_v2,text_qpc_hafs"
```

---

## Side-by-Side Comparison

| Feature | Madinah V2 (QCF V2) | King Fahd (KFGQPC) | Tajweed (QCF V4) |
|---------|---------------------|--------------------|--------------------|
| **Mushaf ID** | 1 | 5 | 19 |
| **Font Type** | Glyph-based | Unicode | Glyph-based + Color |
| **Font Files** | 604 (one per page) | 1 (single file) | 604 (one per page) |
| **Quality** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **File Size** | ~25MB (pages) | ~15MB (pages) | ~25MB (pages) |
| **Font Size** | ~25MB | ~500KB | ~30MB |
| **Rendering** | Pixel-perfect | Standard Unicode | Pixel-perfect + Colors |
| **Maintenance** | ✅ Active | ⚠️ Legacy | ✅ Active |
| **Complexity** | High | Low | High |
| **Use Case** | Production apps | Simple/prototype | Educational apps |
| **Recommended** | ✅ **YES** | ❌ No | ⚠️ Only for Tajweed |

---

## Technical Differences

### Font Rendering Method

**QCF V2 & V4 (Glyph-based):**

```typescript
// Each word uses a special glyph code
{
  "code_v2": "ﱁ",  // Special glyph
  "page_number": 1,
  "text_qpc_hafs": "بِسۡمِ"  // Fallback
}

// Must use innerHTML (not textContent)
span.innerHTML = word.code_v2;
span.style.fontFamily = `p${word.pageNumber}-v2`;
```

**KFGQPC (Unicode):**

```typescript
// Standard Unicode text
{
  "text_qpc_hafs": "بِسۡمِ"
}

// Can use textContent
span.textContent = word.text_qpc_hafs;
span.style.fontFamily = 'UthmanicHafs';
```

### Font Loading Strategy

**QCF V2 & V4:**

```typescript
// Dynamic per-page loading
async function loadPageFont(pageNumber: number, version: 'v2' | 'v4' = 'v2') {
  const fontUrl = `https://verses.quran.foundation/fonts/quran/hafs/${version}/woff2/p${pageNumber}.woff2`;

  const fontFace = new FontFace(
    `p${pageNumber}-${version}`,
    `url('${fontUrl}')`
  );

  await fontFace.load();
  document.fonts.add(fontFace);
}
```

**KFGQPC:**

```css
/* Single font for everything */
@font-face {
  font-family: 'UthmanicHafs';
  src: url('https://verses.quran.foundation/fonts/quran/hafs/uthmanic_hafs/UthmanicHafs1Ver18.woff2');
}
```

---

## When to Use Each

### Use Madinah V2 (QCF V2) - ID: 1

✅ **Default choice for most apps**

**When:**

- Building a production Quran app
- Need pixel-perfect Mushaf layout
- Want exact match to physical Mushaf
- Building reading/memorization apps
- Targeting global audience
- Need the most up-to-date version

**Trade-offs:**

- More complex implementation
- Larger total download size (~50MB for all fonts)
- Need to handle per-page font loading

---

### Use King Fahd (KFGQPC) - ID: 5

⚠️ **Only for quick prototypes or simple use cases**

**When:**

- Building a quick prototype
- Only displaying a few verses
- Don't need exact Mushaf layout
- Want simplest possible implementation
- File size is critical concern

**Trade-offs:**

- Not pixel-perfect
- Less actively maintained
- Not recommended for production
- Lower quality rendering

---

### Use Tajweed (QCF V4) - ID: 19

🎨 **Only when you specifically need Tajweed colors**

**When:**

- Building educational apps
- Teaching Tajweed rules
- Quran learning/memorization apps
- Need color-coded pronunciation guides

**Trade-offs:**

- Same complexity as QCF V2
- Larger file size (~55MB total)
- Requires theme handling (light/dark/sepia)
- Browser-specific handling (Firefox vs Chrome)

---

## Migration Recommendations

### If You're Starting Fresh

```typescript
// ✅ Recommended
const MUSHAF_ID = 1;  // QCF V2
const WORD_FIELDS = 'code_v2,text_qpc_hafs,line_number,page_number,position';
```

### If You're Currently Using KFGQPC (ID: 5)

**Migration Path:**

```
KFGQPC (ID: 5)
    ↓
1. Update mushaf parameter to 1
2. Change word_fields to include code_v2
3. Implement per-page font loading
4. Use innerHTML for code_v2 rendering
5. Add fallback to text_qpc_hafs
    ↓
QCF V2 (ID: 1) ✅
```

### If You Need Both Standard + Tajweed

**Two-Mushaf Strategy:**

```typescript
const mushafs = {
  standard: 1,   // QCF V2 (default)
  tajweed: 19    // QCF V4 (optional)
};

// Let user toggle between them
function switchMushaf(enableTajweed: boolean) {
  return enableTajweed ? mushafs.tajweed : mushafs.standard;
}
```

---

## Summary

### Final Recommendation

**Use Mushaf Madinah V2 (QCF V2) - ID: 1**

**Reasons:**

1. ✅ **Most up-to-date** - Actively maintained by Quran.com team
2. ✅ **Highest quality** - Pixel-perfect rendering
3. ✅ **Production-ready** - Used by millions on Quran.com
4. ✅ **Best support** - Regular updates and corrections
5. ✅ **Future-proof** - Will receive ongoing improvements

### Optional Add-on

**Add Tajweed (QCF V4) - ID: 19** only if:

- You're building an educational app
- Teaching Tajweed is a core feature
- Users specifically request color-coded Tajweed

### Avoid

**King Fahd (KFGQPC) - ID: 5** because:

- ❌ Legacy/older implementation
- ❌ Lower quality than QCF V2
- ❌ Less actively maintained
- ❌ No significant advantages over QCF V2

---

## Package Configuration

```typescript
// src/core/types.ts
export type MushafLayout =
  | 'hafs-v2'        // QCF V2 - RECOMMENDED
  | 'hafs-v4';       // Tajweed - OPTIONAL

export const DEFAULT_MUSHAF: MushafLayout = 'hafs-v2';

export const MUSHAF_CONFIGS = {
  'hafs-v2': {
    id: 1,
    name: 'Medina Mushaf (QCF V2)',
    wordFields: 'code_v2,text_qpc_hafs,line_number,page_number',
    fontType: 'glyph' as const,
    totalPages: 604,
  },
  'hafs-v4': {
    id: 19,
    name: 'Medina Mushaf with Tajweed',
    wordFields: 'code_v2,text_qpc_hafs,line_number,page_number',
    fontType: 'glyph' as const,
    totalPages: 604,
  },
} as const;
```

---

**Bottom Line:** Always use **Mushaf Madinah V2 (QCF V2, ID: 1)** unless you have a specific reason to use Tajweed colors, in which case add QCF V4 (ID: 19) as an optional feature.

---

## Related Documentation

- [Data Structure](architecture/data-structure.md) - File formats and layouts
- [API Integration Guide](api-integration.md) - Quran Foundation API details
- [Data Generation Guide](data-generation.md) - How to generate Mushaf data
