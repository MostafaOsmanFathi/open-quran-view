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
│   │   ├── mushaf-loader.ts # QUL layout loading
│   │   └── word-data-loader.ts # Word data loading
│   ├── view/
│   │   ├── react/          # React component
│   │   └── web/            # Web Component
│   └── test/               # Test setup
├── assets/              # QUL data assets
│   └── riwaya/
│       └── hafs-digitalkhatt/
└── dist/                   # Build output
```

---

## Getting Started

### Installation

```bash
npm install open-quran-view
```

### Basic Usage

```tsx
import { createOpenQuranView } from 'open-quran-view';

const quran = createOpenQuranView();

async function renderPage() {
  const page = await quran.getPage(1);
  console.log(page);
}
```

### React Component

```tsx
import { OpenMushafView } from 'open-quran-view/view/react';

function App() {
  return (
    <OpenMushafView
      page={1}
      width={600}
      height={850}
      onWordClick={(word) => console.log(word)}
    />
  );
}
```

### Web Component

```html
<script type="module">
  import { registerQuranView } from 'open-quran-view/view/web';

  registerQuranView();
</script>

<quran-view page="1" width="600" height="850"></quran-view>
```

---

## API Reference

### createOpenQuranView()

Creates a new Quran viewer instance with QUL data.

```typescript
import { createOpenQuranView } from 'open-quran-view';

const quran = createOpenQuranView();
```

### Methods

- `getPage(pageNumber: number)` - Returns page data with lines and words
- `getFontUrl()` - Returns the font URL for the riwaya
- `getWordsInRange(startId: number, endId: number)` - Returns words in ID range
- `getWordById(id: number)` - Returns a specific word by ID
- `getMushafInfo()` - Returns mushaf metadata

---

## Building

```bash
yarn build    # Build the library
yarn lint     # Run ESLint
yarn test     # Run tests
```

---

Jazakum Allahu Khairan
