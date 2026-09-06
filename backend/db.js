import pool from './db.js'; // أو طريقة التصدير المستعملة لديك
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDB() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    // 1. إنشاء الجداول
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ Schema created successfully!');
    }

    // 2. زراعة البيانات الأساسية
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seedSql);
      console.log('✅ Seed data inserted successfully!');
    }
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
  }
}

export default pool;