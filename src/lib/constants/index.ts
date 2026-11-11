export const ACADEMY_CONFIG = {
  name: 'NextGen Table Tennis Academy',
  location: 'Colombo, Sri Lanka',
  phone: '+94 75 639 9105',
  phoneRaw: '+94756399105',
  whatsappUrl: 'https://wa.me/94756399105',
  email: 'info@nextgentt.lk',
  mapsUrl: 'https://maps.app.goo.gl/NnL6NtGwU9xm4EmA8',
  timezone: 'Asia/Colombo',
  totalTables: 1,
  totalPoolTables: 1,
  slotIntervalMinutes: 60,
  defaultCurrency: 'LKR',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;
