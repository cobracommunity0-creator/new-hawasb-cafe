-- إدراج المستخدمين الافتراضيين (الأدمن والكاشير)
INSERT INTO users (name, pin, role) 
VALUES 
  ('مدير النظام', '1234', 'admin'),
  ('كاشير 1', '5555', 'cashier')
ON CONFLICT (pin) DO NOTHING;

-- إدراج خامات ومكونات تجريبية للمشروبات
INSERT INTO raw_ingredients (name, stock_quantity, base_unit, cost_per_unit)
VALUES 
  ('بن برازيلي', 5000, 'g', 0.5),
  ('حليب كامل الدسم', 20000, 'ml', 0.04),
  ('سكر', 10000, 'g', 0.02)
ON CONFLICT DO NOTHING;

-- إدراج منتجات تجريبية
INSERT INTO products (name, category, base_price, is_active)
VALUES 
  ('إسبراسو', 'مشروبات ساخنة', 35.00, true),
  ('لاتيه', 'مشروبات ساخنة', 50.00, true),
  ('كابتشينو', 'مشروبات ساخنة', 45.00, true)
ON CONFLICT DO NOTHING;