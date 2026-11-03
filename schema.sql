-- ==============================================================================
-- G-Bin & B-Bin – Smart Waste Management System
-- PostgreSQL Database Schema & Supabase RLS Policies
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Linked to Supabase auth.users via id
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'household' CHECK (role IN ('household', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. HOUSEHOLDS TABLE
-- Stores household-specific information and unique household identifier
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_id TEXT NOT NULL UNIQUE, -- e.g. "GB-HH-8492"
    street_address TEXT NOT NULL,
    ward_zone TEXT NOT NULL,
    pincode TEXT NOT NULL,
    residents_count INT NOT NULL DEFAULT 1 CHECK (residents_count > 0),
    g_bin_count INT NOT NULL DEFAULT 1 CHECK (g_bin_count >= 0),
    b_bin_count INT NOT NULL DEFAULT 1 CHECK (b_bin_count >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. USER_ROLES TABLE
-- Explicit role assignment and role management
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('household', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- ------------------------------------------------------------------------------
-- 4. COLLECTIONS TABLE (Regular Scheduled Waste Collection Management)
-- Operational scheduled collections - managed by Admins, viewed by Households
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_zone TEXT NOT NULL,
    area_name TEXT NOT NULL,
    bin_type TEXT NOT NULL CHECK (bin_type IN ('G-Bin (Wet Waste)', 'B-Bin (Dry Waste)', 'Both (G-Bin & B-Bin)')),
    collection_day TEXT NOT NULL, -- e.g., 'Everyday', 'Mon, Wed, Fri', 'Tue, Thu, Sat'
    time_slot TEXT NOT NULL,      -- e.g., '07:00 AM - 09:30 AM'
    vehicle_number TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    driver_phone TEXT,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Delayed')),
    last_completed_at TIMESTAMPTZ,
    operational_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE (Bin Shop & Bin Distribution Records)
-- Households order bins; Admins track and update order status
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_id TEXT NOT NULL,
    items JSONB NOT NULL, -- Array of items: [{ id, name, type, price, quantity }]
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled')),
    delivery_address TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Pay on Delivery / Subsidized Scheme',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- HELPER FUNCTIONS & TRIGGERS
-- Automatic Household ID Generator: e.g. "GB-HH-" + 4 random uppercase/digits
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_household_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL;
BEGIN
    done := false;
    WHILE NOT done LOOP
        new_id := 'GB-HH-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
        done := NOT EXISTS(SELECT 1 FROM public.households WHERE household_id = new_id);
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_households_modtime
    BEFORE UPDATE ON public.households
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_collections_modtime
    BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Security helper function to check if current authenticated user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    ) OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile or admins view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update their own profile or admins update all"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admins or signup trigger can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR is_admin());

-- HOUSEHOLDS POLICIES
CREATE POLICY "Households can view their own record or admins view all"
    ON public.households FOR SELECT
    USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Households can update their address/members or admins update all"
    ON public.households FOR UPDATE
    USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Households can register or admins insert"
    ON public.households FOR INSERT
    WITH CHECK (auth.uid() = user_id OR is_admin());

-- USER ROLES POLICIES
CREATE POLICY "Users can see their own role or admins see all"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Only admins can modify roles"
    ON public.user_roles FOR ALL
    USING (is_admin());

-- COLLECTIONS POLICIES (Regular schedule viewable by all authenticated users, editable only by admin)
CREATE POLICY "Anyone can view scheduled collections"
    ON public.collections FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage collections"
    ON public.collections FOR ALL
    USING (is_admin());

-- ORDERS POLICIES
CREATE POLICY "Households view their own orders or admins view all"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Households can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can update orders (e.g. status) or user cancel"
    ON public.orders FOR UPDATE
    USING (auth.uid() = user_id OR is_admin());

-- ------------------------------------------------------------------------------
-- SAMPLE SEED DATA FOR DEMO & TESTING
-- ------------------------------------------------------------------------------
INSERT INTO public.collections (ward_zone, area_name, bin_type, collection_day, time_slot, vehicle_number, driver_name, driver_phone, status, operational_notes)
VALUES
('Ward 12 - Green Valley', 'Riverside & Sector 4', 'G-Bin (Wet Waste)', 'Daily (Mon-Sun)', '07:00 AM - 09:00 AM', 'GV-04-WM-102', 'Ramesh Kumar', '+91 98765 43210', 'In Progress', 'Daily wet waste composting route running on schedule.'),
('Ward 12 - Green Valley', 'Riverside & Sector 4', 'B-Bin (Dry Waste)', 'Tue, Thu, Sat', '09:30 AM - 11:30 AM', 'GV-04-WM-105', 'Anil Verma', '+91 98765 43211', 'Scheduled', 'Recyclables sorting truck. Cardboard and plastic collection.'),
('Ward 08 - Eco Heights', 'Hilltop Enclave & Lakeview', 'Both (G-Bin & B-Bin)', 'Mon, Wed, Fri', '08:00 AM - 10:30 AM', 'EH-08-WM-204', 'Suresh Patel', '+91 98765 43212', 'Completed', 'Morning round completed. 3.2 tons organic and 1.8 tons dry waste collected.'),
('Ward 15 - Central Park', 'Market Road & Avenues', 'G-Bin (Wet Waste)', 'Daily (Mon-Sun)', '06:30 AM - 08:30 AM', 'CP-15-WM-301', 'Vikram Singh', '+91 98765 43213', 'Scheduled', 'High density market and residential organic waste route.'),
('Ward 15 - Central Park', 'Market Road & Avenues', 'B-Bin (Dry Waste)', 'Wed, Sun', '10:00 AM - 12:00 PM', 'CP-15-WM-302', 'Mahesh Das', '+91 98765 43214', 'Scheduled', 'Commercial and household dry waste collection for recycling plant.')
ON CONFLICT DO NOTHING;
