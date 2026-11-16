-- NextGen Table Tennis Academy - Booking Engine RPC Functions
-- Secure, privacy-preserving availability checking and receipt lookup

-- 1. Function: Retrieve booked time slots without exposing player identities
CREATE OR REPLACE FUNCTION public.get_booked_time_slots(p_date DATE)
RETURNS TABLE (
  start_time TIME,
  end_time TIME,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT b.start_time, b.end_time, b.status
  FROM public.bookings b
  WHERE b.booking_date = p_date
    AND b.status IN ('pending', 'confirmed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function: Retrieve booking confirmation receipt by exact reference code
CREATE OR REPLACE FUNCTION public.get_booking_by_reference(p_ref TEXT)
RETURNS TABLE (
  booking_reference TEXT,
  booking_type TEXT,
  booking_date DATE,
  start_time TIME,
  end_time TIME,
  duration_minutes INTEGER,
  total_amount NUMERIC,
  status TEXT,
  customer_name TEXT,
  pool_table_complimentary BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.booking_reference,
    b.booking_type,
    b.booking_date,
    b.start_time,
    b.end_time,
    b.duration_minutes,
    b.total_amount,
    b.status,
    b.customer_name,
    b.pool_table_complimentary
  FROM public.bookings b
  WHERE b.booking_reference = p_ref
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

