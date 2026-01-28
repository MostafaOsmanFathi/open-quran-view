import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('Script dir:', __dirname);
console.log('Project root:', PROJECT_ROOT);
const DB_PATH = path.join(PROJECT_ROOT, 'src/new-assets/riwaya/hafs-digitalkhatt/digital-khatt-15-lines.db');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'src/new-assets/riwaya/hafs-digitalkhatt/layout.json');
console.log('DB_PATH:', DB_PATH);
console.log('DB exists:', fs.existsSync(DB_PATH));

console.log('Converting QUL SQLite database to JSON...');

const db = new Database(DB_PATH);

const info = db.prepare('SELECT * FROM info').get();
console.log('Info:', info);

const pagesStmt = db.prepare('SELECT * FROM pages ORDER BY page_number, line_number');
const allPages = pagesStmt.all();

const pagesByNumber = {};
for (const page of allPages) {
    const pageNum = page.page_number;
    if (!pagesByNumber[pageNum]) {
        pagesByNumber[pageNum] = [];
    }
    pagesByNumber[pageNum].push({
        line_number: page.line_number,
        line_type: page.line_type,
        is_centered: Boolean(page.is_centered),
        first_word_id: page.first_word_id ?? null,
        last_word_id: page.last_word_id ?? null,
        surah_number: page.surah_number ?? null
    });
}

const layout = {
    info: {
        name: info.name,
        number_of_pages: info.number_of_pages,
        lines_per_page: info.lines_per_page,
        font_name: info.font_name
    },
    pages: pagesByNumber
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(layout, null, 2), 'utf-8');

console.log(`Generated ${OUTPUT_PATH}`);
console.log(`Pages: ${Object.keys(pagesByNumber).length}`);
console.log(`Total lines: ${allPages.length}`);

db.close();
console.log('Done!');
