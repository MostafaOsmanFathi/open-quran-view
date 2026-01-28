import type {
  QuranPage,
  QuranWord,
  LineType,
  Riwaya,
} from "./types";

export type PositionedWord = {
  id: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  lineNumber: number;
  wordIndex: number;
  surahNumber?: number;
  ayahNumber?: number;
};

export type PositionedLine = {
  lineNumber: number;
  y: number;
  isCentered: boolean;
  lineType: LineType;
  surahNumber?: number;
  words: PositionedWord[];
  startX: number;
  endX: number;
  totalWidth: number;
};

export type PageLayout = {
  pageNumber: number;
  width: number;
  height: number;
  lines: PositionedLine[];
  fontUrl: string;
  metrics: PageMetrics;
};

export type PageMetrics = {
  lineHeight: number;
  wordSpacing: number;
  baselineOffset: number;
  pagePadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  lineCount: number;
};

export type FontMetrics = {
  ascent: number;
  descent: number;
  width: Map<string, number>;
};

export interface LayoutConfig {
  pageWidth: number;
  pageHeight: number;
  linesPerPage: number;
  fontSize: number;
  lineHeightRatio: number;
  wordSpacing: number;
  pagePadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

const DEFAULT_CONFIG: LayoutConfig = {
  pageWidth: 600,
  pageHeight: 850,
  linesPerPage: 15,
  fontSize: 24,
  lineHeightRatio: 1.4,
  wordSpacing: 4,
  pagePadding: {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40,
  },
};

export class LayoutCalculator {
  private config: LayoutConfig;
  private fontMetrics: FontMetrics | null = null;

  constructor(config: Partial<LayoutConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  setFontMetrics(metrics: FontMetrics): void {
    this.fontMetrics = metrics;
  }

  calculatePageLayout(page: QuranPage): PageLayout {
    const metrics = this.calculateMetrics();
    const lines = this.calculateLines(page, metrics);

    return {
      pageNumber: page.page_number,
      width: this.config.pageWidth,
      height: this.config.pageHeight,
      lines,
      fontUrl: page.font_url,
      metrics,
    };
  }

  private calculateMetrics(): PageMetrics {
    const lineHeight = this.config.fontSize * this.config.lineHeightRatio;
    const baselineOffset = lineHeight * 0.25;

    return {
      lineHeight,
      wordSpacing: this.config.wordSpacing,
      baselineOffset,
      pagePadding: { ...this.config.pagePadding },
      lineCount: this.config.linesPerPage,
    };
  }

  private calculateLines(page: QuranPage, metrics: PageMetrics): PositionedLine[] {
    const lines: PositionedLine[] = [];
    const contentWidth = this.config.pageWidth - metrics.pagePadding.left - metrics.pagePadding.right;

    for (const pageLine of page.lines) {
      const lineY = this.calculateLineY(pageLine.line_number, metrics);
      const positionedLine = this.calculateLinePosition(
        pageLine,
        lineY,
        contentWidth,
        metrics
      );
      lines.push(positionedLine);
    }

    return lines;
  }

  private calculateLineY(lineNumber: number, metrics: PageMetrics): number {
    const lineHeight = metrics.lineHeight;
    const contentHeight = this.config.pageHeight - metrics.pagePadding.top - metrics.pagePadding.bottom;
    const startY = metrics.pagePadding.top + lineHeight;

    return startY + (lineNumber - 1) * lineHeight;
  }

  private calculateLinePosition(
    pageLine: { line_number: number; line_type: LineType; surah_number?: number; is_centered: boolean; words: QuranWord[] },
    lineY: number,
    contentWidth: number,
    metrics: PageMetrics
  ): PositionedLine {
    const positionedWords: PositionedWord[] = [];
    let currentX = metrics.pagePadding.left;
    let totalWidth = 0;

    for (let i = 0; i < pageLine.words.length; i++) {
      const word = pageLine.words[i];
      const wordWidth = this.getWordWidth(word.text);
      const wordX = currentX;
      const wordY = lineY + metrics.baselineOffset;

      positionedWords.push({
        id: word.id,
        text: word.text,
        x: wordX,
        y: wordY,
        width: wordWidth,
        height: metrics.lineHeight,
        lineNumber: pageLine.line_number,
        wordIndex: i,
        surahNumber: pageLine.surah_number,
        ayahNumber: word.ayah,
      });

      currentX += wordWidth + metrics.wordSpacing;
      totalWidth += wordWidth + metrics.wordSpacing;
    }

    const lastWord = positionedWords[positionedWords.length - 1];
    const endX = lastWord ? lastWord.x + lastWord.width : metrics.pagePadding.left;

    let startX = metrics.pagePadding.left;
    if (pageLine.is_centered && positionedWords.length > 0) {
      const totalLineWidth = endX - metrics.pagePadding.left;
      const availableSpace = contentWidth - totalLineWidth;
      startX = metrics.pagePadding.left + availableSpace / 2;

      for (const word of positionedWords) {
        word.x += availableSpace / 2;
      }
    }

    return {
      lineNumber: pageLine.line_number,
      y: lineY,
      isCentered: pageLine.is_centered,
      lineType: pageLine.line_type,
      surahNumber: pageLine.surah_number,
      words: positionedWords,
      startX,
      endX,
      totalWidth: totalWidth + metrics.pagePadding.left,
    };
  }

  private getWordWidth(text: string): number {
    if (!text) return this.config.fontSize * 0.6;

    if (this.fontMetrics) {
      let totalWidth = 0;
      for (const char of text) {
        totalWidth += this.fontMetrics.width.get(char) || this.config.fontSize * 0.6;
      }
      return totalWidth;
    }

    return text.length * this.config.fontSize * 0.5;
  }

  getConfig(): LayoutConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<LayoutConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export function createLayoutCalculator(config?: Partial<LayoutConfig>): LayoutCalculator {
  return new LayoutCalculator(config);
}
