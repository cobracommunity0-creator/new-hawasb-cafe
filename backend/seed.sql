-- 1. إدراج المستخدمين الافتراضيين (الأدمن والكاشير)
INSERT INTO users (name, pin, role) 
VALUES 
  ('مدير النظام', '1234', 'admin'),
  ('كاشير 1', '5555', 'cashier')
ON CONFLICT (pin) DO NOTHING;

-- 2. إدراج خامات ومكونات تجريبية للمشروبات
INSERT INTO raw_ingredients (name, stock_quantity, base_unit)
VALUES 
  ('بن برازيلي', 5000, 'g'),
  ('حليب كامل الدسم', 20000, 'ml'),
  ('سكر', 10000, 'g')
ON CONFLICT DO NOTHING;

-- 3. إدراج منتجات تجريبية
INSERT INTO products (name, category, base_price, is_active)
VALUES 
  ('إسبراسو', 'مشروبات ساخنة', 35.00, true),
  ('لاتيه', 'مشروبات ساخنة', 50.00, true),
  ('كابتشينو', 'مشروبات ساخنة', 45.00, true)
ON CONFLICT DO NOTHING;