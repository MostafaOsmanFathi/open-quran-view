# Usage Examples

This document provides practical examples for using the `open-quran-view` core library in various environments.

## Vanilla JavaScript

### Basic Page Rendering

This example shows how to render a Quran page using standard HTML5 and CSS.

```javascript
import { DynamicDataLoader, WebAssetFetcher } from "open-quran-view/core";

const fetcher = new WebAssetFetcher();
const loader = new DynamicDataLoader(fetcher);

async function renderPage(pageNumber) {
  const pageData = await loader.getLayoutForPage(pageNumber);
  
  // Create container
  const container = document.getElementById("quran-container");
  container.innerHTML = "";
  
  // Render each line
  const lines = {};
  pageData.forEach(row => {
    if (!lines[row.line]) lines[row.line] = [];
    lines[row.line].push(row);
  });

  Object.entries(lines).forEach(([lineNo, glyphs]) => {
    const lineEl = document.createElement("div");
    lineEl.className = "quran-line";
    
    glyphs.forEach(glyph => {
      const span = document.createElement("span");
      // Map font code to character
      span.textContent = String.fromCharCode(61696 + glyph.glyph);
      lineEl.appendChild(span);
    });
    
    container.appendChild(lineEl);
  });
}
```

## React

### Basic Component

Using the high-level `QuranView` component.

```tsx
import { QuranView } from 'open-quran-view/react';
import { WebAssetFetcher, DynamicDataLoader } from 'open-quran-view/core';

const loader = new DynamicDataLoader(new WebAssetFetcher());

function App() {
  return (
    <QuranView 
      page={1} 
      loader={loader} 
      width={400} 
      height={600} 
    />
  );
}
```

## React Native

### Cross-Platform Skia Component

The same `QuranView` can be used in React Native apps.

```tsx
import { QuranView } from 'open-quran-view/react';
import { NativeAssetFetcher, DynamicDataLoader } from 'open-quran-view/core';

const loader = new DynamicDataLoader(new NativeAssetFetcher());

function QuranScreen() {
  return (
    <QuranView 
      page={1} 
      loader={loader} 
      width={deviceWidth} 
      height={deviceHeight} 
    />
  );
}
```

## CSS Styling

```css
.quran-line {
  display: flex;
  flex-direction: row-reverse; /* Proper RTL alignment */
  justify-content: center;
  min-height: 40px;
}

.quran-glyph {
  font-size: 24px;
}
```
