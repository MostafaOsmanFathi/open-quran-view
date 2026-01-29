import {
  loadPage,
  loadFont,
  createLayoutCalculator,
  type MushafLayout,
  type PageLayout,
} from "../../core";

const STYLES = `
  :host {
    display: block;
    position: relative;
    overflow: hidden;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .quran-viewer {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .quran-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: inherit;
  }

  .quran-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .quran-line {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .quran-surah-name {
    font-weight: bold;
  }

  .quran-word {
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .quran-nav {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 8px 16px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }

  .quran-nav button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    opacity: 1;
  }

  .quran-nav button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .quran-nav input {
    width: 60px;
    padding: 6px;
    text-align: center;
    border: 1px solid;
    border-radius: 4px;
  }

  .quran-nav span {
    font-size: 0.9em;
  }
`;

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>${STYLES}</style>
  <div class="quran-viewer">
    <div class="quran-loading">جاري التحميل...</div>
    <div class="quran-content"></div>
    <div class="quran-nav" style="display: none;">
      <button class="quran-prev">السابق</button>
      <input type="number" class="quran-page-input" min="1" />
      <span class="quran-page-total"></span>
      <button class="quran-next">التالي</button>
    </div>
  </div>
`;

export type QuranViewAttributes = {
  page?: string;
  riwaya?: string;
  width?: string;
  height?: string;
  theme?: "light" | "dark";
};

export class QuranViewElement extends HTMLElement {
  private layout: MushafLayout = "hafs-v2";
  private calculator: ReturnType<typeof createLayoutCalculator> | null = null;
  private currentPage: number = 1;
  private totalPages: number = 604;
  private container: HTMLElement;
  private content: HTMLElement;
  private loading: HTMLElement;
  private nav: HTMLElement;
  private pageInput: HTMLInputElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private fontLoaded: boolean = false;
  private fontFaceSheet: HTMLStyleElement | null = null;

  static get observedAttributes(): string[] {
    return ["page", "riwaya", "width", "height", "theme"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(TEMPLATE.content.cloneNode(true));

    this.container = this.shadowRoot!.querySelector(".quran-viewer")!;
    this.content = this.shadowRoot!.querySelector(".quran-content")!;
    this.loading = this.shadowRoot!.querySelector(".quran-loading")!;
    this.nav = this.shadowRoot!.querySelector(".quran-nav")!;
    this.pageInput = this.shadowRoot!.querySelector(".quran-page-input")!;
    this.prevBtn = this.shadowRoot!.querySelector(".quran-prev")!;
    this.nextBtn = this.shadowRoot!.querySelector(".quran-next")!;

    this.bindEvents();
  }

  connectedCallback(): void {
    this.initialize();
  }

  disconnectedCallback(): void {
    this.calculator = null;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ): void {
    if (oldValue === newValue) return;

    switch (name) {
      case "page":
        this.currentPage = parseInt(newValue, 10) || 1;
        this.renderPage();
        break;
      case "riwaya":
      case "width":
      case "height":
      case "theme":
        this.initialize();
        break;
    }
  }

  private bindEvents(): void {
    this.prevBtn.addEventListener("click", () =>
      this.goToPage(this.currentPage - 1),
    );
    this.nextBtn.addEventListener("click", () =>
      this.goToPage(this.currentPage + 1),
    );
    this.pageInput.addEventListener("change", () => {
      const page = parseInt(this.pageInput.value, 10);
      if (page >= 1 && page <= this.totalPages) {
        this.goToPage(page);
      } else {
        this.pageInput.value = String(this.currentPage);
      }
    });
  }

  private async initialize(): Promise<void> {
    const width = parseInt(this.getAttribute("width") || "600", 10);
    const height = parseInt(this.getAttribute("height") || "850", 10);
    const theme = (this.getAttribute("theme") || "light") as "light" | "dark";
    const riwaya = this.getAttribute("riwaya") as MushafLayout | null;
    this.layout = riwaya || "hafs-v2";

    this.calculator = createLayoutCalculator({
      pageWidth: width,
      pageHeight: height,
    });

    this.container.style.width = `${width}px`;
    this.container.style.height = `${height}px`;
    this.updateTheme(theme);

    await this.loadFont();

    try {
      this.nav.querySelector(".quran-page-total")!.textContent =
        `من ${this.totalPages}`;
      this.nav.style.display = "flex";
      this.renderPage();
    } catch (error) {
      this.loading.textContent = "فشل في تحميل البيانات";
      console.error("Failed to initialize:", error);
    }
  }

  private async loadFont(): Promise<void> {
    if (this.fontLoaded) return;

    await loadFont(this.layout, this.currentPage);

    this.fontFaceSheet = document.createElement("style");
    this.fontFaceSheet.textContent = `
      .quran-word, .quran-surah-name {
        font-family: "QuranFont", system-ui, -apple-system, sans-serif !important;
      }
    `;
    this.shadowRoot?.appendChild(this.fontFaceSheet);
    this.fontLoaded = true;
  }

  private updateTheme(theme: "light" | "dark"): void {
    const bgColor = theme === "dark" ? "#1a1a2e" : "#fafafa";
    const textColor = theme === "dark" ? "#fff" : "#333";
    const navBg =
      theme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)";
    const btnBg = theme === "dark" ? "#333" : "#667eea";
    const inputBg = theme === "dark" ? "#222" : "#fff";
    const inputBorder = theme === "dark" ? "#444" : "#ddd";
    const inputColor = theme === "dark" ? "#fff" : "#333";

    this.container.style.background = bgColor;
    this.loading.style.color = textColor;

    this.nav.style.background = navBg;
    this.prevBtn.style.background = btnBg;
    this.nextBtn.style.background = btnBg;
    this.prevBtn.style.color = "#fff";
    this.nextBtn.style.color = "#fff";
    this.pageInput.style.background = inputBg;
    this.pageInput.style.borderColor = inputBorder;
    this.pageInput.style.color = inputColor;
    this.nav.querySelector(".quran-page-total")!.textContent =
      `من ${this.totalPages}`;
  }

  private async renderPage(): Promise<void> {
    if (!this.calculator) return;

    this.showLoading(true);
    this.pageInput.value = String(this.currentPage);
    this.prevBtn.disabled = this.currentPage <= 1;
    this.nextBtn.disabled = this.currentPage >= this.totalPages;

    try {
      const quranPage = await loadPage(this.layout, this.currentPage);
      if (!quranPage) {
        throw new Error("Page not found");
      }
      const layout = this.calculator.calculatePageLayout(quranPage);
      this.renderLayout(layout);
      this.showLoading(false);
    } catch (error) {
      this.loading.textContent = "فشل في تحميل الصفحة";
      console.error("Failed to load page:", error);
    }
  }

  private renderLayout(layout: PageLayout): void {
    this.content.innerHTML = "";

    for (const line of layout.lines) {
      const lineEl = document.createElement("div");
      lineEl.className = "quran-line";
      lineEl.style.cssText = `
        height: ${layout.metrics.lineHeight}px;
        top: ${line.y - layout.metrics.lineHeight + layout.metrics.baselineOffset}px;
        justify-content: ${line.isCentered ? "center" : "flex-start"};
        padding-left: ${line.isCentered ? 0 : layout.metrics.pagePadding.left}px;
      `;

      const theme = (this.getAttribute("theme") || "light") as "light" | "dark";
      const surahColor = theme === "dark" ? "#fff" : "#2c3e50";
      const wordColor = theme === "dark" ? "#fff" : "#34495e";
      const hoverBg = theme === "dark" ? "#333" : "#e0e0e0";

      if (line.lineType === "header") {
        const surahEl = document.createElement("div");
        surahEl.className = "quran-surah-name";
        surahEl.style.cssText = `font-size: 28px; color: ${surahColor};`;
        surahEl.textContent = `سورة ${line.surahNumber}`;
        lineEl.appendChild(surahEl);
      } else {
        for (const word of line.words) {
          const wordEl = document.createElement("span");
          wordEl.className = "quran-word";
          wordEl.textContent = word.text || `[${word.id}]`;
          wordEl.style.cssText = `
            font-size: 24px;
            color: ${wordColor};
            margin: 0 4px;
            padding: 2px 6px;
            border-radius: 4px;
          `;

          wordEl.addEventListener("mouseenter", () => {
            wordEl.style.background = hoverBg;
          });
          wordEl.addEventListener("mouseleave", () => {
            wordEl.style.background = "transparent";
          });
          wordEl.addEventListener("click", () => {
            this.dispatchEvent(
              new CustomEvent("wordclick", {
                detail: {
                  id: word.id,
                  surahNumber: word.surahNumber,
                  ayahNumber: word.ayahNumber,
                },
                bubbles: true,
                composed: true,
              }),
            );
          });

          lineEl.appendChild(wordEl);
        }
      }

      this.content.appendChild(lineEl);
    }
  }

  private showLoading(show: boolean): void {
    this.loading.style.display = show ? "block" : "none";
  }

  goToPage(page: number): void {
    page = Math.max(1, Math.min(page, this.totalPages));
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.renderPage();
    }
  }

  get page(): number {
    return this.currentPage;
  }

  set page(value: number) {
    this.setAttribute("page", String(value));
  }
}

customElements.define("quran-view", QuranViewElement);

export function registerQuranView(): void {
  if (!customElements.get("quran-view")) {
    customElements.define("quran-view", QuranViewElement);
  }
}

export default QuranViewElement;
