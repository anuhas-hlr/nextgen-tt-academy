export const ACADEMY_CONFIG = {
  name: 'NextGen Table Tennis Academy',
  owner: 'Chanul Dulsen',
  headCoach: 'Chanul Dulsen',
  coachTitles: [
    'Sri Lanka National No. 1',
    'Coach at Horizon College',
    'Professional Table Tennis Coach',
  ],
  tagline: 'Train Smarter. Play Stronger. Become NextGen.',
  location: 'Colombo, Sri Lanka',
  mapsUrl: 'https://maps.app.goo.gl/NnL6NtGwU9xm4EmA8',
  phone: '+94 75 639 9105',
  phoneRaw: '+94756399105',
  whatsappUrl: 'https://wa.me/94756399105',
  email: 'info@nextgentt.lk',
  timezone: 'Asia/Colombo',
  facilities: {
    tableTennisTables: 1, // Exactly ONE competition table tennis table
    poolTables: 1,        // Exactly ONE pool table
    poolAccessComplimentary: true, // Complimentary benefit subject to policy
  },
  bookingSettings: {
    slotIncrementMinutes: 30, // 30-minute booking increment
    minDurationMinutes: 30,
    maxDurationMinutes: 180,
    defaultCurrency: 'LKR',
    paymentMethod: 'Pay at Academy',
  },
  initialRates: {
    personalCoachingHourly: 2500, // LKR 2,500/hr
    groupCoachingHourly: 2500,    // LKR 2,500/hr (subject to admin config)
    tableOnlyHourly: 500,         // LKR 500/hr
  },
} as const;

export const BOOKING_TYPES = {
  PERSONAL_COACHING: 'personal-coaching',
  GROUP_COACHING: 'group-training',
  TABLE_ONLY: 'table-rental',
} as const;

export type BookingType = typeof BOOKING_TYPES[keyof typeof BOOKING_TYPES];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
