import pg from 'pg';

const { Pool } = pg;

// إنشاء الاتصال بقاعدة البيانات باستعمال DATABASE_URL الممرر من Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export default pool;