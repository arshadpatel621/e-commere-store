-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
-- This table is public and holds role info.
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'delivery')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create Products Table
CREATE TABLE public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  unit text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  badge text,
  stock_quantity integer DEFAULT 100,
  is_ramzan_special boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert/update/delete products" ON public.products FOR ALL USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. Create Orders Table
CREATE TABLE public.orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id), -- Nullable for guest checkout if needed, but RBAC implies login
  customer_name text NOT NULL,
  customer_email text,
  total_amount numeric NOT NULL,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Picked Up', 'Out for Delivery', 'Delivered', 'Cancelled')),
  delivery_boy_id uuid REFERENCES public.profiles(id),
  delivery_msg text,
  delivery_time_slot text,
  address_details jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for Orders
-- Admin: See all
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Delivery: See assigned
CREATE POLICY "Delivery boys can view assigned orders" ON public.orders FOR SELECT USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'delivery' and delivery_boy_id = auth.uid())
);

-- User: See own
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (
  auth.uid() = user_id
);

-- Insert: Public (for creating order)
CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT WITH CHECK (true);

-- Update: Admin or Assigned Delivery Boy
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Delivery can update status of assigned" ON public.orders FOR UPDATE USING (
  auth.uid() = delivery_boy_id
);


-- 4. Create Order Items (Normalized)
CREATE TABLE public.order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL,
  price_at_purchase numeric NOT NULL,
  name text NOT NULL, -- Cached name
  unit text NOT NULL -- Cached unit
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View order items based on order access" ON public.order_items FOR SELECT USING (
  exists (select 1 from public.orders where id = order_items.order_id) -- (Simplified, real should check ownership via join)
);

CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);


-- 5. Trigger to auto-create profile on signup
-- This assumes you use Supabase Auth. 
-- You might need to create this function in Supabase SQL Editor if 'security definer' issues arise.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'user') -- Default to user
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger logic (commented out to avoid errors if run multiple times, user should run once)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED DATA (Products)
INSERT INTO products (name, price, unit, image, category, badge, is_ramzan_special)
VALUES
  ('Premium Ajwa Dates', 1200, 'kg', 'https://images.unsplash.com/photo-1558405967-4364366a36a9', 'dates', 'Ramzan Special', true),
  ('Rooh Afza', 250, 'bottle', 'https://m.media-amazon.com/images/I/61S+X3vN9+L.jpg', 'beverages', 'Must Have', true),
  ('Fresh Watermelon', 40, 'kg', 'https://images.unsplash.com/photo-1589531551221-50e85f432bd3', 'fruits', NULL, true),
  ('Kesar Mango Box', 850, 'box', 'https://images.unsplash.com/photo-1553279768-115437813588', 'mangoes', 'Seasonal', false);

-- ==========================================
-- ADMIN SETUP FOR OWNER
-- Run this AFTER signing up `arshadpatel1431@gmail.com` in the app.
-- ==========================================
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'arshadpatel1431@gmail.com';
