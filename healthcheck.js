// Health check for Claude Skill Tree
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Check if database exists and is accessible
const dbPath = process.env.SKILL_DB_PATH || join(__dirname, 'data', 'skill_tree.db');

if (!existsSync(dbPath)) {
  console.error('Database not found at:', dbPath);
  process.exit(1);
}

// Check if we can connect to the database
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  
  // Try a simple query
  db.get('SELECT COUNT(*) as count FROM skills', (err, row) => {
    if (err) {
      console.error('Database query failed:', err);
      process.exit(1);
    }
    
    console.log(`Health check passed. Skills tracked: ${row.count}`);
    db.close();
    process.exit(0);
  });
});