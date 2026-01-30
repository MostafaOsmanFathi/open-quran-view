/// <reference types="vite/client" />

interface QuranViewAttributes {
  page?: string;
  riwaya?: string;
  width?: string;
  height?: string;
  theme?: "light" | "dark";
}

interface QuranViewerElement extends HTMLElement {
  page: number;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  goToPage(page: number): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "quran-view": QuranViewerElement;
  }
}

export {};
