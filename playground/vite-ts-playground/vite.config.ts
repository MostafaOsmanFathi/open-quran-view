import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "open-quran-view": path.resolve(__dirname, "../../dist"),
      "open-quran-view/react": path.resolve(
        __dirname,
        "../../dist/view/react/index.js"
      ),
      "open-quran-view/web": path.resolve(
        __dirname,
        "../../dist/view/web/index.js"
      ),
      "open-quran-view/core": path.resolve(
        __dirname,
        "../../dist/core/index.js"
      ),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "../../..")],
    },
  },
});
