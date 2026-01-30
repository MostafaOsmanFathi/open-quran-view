interface QuranViewerElement extends HTMLElement {
  page: number;
  goToPage(page: number): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "quran-view": QuranViewerElement;
  }
}

declare module "*.css" {
  const content: string;
  export default content;
}

import { registerQuranView, type QuranViewAttributes } from "open-quran-view/web";

registerQuranView();

const viewer = document.getElementById("quran-viewer") as QuranViewerElement;
const pageInput = document.getElementById("page-input") as HTMLInputElement;
const themeSelect = document.getElementById("theme-select") as HTMLSelectElement;
const goBtn = document.getElementById("go-btn") as HTMLButtonElement;
const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
const wordInfo = document.getElementById("word-info") as HTMLDivElement;

goBtn.addEventListener("click", () => {
  const page = parseInt(pageInput.value, 10);
  if (page >= 1 && page <= 604) {
    viewer.setAttribute("page", String(page));
  }
});

pageInput.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    const page = parseInt(pageInput.value, 10);
    if (page >= 1 && page <= 604) {
      viewer.setAttribute("page", String(page));
    }
  }
});

prevBtn.addEventListener("click", () => {
  const currentPage = parseInt(viewer.getAttribute("page") || "1", 10);
  viewer.setAttribute("page", String(Math.max(1, currentPage - 1)));
  pageInput.value = viewer.getAttribute("page") || "1";
});

nextBtn.addEventListener("click", () => {
  const currentPage = parseInt(viewer.getAttribute("page") || "1", 10);
  viewer.setAttribute("page", String(Math.min(604, currentPage + 1)));
  pageInput.value = viewer.getAttribute("page") || "1";
});

themeSelect.addEventListener("change", () => {
  viewer.setAttribute("theme", themeSelect.value);
});

viewer.addEventListener("wordclick", (e: Event) => {
  const detail = (e as CustomEvent).detail as { id: number; surahNumber?: number; ayahNumber?: number };
  wordInfo.innerHTML = `
    <strong>Word Clicked:</strong><br>
    ID: ${detail.id} | Surah: ${detail.surahNumber ?? "N/A"} | Ayah: ${detail.ayahNumber ?? "N/A"}
  `;
});

viewer.addEventListener("pagechange", (e: Event) => {
  const detail = (e as CustomEvent).detail as { page: number };
  pageInput.value = String(detail.page);
});

console.log("Open Quran View web example loaded successfully");
