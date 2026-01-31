# Font Loading Strategy Issue

## Problem Statement

The `open-quran-view` package uses `import.meta.url` with `fetch()` to load fonts and data files. This approach works during local development with workspace protocol but **fails when the package is published to npm**.

### Current Implementation

```typescript
// src/core/font-loader.ts
const fontUrl = new URL("../data/fonts/hafs-v2/p1.woff2", import.meta.url).href;
const response = await fetch(fontUrl);
```

This creates a `file://` URL like:
```
file:///path/to/node_modules/open-quran-view/dist/data/fonts/p1.woff2
```

### Why It Fails

1. **Browser Security Restriction**: Browsers cannot make HTTP requests to `file://` URLs from `node_modules`
2. **Vite Dev Server**: Doesn't serve files from `node_modules` during development
3. **Vite Production Build**: Doesn't copy assets from `node_modules` to build output
4. **Published Package**: Consumer apps have no access to package internal files

### Error Observed

```
Failed to load page: NetworkError: A network error occurred.
```

## Why It Works Locally But Not Published

| Scenario | Behavior |
|----------|----------|
| **workspace: protocol** | Vite resolves locally, intercepts requests, serves files during dev |
| **Published to npm** | Package installed in `node_modules`, but files are inaccessible |

## Current Data/Files Loaded via fetch()

| File Type | Location | Purpose |
|-----------|----------|---------|
| Fonts (WOFF2) | `dist/data/fonts/{layout}/p{page}.woff2` | Page rendering |
| Fonts (OTF/TTF) | `dist/data/fonts/hafs-unicode/*.ttf` | Unicode layout |
| Pages JSON | `dist/data/pages/{layout}/pages.json` | Page metadata |
| Surahs JSON | `dist/data/metadata/surahs.json` | Surah information |
| Juzs JSON | `dist/data/metadata/juz.json` | Juz information |
| Surah Name Font | `dist/data/shared/surah-name-v4.woff2` | Surah headers |

## Solution Options

### Option 1: Inline Everything (Base64)

**Approach**: Convert all assets to base64 strings and bundle directly in JavaScript.

**Pros**:
- Truly zero-config - no external assets needed
- Works offline
- Self-contained package

**Cons**:
- Massive bundle size (600+ fonts = ~50MB+)
- Slow initial load
- Memory issues in browser

**Implementation**:
```typescript
import page1Font from '../data/fonts/hafs-v2/p1.woff2?base64';
const fontUrl = `data:font/woff2;base64,${page1Font}`;
```

### Option 2: Static Asset URLs with Copy Plugin

**Approach**: Export a Vite plugin that copies assets to consumer's `public/` directory.

**Pros**:
- Clean separation of assets and code
- Reasonable bundle size
- Standard browser caching

**Cons**:
- Requires consumer to add plugin to their Vite config
- Not truly "no config"

**Implementation**:
```typescript
// open-quran-view/vite-plugin.ts
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export function openQuranViewAssets() {
  return {
    name: 'open-quran-view-assets',
    buildEnd() {
      const publicDir = join(process.cwd(), 'public', 'open-quran-view');
      mkdirSync(publicDir, { recursive: true });
      copyFileSync(
        join(__dirname, '../dist/data'),
        join(publicDir, 'data')
      );
    }
  };
}
```

### Option 3: CDN-hosted Assets

**Approach**: Host fonts and data on a CDN, fetch from URL.

**Pros**:
- Small bundle size
- Standard caching behavior
- Works with any bundler

**Cons**:
- Requires internet connection
- CDN setup and maintenance
- Potential versioning issues

**Implementation**:
```typescript
const CDN_BASE = 'https://cdn.jsdelivr.net/npm/open-quran-view@0.1.0';
const fontUrl = `${CDN_BASE}/dist/data/fonts/hafs-v2/p1.woff2`;
```

### Option 4: Hybrid Approach (Recommended)

**Approach**: Bundle small assets inline, serve large assets from public directory with automatic copy.

**Strategy**:
1. Inline pages.json, surahs.json, juz.json (small JSON files)
2. Use Vite plugin to copy fonts to public
3. Provide clear setup instructions for consumers

**Pros**:
- Reasonable bundle size
- Clear upgrade path
- Works offline for core data

**Cons**:
- Still requires some consumer setup

## Recommended Solution: Static Asset URLs with Vite Plugin

This approach provides the best balance of usability and performance.

### Package Changes Required

1. Update `package.json` exports to include plugin:
```json
{
  "exports": {
    "./vite-plugin": "./vite-plugin.ts",
    "./view": { ... }
  }
}
```

2. Create `vite-plugin.ts`:
```typescript
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

export function openQuranViewAssets() {
  return {
    name: 'open-quran-view-assets',
    buildEnd() {
      const srcDir = join(__dirname, 'dist', 'data');
      const destDir = join(process.cwd(), 'public', 'open-quran-view', 'data');
      
      if (existsSync(srcDir)) {
        copyDirRecursive(srcDir, destDir);
        console.log('✓ open-quran-view assets copied to public/open-quran-view');
      }
    }
  };
}

function copyDirRecursive(src: string, dest: string) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}
```

3. Update font-loader to use relative paths:
```typescript
const fontUrl = `/open-quran-view/data/fonts/${layout}/p${page}.woff2`;
```

### Consumer Usage

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { openQuranViewAssets } from 'open-quran-view/vite-plugin';

export default defineConfig({
  plugins: [react(), openQuranViewAssets()],
});
```

```tsx
// App.tsx
import { OpenQuranView } from 'open-quran-view/view';

function App() {
  return <OpenQuranView />;
}
```

## Timeline for Fix

1. **Immediate**: Update font-loader to use relative paths
2. **Short-term**: Create and publish Vite plugin
3. **Medium-term**: Document migration guide for consumers
4. **Long-term**: Consider base64 inlining for smaller assets

## Related Files

- `src/core/font-loader.ts` - Font loading logic
- `src/core/data-loader.ts` - Data file loading logic
- `tsup.config.ts` - Build configuration
- `dist/view/react/index.js` - Built React component
- `dist/view/web/index.js` - Built Web Component
