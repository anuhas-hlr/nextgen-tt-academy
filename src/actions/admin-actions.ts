'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { addMinutesToTime, timeToMinutes, formatDisplayTime } from '@/lib/utils';
import {
  generateBookingApprovedEmail,
  generateBookingRejectedEmail,
  sendEmailNotification,
} from '@/lib/notifications';

// Helper to check admin authorization
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Admin authorization required');
  }

  return { supabase, user };
}

/**
 * 1. Overview Dashboard Metrics
 */
export async function getAdminDashboardMetrics() {
  const { supabase } = await requireAdmin();
  const db = supabase as any;

  // Current date in Asia/Colombo
  const nowColombo = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
  );
  const todayStr = nowColombo.toISOString().slice(0, 10);

  // Today's Bookings
  const { data: todayBookings, count: todayCount } = await db
    .from('bookings')
    .select('id, total_amount, payment_status, status', { count: 'exact' })
    .eq('booking_date', todayStr);

  // Pending Requests count
  const { count: pendingCount } = await db
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Confirmed Bookings count
  const { count: confirmedCount } = await db
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'confirmed');

  // Total Unique Players count
  const { count: playersCount } = await db
    .from('players')
    .select('id', { count: 'exact', head: true });

  // Today's Recorded Revenue: ONLY Paid bookings
  const { data: todayPaidPayments } = await db
    .from('payments')
    .select('amount')
    .eq('status', 'paid')
    .gte('created_at', `${todayStr}T00:00:00+05:30`)
    .lte('created_at', `${todayStr}T23:59:59+05:30`);

  let todayRevenue = 0;
  if (todayPaidPayments) {
    todayRevenue = todayPaidPayments.reduce(
      (sum: number, p: any) => sum + Number(p.amount || 0),
      0
    );
  }

  // Also include paid bookings for today if payment row wasn't separately added
  if (todayBookings) {
    const paidBookingsTotal = todayBookings
      .filter((b: any) => b.payment_status === 'paid')
      .reduce((sum: number, b: any) => sum + Number(b.total_amount || 0), 0);
    todayRevenue = Math.max(todayRevenue, paidBookingsTotal);
  }

  // Upcoming 5 sessions
  const { data: upcomingSessions } = await db
    .from('bookings')
    .select('*')
    .gte('booking_date', todayStr)
    .in('status', ['pending', 'confirmed'])
    .order('booking_date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(8);

  return {
    todayBookingsCount: todayCount || 0,
    pendingRequestsCount: pendingCount || 0,
    confirmedBookingsCount: confirmedCount || 0,
    totalPlayersCount: playersCount || 0,
    todayRecordedRevenue: todayRevenue,
    upcomingSessions: upcomingSessions || [],
    todayDate: todayStr,
  };
}

/**
 * 2. Filterable Bookings List
 */
export interface AdminBookingFilters {
  date?: string;
  status?: string;
  bookingType?: string;
  search?: string;
}

export async function getAdminBookings(filters?: AdminBookingFilters) {
  const { supabase } = await requireAdmin();
  const db = supabase as any;

  let query = db
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (filters?.date) {
    query = query.eq('booking_date', filters.date);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.bookingType && filters.bookingType !== 'all') {
    query = query.eq('booking_type', filters.bookingType);
  }
  if (filters?.search && filters.search.trim()) {
    const s = filters.search.trim();
    query = query.or(
      `customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,booking_reference.ilike.%${s}%`
    );
  }

  const { data: bookings, error } = await query;
  if (error) {
    console.error('Error fetching admin bookings:', error);
    return [];
  }
  return bookings || [];
}

/**
 * 3. Approve Booking Request
 */
