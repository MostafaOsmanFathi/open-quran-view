import { existsSync, readdirSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";

const PROJECT_ROOT = join(__dirname, "..");
const DATA_SRC = join(PROJECT_ROOT, "src/data");
const STATIC_OUT = join(PROJECT_ROOT, "src/core/static");

function generateData(): string {
  let output = `export const staticData = {\n`;

  if (existsSync(join(DATA_SRC, "pages"))) {
    output += `  pages: {\n`;
    const pagesDir = readdirSync(join(DATA_SRC, "pages"));
    for (const layout of pagesDir) {
      const pagesPath = join(DATA_SRC, "pages", layout, "pages.json");
      if (existsSync(pagesPath)) {
        output += `    "${layout}": new URL(\n`;
        output += `      "../../data/pages/${layout}/pages.json",\n`;
        output += `      import.meta.url,\n`;
        output += `    ).href,\n`;
      }
    }
    output += `  },\n`;
  }

  if (existsSync(join(DATA_SRC, "metadata"))) {
    output += `  metadata: {\n`;
    const metadataDir = readdirSync(join(DATA_SRC, "metadata"));
    for (const file of metadataDir) {
      const filePath = join(DATA_SRC, "metadata", file);
      if (existsSync(filePath) && file.endsWith(".json")) {
        const name = file.replace(".json", "");
        output += `    ${name}: new URL("../../data/metadata/${file}", import.meta.url).href,\n`;
      }
    }
    output += `  },\n`;
  }

  if (existsSync(join(DATA_SRC, "shared"))) {
    output += `  shared: {\n`;
    const sharedDir = readdirSync(join(DATA_SRC, "shared"));
    for (const file of sharedDir) {
      const filePath = join(DATA_SRC, "shared", file);
      if (existsSync(filePath)) {
        output += `    surahname: new URL("../../data/shared/${file}", import.meta.url)\n`;
        output += `      .href,\n`;
      }
    }
    output += `  },\n`;
  }

  output += `} as const;\n\n`;
  output += `export type StaticData = typeof staticData;\n\n`;
  output += `export function getPagesUrl(layout: string): string {\n`;
  output += `  const url = staticData.pages?.[layout as keyof typeof staticData.pages];\n`;
  output += `  if (!url) throw new Error(\`Pages not found: \${layout}\`);\n`;
  output += `  return url;\n`;
  output += `}\n\n`;
  output += `export function getMetadataUrl(type: "surahs" | "juz"): string {\n`;
  output += `  const url = staticData.metadata?.[type];\n`;
  output += `  if (!url) throw new Error(\`Metadata not found: \${type}\`);\n`;
  output += `  return url;\n`;
  output += `}\n\n`;
  output += `export function getSurahNameFontUrl(): string {\n`;
  output += `  const url = staticData.shared?.surahname;\n`;
  output += `  if (!url) throw new Error(\`Surah name font not found\`);\n`;
  output += `  return url;\n`;
  output += `}\n`;

  return output;
}

const content = generateData();
mkdirSync(STATIC_OUT, { recursive: true });
writeFileSync(join(STATIC_OUT, "data.ts"), content, "utf-8");
console.log(`Generated ${STATIC_OUT}/data.ts`);
