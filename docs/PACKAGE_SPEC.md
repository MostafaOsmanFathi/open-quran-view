# Package Specification: open-quran-view

## 🌟 Overview

`open-quran-view` is a universal, cross-platform Quran component library designed to provide high-fidelity Mushaf rendering across Web, React, and React Native environments. It serves as a bridge for accessing multiple trusted layout systems (QUL, KFGQPC) through a single, performant API.

## 🎯 Architecture

The package follows a **Hybrid Multi-Entry** approach:

### 1. Core Logic (`/core`)

- **Responsibility**: Data orchestration, ayah lookup, and coordinate mapping.
- **Implementation**: Platform-agnostic TypeScript.
- **Origins**: Leverages rendering techniques pioneered in the `iTarek/Java-Quran-Web` project (internal reference).

### 2. Rendering Surface (`/view`)

- **P1 - Skia Powered**: For React and React Native, the primary rendering engine is **Skia**. This ensures pixel-perfect glyph placement and consistent Tajweed rendering across mobile and web.
- **P0 - Dynamic Data**: Implements on-demand fetching for fonts and layout metadata to minimize initial bundle size (supporting >9 recitations).

## 📦 Package Distribution

The package is distributed as a single npm package with multiple entry points:

- `open-quran-view/core`: Base logic and types.
- `open-quran-view/react`: Web-optimized React components.
- `open-quran-view/native`: Skia-based React Native components.

## 🛠️ Key Features

- **Multi-Recitation Search**: Integrated discovery of Hafs, Warsh, Qaloon, and more.
- **Hybrid Data Engine**:
  - **QUL**: Word-level precision (Hafs).
  - **KFGQPC**: Ayah-level support for 9+ recitations.
- **Universal API**: A unified `<QuranView />` component for all platforms.