export async function approveBooking(bookingId: string) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { data: booking, error: fetchErr } = await db
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (fetchErr || !booking) {
    return { error: 'Booking not found' };
  }

  // Update status to confirmed
  const { error: updateErr } = await db
    .from('bookings')
    .update({
      status: 'confirmed',
      approval_timestamp: new Date().toISOString(),
      approved_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (updateErr) {
    return { error: updateErr.message };
  }

  // Log admin activity
  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'APPROVE_BOOKING',
    target_type: 'booking',
    target_id: bookingId,
    details: {
      booking_reference: booking.booking_reference,
      customer_name: booking.customer_name,
      booking_date: booking.booking_date,
    },
  });

  // Log notification to player in DB
  await db.from('notifications').insert({
    recipient_email: booking.customer_email,
    recipient_phone: booking.customer_phone,
    type: 'booking_approved',
    title: `Booking Confirmed: ${booking.booking_reference}`,
    message: `Coach Chanul has confirmed your table tennis reservation for ${booking.booking_date} at ${booking.start_time.slice(0, 5)}. Payment will be collected at the academy.`,
    metadata: { booking_reference: booking.booking_reference },
    status: 'pending',
  });

  // Dispatch Email Notification to player if email was provided
  if (booking.customer_email) {
    try {
      const emailPayload = generateBookingApprovedEmail({
        bookingReference: booking.booking_reference,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        serviceTitle: booking.service_type_name,
        bookingDate: booking.booking_date,
        startTime: formatDisplayTime(booking.start_time),
        endTime: formatDisplayTime(booking.end_time),
        durationMinutes: booking.duration_minutes,
        totalAmount: Number(booking.total_amount),
      });
      await sendEmailNotification(emailPayload);
    } catch (e) {
      console.error('Failed to send approval email:', e);
    }
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/bookings');
  revalidatePath('/admin/dashboard/calendar');
  return { success: true };
}

/**
 * 4. Reject Booking Request
 */
export async function rejectBooking(bookingId: string, adminNotes?: string) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { data: booking } = await db
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  const { error } = await db
    .from('bookings')
    .update({
      status: 'rejected',
      admin_notes: adminNotes || 'Requested slot unavailable or declined by coach.',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (error) {
    return { error: error.message };
  }

  // Log admin activity
  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'REJECT_BOOKING',
    target_type: 'booking',
    target_id: bookingId,
    details: { reason: adminNotes },
  });

  // Release notification
  if (booking) {
    await db.from('notifications').insert({
      recipient_email: booking.customer_email,
      recipient_phone: booking.customer_phone,
      type: 'booking_rejected',
      title: `Booking Request Declined: ${booking.booking_reference}`,
      message: `Your requested session on ${booking.booking_date} could not be confirmed. Reason: ${adminNotes || 'Time slot unavailable'}. Please request an alternate slot.`,
      metadata: { booking_reference: booking.booking_reference },
      status: 'pending',
    });

    // Dispatch Rejection Email to player if email was provided
    if (booking.customer_email) {
      try {
        const emailPayload = generateBookingRejectedEmail({
          bookingReference: booking.booking_reference,
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone,
          serviceTitle: booking.service_type_name,
          bookingDate: booking.booking_date,
          startTime: formatDisplayTime(booking.start_time),
          endTime: formatDisplayTime(booking.end_time),
          durationMinutes: booking.duration_minutes,
          totalAmount: Number(booking.total_amount),
          adminNotes: adminNotes,
        });
        await sendEmailNotification(emailPayload);
      } catch (e) {
        console.error('Failed to send rejection email:', e);
      }
    }
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/bookings');
  revalidatePath('/admin/dashboard/calendar');
  return { success: true };
}

/**
 * 5. Cancel Booking
 */
export async function cancelBooking(bookingId: string, reason?: string) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { data: booking } = await db
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  const { error } = await db
    .from('bookings')
    .update({
      status: 'cancelled',
      admin_notes: reason ? `Cancelled: ${reason}` : 'Cancelled by administrator.',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'CANCEL_BOOKING',
    target_type: 'booking',
    target_id: bookingId,
    details: { reason },
  });

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/bookings');
  revalidatePath('/admin/dashboard/calendar');
  return { success: true };
}

/**
 * 6. Mark Session Completed & Record Attendance
 */
export async function completeBooking(bookingId: string) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { error } = await db
    .from('bookings')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'COMPLETE_BOOKING',
    target_type: 'booking',
    target_id: bookingId,
  });

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/bookings');
  return { success: true };
}

