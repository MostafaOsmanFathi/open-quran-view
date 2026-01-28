import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const DB_PATH = path.join(PROJECT_ROOT, 'src/assets/riwaya/hafs-digitalkhatt/digital-khatt-15-lines.db');

console.log('DB Path:', DB_PATH);
console.log('DB Exists:', fs.existsSync(DB_PATH));

if (!fs.existsSync(DB_PATH)) {
    console.error('Database not found!');
    process.exit(1);
}

const db = new Database(DB_PATH);

// List all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('\nTables found:', tables.length);

for (const table of tables) {
    const tableName = table.name;
    console.log(`\n=== TABLE: ${tableName} ===`);

    // Schema
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    console.log('Columns:', columns.map(c => `${c.name}(${c.type})`).join(', '));

    // Count
    const count = db.prepare(`SELECT COUNT(*) as c FROM ${tableName}`).get();
    console.log('Rows:', count.c);

    // Sample
    const sample = db.prepare(`SELECT * FROM ${tableName} LIMIT 2`).all();
    console.log('Sample:', JSON.stringify(sample).substring(0, 300));
}

db.close();
console.log('\nDone');