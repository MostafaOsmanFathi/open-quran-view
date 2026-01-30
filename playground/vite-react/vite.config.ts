import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const openQuranViewRoot = path.resolve(__dirname, "../../dist");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "open-quran-view": openQuranViewRoot,
    },
    extensions: [".js", ".ts", ".tsx"],
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "../../..")],
    },
  },
});
