'use server';

import { createClient } from '@/lib/supabase/server';
import { bookingSchema, type BookingInput } from '@/lib/validations';

export async function createBooking(data: BookingInput) {
  const validation = bookingSchema.safeParse(data);
  if (!validation.success) {
    return { error: 'Invalid booking data', issues: validation.error.format() };
  }

  const supabase = await createClient();
  const { data: booking, error } = await (supabase as any)
    .from('bookings')
    .insert({
      service_id: data.serviceId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      table_number: data.tableNumber,
      booking_date: data.bookingDate,
      start_time: data.startTime,
      end_time: data.endTime,
      notes: data.notes,
      total_amount: 3500.00, // resolved from service type
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, booking };
}
