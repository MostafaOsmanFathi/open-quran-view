# open-quran-view

High-performance universal Quran rendering library using QUL (Quranic Universal Library) format.

`open-quran-view` provides React and Web Component views for rendering Quran pages with high fidelity.

---

## Features

- **QUL Format Support** - Uses Quranic Universal Library layout format for platform-agnostic data.
- **Universal Views** - React component and Vanilla Web Component with consistent API.
- **TypeScript First** - Built with TypeScript for a robust development experience.
- **Static Assets** - Self-contained fonts and metadata included in package.

---

## Project Structure

```
open-quran-view/
├── src/
│   ├── core/               # Platform-agnostic core logic
│   │   ├── static/         # Static asset URLs
│   │   ├── data-loader.ts  # Data loading with caching
│   │   ├── font-loader.ts  # Font loading
│   │   └── lookup.ts       # Navigation & verse lookup
│   ├── view/
│   │   ├── react/          # React component
│   │   └── web/            # Web Component
│   └── data/               # QUL data assets (generated)
├── docs/                   # Documentation
├── scripts/                # Data generation scripts
├── playground/             # Development playgrounds
└── dist/                   # Build output
```

---

## Getting Started

### Installation

```bash
npm install open-quran-view
```

### React Component

```tsx
import { OpenQuranView } from 'open-quran-view/view';

function App() {
  return (
    <OpenQuranView
      page={1}
      mushafLayout="hafs-v2"
      width={600}
      height={850}
      onWordClick={(word) => console.log(word)}
    />
  );
}
```

Explicit imports:

```tsx
import { OpenQuranView } from 'open-quran-view/view/react';
```

### Web Component

```html
<script type="module">
  import { registerOpenQuranView } from 'open-quran-view/view/web';
  registerOpenQuranView();
</script>

<open-quran-view page="1" mushaf-layout="hafs-v2" width="600" height="850"></open-quran-view>
```

---

## API Reference

### React Component (`@open-quran-view/view`)

```tsx
import { OpenQuranView, type OpenQuranViewProps } from 'open-quran-view/view';

<OpenQuranView
  page={1}
  width={600}
  height={850}
  theme="light"
  mushafLayout="hafs-v2"
  onPageChange={(page) => console.log(page)}
  onLoad={(layout) => console.log(layout)}
  onWordClick={(word) => console.log(word)}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | number | `1` | Page number (1-604) |
| `width` | number | `600` | Component width in pixels |
| `height` | number | `850` | Component height in pixels |
| `theme` | `"light" \| "dark"` | `"light"` | Color theme |
| `mushafLayout` | `"hafs-v2" \| "hafs-v4" \| "hafs-unicode"` | `"hafs-v2"` | Mushaf layout |
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

### Web Component (`@open-quran-view/view/web`)

```typescript
import { registerOpenQuranView, type OpenQuranViewProps } from 'open-quran-view/view/web';
registerOpenQuranView();
```

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | string | `"1"` | Page number (1-604) |
| `mushaf-layout` | string | `"hafs-v2"` | Mushaf layout |
| `width` | string | `"600"` | Component width in pixels |
| `height` | string | `"850"` | Component height in pixels |
| `theme` | string | `"light"` | Color theme (`light` or `dark`) |

**Events:**

| Event | Detail | Description |
|-------|--------|-------------|
| `load` | `PageLayout` | Fired when page loads |
| `pagechange` | `{ page: number }` | Fired when page changes |
| `wordclick` | `WordInfo` | Fired when a word is clicked |

**JavaScript API:**

```typescript
const viewer = document.querySelector('open-quran-view') as OpenQuranView;

viewer.page = 10;
viewer.goToPage(10);
console.log(viewer.page);
viewer.setAttribute('mushaf-layout', 'hafs-v4');
viewer.setAttribute('theme', 'dark');
```

---

## Mushaf Layouts

| Layout | Description |
|--------|-------------|
| `hafs-v2` | Hafs from Asim via the way of Warsh |
| `hafs-v4` | Hafs from Asim via the way of Shu'bah |
| `hafs-unicode` | Standard Unicode Quran |

---

## Documentation

See [`docs/`](docs/) directory for:

- [API Reference](docs/api/views.md) - Detailed views module documentation
- [Architecture](docs/architecture/data-structure.md) - Data structures and file formats
- [Architecture](docs/architecture/static-assets.md) - Static assets system (v0.2.0+)
- [Guides](docs/guides/font-loading.md) - Font loading strategy

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm generate:all` | Generate all static assets |
| `pnpm generate:static:fonts` | Generate font URLs |
| `pnpm generate:static:data` | Generate data URLs |
| `pnpm build` | Build the package |
| `pnpm prepare` | Auto-generate + build on install |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint code |

---

## Development

```bash
# Install dependencies
pnpm install

# Generate static assets
pnpm run generate:all

# Build package
pnpm run build

# Run development playground
pnpm run playground:react
```

---

Jazakum Allahu Khairan
