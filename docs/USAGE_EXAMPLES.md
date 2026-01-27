# Usage Examples

## Overview

This document provides practical examples for using the Quran Core package in different frameworks.

---

## Vanilla JavaScript

### Basic Page Rendering

```javascript
import { getPageData } from "quran-core";

async function renderPage(pageNumber, options = {}) {
  const data = getPageData(pageNumber, options);

  // Load fonts
  await loadFonts(data.fonts.required);

  // Create page container
  const pageEl = document.createElement("div");
  pageEl.className = `quran-page page-${data.metadata.pageFace}`;

  // Render header
  const headerEl = document.createElement("header");
  headerEl.className = "page-header";
  headerEl.innerHTML = `
    <span class="juz">الجُزْءُ ${data.metadata.juz}</span>
    <span class="surah">سُورَةُ ${data.surahs.map((s) => s.name).join(" - ")}</span>
  `;
  pageEl.appendChild(headerEl);

  // Render lines
  const contentEl = document.createElement("div");
  contentEl.className = "page-content";

  data.lines.forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.className = `quran-line ${line.isCentered ? "centered" : ""}`;

    line.glyphs.forEach((glyph) => {
      const span = document.createElement("span");
      span.textContent = glyph.char;
      span.style.fontFamily = data.fonts.fontFamilies[glyph.fontSource];
      span.dataset.surah = glyph.surah;
      span.dataset.ayah = glyph.ayah;

      if (glyph.isHighlightable) {
        span.classList.add("quran-glyph", "highlightable");
        span.addEventListener("click", () => {
          console.log("Clicked:", glyph.surah, glyph.ayah);
        });
        span.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          console.log("Long pressed:", glyph.surah, glyph.ayah);
        });
      } else {
        span.classList.add("quran-glyph");
      }

      lineEl.appendChild(span);
    });

    contentEl.appendChild(lineEl);
  });

  pageEl.appendChild(contentEl);

  // Render footer
  const footerEl = document.createElement("footer");
  footerEl.className = "page-footer";
  footerEl.innerHTML = `<span class="page-number">${pageNumber}</span>`;
  pageEl.appendChild(footerEl);

  return pageEl;
}

async function loadFonts(fonts) {
  // Load basmalah font
  const basmalahStyle = document.createElement("style");
  basmalahStyle.textContent = `
    @font-face {
      font-family: '${getFontFamilyName("basmalah")}';
      src: url('/fonts/qcf4/${fonts.basmalah}');
    }
  `;
  document.head.appendChild(basmalahStyle);

  // Load surah font
  const surahStyle = document.createElement("style");
  surahStyle.textContent = `
    @font-face {
      font-family: '${getFontFamilyName("surah")}';
      src: url('/fonts/qcf4/${fonts.surah}');
    }
  `;
  document.head.appendChild(surahStyle);

  // Load page font
  const pageStyle = document.createElement("style");
  pageStyle.textContent = `
    @font-face {
      font-family: '${getFontFamilyName("page")}';
      src: url('/fonts/qcf4/${fonts.page}');
    }
  `;
  document.head.appendChild(pageStyle);
}

function getFontFamilyName(source) {
  return `quran-${source}`;
}

// Usage
renderPage(1).then((el) => {
  document.getElementById("app").appendChild(el);
});
```

---

## React

### QuranPage Component

```tsx
import React from 'react';
import { getPageData, FontMode } from 'quran-core';
import './QuranPage.css';

interface QuranPageProps {
  page: number;
  mode?: FontMode;
  onPress?: (surah: number, ayah: number) => void;
  onLongPress?: (surah: number, ayah: number) => void;
  className?: string;
}

export const QuranPage: React.FC<QuranPageProps> = ({
  page,
  mode = 'standard',
  onPress,
  onLongPress,
  className = ''
}) => {
  const data = getPageData(page, { mode });

  return (
    <div className={`quran-page page-${data.metadata.pageFace} ${className}`}>
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
                onContextMenu={(e) => {
                  e.preventDefault();
                  onLongPress?.(glyph.surah, glyph.ayah);
                }}
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
<QuranPage
  page={1}
  onPress={(surah, ayah) => console.log(surah, ayah)}
  onLongPress={(surah, ayah) => console.log('long press', surah, ayah)}
/>

// Tajweed mode
<QuranPage page={1} mode="tajweed" />
```

### useQuranPage Hook

```tsx
import { useState, useEffect } from "react";
import { getPageData, getPageFromAyah, FontMode } from "quran-core";

export function useQuranPage(page: number, options: { mode?: FontMode } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const pageData = getPageData(page, options);
      setData(pageData);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [page, options.mode]);

  return { data, loading, error };
}

// Usage
function MyComponent() {
  const { data, loading, error } = useQuranPage(1, { mode: "standard" });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <QuranPage page={1} />;
}
```

