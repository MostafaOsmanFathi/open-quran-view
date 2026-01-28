import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "open-quran-view": path.resolve(__dirname, "../../dist"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "../../..")],
    },
  },
});
