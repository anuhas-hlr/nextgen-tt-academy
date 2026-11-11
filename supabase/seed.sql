-- Seed Data for NextGen Table Tennis Academy

INSERT INTO public.service_types (title, slug, description, duration_minutes, price_lkr, max_capacity, is_active)
VALUES
('Private Coaching (1-on-1)', 'private-coaching', 'Personalized high-intensity session with head coach covering technique, footwork, and strategy.', 60, 3500.00, 1, true),
('Group Training (Intermediate & Advanced)', 'group-training', 'Structured drills, multiball practice, and tactical match simulation with academy peers.', 90, 2000.00, 6, true),
('Table Solo / Pair Rental', 'table-rental', 'ITTF-standard competition table rental with premium balls and nets.', 60, 1500.00, 4, true),
('Weekend Junior Clinic', 'weekend-junior-clinic', 'Foundation training for young aspiring champions aged 7-16.', 120, 2500.00, 10, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.academy_settings (key, value, description)
VALUES
('operating_hours', '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "07:00", "close": "22:00"}, "sunday": {"open": "07:00", "close": "21:00"}}'::jsonb, 'Academy open and close schedules in Asia/Colombo time'),
('court_config', '{"total_tables": 6, "slot_interval_minutes": 60}'::jsonb, 'Total number of competition tables and booking slot granularity'),
('contact_details', '{"email": "info@nextgentt.lk", "phone": "+94 75 639 9105", "address": "NextGen Table Tennis Academy, Colombo, Sri Lanka"}'::jsonb, 'Academy contact and location information')
ON CONFLICT (key) DO NOTHING;