---

## React Native

### QuranPage Component

```tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getPageData, FontMode } from "quran-core";

interface QuranPageProps {
  page: number;
  mode?: FontMode;
  onPress?: (surah: number, ayah: number) => void;
  onLongPress?: (surah: number, ayah: number) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({
  page,
  mode = "standard",
  onPress,
  onLongPress,
}) => {
  const data = getPageData(page, { mode });

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.juz}>الجُزْءُ {data.metadata.juz}</Text>
        <Text style={styles.surah}>
          سُورَةُ {data.surahs.map((s) => s.name).join(" - ")}
        </Text>
      </View>

      {/* Lines */}
      <View style={styles.content}>
        {data.lines.map((line) => (
          <View
            key={line.lineNumber}
            style={[styles.line, line.isCentered && styles.centeredLine]}
          >
            {line.glyphs.map((glyph, index) => {
              const Component = glyph.isHighlightable ? TouchableOpacity : View;
              return (
                <Component
                  key={index}
                  style={styles.glyph}
                  onPress={() => onPress?.(glyph.surah, glyph.ayah)}
                  onLongPress={() => onLongPress?.(glyph.surah, glyph.ayah)}
                >
                  <Text style={styles.glyphText}>{glyph.char}</Text>
                </Component>
              );
            })}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.pageNumber}>{page}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f5dc",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  juz: {
    fontSize: 14,
    color: "#666",
  },
  surah: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
  },
  line: {
    flexDirection: "row",
    flexWrap: "wrap",
    minHeight: 32,
    alignItems: "center",
  },
  centeredLine: {
    justifyContent: "center",
  },
  glyph: {
    marginHorizontal: 1,
  },
  glyphText: {
    fontSize: 24,
    // Note: In React Native, you'll need to load fonts differently
    // This is a simplified example
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  pageNumber: {
    fontSize: 14,
    color: "#666",
  },
});

// Usage
<QuranPage page={1} onPress={(surah, ayah) => console.log(surah, ayah)} />;
```

---

## Vue 3

### QuranPage Component

```vue
<template>
  <div :class="['quran-page', `page-${data?.metadata?.pageFace}`]">
    <!-- Header -->
    <header class="page-header">
      <span class="juz">الجُزْءُ {{ data?.metadata?.juz }}</span>
      <span class="surah">سُورَةُ {{ surahNames }}</span>
    </header>

    <!-- Lines -->
    <div class="page-content">
      <div
        v-for="line in data?.lines"
        :key="line.lineNumber"
        :class="['quran-line', { centered: line.isCentered }]"
      >
        <span
          v-for="(glyph, index) in line.glyphs"
          :key="index"
          :class="['quran-glyph', { highlightable: glyph.isHighlightable }]"
          :style="{ fontFamily: data?.fonts?.fontFamilies?.[glyph.fontSource] }"
          :data-surah="glyph.surah"
          :data-ayah="glyph.ayah"
          @click="handleClick(glyph)"
          @contextmenu.prevent="handleLongPress(glyph)"
        >
          {{ glyph.char }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <footer class="page-footer">
      <span class="page-number">{{ page }}</span>
    </footer>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getPageData } from "quran-core";

const props = defineProps({
  page: { type: Number, required: true },
  mode: { type: String, default: "standard" },
});

const emit = defineEmits(["press", "longPress"]);

const data = computed(() => getPageData(props.page, { mode: props.mode }));

const surahNames = computed(
  () => data.value?.surahs.map((s) => s.name).join(" - ") || "",
);

function handleClick(glyph) {
  if (glyph.isHighlightable) {
    emit("press", glyph.surah, glyph.ayah);
  }
}

function handleLongPress(glyph) {
  if (glyph.isHighlightable) {
    emit("longPress", glyph.surah, glyph.ayah);
  }
}
</script>

<style scoped>
.quran-page {
  direction: rtl;
  background-color: #f5f5dc;
}

.quran-line {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.quran-line.centered {
  justify-content: center;
}

.quran-glyph {
  font-size: 24px;
  margin: 0 1px;
}

.quran-glyph.highlightable {
  cursor: pointer;
}
</style>
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

## Navigation Example

```typescript
import { getPageFromAyah } from "quran-core";

function navigateToAyah(surah, ayah) {
  const page = getPageFromAyah(surah, ayah);
  console.log(`Navigate to page ${page} for Surah ${surah}, Ayah ${ayah}`);
  // Your navigation logic here
}

// Examples
navigateToAyah(1, 1); // Page 1 - Al-Fatihah
navigateToAyah(2, 255); // Page 283 - Ayat Al-Kursi
navigateToAyah(110, 3); // Page 604 - Last ayah
```
