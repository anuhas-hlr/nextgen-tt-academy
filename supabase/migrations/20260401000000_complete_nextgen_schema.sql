-- NextGen Table Tennis Academy - Complete Production Schema
-- Timezone: Asia/Colombo (UTC+05:30)
-- Concurrency & Single-Table Conflict Prevention Engine

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Clean drop of previous empty tables to avoid schema cache / missing column collisions
DROP TABLE IF EXISTS public.admin_activity_logs CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.booking_participants CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.blocked_slots CASCADE;
DROP TABLE IF EXISTS public.availability_rules CASCADE;
DROP TABLE IF EXISTS public.service_types CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.academy_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==========================================
-- 1. PROFILES (Admin, Coach & Registered Players)
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('admin', 'coach', 'player')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 2. PLAYERS DIRECTORY
-- ==========================================
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    skill_level TEXT NOT NULL DEFAULT 'intermediate' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    guardian_name TEXT,
    guardian_phone TEXT,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 3. SERVICES & DYNAMIC PRICING
-- ==========================================
CREATE TABLE public.service_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price_lkr NUMERIC(10, 2) NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. BOOKINGS (Single-Table Conflict Prevention)
-- ==========================================
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT NOT NULL UNIQUE,
    player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.service_types(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    booking_type TEXT NOT NULL CHECK (booking_type IN ('personal-coaching', 'group-training', 'table-rental')),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    table_number INTEGER NOT NULL DEFAULT 1 CHECK (table_number = 1), -- Exactly ONE table tennis table
    price_snapshot NUMERIC(10, 2) NOT NULL, -- Historical price snapshot
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    skill_level TEXT DEFAULT 'intermediate',
    guardian_name TEXT,
    guardian_phone TEXT,
    participants_count INTEGER NOT NULL DEFAULT 1,
    pool_table_complimentary BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    admin_notes TEXT,
    approval_timestamp TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Single Table Tennis Table Overlap Guard (Pending & Confirmed slots reserve the table)
    CONSTRAINT no_overlapping_table_bookings
    EXCLUDE USING gist (
      booking_date WITH =,
      tstzrange(
        ((booking_date + start_time) AT TIME ZONE 'Asia/Colombo'),
        ((booking_date + end_time) AT TIME ZONE 'Asia/Colombo')
      ) WITH &&
    )
    WHERE (status IN ('pending', 'confirmed'))
);

-- ==========================================
-- 5. BOOKING PARTICIPANTS (For Group Sessions)
-- ==========================================
CREATE TABLE public.booking_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    participant_name TEXT NOT NULL,
    participant_phone TEXT,
    skill_level TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 6. PAYMENTS (Physical In-Person Cash / Transfer)
-- ==========================================
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_reference TEXT NOT NULL,
    player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'LKR',
    payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'card', 'online')),
    reference_number TEXT,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'refunded')),
    payment_date TIMESTAMPTZ,
    collected_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 7. AVAILABILITY RULES (Operating Hours by Day)
-- ==========================================
CREATE TABLE public.availability_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    slot_interval_minutes INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_day_of_week UNIQUE (day_of_week)
);

-- ==========================================
-- 8. BLOCKED SLOTS & HOLIDAYS
-- ==========================================
CREATE TABLE public.blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    reason TEXT,
    block_type TEXT NOT NULL DEFAULT 'maintenance' CHECK (block_type IN ('holiday', 'maintenance', 'tournament', 'coach_unavailable', 'private_event')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    all_day BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 9. ACADEMY SETTINGS (Key-Value Dynamic Configuration)
-- ==========================================
CREATE TABLE public.academy_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 10. NOTIFICATIONS LOG
-- ==========================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email TEXT,
    recipient_phone TEXT,
    type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_approved', 'booking_rejected', 'booking_cancelled', 'reminder', 'admin_alert')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 11. ADMIN ACTIVITY AUDIT LOGS
-- ==========================================
CREATE TABLE public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==========================================
CREATE INDEX idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX idx_bookings_status ON public.bookings (status);
CREATE INDEX idx_bookings_reference ON public.bookings (booking_reference);
CREATE INDEX idx_payments_booking_id ON public.payments (booking_id);
CREATE INDEX idx_payments_status ON public.payments (status);
CREATE INDEX idx_players_phone ON public.players (phone);
CREATE INDEX idx_blocked_slots_dates ON public.blocked_slots (start_date, end_date);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public can view coaches; users view own profile; admin manages all
CREATE POLICY "Public can view coach profiles" ON public.profiles FOR SELECT USING (role = 'coach' OR id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Services: Public view active services; Admins manage
CREATE POLICY "Public can view active services" ON public.service_types FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins have full access to services" ON public.service_types FOR ALL USING (public.is_admin());

-- Bookings: Public can create requests; Users view own; Admins manage
CREATE POLICY "Public can create booking requests" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = user_id OR public.is_admin()
);
CREATE POLICY "Admins have full access to bookings" ON public.bookings FOR ALL USING (public.is_admin());

-- Players: Only Admins can manage players directory
CREATE POLICY "Admins have full access to players" ON public.players FOR ALL USING (public.is_admin());

-- Payments: Only Admins can manage payments
CREATE POLICY "Admins have full access to payments" ON public.payments FOR ALL USING (public.is_admin());

-- Availability Rules & Blocked Slots: Public can view; Admins manage
CREATE POLICY "Public can view availability rules" ON public.availability_rules FOR SELECT USING (true);
CREATE POLICY "Admins have full access to availability rules" ON public.availability_rules FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view blocked slots" ON public.blocked_slots FOR SELECT USING (true);
CREATE POLICY "Admins have full access to blocked slots" ON public.blocked_slots FOR ALL USING (public.is_admin());

-- Settings: Public can read settings; Admins manage
CREATE POLICY "Public can view settings" ON public.academy_settings FOR SELECT USING (true);
CREATE POLICY "Admins have full access to settings" ON public.academy_settings FOR ALL USING (public.is_admin());

-- Notifications & Audit Logs: Admin only
CREATE POLICY "Admins have full access to notifications" ON public.notifications FOR ALL USING (public.is_admin());
CREATE POLICY "Admins have full access to audit logs" ON public.admin_activity_logs FOR ALL USING (public.is_admin());

-- ==========================================
-- AUTOMATIC PROFILE SYNC FROM AUTH.USERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'player')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
