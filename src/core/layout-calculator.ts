import type { Page, Word } from "./types";

export type LineLayout = {
  lineNumber: number;
  y: number;
  words: WordLayout[];
  isCentered: boolean;
  lineType: "text" | "surah_name";
  surahNumber?: number;
};

export type WordLayout = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  surahNumber?: number;
  ayahNumber?: number;
};

export type PageMetrics = {
  lineHeight: number;
  baselineOffset: number;
  pagePadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

export type PageLayout = {
  pageNumber: number;
  lines: LineLayout[];
  metrics: PageMetrics;
};

export type LayoutCalculatorOptions = {
  pageWidth: number;
  pageHeight: number;
  fontSize?: number;
  lineHeight?: number;
};

export function createLayoutCalculator(options: LayoutCalculatorOptions): {
  calculatePageLayout: (page: Page) => PageLayout;
  getMetrics: () => PageMetrics;
} {
  const pageWidth = options.pageWidth;
  const pageHeight = options.pageHeight;
  const fontSize = options.fontSize || 24;
  const lineHeight = options.lineHeight || fontSize * 1.5;

  const paddingTop = pageHeight * 0.05;
  const paddingBottom = pageHeight * 0.05;
  const paddingLeft = pageWidth * 0.08;
  const paddingRight = pageWidth * 0.08;

  const metrics: PageMetrics = {
    lineHeight,
    baselineOffset: lineHeight * 0.2,
    pagePadding: {
      top: Math.round(paddingTop),
      bottom: Math.round(paddingBottom),
      left: Math.round(paddingLeft),
      right: Math.round(paddingRight),
    },
  };

  function shouldCenterLine(words: Word[], chapterId: number): boolean {
    if (words.length === 0) return false;
    const firstWord = words[0];
    return firstWord.position === 1 && firstWord.verse === 1 && chapterId !== 1;
  }

  function estimateTextWidth(text: string): number {
    const avgCharWidth = fontSize * 0.5;
    return text.length * avgCharWidth;
  }

  function calculateLineLayout(
    line: {
      lineNumber: number;
      words: Word[];
      metadata: { verseKey: string; chapterId: number };
    },
    startY: number,
    lineIndex: number,
  ): LineLayout {
    const words: WordLayout[] = [];
    const y = startY + lineIndex * metrics.lineHeight;
    let currentX = metrics.pagePadding.left;

    for (const word of line.words) {
      const wordLayout: WordLayout = {
        id: word.id,
        x: currentX,
        y,
        width: estimateTextWidth(word.text),
        height: fontSize,
        text: word.text,
        surahNumber: word.surah,
        ayahNumber: word.verse,
      };
      words.push(wordLayout);
      currentX += wordLayout.width + 8;
    }

    const isCentered = shouldCenterLine(line.words, line.metadata.chapterId);

    return {
      lineNumber: line.lineNumber,
      y,
      words,
      isCentered,
      lineType: "text",
    };
  }

  function calculatePageLayout(page: Page): PageLayout {
    const lines: LineLayout[] = [];
    const startY = metrics.pagePadding.top + metrics.lineHeight / 2;

    for (let i = 0; i < page.lines.length; i++) {
      const line = page.lines[i];
      const lineLayout = calculateLineLayout(line, startY, i);
      lines.push(lineLayout);
    }

    return {
      pageNumber: page.pageNumber,
      lines,
      metrics,
    };
  }

  return {
    calculatePageLayout,
    getMetrics: () => ({ ...metrics }),
  };
}
