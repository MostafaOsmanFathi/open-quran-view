# 📖 open-quran-view

> **High-Performance Universal Quran Rendering Library** using React Native Skia.

`open-quran-view` is a modern, high-performance library designed to render the Holy Quran with pixel-perfect accuracy across all platforms. Built on top of **React Native Skia**, it provides a universal rendering engine that works seamlessly on **Web, iOS, and Android**.

---

## ✨ Features

- 🎨 **Skia-Powered Rendering** - Utilizing hardware acceleration for smooth, crisp Quranic glyphs.
- 📜 **Universal Support** - Single codebase for Web, Mobile, and Desktop via React Native Skia.
- ⚡ **Dynamic Data Loading** - Efficient CSV-based layout processing with on-demand font loading.
- 🧭 **Authentic Mushaf Layout** - Faithful replication of the 15-line Mushaf Madina layout.
- 🛠️ **Developer Friendly** - Clean TypeScript API with modular architecture.

---

## 🏗️ Project Structure

The project has been refactored into a modern library structure:

```
open-quran-view/
├── src/
│   ├── core/               # Platform-agnostic business logic & data loading
│   │   ├── index.ts        # Main Core entry
│   │   ├── types.ts        # Shared TypeScript interfaces
│   │   ├── fetcher.ts      # Universal asset fetching logic
│   │   └── data-loader.ts  # CSV/JSON processing engine
│   └── view/
│       └── react/          # React / React Native Skia components
│           └── index.tsx   # <QuranView /> component
├── assets/                 # Reusable assets (Fonts, etc.)
├── data/                   # Mushaf layout and metadata (JSON/CSV)
└── docs/                   # Comprehensive technical documentation
```

---

## 🚀 Getting Started

### Installation

```bash
npm install open-quran-view
```

### Basic Usage (React/React Native)

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

## 📖 Documentation

For detailed guides and API references, please see the [docs/](docs/) directory:

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Data Structures](docs/DATA_STRUCTURES.md)
- [Layout Systems Comparison](docs/RESEARCH_Layout_Systems.md)

---

## 🤝 Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to help build the future of digital Quran rendering.

---

<div align="center">

**Made with ❤️ for the Muslim Ummah**

*Jazakum Allahu Khairan - May Allah reward you with goodness*

</div>
