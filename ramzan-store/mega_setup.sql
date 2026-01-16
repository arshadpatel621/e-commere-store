-- ==============================================================================
-- COMPREHENSIVE DATABASE SETUP & REPAIR SCRIPT (V4)
-- ==============================================================================

-- 1. EXTENSIONS
-- =================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PROFILES (Authentication & Roles)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'delivery')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 3. PRODUCTS (Catalog)
-- =======================
-- Ensure table exists
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- FIX: Add ALL columns safely if they are missing
DO $$
BEGIN
    -- Core Fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='name') THEN
        ALTER TABLE public.products ADD COLUMN name text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price') THEN
        ALTER TABLE public.products ADD COLUMN price numeric DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='unit') THEN
        ALTER TABLE public.products ADD COLUMN unit text DEFAULT 'kg';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='image') THEN
        ALTER TABLE public.products ADD COLUMN image text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category') THEN
        ALTER TABLE public.products ADD COLUMN category text DEFAULT 'general';
    END IF;

    -- Optional / Special Fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='badge') THEN
        ALTER TABLE public.products ADD COLUMN badge text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock_quantity') THEN
        ALTER TABLE public.products ADD COLUMN stock_quantity integer DEFAULT 100;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_ramzan_special') THEN
        ALTER TABLE public.products ADD COLUMN is_ramzan_special boolean DEFAULT false;
    END IF;
END $$;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Everyone can view products" ON public.products;
CREATE POLICY "Everyone can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert/update/delete products" ON public.products;
CREATE POLICY "Admins can insert/update/delete products" ON public.products FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);


-- 4. ORDERS (Transactions)
-- ==========================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- FIX: Add ALL potentially missing columns for orders
DO $$
BEGIN
    -- Core Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id') THEN
        ALTER TABLE public.orders ADD COLUMN user_id uuid REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_name') THEN
        ALTER TABLE public.orders ADD COLUMN customer_name text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_email') THEN
        ALTER TABLE public.orders ADD COLUMN customer_email text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='total_amount') THEN
        ALTER TABLE public.orders ADD COLUMN total_amount numeric DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='status') THEN
        ALTER TABLE public.orders ADD COLUMN status text DEFAULT 'Pending';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='address_details') THEN
        ALTER TABLE public.orders ADD COLUMN address_details jsonb DEFAULT '{}';
    END IF;

    -- Delivery Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_boy_id') THEN
        ALTER TABLE public.orders ADD COLUMN delivery_boy_id uuid REFERENCES public.profiles(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_msg') THEN
        ALTER TABLE public.orders ADD COLUMN delivery_msg text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivery_time_slot') THEN
        ALTER TABLE public.orders ADD COLUMN delivery_time_slot text;
    END IF;
END $$;

-- Ensure status check constraint exists
DO $$
BEGIN
    ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
    ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('Pending', 'Processing', 'Picked Up', 'Out for Delivery', 'Delivered', 'Cancelled'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

DROP POLICY IF EXISTS "Delivery boys can view assigned orders" ON public.orders;
CREATE POLICY "Delivery boys can view assigned orders" ON public.orders FOR SELECT USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'delivery' and delivery_boy_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (
   auth.uid() = user_id
);

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

DROP POLICY IF EXISTS "Delivery can update status of assigned" ON public.orders;
CREATE POLICY "Delivery can update status of assigned" ON public.orders FOR UPDATE USING (
  auth.uid() = delivery_boy_id
);


-- 5. ORDER ITEMS (Line Items)
-- =============================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL,
  price_at_purchase numeric NOT NULL,
  name text NOT NULL,
  unit text NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View order items based on order access" ON public.order_items;
CREATE POLICY "View order items based on order access" ON public.order_items FOR SELECT USING (
  exists (select 1 from public.orders where id = order_items.order_id)
);

DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);


-- 6. DELIVERY LOCATIONS (Real-time Tracking)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.delivery_locations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  delivery_boy_id uuid REFERENCES public.profiles(id) NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all locations" ON public.delivery_locations;
CREATE POLICY "Admins can view all locations" ON public.delivery_locations FOR SELECT USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

DROP POLICY IF EXISTS "Delivery boys can update their own location" ON public.delivery_locations;
CREATE POLICY "Delivery boys can update their own location" ON public.delivery_locations FOR ALL USING (
  auth.uid() = delivery_boy_id
);

-- 7. STORAGE BUCKETS
-- ===================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
