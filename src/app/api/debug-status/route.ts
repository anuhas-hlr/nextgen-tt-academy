import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || 'raviruanuhasff@gmail.com';

  const supabase = await createClient();
  const db = supabase as any;

  // 1. Check all bookings in table
  const { data: allBookings, error: err1 } = await db
    .from('bookings')
    .select('id, booking_reference, customer_name, customer_email, booking_date, status')
    .order('created_at', { ascending: false })
    .limit(10);

  // 2. Try RPC function
  const { data: rpcData, error: rpcErr } = await db.rpc('get_bookings_by_email', {
    p_email: email.trim().toLowerCase(),
  });

  return NextResponse.json({
    emailQueried: email,
    allRecentBookings: allBookings || [],
    allRecentError: err1 ? err1.message : null,
    rpcResult: rpcData || [],
    rpcError: rpcErr ? rpcErr.message : null,
  });
}