/**
 * 7. Reschedule Booking
 */
export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newStartTime: string,
  newDurationMinutes: number
) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { data: booking, error: fetchErr } = await db
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (fetchErr || !booking) {
    return { error: 'Booking not found' };
  }

  // Compute new end time
  const [h, m] = newStartTime.split(':').map(Number);
  const totalM = h * 60 + m + newDurationMinutes;
  const newEndTime = `${String(Math.floor(totalM / 60)).padStart(2, '0')}:${String(totalM % 60).padStart(2, '0')}`;

  // Check for conflicts on new date/slot
  const { data: conflicts } = await db
    .from('bookings')
    .select('id, start_time, end_time')
    .eq('booking_date', newDate)
    .in('status', ['pending', 'confirmed'])
    .neq('id', bookingId);

  const startMins = h * 60 + m;
  const endMins = totalM;

  const hasConflict = conflicts?.some((c: any) => {
    const [cH1, cM1] = c.start_time.slice(0, 5).split(':').map(Number);
    const [cH2, cM2] = c.end_time.slice(0, 5).split(':').map(Number);
    const cStart = cH1 * 60 + cM1;
    const cEnd = cH2 * 60 + cM2;
    return startMins < cEnd && endMins > cStart;
  });

  if (hasConflict) {
    return { error: 'The selected rescheduled time slot conflicts with an existing booking.' };
  }

  // Update booking
  const { error: updateErr } = await db
    .from('bookings')
    .update({
      booking_date: newDate,
      start_time: newStartTime.length === 5 ? `${newStartTime}:00` : newStartTime,
      end_time: newEndTime.length === 5 ? `${newEndTime}:00` : newEndTime,
      duration_minutes: newDurationMinutes,
      admin_notes: `Rescheduled from ${booking.booking_date} ${booking.start_time.slice(0, 5)} to ${newDate} ${newStartTime}`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (updateErr) {
    return { error: updateErr.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'RESCHEDULE_BOOKING',
    target_type: 'booking',
    target_id: bookingId,
    details: { newDate, newStartTime, newDurationMinutes },
  });

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/bookings');
  revalidatePath('/admin/dashboard/calendar');
  return { success: true };
}

/**
 * 8. Quick Mark Payment as Paid / Unpaid
 */
export async function togglePaymentStatus(bookingId: string, paymentMethod: 'cash' | 'bank_transfer' = 'cash') {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { data: booking, error: fetchErr } = await db
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (fetchErr || !booking) {
    return { error: 'Booking not found' };
  }

  const nextStatus = booking.payment_status === 'paid' ? 'unpaid' : 'paid';

  const { error: updateErr } = await db
    .from('bookings')
    .update({
      payment_status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (updateErr) {
    return { error: updateErr.message };
  }

  // If marked as paid, record or update in payments table
  if (nextStatus === 'paid') {
    await db.from('payments').insert({
      booking_id: booking.id,
      booking_reference: booking.booking_reference,
      player_id: booking.player_id,
      amount: booking.total_amount,
      payment_method: paymentMethod,
      status: 'paid',
      payment_date: new Date().toISOString(),
      collected_by: user.id,
      notes: `Recorded in-person payment via ${paymentMethod}`,
    });
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/bookings');
  revalidatePath('/admin/dashboard/payments');
  return { success: true, paymentStatus: nextStatus };
}

/**
 * 9. Calendar Events Fetcher
 */
export async function getCalendarData(startDate: string, endDate: string) {
  const { supabase } = await requireAdmin();
  const db = supabase as any;

  // Fetch bookings in date range with normalized customer fields
  const { data: bookings } = await db
    .from('bookings')
    .select('*')
    .gte('booking_date', startDate)
    .lte('booking_date', endDate)
    .order('booking_date', { ascending: true })
    .order('start_time', { ascending: true });

  // Fetch blocked slots in date range
  const { data: blocks } = await db
    .from('blocked_slots')
    .select('*')
    .lte('start_date', endDate)
    .gte('end_date', startDate);

  const normalizedBookings = (bookings || []).map((b: any) => ({
    id: b.id,
    booking_reference: b.booking_reference,
    player_name: b.player_name || b.customer_name || 'Anonymous Player',
    player_phone: b.player_phone || b.customer_phone || '',
    player_email: b.player_email || b.customer_email || '',
    service_type_name: b.service_type_name || b.booking_type || 'Table Session',
    booking_date: b.booking_date,
    start_time: b.start_time,
    end_time: b.end_time,
    duration_minutes: b.duration_minutes || 60,
    status: b.status || 'pending',
    payment_status: b.payment_status || 'unpaid',
    total_amount: Number(b.total_amount || 0),
    participants_count: b.participants_count || 1,
    notes: b.notes || '',
  }));

  return {
    bookings: normalizedBookings,
    blockedSlots: blocks || [],
  };
}

/**
 * 10. Players Management
 */
export async function getAdminPlayers(searchQuery?: string) {
  const { supabase } = await requireAdmin();
  const db = supabase as any;

  let query = db
    .from('players')
    .select(`
      *,
      bookings:bookings(id, booking_reference, booking_date, start_time, end_time, service_type_name, total_amount, status, payment_status)
    `)
    .order('created_at', { ascending: false });

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.trim();
    query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching players:', error);
    return { error: error.message, players: [] };
  }

  return { players: data || [] };
}

export async function updatePlayerNotes(playerId: string, notes: string) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { error } = await db
    .from('players')
    .update({
      internal_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', playerId);

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'UPDATE_PLAYER_NOTES',
    target_type: 'player',
    target_id: playerId,
    details: { notesLength: notes.length },
  });

  revalidatePath('/admin/dashboard/players');
  return { success: true };
}

/**
 * 11. Payments Management
 */
export async function getAdminPayments(filterStatus?: string) {
  const { supabase } = await requireAdmin();
  const db = supabase as any;

  let query = db
    .from('payments')
    .select(`
      *,
      player:players(id, full_name, phone, email)
    `)
    .order('created_at', { ascending: false });

  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus);
  }

  const { data: payments, error } = await query;
  if (error) {
    console.error('Error fetching payments:', error);
    return { error: error.message, payments: [], totalCollected: 0 };
  }

  // Calculate total collected revenue (only paid status)
  const totalCollected = (payments || [])
    .filter((p: any) => p.status === 'paid')
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  return { payments: payments || [], totalCollected };
}

