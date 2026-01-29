import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CDN_BASE = "https://verses.quran.foundation/fonts/quran";

interface FontDownloadConfig {
  name: string;
  urls: string[];
  outputDir: string;
}

const FONT_CONFIGS: FontDownloadConfig[] = [
  {
    name: "Uthmanic Hafs Unicode",
    urls: [
      `${CDN_BASE}/hafs/uthmanic_hafs/UthmanicHafs1Ver18.ttf`,
      `${CDN_BASE}/hafs/uthmanic_hafs/UthmanicHafs1Ver18.woff2`,
    ],
    outputDir: "src/data/fonts/uthmanic-hafs",
  },
  {
    name: "IndoPak Nastaleeq",
    urls: [
      `${CDN_BASE}/hafs/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.ttf`,
      `${CDN_BASE}/hafs/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.woff2`,
    ],
    outputDir: "src/data/fonts/indopak",
  },
];

async function downloadFile(url: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`    ❌ Failed: ${response.statusText}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    writeFileSync(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`    ❌ Error: ${error}`);
    return false;
  }
}

async function downloadPageFonts(
  version: "v2" | "v4",
  outputDir: string
): Promise<void> {
  console.log(`\n📦 Downloading QCF ${version.toUpperCase()} fonts (604 pages)...`);

  mkdirSync(outputDir, { recursive: true });

  const format = "woff2";
  let downloaded = 0;
  let failed = 0;

  for (let page = 1; page <= 604; page++) {
    const url = `${CDN_BASE}/hafs/${version}/${format}/p${page}.${format}`;
    const outputPath = join(outputDir, `p${page}.${format}`);

    const success = await downloadFile(url, outputPath);

    if (success) {
      downloaded++;
    } else {
      failed++;
    }

    if (page % 50 === 0) {
      console.log(`  Progress: ${page}/604 pages...`);
    }
  }

  console.log(`  ✅ Downloaded ${downloaded}/604 font files`);
  if (failed > 0) {
    console.log(`  ⚠️  Failed: ${failed} files`);
  }
}

async function downloadUnicodeFonts(): Promise<void> {
  console.log("\n📝 Downloading Unicode fonts...");

  for (const config of FONT_CONFIGS) {
    console.log(`  Downloading ${config.name}...`);

    mkdirSync(config.outputDir, { recursive: true });

    let downloaded = 0;
    for (const url of config.urls) {
      const filename = url.split("/").pop() || "font";
      const outputPath = join(config.outputDir, filename);

      const success = await downloadFile(url, outputPath);
      if (success) {
        console.log(`    ✅ ${filename}`);
        downloaded++;
      }
    }

    console.log(`  Downloaded ${downloaded}/${config.urls.length} files`);
  }
}

async function main() {
  console.log("🚀 Starting font downloads...\n");

  try {
    console.log("Note: QCF V2 and V4 fonts require 604 downloads each.");
    console.log("This may take several minutes...\n");

    await downloadPageFonts("v2", join(__dirname, "..", "src", "data", "fonts", "hafs-v2"));
    await downloadPageFonts("v4", join(__dirname, "..", "src", "data", "fonts", "hafs-v4"));

    console.log("\n✨ Font download complete!");
    console.log("\n⚠️  Note: These fonts are large (~50MB total).");
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

main();
