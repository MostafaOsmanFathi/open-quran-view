import hafsV2Pages from "./pages/hafs-v2/pages.json";
import hafsV4Pages from "./pages/hafs-v4/pages.json";
import hafsUnicodePages from "./pages/hafs-unicode/pages.json";
import type { Page, MushafLayout } from "../core/types";

type PagesData = Record<MushafLayout, Page[]>;

const pagesData: PagesData = {
  "hafs-v2": hafsV2Pages as unknown as Page[],
  "hafs-v4": hafsV4Pages as unknown as Page[],
  "hafs-unicode": hafsUnicodePages as unknown as Page[],
};

export default pagesData;
