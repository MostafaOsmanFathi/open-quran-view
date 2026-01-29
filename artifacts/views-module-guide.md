# Views Module Documentation

> Reference for `@open-quran-view/view` React and Web Component views.

---

## Table of Contents

1. [Export Paths](#export-paths)
2. [React View](#react-view)
3. [Web Component](#web-component)
4. [Comparison](#comparison)
5. [Type Definitions](#type-definitions)

---

## Export Paths

| Import | Target | Description |
|--------|--------|-------------|
| `@open-quran-view/view` | React component (default) | `import { OpenQuranView }` |
| `@open-quran-view/view/react` | React component (explicit) | Same as default |
| `@open-quran-view/view/web` | Web Component | `import { registerQuranView }` |

---

## React View

### Basic Usage

```tsx
import { OpenQuranView } from '@open-quran-view/view';

function App() {
  return (
    <OpenQuranView
      page={1}
      width={600}
      height={850}
      theme="light"
      onPageChange={(page) => console.log('Page:', page)}
      onLoad={(layout) => console.log('Loaded:', layout)}
      onWordClick={(word) => console.log('Word:', word)}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | number | `1` | Page number (1-604) |
| `width` | number | `600` | Component width in pixels |
| `height` | number | `850` | Component height in pixels |
| `theme` | `"light" \| "dark"` | `"light"` | Color theme |
| `onPageChange` | `(page: number) => void` | - | Called when page changes |
| `onLoad` | `(layout: PageLayout) => void` | - | Called when page loads |
| `onWordClick` | `(word: WordInfo) => void` | - | Called when word is clicked |
| `className` | string | - | CSS class for container |

```typescript
type WordInfo = {
  id: number;
  surahNumber?: number;
  ayahNumber?: number;
};
```

### Navigation Controls

The React view includes built-in navigation controls:
- Previous/Next page buttons
- Page number input
- Total pages indicator

---

## Web Component

### Registration

```typescript
import { registerQuranView } from '@open-quran-view/view/web';

registerQuranView();
```

### HTML Usage

```html
<quran-view
  page="1"
  riwaya="hafs-v2"
  width="600"
  height="850"
  theme="light"
></quran-view>
```

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | string | `"1"` | Page number (1-604) |
| `riwaya` | string | `"hafs-v2"` | Mushaf layout |
| `width` | string | `"600"` | Component width in pixels |
| `height` | string | `"850"` | Component height in pixels |
| `theme` | string | `"light"` | Color theme (`light` or `dark`) |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `wordclick` | `{ id, surahNumber, ayahNumber }` | Fired when a word is clicked |

```typescript
const viewer = document.querySelector('quran-view');
viewer.addEventListener('wordclick', (e: CustomEvent) => {
  console.log('Word clicked:', e.detail);
});
```

### JavaScript API

```typescript
const viewer = document.querySelector('quran-view') as QuranViewElement;

// Navigate to page
viewer.page = 10;
viewer.goToPage(10);

// Get current page
console.log(viewer.page); // 10

// Change layout
viewer.setAttribute('riwaya', 'hafs-v4');

// Change theme
viewer.setAttribute('theme', 'dark');

// Change dimensions
viewer.setAttribute('width', '800');
viewer.setAttribute('height', '1000');
```

---

## Comparison

| Feature | React View | Web Component |
|---------|------------|---------------|
| Framework | React | Vanilla JS / Any |
| Bundle Size | ~59KB | ~59KB |
| Custom Styling | CSS-in-JS, classes | Shadow DOM, encapsulated |
| State Management | React hooks | Internal state |
| Event Handling | React props | Custom events |
| Accessibility | Keyboard + ARIA | Built-in |
| Theming | Prop-based | Attribute-based |

### When to Use React View

- React applications
- Need for easy integration with React ecosystem
- Want to use React hooks and context
- Prefer CSS-in-JS solutions

### When to Use Web Component

- Vanilla JS projects
- Any framework (Vue, Angular, Svelte)
- Need isolated styles (Shadow DOM)
- Want framework-agnostic component
- Need to use in static HTML

---

## Type Definitions

### React Props

```typescript
export type OpenQuranViewProps = {
  page?: number;
  width?: number;
  height?: number;
  theme?: "light" | "dark";
  onPageChange?: (page: number) => void;
  onLoad?: (layout: PageLayout) => void;
  onWordClick?: (word: {
    id: number;
    surahNumber?: number;
    ayahNumber?: number;
  }) => void;
  className?: string;
};
```

### Web Component Types

```typescript
export type QuranViewAttributes = {
  page?: string;
  riwaya?: string;
  width?: string;
  height?: string;
  theme?: "light" | "dark";
};

export class QuranViewElement extends HTMLElement {
  page: number;
  goToPage(page: number): void;
}

export function registerQuranView(): void;
```

---

## Dependencies

Both views depend on `@open-quran-view/core`:

```typescript
import {
  loadPage,
  getFontUrl,
  createLayoutCalculator,
  type MushafLayout,
  type PageLayout,
} from "../../core";
```

---

## Project Structure

```
src/view/
├── react/
│   ├── index.tsx    # OpenQuranView component
│   └── adapter.ts   # React adapter (if needed)
└── web/
    └── index.ts     # QuranViewElement + registerQuranView
```

---

## Examples

### React with Custom Styling

```tsx
import { OpenQuranView } from '@open-quran-view/view';

function CustomQuranView() {
  return (
    <div className="quran-container">
      <OpenQuranView
        page={1}
        width={600}
        height={850}
        theme="dark"
        onWordClick={(word) => {
          console.log(`Surah ${word.surahNumber}:${word.ayahNumber}`);
        }}
        className="my-quran-view"
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
}
```

### Web Component in Vanilla JS

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { registerQuranView } from './dist/view/web/index.js';
    registerQuranView();
  </script>
</head>
<body>
  <quran-view
    id="my-viewer"
    page="1"
    riwaya="hafs-v2"
    width="600"
    height="850"
    theme="light"
  ></quran-view>

  <script>
    const viewer = document.getElementById('my-viewer');

    // Listen for word clicks
    viewer.addEventListener('wordclick', (e) => {
      console.log('Clicked:', e.detail);
    });

    // Navigate after 3 seconds
    setTimeout(() => {
      viewer.page = 5;
    }, 3000);
  </script>
</body>
</html>
```

### Vue with Web Component

```vue
<template>
  <quran-view
    ref="viewer"
    page="1"
    riwaya="hafs-v2"
    theme="light"
    @wordclick="handleWordClick"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { registerQuranView } from '@open-quran-view/view/web';

registerQuranView();

const viewer = ref(null);

const handleWordClick = (e) => {
  console.log('Word:', e.detail);
};

onMounted(() => {
  viewer.value.page = 10;
});
</script>
```

---

## Theming

### Light Theme (Default)

| Element | Color |
|---------|-------|
| Background | `#fafafa` |
| Text | `#34495e` |
| Surah Name | `#2c3e50` |
| Navigation | `rgba(255,255,255,0.9)` |
| Buttons | `#667eea` |

### Dark Theme

| Element | Color |
|---------|-------|
| Background | `#1a1a2e` |
| Text | `#fff` |
| Surah Name | `#fff` |
| Navigation | `rgba(0,0,0,0.5)` |
| Buttons | `#333` |

### Custom Font

Both views use the `QuranFont` family, loaded dynamically:

```typescript
// Font is loaded via FontFace API
const fontFace = new FontFace("QuranFont", `url(${fontUrl})`);
await fontFace.load();
document.fonts.add(fontFace);
```

Font URL is generated by `@open-quran-view/core` based on layout and page number.
