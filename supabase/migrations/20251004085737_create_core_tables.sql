/*
  # SCRIBOT - Initial Database Schema

  ## Overview
  This migration creates the core database structure for the SCRIBOT marketplace platform.
  
  ## New Tables
  
  ### 1. profiles
  - Extended user information beyond auth.users
  - `id` (uuid, references auth.users) - Primary key
  - `user_type` (text) - 'buyer' or 'seller'
  - `username` (text, unique) - Public display name
  - `full_name` (text) - Full name for billing
  - `avatar_url` (text) - Profile picture URL
  - `bio` (text) - Seller biography
  - `is_verified` (boolean) - Verified seller badge
  - `created_at` (timestamptz) - Account creation date
  - `updated_at` (timestamptz) - Last profile update
  
  ### 2. products
  - Digital products (bots, extensions, scripts)
  - `id` (uuid) - Primary key
  - `seller_id` (uuid) - References profiles
  - `title` (text) - Product name
  - `subtitle` (text) - Short description
  - `description` (text) - Full description
  - `category` (text) - discord/chrome/twitch
  - `price` (numeric) - Price in EUR
  - `image_url` (text) - Main product image
  - `gallery_urls` (jsonb) - Array of additional images
  - `file_url` (text) - Download file path
  - `version` (text) - Current version
  - `status` (text) - draft/pending/published
  - `downloads` (integer) - Download count
  - `sales` (integer) - Sales count
  - `rating_avg` (numeric) - Average rating
  - `rating_count` (integer) - Number of ratings
  - `tags` (text[]) - Product tags
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. orders
  - Purchase transactions
  - `id` (uuid) - Primary key
  - `buyer_id` (uuid) - References profiles
  - `seller_id` (uuid) - References profiles
  - `product_id` (uuid) - References products
  - `order_number` (text, unique) - Human-readable order ID
  - `amount` (numeric) - Purchase amount
  - `commission` (numeric) - Platform commission
  - `status` (text) - pending/completed/refunded
  - `stripe_payment_id` (text) - Stripe transaction ID
  - `created_at` (timestamptz)
  
  ### 4. licenses
  - Product license keys
  - `id` (uuid) - Primary key
  - `order_id` (uuid) - References orders
  - `product_id` (uuid) - References products
  - `buyer_id` (uuid) - References profiles
  - `license_key` (text, unique) - Generated license key
  - `activations_count` (integer) - Number of activations
  - `activations_limit` (integer) - Max activations allowed
  - `is_active` (boolean) - License status
  - `created_at` (timestamptz)
  - `expires_at` (timestamptz) - Optional expiration
  
  ### 5. reviews
  - Product reviews and ratings
  - `id` (uuid) - Primary key
  - `product_id` (uuid) - References products
  - `buyer_id` (uuid) - References profiles
  - `order_id` (uuid) - References orders (verified purchase)
  - `rating` (integer) - 1-5 stars
  - `title` (text) - Review title
  - `comment` (text) - Review text
  - `seller_response` (text) - Optional seller reply
  - `helpful_count` (integer) - Helpful votes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 6. favorites
  - User wishlist/favorites
  - `user_id` (uuid) - References profiles
  - `product_id` (uuid) - References products
  - `created_at` (timestamptz)
  - Primary key: (user_id, product_id)
  
  ### 7. support_tickets
  - Customer support system
  - `id` (uuid) - Primary key
  - `user_id` (uuid) - References profiles
  - `product_id` (uuid) - Optional product reference
  - `subject` (text) - Ticket subject
  - `message` (text) - Initial message
  - `status` (text) - open/in_progress/resolved/closed
  - `priority` (text) - low/normal/high
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict data access based on user roles
  - Users can only see their own sensitive data
  - Public data (products, reviews) accessible to all authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('buyer', 'seller')) DEFAULT 'buyer',
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('discord', 'chrome', 'twitch')),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text,
  gallery_urls jsonb DEFAULT '[]'::jsonb,
  file_url text,
  version text DEFAULT '1.0.0',
  status text NOT NULL CHECK (status IN ('draft', 'pending', 'published')) DEFAULT 'draft',
  downloads integer DEFAULT 0,
  sales integer DEFAULT 0,
  rating_avg numeric(3,2) DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  amount numeric(10,2) NOT NULL,
  commission numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'refunded')) DEFAULT 'pending',
  stripe_payment_id text,
  created_at timestamptz DEFAULT now()
);

-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  license_key text UNIQUE NOT NULL,
  activations_count integer DEFAULT 0,
  activations_limit integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  seller_response text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, buyer_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority text NOT NULL CHECK (priority IN ('low', 'normal', 'high')) DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Products Policies
CREATE POLICY "Anyone can view published products"
  ON products FOR SELECT
  TO authenticated
  USING (status = 'published' OR seller_id = auth.uid());

CREATE POLICY "Sellers can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'seller'
  ));

CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Orders Policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Licenses Policies
CREATE POLICY "Users can view own licenses"
  ON licenses FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "System can create licenses"
  ON licenses FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Reviews Policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Buyers can create reviews for purchased products"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    buyer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.buyer_id = auth.uid()
      AND orders.status = 'completed'
    )
  );

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Favorites Policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Support Tickets Policies
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_licenses_buyer_id ON licenses(buyer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();