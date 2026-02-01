import "@testing-library/jest-dom";
import type { Mock } from "vitest";
import { vi, beforeEach, afterEach } from "vitest";

globalThis.fetch = vi.fn();

const createObjectURL = vi.fn();
const revokeObjectURL = vi.fn();

globalThis.URL.createObjectURL = createObjectURL;
globalThis.URL.revokeObjectURL = revokeObjectURL;

const mockPagesData = {
  "hafs-v2": [
    {
      pageNumber: 1,
      lines: [
        {
          lineNumber: 1,
          words: [
            {
              id: 1,
              position: 1,
              text: "بِسْمِ",
              code_v2: "some-code",
              pageNumber: 1,
              charType: "word",
              surah: 1,
              verse: 1,
            },
          ],
          metadata: {
            verseId: 1,
            verseKey: "1:1",
            chapterId: 1,
          },
        },
      ],
    },
  ],
  "hafs-v4": [
    {
      pageNumber: 1,
      lines: [
        {
          lineNumber: 1,
          words: [
            {
              id: 1,
              position: 1,
              text: "بِسْمِ",
              code_v2: "some-code",
              pageNumber: 1,
              charType: "word",
              surah: 1,
              verse: 1,
            },
          ],
          metadata: {
            verseId: 1,
            verseKey: "1:1",
            chapterId: 1,
          },
        },
      ],
    },
  ],
  "hafs-unicode": [
    {
      pageNumber: 1,
      lines: [
        {
          lineNumber: 1,
          words: [
            {
              id: 1,
              position: 1,
              text: "بِسْمِ",
              code_v2: "some-code",
              pageNumber: 1,
              charType: "word",
              surah: 1,
              verse: 1,
            },
          ],
          metadata: {
            verseId: 1,
            verseKey: "1:1",
            chapterId: 1,
          },
        },
      ],
    },
  ],
};

const mockSurahsData = [
  {
    id: 1,
    nameSimple: "Al-Fatihah",
    nameComplex: "The Opening",
    nameArabic: "ٱلْفَاتِحَة",
    versesCount: 7,
    revelationPlace: "makkah",
    revelationOrder: 5,
    bismillahPre: false,
    pages: [1, 1],
    translatedName: {
      languageName: "english",
      name: "The Opening",
    },
  },
  {
    id: 2,
    nameSimple: "Al-Baqarah",
    nameComplex: "The Cow",
    nameArabic: "ٱلْبَقَرَة",
    versesCount: 286,
    revelationPlace: "madinah",
    revelationOrder: 87,
    bismillahPre: true,
    pages: [2, 50],
    translatedName: {
      languageName: "english",
      name: "The Cow",
    },
  },
];

const mockJuzData = [
  {
    id: 1,
    juzNumber: 1,
    firstVerseId: 1,
    lastVerseId: 148,
    versesCount: 148,
    verseMapping: {},
  },
  {
    id: 30,
    juzNumber: 30,
    firstVerseId: 5946,
    lastVerseId: 6236,
    versesCount: 291,
    verseMapping: {},
  },
  {
    id: 90,
    juzNumber: 30,
    firstVerseId: 5946,
    lastVerseId: 6236,
    versesCount: 291,
    verseMapping: {},
  },
];

const mockFontBuffer = new ArrayBuffer(100);

async function createMockResponse(data: unknown, status = 200) {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
    arrayBuffer: () => Promise.resolve(mockFontBuffer),
    blob: () => Promise.resolve(blob),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

function setupFetchMocks() {
  (globalThis.fetch as Mock).mockImplementation((url: string) => {
    if (typeof url !== "string") {
      return Promise.resolve(createMockResponse({}));
    }

    if (url.includes("/pages.json")) {
      const layoutMatch = url.match(/\/pages\/([^/]+)\/pages\.json/);
      const layout = layoutMatch ? layoutMatch[1] : "hafs-v2";
      const pagesData = mockPagesData[layout as keyof typeof mockPagesData];
      if (pagesData) {
        const fullPages = Array.from({ length: 604 }, (_, i) => ({
          pageNumber: i + 1,
          lines:
            i === 0
              ? pagesData[0].lines
              : [
                  {
                    lineNumber: 1,
                    words: [],
                    metadata: {
                      verseId: i + 1,
                      verseKey: `${i + 1}:1`,
                      chapterId: i + 1,
                    },
                  },
                ],
        }));
        return Promise.resolve(createMockResponse(fullPages));
      }
      return Promise.resolve(createMockResponse([]));
    }

    if (url.includes("/surahs.json")) {
      return Promise.resolve(createMockResponse(mockSurahsData));
    }

    if (url.includes("/juz.json")) {
      return Promise.resolve(createMockResponse(mockJuzData));
    }

    if (
      url.includes(".woff2") ||
      url.includes(".otf") ||
      url.includes(".ttf")
    ) {
      return Promise.resolve(createMockResponse(new ArrayBuffer(100)));
    }

    return Promise.resolve(createMockResponse({}));
  });

  createObjectURL.mockImplementation((_blob: Blob) => {
    return `blob:mock-url-${Math.random().toString(36).slice(2)}`;
  });

  revokeObjectURL.mockImplementation(() => {});
}

beforeEach(() => {
  setupFetchMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});
