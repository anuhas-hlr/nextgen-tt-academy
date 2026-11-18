import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  // Optional cron security verification
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const db = supabase as any;

  // 1. Fetch configured expiry window from academy settings (default: 60 minutes)
  let expiryMinutes = 60;
  const { data: settingRow } = await db
    .from('academy_settings')
    .select('value')
    .eq('key', 'booking_policy')
    .single();

  if (settingRow?.value?.pending_expiry_minutes) {
    expiryMinutes = parseInt(settingRow.value.pending_expiry_minutes, 10);
  }

  const cutoffTime = new Date(Date.now() - expiryMinutes * 60 * 1000).toISOString();

  // 2. Identify expired pending bookings
  const { data: expiredBookings, error: fetchErr } = await db
    .from('bookings')
    .select('id, booking_reference, customer_name, customer_email, customer_phone')
    .eq('status', 'pending')
    .lt('created_at', cutoffTime);

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  if (!expiredBookings || expiredBookings.length === 0) {
    return NextResponse.json({
      status: 'ok',
      message: 'No pending bookings exceeded the expiry window.',
      expiredCount: 0,
    });
  }

  // 3. Mark identified bookings as cancelled
  const expiredIds = expiredBookings.map((b: any) => b.id);
  const { error: updateErr } = await db
    .from('bookings')
    .update({
      status: 'cancelled',
      admin_notes: `Automatically cancelled after ${expiryMinutes} minutes without confirmation to release table court.`,
      updated_at: new Date().toISOString(),
    })
    .in('id', expiredIds);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // 4. Record expiry notification
  for (const b of expiredBookings) {
    await db.from('notifications').insert({
      recipient_email: b.customer_email,
      recipient_phone: b.customer_phone,
      type: 'booking_cancelled',
      title: `Booking Request Expired: ${b.booking_reference}`,
      message: `Your booking request ${b.booking_reference} expired automatically as it was not confirmed within ${expiryMinutes} minutes. The table slot has been released.`,
      metadata: { booking_reference: b.booking_reference },
      status: 'pending',
    });
  }

  return NextResponse.json({
    status: 'ok',
    expiredCount: expiredBookings.length,
    releasedReferences: expiredBookings.map((b: any) => b.booking_reference),
  });
}
