'use server';

import { createClient } from '@/lib/supabase/server';
import { publicBookingRequestSchema, type PublicBookingRequestInput } from '@/lib/validations';

export interface TimeSlotAvailability {
  time: string;           // '08:00' (HH:mm)
  displayTime: string;    // '08:00 AM'
  endTime: string;        // '09:00' (HH:mm)
  displayEndTime: string; // '09:00 AM'
  isAvailable: boolean;
  reason?: string;
}

export interface DayAvailabilityResult {
  isClosed: boolean;
  message?: string;
  openTime?: string;
  closeTime?: string;
  slots: TimeSlotAvailability[];
}

// Convert 24h 'HH:mm' or 'HH:mm:ss' to 'hh:mm A'
function formatDisplayTime(timeStr: string): string {
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

// Helper to add minutes to 'HH:mm'
function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const totalM = h * 60 + m + minutesToAdd;
  const newH = Math.floor(totalM / 60);
  const newM = totalM % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

// Compare two 'HH:mm' strings
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Server-side availability engine
 * Queries database rules, blocked periods, and single-table bookings
 */
export async function getAvailableSlots(
  dateStr: string,
  durationMinutes: number = 60
): Promise<DayAvailabilityResult> {
  const supabase = await createClient();
  const db = supabase as any;

  // Validate date format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { isClosed: true, message: 'Invalid date format', slots: [] };
  }

  // Calculate day of week in Asia/Colombo time
  const targetDate = new Date(`${dateStr}T12:00:00+05:30`);
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday

  // 1. Fetch operating hours for this day of week
  const { data: rule, error: ruleErr } = await db
    .from('availability_rules')
    .select('open_time, close_time, slot_interval_minutes, is_active')
    .eq('day_of_week', dayOfWeek)
    .single();

  if (ruleErr || !rule || !rule.is_active) {
    return { isClosed: true, message: 'Academy is closed on this day', slots: [] };
  }

  const openTime = rule.open_time.slice(0, 5);   // '06:00'
  const closeTime = rule.close_time.slice(0, 5); // '22:00'
  const interval = rule.slot_interval_minutes || 30;

  // 2. Fetch blocked slots for this date
  const { data: blockedSlots } = await db
    .from('blocked_slots')
    .select('*')
    .lte('start_date', dateStr)
    .gte('end_date', dateStr);

  const hasAllDayBlock = blockedSlots?.some((b: any) => b.all_day);
  if (hasAllDayBlock) {
    return {
      isClosed: true,
      message: 'Academy is reserved or closed for special event/maintenance on this date',
      slots: [],
    };
  }

  // 3. Fetch active bookings on this date (Single Table Tennis Table)
  let bookedRanges: Array<{ start: string; end: string }> = [];

  const { data: rpcSlots, error: rpcErr } = await db.rpc(
    'get_booked_time_slots',
    { p_date: dateStr }
  );

  if (!rpcErr && rpcSlots) {
    bookedRanges = rpcSlots.map((b: any) => ({
      start: b.start_time.slice(0, 5),
      end: b.end_time.slice(0, 5),
    }));
  } else {
    // Fallback direct select
    const { data: directBookings } = await db
      .from('bookings')
      .select('start_time, end_time, status')
      .eq('booking_date', dateStr)
      .in('status', ['pending', 'confirmed']);

    if (directBookings) {
      bookedRanges = directBookings.map((b: any) => ({
        start: b.start_time.slice(0, 5),
        end: b.end_time.slice(0, 5),
      }));
    }
  }

  // 4. Generate possible slots from openTime to closeTime - durationMinutes
  const openM = timeToMinutes(openTime);
  const closeM = timeToMinutes(closeTime);
  const slots: TimeSlotAvailability[] = [];

  // Current time in Asia/Colombo for checking past slots
  const nowColombo = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })
  );
  const todayColomboStr = nowColombo.toISOString().slice(0, 10);
  const currentMinutesToday = nowColombo.getHours() * 60 + nowColombo.getMinutes();

  for (let m = openM; m + durationMinutes <= closeM; m += interval) {
    const slotStartH = Math.floor(m / 60);
    const slotStartM = m % 60;
    const slotStartTime = `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`;
    const slotEndTime = addMinutesToTime(slotStartTime, durationMinutes);

    const slotStartMins = m;
    const slotEndMins = m + durationMinutes;

    let isAvailable = true;
    let reason: string | undefined = undefined;

    // Check if slot is in the past for today
    if (dateStr === todayColomboStr && slotStartMins <= currentMinutesToday + 15) {
      isAvailable = false;
      reason = 'Past time';
    }

    // Check conflict with any blocked time range
    if (isAvailable && blockedSlots) {
      for (const block of blockedSlots) {
        if (block.start_time && block.end_time) {
          const bStart = timeToMinutes(block.start_time.slice(0, 5));
          const bEnd = timeToMinutes(block.end_time.slice(0, 5));
          if (slotStartMins < bEnd && slotEndMins > bStart) {
            isAvailable = false;
            reason = block.title || 'Blocked';
            break;
          }
        }
      }
    }

    // Check conflict with any active booking (Single Table Tennis Table)
    if (isAvailable && bookedRanges.length > 0) {
      for (const booked of bookedRanges) {
        const bStart = timeToMinutes(booked.start);
        const bEnd = timeToMinutes(booked.end);
        // Overlap condition: slotStart < bEnd AND slotEnd > bStart
        if (slotStartMins < bEnd && slotEndMins > bStart) {
          isAvailable = false;
          reason = 'Reserved';
          break;
        }
      }
    }

    slots.push({
      time: slotStartTime,
      displayTime: formatDisplayTime(slotStartTime),
      endTime: slotEndTime,
      displayEndTime: formatDisplayTime(slotEndTime),
      isAvailable,
      reason,
    });
  }

  return {
    isClosed: false,
    openTime: formatDisplayTime(openTime),
    closeTime: formatDisplayTime(closeTime),
    slots,
  };
}

