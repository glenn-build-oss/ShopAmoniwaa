-- ShopAmoniwaa Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    image_url TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for customer orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table for order details
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table for customer shopping carts
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO admin_users (email) 
VALUES ('admin@shopamoniwaa.com')
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
-- Allow public read access
CREATE POLICY "Allow public read access on products"
    ON products FOR SELECT
    TO public
    USING (true);

-- Allow public insert on products (for admin)
CREATE POLICY "Allow public insert on products"
    ON products FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow public update on products (for admin)
CREATE POLICY "Allow public update on products"
    ON products FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Allow public delete on products (for admin)
CREATE POLICY "Allow public delete on products"
    ON products FOR DELETE
    TO public
    USING (true);

-- Create policies for admin_users table
-- Allow public read access (for checking if user is admin)
CREATE POLICY "Allow public read access on admin_users"
    ON admin_users FOR SELECT
    TO public
    USING (true);

-- Allow service role to insert admin users
CREATE POLICY "Allow service role insert on admin_users"
    ON admin_users FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Enable Row Level Security for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Allow public read access on orders"
    ON orders FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert on orders"
    ON orders FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public update on orders"
    ON orders FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Create policies for order_items table
CREATE POLICY "Allow public read access on order_items"
    ON order_items FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert on order_items"
    ON order_items FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policies for cart_items table
CREATE POLICY "Allow public read access on cart_items"
    ON cart_items FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert on cart_items"
    ON cart_items FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public update on cart_items"
    ON cart_items FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete on cart_items"
    ON cart_items FOR DELETE
    TO public
    USING (true);

-- Enable Realtime on products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock_quantity, in_stock) VALUES
('Wireless Headphones Pro', 'Premium wireless headphones with noise cancellation and 30-hour battery life.', 850.00, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 50, true),
('Smart Watch Series X', 'Advanced smartwatch with health monitoring, GPS, and 7-day battery.', 1200.00, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 30, true),
('Designer Leather Jacket', 'Premium leather jacket with modern fit and premium craftsmanship.', 650.00, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 25, true),
('Running Shoes Elite', 'Lightweight running shoes with advanced cushioning technology.', 450.00, 'Sports', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 100, true),
('Minimalist Desk Lamp', 'Modern LED desk lamp with adjustable brightness and color temperature.', 280.00, 'Home', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 40, true),
('Bluetooth Speaker Mini', 'Portable Bluetooth speaker with 360° sound and waterproof design.', 200.00, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 75, true),
('Cotton T-Shirt Premium', '100% organic cotton t-shirt with premium fit and comfort.', 120.00, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 200, true),
('Yoga Mat Professional', 'Extra thick yoga mat with non-slip surface and carrying strap.', 180.00, 'Sports', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 60, true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable Realtime on orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;

-- ============================================================
-- FIX SCRIPT: Run this if you already have the table created
-- with the product FK constraint causing checkout failures.
-- ============================================================
-- ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
