'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
