-- Function 1: Lookup by reference code (with customer_email and case-insensitive check)
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
  customer_email TEXT,
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
    b.customer_email,
    b.pool_table_complimentary
  FROM public.bookings b
  WHERE UPPER(TRIM(b.booking_reference)) = UPPER(TRIM(p_ref))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Lookup all bookings by email address
CREATE OR REPLACE FUNCTION public.get_bookings_by_email(p_email TEXT)
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
  customer_email TEXT,
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
    b.customer_email,
    b.pool_table_complimentary
  FROM public.bookings b
  WHERE LOWER(TRIM(b.customer_email)) = LOWER(TRIM(p_email))
  ORDER BY b.booking_date DESC, b.start_time DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to public / anon role
GRANT EXECUTE ON FUNCTION public.get_booking_by_reference(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_bookings_by_email(TEXT) TO anon, authenticated, service_role;
