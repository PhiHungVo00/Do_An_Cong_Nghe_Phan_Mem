-- Sample data for Sales Management System
INSERT INTO users (username, email, password, role, full_name, phone)
VALUES
  ('admin', 'admin@example.com', 'hashed_admin_pwd', 'admin', 'Admin User', '0123456789'),
  ('user1', 'user@example.com', 'hashed_user_pwd', 'user', 'Nguyen Van A', '0987654321'),
  ('shipper1', 'shipper@example.com', 'hashed_shipper_pwd', 'shipper', 'Tran Van Shipper', '0909009009');

INSERT INTO products (name, description, price, original_price, discount, stock, category, brand, image, specifications, warranty, sku)
VALUES
  ('Tủ Lạnh Samsung', 'Tủ lạnh Samsung 300L', 12000000, 15000000, 20, 50, 'kitchen', 'Samsung', '/assets/products/tulanh.jpg', 'Dung tích 300L', '24 tháng', 'SAM-KIT-001'),
  ('Smart TV LG', 'Smart TV 55 inch 4K', 18000000, 22000000, 18, 30, 'livingroom', 'LG', '/assets/products/smarttv.jpg', '55 inch 4K', '24 tháng', 'LG-LIV-002');

INSERT INTO customers (name, email, phone, address)
VALUES
  ('Nguyen Van B', 'customer@example.com', '0911222333', '123 ABC Street');

-- Sample address hierarchy
INSERT INTO addresses (code, name, full_name, level, parent_code)
VALUES
  ('01', 'Hà Nội', 'Thành phố Hà Nội', 1, NULL),
  ('001', 'Ba Đình', 'Quận Ba Đình', 2, '01'),
  ('00001', 'Phúc Xá', 'Phường Phúc Xá', 3, '001');

INSERT INTO orders (order_number, customer_id, payment_method, shipping_address, shipper, delivery_status, delivered_at, total_amount)
VALUES
  ('ORD001', 1, 'COD', '123 ABC Street', NULL, NULL, NULL, 0),
  ('ORD002', 1, 'COD', '123 ABC Street', 'shipper1', 'in_transit', NULL, 0);

INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
VALUES
  (1, 1, 'Tủ Lạnh Samsung', 12000000, 1),
  (1, 2, 'Smart TV LG', 18000000, 2),
  (2, 2, 'Smart TV LG', 18000000, 1);

-- Update total amount for order 1
UPDATE orders SET total_amount = (
  SELECT SUM(price * quantity) FROM order_items WHERE order_id = 1
) WHERE id = 1;

UPDATE orders SET total_amount = (
  SELECT SUM(price * quantity) FROM order_items WHERE order_id = 2
) WHERE id = 2;

