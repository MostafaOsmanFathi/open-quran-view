import { defineConfig } from "tsup";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const ASSETS_SRC = "src/assets";
const ASSETS_DIST = "dist/assets";
const FONTS_SRC = "src/data/fonts";
const FONTS_DIST = "dist/data/fonts";

function copyAssets() {
  if (existsSync(ASSETS_SRC)) {
    mkdirSync(ASSETS_DIST, { recursive: true });
    copyDir(ASSETS_SRC, ASSETS_DIST);
  }
}

function copyFonts() {
  if (existsSync(FONTS_SRC)) {
    mkdirSync(FONTS_DIST, { recursive: true });
    copyDir(FONTS_SRC, FONTS_DIST);
  }
}

function copyDir(src: string, dest: string) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
    "view/index": "src/view/react/index.tsx",
    "view/react/index": "src/view/react/index.tsx",
    "view/web/index": "src/view/web/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
  external: ["react"],
  onSuccess: () => {
    copyAssets();
    copyFonts();
    console.log("Assets and fonts copied to dist");
  },
});
