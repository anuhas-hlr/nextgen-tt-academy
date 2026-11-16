-- Seed Data for NextGen Table Tennis Academy
-- Initial verified rates, operating hours, and policies

-- 1. Initial Services Catalog
INSERT INTO public.service_types (title, slug, description, duration_minutes, price_lkr, max_capacity, is_active)
VALUES
('Personal Coaching (1-on-1)', 'personal-coaching', 'Direct high-intensity 1-on-1 mentorship with National Champion Chanul Dulsen covering technique, footwork, and tactical strategy.', 60, 2500.00, 1, true),
('Group Coaching Sessions', 'group-training', 'Structured squad drills, tactical multiball, and pressure match simulations with academy peers.', 60, 2500.00, 6, true),
('Table-Only Rental', 'table-rental', 'Reserve our official competition table for sparring, friendly matches, or solo practice without coach guidance.', 60, 500.00, 4, true)
ON CONFLICT (slug) DO UPDATE
SET price_lkr = EXCLUDED.price_lkr,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

-- 2. Initial Operating Hours (Mon–Sat 6:00 AM – 10:00 PM, Sun 7:00 AM – 9:00 PM)
INSERT INTO public.availability_rules (day_of_week, open_time, close_time, slot_interval_minutes, is_active)
VALUES
(1, '06:00:00', '22:00:00', 30, true), -- Monday
(2, '06:00:00', '22:00:00', 30, true), -- Tuesday
(3, '06:00:00', '22:00:00', 30, true), -- Wednesday
(4, '06:00:00', '22:00:00', 30, true), -- Thursday
(5, '06:00:00', '22:00:00', 30, true), -- Friday
(6, '06:00:00', '22:00:00', 30, true), -- Saturday
(0, '07:00:00', '21:00:00', 30, true)  -- Sunday
ON CONFLICT (day_of_week) DO UPDATE
SET open_time = EXCLUDED.open_time,
    close_time = EXCLUDED.close_time,
    slot_interval_minutes = EXCLUDED.slot_interval_minutes;

-- 3. Dynamic Academy Settings
INSERT INTO public.academy_settings (key, value, description)
VALUES
('pricing_rates', '{"personal_hourly": 2500, "group_hourly": 2500, "table_hourly": 500, "currency": "LKR"}'::jsonb, 'Current standard hourly rates in Sri Lankan Rupees'),
('pool_table_policy', '{"complimentary": true, "max_guests": 2, "rules": "Access available for player and 1 guardian during booked time slot"}'::jsonb, 'Complimentary pool table access rules and conditions'),
('booking_policy', '{"min_duration_minutes": 30, "max_duration_minutes": 180, "slot_increment_minutes": 30, "pending_expiry_minutes": 60, "total_tables": 1}'::jsonb, 'Court booking constraints and single-table rules'),
('contact_info', '{"phone": "+94 75 639 9105", "email": "info@nextgentt.lk", "location": "NextGen Table Tennis Academy, Colombo, Sri Lanka", "mapsUrl": "https://maps.app.goo.gl/NnL6NtGwU9xm4EmA8"}'::jsonb, 'Official academy contact information')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description;