export async function recordPayment(input: {
  bookingId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'card' | 'online';
  referenceNumber?: string;
  notes?: string;
}) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { data: booking, error: bErr } = await db
    .from('bookings')
    .select('*')
    .eq('id', input.bookingId)
    .single();

  if (bErr || !booking) {
    return { error: 'Booking not found' };
  }

  // Insert payment record
  const { error: pErr } = await db.from('payments').insert({
    booking_id: booking.id,
    booking_reference: booking.booking_reference,
    player_id: booking.player_id,
    amount: input.amount,
    currency: 'LKR',
    payment_method: input.paymentMethod,
    reference_number: input.referenceNumber || null,
    status: 'paid',
    payment_date: new Date().toISOString(),
    collected_by: user.id,
    notes: input.notes || `Recorded payment of LKR ${input.amount}`,
  });

  if (pErr) {
    return { error: pErr.message };
  }

  // Update booking payment status
  await db
    .from('bookings')
    .update({
      payment_status: 'paid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', booking.id);

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'RECORD_PAYMENT',
    target_type: 'payment',
    target_id: booking.id,
    details: { amount: input.amount, method: input.paymentMethod },
  });

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/bookings');
  revalidatePath('/admin/dashboard/payments');
  return { success: true };
}

/**
 * 12. Academy Settings Management
 */
