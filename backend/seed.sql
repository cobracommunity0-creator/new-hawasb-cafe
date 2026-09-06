INSERT INTO users (name, pin, role) 
VALUES 
  ('مدير النظام', '1234', 'admin'),
  ('كاشير 1', '5555', 'cashier')
ON CONFLICT (pin) DO NOTHING;

INSERT INTO raw_ingredients (name, stock_quantity, base_unit)
VALUES 
  ('بن برازيلي', 5000, 'g'),
  ('حليب كامل الدسم', 20000, 'ml'),
  ('سكر', 10000, 'g')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, is_active)
VALUES 
  ('إسبراسو', 35.00, true),
  ('لاتيه', 50.00, true),
  ('كابتشينو', 45.00, true)
ON CONFLICT DO NOTHING;