/**
 * Submit Booking Request (Server-side transactional validation & submission)
 */
export async function submitBookingRequest(input: PublicBookingRequestInput) {
  // 1. Zod schema validation
  const validation = publicBookingRequestSchema.safeParse(input);
  if (!validation.success) {
    return {
      error: validation.error.errors[0]?.message || 'Invalid booking details provided',
    };
  }

  const data = validation.data;
  const supabase = await createClient();
  const db = supabase as any;

  // 2. Fetch live service pricing from database
  const { data: service, error: serviceErr } = await db
    .from('service_types')
    .select('id, title, price_lkr, is_active')
    .eq('slug', data.bookingType)
    .single();

  if (serviceErr || !service) {
    return { error: 'The selected program is currently unavailable. Please refresh and try again.' };
  }

  const pricePerHour = Number(service.price_lkr);
  const totalAmount = Math.round((pricePerHour / 60) * data.durationMinutes);
  const endTime = addMinutesToTime(data.startTime, data.durationMinutes);

  // 3. Double-check availability on server before insert
  const avail = await getAvailableSlots(data.bookingDate, data.durationMinutes);
  if (avail.isClosed) {
    return { error: avail.message || 'Academy is closed on the selected date.' };
  }

  const targetSlot = avail.slots.find((s) => s.time === data.startTime.slice(0, 5));
  if (!targetSlot || !targetSlot.isAvailable) {
    return {
      error: `The slot at ${formatDisplayTime(data.startTime)} is no longer available. Please select another time.`,
    };
  }

  // 4. Generate unique, human-friendly booking reference: NGTT-YYYYMMDD-XXXX
  const dateCompact = data.bookingDate.replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const bookingReference = `NGTT-${dateCompact}-${randomSuffix}`;

  // 5. Insert booking with status: PENDING
  const { error: insertErr } = await db
    .from('bookings')
    .insert({
      booking_reference: bookingReference,
      booking_type: data.bookingType,
      service_id: service.id,
      booking_date: data.bookingDate,
      start_time: data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime,
      end_time: endTime.length === 5 ? `${endTime}:00` : endTime,
      duration_minutes: data.durationMinutes,
      table_number: 1, // Single competition table
      price_snapshot: pricePerHour,
      total_amount: totalAmount,
      status: 'pending', // Initial status must be PENDING
      payment_status: 'unpaid',
      customer_name: data.customerName.trim(),
      customer_phone: data.customerPhone.trim(),
      customer_email: data.customerEmail?.trim() || null,
      skill_level: data.skillLevel,
      guardian_name: data.guardianName?.trim() || null,
      guardian_phone: data.guardianPhone?.trim() || null,
      participants_count: data.participantsCount || 1,
      pool_table_complimentary: true,
      notes: data.notes?.trim() || null,
    });

  // Handle single-table exclusion constraint conflict (PostgreSQL code 23P01)
  if (insertErr) {
    if (insertErr.code === '23P01' || insertErr.message?.includes('exclusion')) {
      return {
        error:
          'This table tennis slot was just reserved by another player. Please choose another time slot.',
      };
    }
    console.error('Booking submission error:', insertErr);
    return {
      error: 'Unable to reserve time slot at this moment. Please check your details and try again.',
    };
  }

  // 6. Record in players directory for admin visibility
  try {
    const { data: existingPlayer } = await db
      .from('players')
      .select('id, total_sessions')
      .eq('phone', data.customerPhone.trim())
      .single();

    if (existingPlayer) {
      await db
        .from('players')
        .update({
          full_name: data.customerName.trim(),
          email: data.customerEmail?.trim() || null,
          skill_level: data.skillLevel,
          guardian_name: data.guardianName?.trim() || null,
          guardian_phone: data.guardianPhone?.trim() || null,
          total_sessions: (existingPlayer.total_sessions || 0) + 1,
        })
        .eq('id', existingPlayer.id);
    } else {
      await db.from('players').insert({
        full_name: data.customerName.trim(),
        phone: data.customerPhone.trim(),
        email: data.customerEmail?.trim() || null,
        skill_level: data.skillLevel,
        guardian_name: data.guardianName?.trim() || null,
        guardian_phone: data.guardianPhone?.trim() || null,
        total_sessions: 1,
      });
    }
  } catch (playerErr) {
    console.error('Player directory record update error:', playerErr);
  }

  // 7. Create admin notification alert
  try {
    await db.from('notifications').insert({
      recipient_email: data.customerEmail?.trim() || null,
      recipient_phone: data.customerPhone.trim(),
      type: 'booking_request',
      title: `New Booking Request - ${bookingReference}`,
      message: `${data.customerName} requested ${service.title} on ${data.bookingDate} at ${formatDisplayTime(data.startTime)} (LKR ${totalAmount.toLocaleString()}). Status: PENDING.`,
      metadata: {
        booking_reference: bookingReference,
        total_amount: totalAmount,
        booking_type: data.bookingType,
      },
      status: 'pending',
    });
  } catch (notifErr) {
    console.error('Notification log error:', notifErr);
  }

  return {
    success: true,
    bookingReference: bookingReference,
    totalAmount,
    bookingDate: data.bookingDate,
    startTime: formatDisplayTime(data.startTime),
    endTime: formatDisplayTime(endTime),
    programTitle: service.title,
  };
}

