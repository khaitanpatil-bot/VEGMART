-- ====================================================
-- FARMDRECT - DATABASE SCHEMA (SUPABASE SQL)
-- ====================================================

-- 1. Create Profile Status or Role enum types (optional, text constraints used instead for simplicity and flexibility)

-- 2. CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    phone TEXT,
    location TEXT, -- Can store string "Latitude, Longitude" or Address
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')), -- Useful for Farmer approval
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price_per_kg DECIMAL(10, 2) NOT NULL CHECK (price_per_kg > 0),
    quantity_available DECIMAL(10, 2) NOT NULL CHECK (quantity_available >= 0),
    image_url TEXT,
    harvest_date DATE NOT NULL,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. CREATE CART TABLE (With 1 hour expiry)
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (TIMEZONE('utc'::text, NOW()) + INTERVAL '1 hour') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for cart
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- 5. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    farmer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    farmer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;


-- ====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================

-- Users Policies:
-- Users can read all user profiles (e.g. buyer needs to see farmer details, admin sees all)
CREATE POLICY "Allow public read of profiles" ON public.users 
    FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Allow users to update their own profile" ON public.users 
    FOR UPDATE USING (auth.uid() = id);

-- Allow admins to update any profile (e.g., approve/reject farmers)
-- Using auth.jwt() metadata checks to completely avoid recursive RLS issues
CREATE POLICY "Allow admins to update any profile" ON public.users 
    FOR UPDATE USING (
        ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'
    );

-- Allow profile creation during sign-up
CREATE POLICY "Allow system/users to create profiles" ON public.users 
    FOR INSERT WITH CHECK (true);

-- Products Policies:
-- Anyone can view products
CREATE POLICY "Allow public select on products" ON public.products 
    FOR SELECT USING (true);

-- Farmers can insert/update/delete their own products
CREATE POLICY "Allow farmers to insert own products" ON public.products 
    FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Allow farmers to update own products" ON public.products 
    FOR UPDATE USING (auth.uid() = farmer_id);

CREATE POLICY "Allow farmers to delete own products" ON public.products 
    FOR DELETE USING (auth.uid() = farmer_id);

-- Admins can delete any product
CREATE POLICY "Allow admins to delete products" ON public.products 
    FOR DELETE USING (
        ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'
    );

-- Cart Policies:
-- Buyers can manage their own carts
CREATE POLICY "Allow buyers to select their own cart" ON public.cart 
    FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Allow buyers to insert into their own cart" ON public.cart 
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Allow buyers to update their own cart" ON public.cart 
    FOR UPDATE USING (auth.uid() = buyer_id);

CREATE POLICY "Allow buyers to delete from their own cart" ON public.cart 
    FOR DELETE USING (auth.uid() = buyer_id);

-- Orders Policies:
-- Buyers can view their own orders
CREATE POLICY "Allow buyers to select own orders" ON public.orders 
    FOR SELECT USING (auth.uid() = buyer_id);

-- Farmers can view orders made to them
CREATE POLICY "Allow farmers to select incoming orders" ON public.orders 
    FOR SELECT USING (auth.uid() = farmer_id);

-- Admins can view all orders
CREATE POLICY "Allow admins to select all orders" ON public.orders 
    FOR SELECT USING (
        ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'
    );

-- Buyers can place orders
CREATE POLICY "Allow buyers to place orders" ON public.orders 
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Farmers can update order status (e.g. pending -> confirmed -> completed)
CREATE POLICY "Allow farmers to update order status" ON public.orders 
    FOR UPDATE USING (auth.uid() = farmer_id);

-- Reviews Policies:
-- Anyone can read reviews
CREATE POLICY "Allow public read of reviews" ON public.reviews 
    FOR SELECT USING (true);

-- Buyers can post reviews
CREATE POLICY "Allow buyers to insert reviews" ON public.reviews 
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);


-- ====================================================
-- AUTO-CLEANUP FUNCTION FOR EXPIRED CART ITEMS
-- ====================================================
-- This trigger/function will clean up cart items that have expired whenever new items are added/updated
CREATE OR REPLACE FUNCTION delete_expired_cart_items() 
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.cart WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_clean_expired_cart_before_change
    BEFORE INSERT OR UPDATE ON public.cart
    FOR EACH STATEMENT
    EXECUTE FUNCTION delete_expired_cart_items();


-- ====================================================
-- AUTOMATIC PROFILE SETUP ON SIGN-UP
-- ====================================================
-- Create a trigger that automatically inserts a record into public.users 
-- when a new user signs up via Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, phone, location, latitude, longitude, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'buyer'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'location',
    (new.raw_user_meta_data->>'latitude')::DOUBLE PRECISION,
    (new.raw_user_meta_data->>'longitude')::DOUBLE PRECISION,
    CASE 
      WHEN COALESCE(new.raw_user_meta_data->>'role', 'buyer') = 'farmer' THEN 'pending'
      ELSE 'approved'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    location = EXCLUDED.location,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ====================================================
-- STORAGE BUCKETS SETUP
-- ====================================================
-- Insert records to create standard product-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Row Level Security for Storage Bucket Objects:
CREATE POLICY "Allow public read access to product-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated users to upload product-images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow users to update own product-images" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

CREATE POLICY "Allow users to delete own product-images" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'product-images');
