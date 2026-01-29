import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_BASE = "https://apis.quran.foundation/content/api/v4";

function loadEnv(): { clientId: string; clientSecret: string } {
  const envPath = join(__dirname, "..", ".env");

  let clientId = process.env.QURAN_CLIENT_ID;
  let clientSecret = process.env.QURAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, "utf-8");
      envContent.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          if (key.trim() === "QURAN_CLIENT_ID") clientId = value.trim();
          if (key.trim() === "QURAN_CLIENT_SECRET") clientSecret = value.trim();
        }
      });
    }
  }

  if (!clientId || !clientSecret) {
    throw new Error(
      "QURAN_CLIENT_ID and QURAN_CLIENT_SECRET must be set in .env file"
    );
  }

  return { clientId, clientSecret };
}

async function getAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    "https://oauth2.quran.foundation/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=content",
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchSurahs(
  accessToken: string,
  clientId: string
): Promise<any[]> {
  console.log("📚 Fetching surah metadata...");

  const response = await fetch(`${API_BASE}/chapters`, {
    headers: {
      "x-auth-token": accessToken,
      "x-client-id": clientId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chapters: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.chapters.length} surahs`);
  return data.chapters;
}

async function fetchJuzs(
  accessToken: string,
  clientId: string
): Promise<any[]> {
  console.log("📗 Fetching juz metadata...");

  const response = await fetch(`${API_BASE}/juzs`, {
    headers: {
      "x-auth-token": accessToken,
      "x-client-id": clientId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch juzs: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.juzs.length} juz`);
  return data.juzs;
}

async function fetchPagesInfo(
  accessToken: string,
  clientId: string
): Promise<any> {
  console.log("📄 Fetching page info...");

  const response = await fetch(
    `${API_BASE}/verses/by_page/1?words=false`,
    {
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": clientId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch page info: ${response.statusText}`);
  }

  const data = await response.json();

  const pagesInfo = {
    totalPages: 604,
    linesPerPage: 15,
    versesPerPage: "variable",
    sampleStructure: data.verses[0],
  };

  console.log("✅ Page info fetched");
  return pagesInfo;
}

async function main() {
  console.log("🚀 Fetching Quran metadata...\n");

  try {
    const { clientId, clientSecret } = loadEnv();
    console.log("✅ Loaded environment variables\n");

    const accessToken = await getAccessToken(clientId, clientSecret);
    console.log("✅ Got access token\n");

    const metadataDir = join(__dirname, "..", "src", "data", "metadata");
    mkdirSync(metadataDir, { recursive: true });

    const surahs = await fetchSurahs(accessToken, clientId);
    writeFileSync(
      join(metadataDir, "surahs.json"),
      JSON.stringify(surahs, null, 2),
      "utf-8"
    );
    console.log(`✅ Saved surahs to ${join(metadataDir, "surahs.json")}\n`);

    const juzs = await fetchJuzs(accessToken, clientId);
    writeFileSync(
      join(metadataDir, "juz.json"),
      JSON.stringify(juzs, null, 2),
      "utf-8"
    );
    console.log(`✅ Saved juz to ${join(metadataDir, "juz.json")}\n`);

    const pagesInfo = await fetchPagesInfo(accessToken, clientId);
    writeFileSync(
      join(metadataDir, "pages-info.json"),
      JSON.stringify(pagesInfo, null, 2),
      "utf-8"
    );
    console.log(`✅ Saved pages info to ${join(metadataDir, "pages-info.json")}\n`);

    console.log("✨ Metadata generation complete!");
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

main();
