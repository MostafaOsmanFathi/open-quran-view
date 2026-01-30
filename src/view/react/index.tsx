import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  createLayoutCalculator,
  loadAyatMarkerFont,
  loadFont,
  loadPage,
  loadSurahNameFont,
  surahNumberToFontCode,
  type MushafLayout,
  type PageLayout,
} from "../../core";

export const CENTERED_PAGES_VERTICAL = [1, 2] as const;
export const CENTERED_PAGES_HORIZONTAL = [1, 2, 602, 603, 604] as const;

const CENTERED_PAGES_HORIZONTAL_SET = new Set<number>(
  CENTERED_PAGES_HORIZONTAL,
);

export type { MushafLayout, PageLayout } from "../../core";

export type OpenQuranViewProps = {
  page?: number;
  width?: number;
  height?: number;
  theme?: "light" | "dark";
  mushafLayout?: MushafLayout;
  onPageChange?: (page: number) => void;
  onLoad?: (layout: PageLayout) => void;
  onWordClick?: (word: {
    id: number;
    surahNumber?: number;
    ayahNumber?: number;
  }) => void;
  className?: string;
};

export const OpenQuranView: React.FC<OpenQuranViewProps> = ({
  page = 1,
  width = 600,
  height = 850,
  theme = "light",
  mushafLayout = "hafs-v2",
  onPageChange,
  onLoad,
  onWordClick,
  className,
}: OpenQuranViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<MushafLayout>(mushafLayout);
  const calculatorRef = useRef<ReturnType<
    typeof createLayoutCalculator
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [pageLayout, setPageLayout] = useState<PageLayout | null>(null);

  const handleLoadPage = useCallback(
    async (pageNum: number) => {
      if (!calculatorRef.current || !containerRef.current) return;

      setLoading(true);
      try {
        await loadFont(layoutRef.current, pageNum);
        const quranPage = await loadPage(layoutRef.current, pageNum);
        if (!quranPage) return;

        const calculatedLayout =
          calculatorRef.current.calculatePageLayout(quranPage);

        setPageLayout(calculatedLayout);
        setCurrentPage(pageNum);
        onLoad?.(calculatedLayout);
      } catch (error) {
        console.error("Failed to load page:", error);
      } finally {
        setLoading(false);
      }
    },
    [onLoad],
  );

  useEffect(() => {
    calculatorRef.current = createLayoutCalculator({
      pageWidth: width,
      pageHeight: height,
    });

    handleLoadPage(page);
    loadSurahNameFont();

    return () => {
      calculatorRef.current = null;
    };
  }, [width, height, page, handleLoadPage]);

  useEffect(() => {
    layoutRef.current = mushafLayout;
    handleLoadPage(page);

    if (mushafLayout === "hafs-unicode") {
      loadAyatMarkerFont();
    }
  }, [mushafLayout, page, handleLoadPage]);

  const handleNextPage = useCallback(async () => {
    const next = currentPage + 1;
    await handleLoadPage(next);
    onPageChange?.(next);
  }, [currentPage, handleLoadPage, onPageChange]);

  const handlePrevPage = useCallback(async () => {
    const prev = currentPage - 1;
    await handleLoadPage(prev);
    onPageChange?.(prev);
  }, [currentPage, handleLoadPage, onPageChange]);

  const handleGoToPage = useCallback(
    async (pageNum: number) => {
      await handleLoadPage(pageNum);
      onPageChange?.(pageNum);
    },
    [handleLoadPage, onPageChange],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width,
        height,
        background: theme === "dark" ? "#1a1a2e" : "#fafafa",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        direction: "rtl",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: theme === "dark" ? "#fff" : "#333",
          }}
        >
          جاري التحميل...
        </div>
      )}

      {!loading && pageLayout && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {pageLayout.lines.map((line) => (
            <div
              key={line.lineNumber}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: pageLayout.metrics.lineHeight,
                top:
                  line.y -
                  pageLayout.metrics.lineHeight +
                  pageLayout.metrics.baselineOffset,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  line.isCentered ||
                  CENTERED_PAGES_HORIZONTAL_SET.has(currentPage)
                    ? "center"
                    : "flex-start",
                paddingInlineStart:
                  line.isCentered ||
                  CENTERED_PAGES_HORIZONTAL_SET.has(currentPage)
                    ? 0
                    : pageLayout.metrics.pagePadding.left,
              }}
            >
              {line.lineType === "header" ? (
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: "bold",
                    color: theme === "dark" ? "#fff" : "#2c3e50",
                    fontFamily:
                      '"SurahNameFont", system-ui, -apple-system, sans-serif',
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: 12,
                    marginBottom: 56,
                    paddingInline: 12,
                    paddingBlock: 4,
                    border: `2px solid ${theme === "dark" ? "#fff" : "#2c3e50"}`,
                    borderRadius: 8,
                  }}
                >
                  {line.surahNumber
                    ? surahNumberToFontCode(line.surahNumber)
                    : "surah000"}
                </div>
              ) : (
                line.words.map((word) => {
                  const isAyahEnd =
                    mushafLayout === "hafs-unicode" && word.charType === "end";

                  return (
                    <span
                      key={word.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        onWordClick?.({
                          id: word.id,
                          surahNumber: word.surahNumber,
                          ayahNumber: word.ayahNumber,
                        })
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onWordClick?.({
                            id: word.id,
                            surahNumber: word.surahNumber,
                            ayahNumber: word.ayahNumber,
                          });
                        }
                      }}
                      style={{
                        fontFamily: isAyahEnd
                          ? '"AyatMarker", "DigitalKhatt", system-ui'
                          : mushafLayout === "hafs-unicode"
                            ? '"DigitalKhatt", "Scheherazade New", "Amiri", system-ui, -apple-system, sans-serif'
                            : '"QuranFont", system-ui, -apple-system, sans-serif',

                        fontSize: 24,
                        color: theme === "dark" ? "#fff" : "#34495e",

                        margin: "0 4px",
                        cursor: "pointer",
                        padding: "2p",
                        borderRadius: 4,
                        transition: "background 0.2s",

                        display: isAyahEnd ? "inline-block" : "inline-flex",

                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",

                        lineHeight: isAyahEnd ? "1.4em" : 1,
                        minWidth: isAyahEnd ? 20 : 28,
                        verticalAlign: "middle",
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background =
                          theme === "dark" ? "#333" : "#e0e0e0";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = "transparent";
                      }}
                    >
                      {isAyahEnd
                        ? `﴾${word.ayahNumber}`
                        : word.text || `[${word.id}]`}
                    </span>
                  );
                })
              )}
            </div>
          ))}
        </div>
      )}

      <NavigationControls
        currentPage={currentPage}
        totalPages={604}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        onGoTo={handleGoToPage}
        theme={theme}
      />
    </div>
  );
};

interface NavigationControlsProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (page: number) => void;
  theme: "light" | "dark";
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  onGoTo,
  theme,
}: NavigationControlsProps) => {
  const [inputValue, setInputValue] = useState(String(currentPage));

  useEffect(() => {
    setInputValue(String(currentPage));
  }, [currentPage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const pageNum = Number.parseInt(inputValue, 10);

    if (pageNum >= 1 && pageNum <= totalPages) {
      onGoTo(pageNum);
    } else {
      setInputValue(String(currentPage));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: "absolute",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: "8px 16px",
        background:
          theme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)",
        borderRadius: 8,
        backdropFilter: "blur(10px)",
      }}
    >
      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        التالي
      </button>

      <span>من {totalPages}</span>

      <input
        type="number"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        min={1}
        max={totalPages}
      />

      <button type="button" onClick={onPrev} disabled={currentPage <= 1}>
        السابق
      </button>
    </form>
  );
};

export default OpenQuranView;