/**
 * Fetch public live pricing directly from Supabase
 */
export async function getLiveServiceRates() {
  const supabase = await createClient();
  const db = supabase as any;
  const { data: services, error } = await db
    .from('service_types')
    .select('id, title, slug, price_lkr, description, max_capacity')
    .eq('is_active', true);

  if (error || !services) {
    return [
      { id: '1', slug: 'personal-coaching', title: 'Personal Coaching (1-on-1)', price_lkr: 2500, max_capacity: 1 },
      { id: '2', slug: 'group-training', title: 'Group Coaching Sessions', price_lkr: 2500, max_capacity: 6 },
      { id: '3', slug: 'table-rental', title: 'Table-Only Rental', price_lkr: 500, max_capacity: 4 },
    ];
  }

  return services;
}

/**
 * Public Booking Status Lookup by Reference Code OR Customer Email
 */
export async function getPublicBookingStatus(query: string) {
  if (!query || query.trim().length === 0) {
    return { error: 'Please enter a valid booking reference code or email address.' };
  }

  const cleanQuery = query.trim();
  const isEmail = cleanQuery.includes('@');
  const supabase = await createClient();
  const db = supabase as any;

  // If user searched by Email address
  if (isEmail) {
    const { data: bookings, error } = await db
      .from('bookings')
      .select('booking_reference, customer_name, customer_email, booking_date, start_time, end_time, booking_type, total_amount, status, payment_status, created_at')
      .ilike('customer_email', cleanQuery)
      .order('booking_date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Email status lookup error:', error);
      return { error: 'Could not fetch bookings for that email address.' };
    }

    if (!bookings || bookings.length === 0) {
      return { error: `No bookings found matching email "${cleanQuery}".` };
    }

    return {
      bookings: bookings.map((b: any) => ({
        booking_reference: b.booking_reference,
        customer_name: b.customer_name,
        customer_email: b.customer_email,
        booking_date: b.booking_date,
        start_time: formatDisplayTime(b.start_time),
        end_time: formatDisplayTime(b.end_time),
        service_title: b.booking_type || 'Table Session',
        total_amount: Number(b.total_amount),
        status: b.status,
        payment_status: b.payment_status || 'unpaid',
        created_at: b.created_at,
      })),
    };
  }

  // Otherwise, user searched by Booking Reference code
  const cleanRef = cleanQuery.toUpperCase();

  // 1. First attempt: call RPC `get_booking_by_reference`
  try {
    const { data: rpcData, error: rpcErr } = await db.rpc('get_booking_by_reference', {
      p_ref: cleanRef,
    });

    if (!rpcErr && rpcData && rpcData.length > 0) {
      const b = rpcData[0];
      return {
        bookings: [
          {
            booking_reference: b.booking_reference,
            customer_name: b.customer_name,
            booking_date: b.booking_date,
            start_time: formatDisplayTime(b.start_time),
            end_time: formatDisplayTime(b.end_time),
            service_title: b.booking_type || 'Table Session',
            total_amount: Number(b.total_amount),
            status: b.status,
            payment_status: 'unpaid',
            created_at: new Date().toISOString(),
          },
        ],
      };
    }
  } catch (rpcCatch) {
    console.warn('RPC check skipped, falling back to direct lookup:', rpcCatch);
  }

  // 2. Direct lookup: Query with exact reference
  const { data: directBooking, error: directErr } = await db
    .from('bookings')
    .select('booking_reference, customer_name, customer_email, booking_date, start_time, end_time, booking_type, total_amount, status, payment_status, created_at')
    .ilike('booking_reference', cleanRef)
    .maybeSingle();

  if (directErr) {
    console.error('Direct booking lookup error:', directErr);
    return { error: `Lookup error: ${directErr.message}` };
  }

  if (!directBooking) {
    return { error: `No booking found with reference "${cleanRef}". Please double check your code or search with your email.` };
  }

  return {
    bookings: [
      {
        booking_reference: directBooking.booking_reference,
        customer_name: directBooking.customer_name,
        customer_email: directBooking.customer_email,
        booking_date: directBooking.booking_date,
        start_time: formatDisplayTime(directBooking.start_time),
        end_time: formatDisplayTime(directBooking.end_time),
        service_title: directBooking.booking_type || 'Table Session',
        total_amount: Number(directBooking.total_amount),
        status: directBooking.status,
        payment_status: directBooking.payment_status || 'unpaid',
        created_at: directBooking.created_at,
      },
    ],
  };
}

