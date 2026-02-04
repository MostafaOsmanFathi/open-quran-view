import { readdirSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";

const PROJECT_ROOT = join(__dirname, "..");
const FONTS_SRC = join(PROJECT_ROOT, "src/data/fonts");
const STATIC_OUT = join(PROJECT_ROOT, "src/core/static");

function getAllFonts(dir: string, baseDir: string = dir): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFonts(fullPath, baseDir));
    } else if (entry.isFile() && /\.(woff2|otf|ttf)$/i.test(entry.name)) {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

function generateFonts(): string {
  let output = `import type { MushafLayout } from "../types";\n\n`;
  output += `export const staticFonts = {\n`;

  const layouts = ["hafs-v2", "hafs-v4", "hafs-unicode"];

  for (const layout of layouts) {
    const layoutPath = join(FONTS_SRC, layout);
    if (!statSync(layoutPath, { throwIfNoEntry: false })) {
      continue;
    }

    const fonts = getAllFonts(layoutPath);
    if (fonts.length === 0) continue;

    output += `  "${layout}": {\n`;

    if (layout === "hafs-unicode") {
      for (const font of fonts) {
        const name = font.replace(/\.(otf|ttf)$/i, "").toLowerCase();
        output += `    "${name}": new URL("../../data/fonts/${layout}/${font}", import.meta.url).href,\n`;
      }
    } else {
      for (const font of fonts) {
        const pageNum = font.replace(/^p|\.woff2$/gi, "");
        output += `    ${pageNum}: new URL("../../data/fonts/${layout}/${font}", import.meta.url).href,\n`;
      }
    }

    output += `  },\n`;
  }

  output += `} as const;\n\n`;
  output += `export type StaticFonts = typeof staticFonts;\n\n`;
  output += `export function getFontUrl(layout: MushafLayout, page: number): string {\n`;
  output += `  const pageStr = String(page);\n`;
  output += `  const url = staticFonts[layout]?.[pageStr as keyof typeof staticFonts[MushafLayout]];\n`;
  output += `  if (!url) throw new Error(\`Font not found: \${layout}/\${page}\`);\n`;
  output += `  return url;\n`;
  output += `}\n\n`;
  output += `export function getUnicodeFontUrl(type: "digitalkhatt" | "ayatquran2_pvkgm"): string {\n`;
  output += `  const url = staticFonts["hafs-unicode"]?.[type];\n`;
  output += `  if (!url) throw new Error(\`Unicode font not found: \${type}\`);\n`;
  output += `  return url;\n`;
  output += `}\n`;

  return output;
}

const content = generateFonts();
mkdirSync(STATIC_OUT, { recursive: true });
writeFileSync(join(STATIC_OUT, "fonts.ts"), content, "utf-8");
console.log(`Generated ${STATIC_OUT}/fonts.ts`);
