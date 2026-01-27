# open-quran-view

High-performance universal Quran rendering library using React Native Skia.

`open-quran-view` is designed with a strictly decoupled architecture. While it provides a high-fidelity rendering component for React and React Native (via Skia), the **Core logic** is platform-agnostic and can be used with any framework or even vanilla JavaScript.

---

## Features

- **Skia-Powered Rendering** - Hardware-accelerated rendering for crisp Quranic text.
- **Universal & Modular** - Decoupled Core logic allows for React-specific views or vanilla web variants.
- **Efficient Data Loading** - Optimized CSV-based layout processing and font loading.
- **Standard Mushaf Layout** - Follows the 15-line Mushaf Madina layout.
- **TypeScript First** - Built with TypeScript for a robust development experience.

---

## Project Structure

The project is organized as follows:

```text
open-quran-view/
├── src/
│   ├── core/               # Platform-agnostic logic and data processing
│   │   ├── index.ts        # Core library entry point
│   │   ├── types.ts        # Shared TypeScript interfaces
│   │   ├── fetcher.ts      # Asset fetching logic
│   │   └── data-loader.ts  # CSV/JSON processing engine
│   └── view/
│       ├── react/          # Shared Skia component (Web, iOS, Android)
│       └── web/            # Vanilla JS / HTML5 Canvas placeholder
├── assets/                 # Reusable assets (Fonts, etc.)
├── data/                   # Mushaf layout and metadata
└── docs/                   # Documentation
```

---

## Getting Started

### Installation

```bash
npm install open-quran-view
```

### Basic Usage

```tsx
import { QuranView } from 'open-quran-view';
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

---

## Documentation

For detailed information, please refer to the `docs/` directory:

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Data Structures](docs/DATA_STRUCTURES.md)
- [Layout Systems Comparison](docs/RESEARCH_Layout_Systems.md)

---

## Contributing

Contributions are welcome. Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

Jazakum Allahu Khairan