export async function getAcademySettings() {
  const { supabase } = await requireAdmin();
  const db = supabase as any;

  const { data: settings } = await db.from('academy_settings').select('*');
  const { data: availability } = await db
    .from('availability_rules')
    .select('*')
    .order('day_of_week', { ascending: true });
  const { data: services } = await db
    .from('service_types')
    .select('*')
    .order('price_lkr', { ascending: false });
  const { data: blockedSlots } = await db
    .from('blocked_slots')
    .select('*')
    .order('start_date', { ascending: false });

  // Convert settings array into key-value map
  const settingsMap: Record<string, any> = {};
  (settings || []).forEach((s: any) => {
    settingsMap[s.key] = s.value;
  });

  return {
    settings: settingsMap,
    availability: availability || [],
    services: services || [],
    blockedSlots: blockedSlots || [],
  };
}

export async function updateServicePricing(serviceId: string, priceLkr: number, maxCapacity?: number) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const updateData: any = {
    price_lkr: priceLkr,
    updated_at: new Date().toISOString(),
  };
  if (maxCapacity !== undefined) {
    updateData.max_capacity = maxCapacity;
  }

  const { error } = await db
    .from('service_types')
    .update(updateData)
    .eq('id', serviceId);

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'UPDATE_SERVICE_PRICING',
    target_type: 'service_type',
    target_id: serviceId,
    details: { priceLkr, maxCapacity },
  });

  revalidatePath('/admin/dashboard/settings');
  revalidatePath('/programs');
  revalidatePath('/booking');
  return { success: true };
}

export async function updateOperatingHours(
  dayOfWeek: number,
  openTime: string,
  closeTime: string,
  isActive: boolean,
  slotIntervalMinutes: number = 30
) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { error } = await db
    .from('availability_rules')
    .upsert({
      day_of_week: dayOfWeek,
      open_time: openTime.length === 5 ? `${openTime}:00` : openTime,
      close_time: closeTime.length === 5 ? `${closeTime}:00` : closeTime,
      is_active: isActive,
      slot_interval_minutes: slotIntervalMinutes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'day_of_week' });

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'UPDATE_OPERATING_HOURS',
    target_type: 'availability_rules',
    target_id: String(dayOfWeek),
    details: { openTime, closeTime, isActive, slotIntervalMinutes },
  });

  revalidatePath('/admin/dashboard/settings');
  revalidatePath('/booking');
  return { success: true };
}

export async function updateSettingConfig(key: string, value: any) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { error } = await db
    .from('academy_settings')
    .upsert({
      key,
      value,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'UPDATE_SETTING_CONFIG',
    target_type: 'academy_settings',
    target_id: key,
    details: value,
  });

  revalidatePath('/admin/dashboard/settings');
  revalidatePath('/booking');
  return { success: true };
}

export async function addBlockedSlot(input: {
  title: string;
  reason?: string;
  blockType: 'holiday' | 'maintenance' | 'tournament' | 'coach_unavailable' | 'private_event';
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
}) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { error } = await db.from('blocked_slots').insert({
    title: input.title,
    reason: input.reason || null,
    block_type: input.blockType,
    start_date: input.startDate,
    end_date: input.endDate,
    start_time: input.startTime ? (input.startTime.length === 5 ? `${input.startTime}:00` : input.startTime) : null,
    end_time: input.endTime ? (input.endTime.length === 5 ? `${input.endTime}:00` : input.endTime) : null,
    all_day: input.allDay,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'ADD_BLOCKED_SLOT',
    target_type: 'blocked_slots',
    details: input,
  });

  revalidatePath('/admin/dashboard/settings');
  revalidatePath('/admin/dashboard/calendar');
  revalidatePath('/booking');
  return { success: true };
}

export async function deleteBlockedSlot(id: string) {
  const { supabase, user } = await requireAdmin();
  const db = supabase as any;

  const { error } = await db.from('blocked_slots').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  await db.from('admin_activity_logs').insert({
    admin_id: user.id,
    action: 'DELETE_BLOCKED_SLOT',
    target_type: 'blocked_slots',
    target_id: id,
  });

  revalidatePath('/admin/dashboard/settings');
  revalidatePath('/admin/dashboard/calendar');
  revalidatePath('/booking');
  return { success: true };
}

