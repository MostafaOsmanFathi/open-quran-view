# Open Quran View - Vanilla TypeScript Playground

This playground demonstrates the `OpenQuranView` Web Component with pure TypeScript.

## Usage

```bash
# From the project root
pnpm playground:web

# Or directly in this directory
pnpm install
pnpm dev
```

## Features

- Vanilla TypeScript (no framework)
- Web Component custom element (`<open-quran-view>`)
- Vite for fast development
- Hot Module Replacement (HMR)
- Workspace dependency resolution (`open-quran-view: workspace:*`)

## Usage Example

```typescript
import { registerOpenQuranView } from "open-quran-view/view/web";

registerOpenQuranView();

const viewer = document.getElementById("quran-viewer") as HTMLElement;

// Navigate to page
viewer.setAttribute("page", "5");

// Listen for word clicks
viewer.addEventListener("wordclick", (e) => {
  const { id, surahNumber, ayahNumber } = e.detail;
  console.log("Word clicked:", { id, surahNumber, ayahNumber });
});
```

## Custom Element Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `page` | string | Page number (1-604) |
| `mushaf-layout` | string | Quran reading/style (e.g., "hafs-v2") |
| `width` | string | Viewer width in pixels |
| `height` | string | Viewer height in pixels |
| `theme` | "light" \| "dark" | Color theme |

## Events

| Event | Detail |
|-------|--------|
| `load` | `{ lines: [...], metrics: {...} }` |
| `pagechange` | `{ page: number }` |
| `wordclick` | `{ id: number; surahNumber?: number; ayahNumber?: number }` |
