-- Database schema for Sales Management System
-- Use PostgreSQL syntax

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(12,2),
    discount INTEGER DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    sold_count INTEGER DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    specifications TEXT NOT NULL,
    warranty VARCHAR(100) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    supplier VARCHAR(100),
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    type VARCHAR(20) DEFAULT 'retail',
    credit_limit NUMERIC(12,2) DEFAULT 0,
    balance NUMERIC(12,2) DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_purchase_date DATE,
    total_purchases INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'Đang xử lý',
    payment_status VARCHAR(50) DEFAULT 'Chờ thanh toán',
    payment_method VARCHAR(50) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipper VARCHAR(100),
    delivery_status VARCHAR(50),
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(200) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY(order_id, product_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    customer_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description TEXT,
    image VARCHAR(255),
    banner_image VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'promotion',
    status VARCHAR(50) DEFAULT 'draft',
    location VARCHAR(100),
    max_participants INTEGER,
    budget NUMERIC(12,2) DEFAULT 0,
    notes TEXT,
    discount_percentage INTEGER,
    created_by INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_event_products (
    event_id INTEGER REFERENCES sales_events(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY(event_id, product_id)
);

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description TEXT,
    image VARCHAR(255),
    banner_image VARCHAR(255),
    reward VARCHAR(100) NOT NULL,
    max_participants INTEGER,
    requirements TEXT NOT NULL,
    rules TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'shopping',
    status VARCHAR(50) DEFAULT 'draft',
    created_by INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE challenge_participants (
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(challenge_id, user_id)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Address hierarchy (provinces/districts/wards)
CREATE TABLE addresses (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL CHECK (level IN (1,2,3)),
    parent_code VARCHAR(10) REFERENCES addresses(code),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_parent ON addresses(parent_code);
CREATE INDEX idx_addresses_level ON addresses(level);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    to_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- View: total sales amount by product
CREATE VIEW product_sales_view AS
SELECT p.id AS product_id, p.name,
       SUM(oi.quantity) AS total_quantity,
       SUM(oi.price * oi.quantity) AS total_sales
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name;

-- Stored procedure: add order with items
CREATE OR REPLACE FUNCTION add_order(p_customer INT, p_payment_method VARCHAR, p_shipping VARCHAR, p_items JSON)
RETURNS VOID AS $$
DECLARE
    v_order_id INT;
BEGIN
    INSERT INTO orders(customer_id, payment_method, shipping_address, total_amount)
    VALUES (p_customer, p_payment_method, p_shipping, 0) RETURNING id INTO v_order_id;

    INSERT INTO order_items(order_id, product_id, product_name, price, quantity)
    SELECT v_order_id, (item->>'product_id')::INT, item->>'product_name', (item->>'price')::NUMERIC, (item->>'quantity')::INT
    FROM json_array_elements(p_items) AS item;

    UPDATE orders SET total_amount = (
        SELECT SUM(price * quantity) FROM order_items WHERE order_id = v_order_id
    ) WHERE id = v_order_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger: reduce product stock after inserting order_items
CREATE OR REPLACE FUNCTION trg_reduce_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reduce_stock AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION trg_reduce_stock();

-- Indexes for faster queries
CREATE INDEX idx_products_name ON products USING gin (to_tsvector('simple', name));
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_date ON orders(customer_id, date DESC);
CREATE INDEX idx_orders_shipper ON orders(shipper);

