import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "core/index": "src/core/index.ts",
    "view/react/index": "src/view/react/index.tsx",
    "view/web/index": "src/view/web/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
  external: ["react"],
});
