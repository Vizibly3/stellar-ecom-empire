
-- Create enum types for better data integrity
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'cancelled');
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  compare_price DECIMAL(10,2) CHECK (compare_price >= price),
  cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  weight DECIMAL(8,2),
  dimensions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer',
  address JSONB,
  date_of_birth DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart table for persistent cart storage
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id),
  CONSTRAINT unique_session_product UNIQUE (session_id, product_id),
  CONSTRAINT user_or_session_required CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  billing_address JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  notes TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for products
CREATE POLICY "Active products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all products" ON products FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for cart_items
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (
  auth.uid() = user_id OR session_id IS NOT NULL
);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'admin@techgenius.site' THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number() 
RETURNS TEXT AS $$
BEGIN
  RETURN 'TG' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE order_number_seq START 1001;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert computer and printer accessories categories
INSERT INTO categories (name, slug, description, image_url) VALUES 
('Computer Accessories', 'computer-accessories', 'Essential accessories for your computer setup', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
('Printer Accessories', 'printer-accessories', 'Ink cartridges, toners, and printer supplies', 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400'),
('Keyboards & Mice', 'keyboards-mice', 'Mechanical keyboards, wireless mice, and gaming peripherals', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'),
('Cables & Adapters', 'cables-adapters', 'USB cables, HDMI adapters, and connectivity solutions', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
('Storage Solutions', 'storage-solutions', 'External drives, USB sticks, and storage accessories', 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=400'),
('Audio & Video', 'audio-video', 'Headphones, webcams, and multimedia accessories', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
('Laptop Accessories', 'laptop-accessories', 'Laptop stands, cooling pads, and mobile accessories', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
('Gaming Accessories', 'gaming-accessories', 'Gaming keyboards, mice, headsets, and controllers', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400');

-- Insert sample computer and printer accessories products
INSERT INTO products (title, slug, description, price, compare_price, stock, image_url, category_id, featured) 
SELECT 
  'Mechanical RGB Gaming Keyboard',
  'mechanical-rgb-gaming-keyboard',
  'Professional gaming keyboard with customizable RGB lighting and mechanical switches for optimal gaming performance.',
  149.99,
  199.99,
  25,
  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
  c.id,
  true
FROM categories c WHERE c.slug = 'keyboards-mice'
UNION ALL
SELECT 
  'Wireless Ergonomic Mouse',
  'wireless-ergonomic-mouse',
  'Comfortable wireless mouse with ergonomic design and precision tracking for all-day use.',
  79.99,
  99.99,
  40,
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
  c.id,
  true
FROM categories c WHERE c.slug = 'keyboards-mice'
UNION ALL
SELECT 
  'HP Compatible Ink Cartridge Set',
  'hp-compatible-ink-cartridge-set',
  'High-quality compatible ink cartridges for HP printers. Pack of 4 - Black, Cyan, Magenta, Yellow.',
  89.99,
  129.99,
  60,
  'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
  c.id,
  false
FROM categories c WHERE c.slug = 'printer-accessories'
UNION ALL
SELECT 
  'Canon Toner Cartridge',
  'canon-toner-cartridge',
  'Original Canon toner cartridge for laser printers. High yield, professional quality printing.',
  159.99,
  199.99,
  30,
  'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
  c.id,
  false
FROM categories c WHERE c.slug = 'printer-accessories'
UNION ALL
SELECT 
  'USB-C to HDMI Adapter',
  'usb-c-to-hdmi-adapter',
  'High-speed USB-C to HDMI adapter supporting 4K resolution for connecting laptops to external displays.',
  29.99,
  39.99,
  80,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
  c.id,
  true
FROM categories c WHERE c.slug = 'cables-adapters'
UNION ALL
SELECT 
  'USB 3.0 Extension Cable',
  'usb-3-extension-cable',
  '6ft USB 3.0 extension cable with high-speed data transfer and gold-plated connectors.',
  19.99,
  24.99,
  100,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
  c.id,
  false
FROM categories c WHERE c.slug = 'cables-adapters'
UNION ALL
SELECT 
  'External SSD 1TB',
  'external-ssd-1tb',
  'Portable external SSD with 1TB capacity, USB 3.2 interface for fast file transfers and backup.',
  199.99,
  249.99,
  35,
  'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=500',
  c.id,
  true
FROM categories c WHERE c.slug = 'storage-solutions'
UNION ALL
SELECT 
  'USB Flash Drive 64GB',
  'usb-flash-drive-64gb',
  'High-speed USB 3.0 flash drive with 64GB capacity and compact design.',
  24.99,
  34.99,
  150,
  'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=500',
  c.id,
  false
FROM categories c WHERE c.slug = 'storage-solutions'
UNION ALL
SELECT 
  'Noise-Cancelling Headphones',
  'noise-cancelling-headphones',
  'Premium over-ear headphones with active noise cancellation and superior sound quality.',
  299.99,
  399.99,
  20,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  c.id,
  true
FROM categories c WHERE c.slug = 'audio-video'
UNION ALL
SELECT 
  '4K Webcam',
  '4k-webcam',
  'Ultra HD 4K webcam with auto-focus and built-in microphone for video conferencing and streaming.',
  129.99,
  159.99,
  45,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  c.id,
  false
FROM categories c WHERE c.slug = 'audio-video'
UNION ALL
SELECT 
  'Laptop Cooling Pad',
  'laptop-cooling-pad',
  'Adjustable laptop cooling pad with dual fans and LED lighting for optimal temperature control.',
  49.99,
  69.99,
  70,
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  c.id,
  false
FROM categories c WHERE c.slug = 'laptop-accessories'
UNION ALL
SELECT 
  'Laptop Stand Aluminum',
  'laptop-stand-aluminum',
  'Ergonomic aluminum laptop stand with adjustable height and angle for comfortable working.',
  79.99,
  99.99,
  55,
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  c.id,
  true
FROM categories c WHERE c.slug = 'laptop-accessories'
UNION ALL
SELECT 
  'Gaming Headset Pro',
  'gaming-headset-pro',
  'Professional gaming headset with 7.1 surround sound, noise-cancelling microphone, and RGB lighting.',
  189.99,
  229.99,
  30,
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
  c.id,
  true
FROM categories c WHERE c.slug = 'gaming-accessories'
UNION ALL
SELECT 
  'Gaming Mouse Pad XXL',
  'gaming-mouse-pad-xxl',
  'Extra large gaming mouse pad with smooth surface and non-slip rubber base.',
  39.99,
  49.99,
  90,
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
  c.id,
  false
FROM categories c WHERE c.slug = 'gaming-accessories';
