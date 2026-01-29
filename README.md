# open-quran-view

High-performance universal Quran rendering library using QUL (Quranic Universal Library) format.

`open-quran-view` is designed with a strictly decoupled architecture. While it provides a high-fidelity rendering component for React and web, the **Core logic** is platform-agnostic and can be used with any framework or even vanilla JavaScript.

---

## Features

- **QUL Format Support** - Uses Quranic Universal Library layout format for platform-agnostic data.
- **Universal & Modular** - Decoupled Core logic allows for React-specific views or vanilla web variants.
- **Single Font System** - Uses DigitalKhattV2.ttf for consistent rendering.
- **TypeScript First** - Built with TypeScript for a robust development experience.

---

## Project Structure

The project is organized as follows:

```text
open-quran-view/
├── src/
│   ├── core/               # Platform-agnostic logic
│   │   ├── index.ts        # Core library entry point
│   │   ├── types.ts        # Shared TypeScript interfaces
│   │   ├── data-loader.ts  # Data loading with caching
│   │   ├── font-loader.ts  # Font URL generation
│   │   ├── lookup.ts       # Navigation and verse lookup
│   │   └── layout-calculator.ts # Page layout calculation
│   ├── view/
│   │   ├── react/          # React component
│   │   └── web/            # Web Component
│   └── data/               # QUL data assets
│       └── pages/
│           ├── hafs-v2/
│           ├── hafs-v4/
│           └── hafs-unicode/
└── dist/                   # Build output
```

---

## Getting Started

### Installation

```bash
npm install open-quran-view
```

### Core Module (Framework Agnostic)

```typescript
import { loadPage, getFontUrl, createLayoutCalculator } from '@open-quran-view/core';

const calculator = createLayoutCalculator({ pageWidth: 600, pageHeight: 850 });

async function renderPage() {
  const page = await loadPage('hafs-v2', 1);
  const fontUrl = getFontUrl('hafs-v2', 1);
  const layout = calculator.calculatePageLayout(page);
  console.log(layout);
}
```

### React Component

```tsx
import { OpenQuranView } from 'open-quran-view/view';

function App() {
  return (
    <OpenQuranView
      page={1}
      width={600}
      height={850}
      onWordClick={(word) => console.log(word)}
    />
  );
}
```

You can also import explicitly:

```tsx
import { OpenQuranView } from 'open-quran-view/view/react';
```

### Web Component

```html
<script type="module">
  import { registerQuranView } from 'open-quran-view/view/web';

  registerQuranView();
</script>

<quran-view page="1" width="600" height="850" riwaya="hafs-v2"></quran-view>
```

---

## API Reference

### Core Module (`@open-quran-view/core`)

#### Data Loading

```typescript
import { loadPage, loadAllPages, loadSurahs, loadJuzs } from '@open-quran-view/core';

// Load a single page
const page = await loadPage('hafs-v2', 1);

// Load all pages
const allPages = await loadAllPages('hafs-v2');

// Load metadata
const surahs = await loadSurahs();
const juzs = await loadJuzs();
```

#### Font Loading

```typescript
import { getFontUrl } from '@open-quran-view/core';

const fontUrl = await getFontUrl('hafs-v2', 1);
```

#### Layout Calculator

```typescript
import { createLayoutCalculator } from '@open-quran-view/core';

const calculator = createLayoutCalculator({
  pageWidth: 600,
  pageHeight: 850,
  fontSize: 24,
});

const layout = calculator.calculatePageLayout(page);
const metrics = calculator.getMetrics();
```

#### Lookup Functions

```typescript
import {
  getPageForVerse,
  getVerseLocation,
  getNavigation,
  getSurahByPage,
} from '@open-quran-view/core';

const result = await getPageForVerse('1:1');
const location = await getVerseLocation(1, 1);
const navigation = await getNavigation(1);
const surah = await getSurahByPage(1);
```

### React Component (`@open-quran-view/view`)

```tsx
import { OpenQuranView } from 'open-quran-view/view';

<OpenQuranView
  page={1}
  width={600}
  height={850}
  theme="light"
  onPageChange={(page) => console.log(page)}
  onLoad={(layout) => console.log(layout)}
  onWordClick={(word) => console.log(word)}
/>
```

### Web Component (`@open-quran-view/view/web`)

```typescript
import { registerQuranView } from 'open-quran-view/view/web';

registerQuranView();
```

**Attributes:**
- `page` - Page number (1-604)
- `riwaya` - Mushaf layout (`hafs-v2`, `hafs-v4`, `hafs-unicode`)
- `width` - Component width
- `height` - Component height
- `theme` - `light` or `dark`

**Events:**
- `wordclick` - Fired when a word is clicked

---

## Building

```bash
pnpm install
pnpm build    # Build the library
pnpm lint     # Run ESLint
pnpm test     # Run tests
```

---

## Mushaf Layouts

| Layout | Description |
|--------|-------------|
| `hafs-v2` | Hafs from Asim via the way of Warsh |
| `hafs-v4` | Hafs from Asim via the way of Shu'bah |
| `hafs-unicode` | Standard Unicode Quran |

---

Jazakum Allahu Khairan
