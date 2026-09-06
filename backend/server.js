import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// دالة لتلقيم وتجهيز الداتابيز أوتوماتيكياً عند أول تشغيل
async function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      console.log('Initializing database schema...');
      await pool.query(schemaSql);
    }

    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      console.log('Initializing database seed...');
      await pool.query(seedSql);
    }

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
}

// تشغيل الـ APIs العادية
app.post('/api/login', async (req, res) => {
  const { pin } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE pin = $1', [pin]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'رمز PIN غير صحيح' });
    }
    const user = result.rows[0];
    res.json({ id: user.id, name: user.name, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_active = true ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في جلب المنتجات' });
  }
});

app.post('/api/checkout', async (req, res) => {
  const { user_id, payment_method, items, discount = 0 } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    for (const item of items) {
      const prodRes = await client.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
      if (prodRes.rows.length > 0) {
        total += Number(prodRes.rows[0].price) * item.quantity;
      }
    }
    const finalTotal = Math.max(0, total - discount);

    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, discount, payment_method)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [user_id, finalTotal, discount, payment_method]
    );
    const orderId = orderRes.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         SELECT $1, $2, $3, price FROM products WHERE id = $2`,
        [orderId, item.product_id, item.quantity]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, order_id: orderId, total: finalTotal });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'فشلت عملية الدفع' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // تشغيل إنشاء الجداول فوراً بعد تشغيل السيرفر
  await initDatabase();
});