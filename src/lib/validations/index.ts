import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(9, 'Please provide a valid phone number'),
  tableNumber: z.number().int().min(1).max(6),
  bookingDate: z.string(), // YYYY-MM-DD
  startTime: z.string(),  // HH:mm
  endTime: z.string(),    // HH:mm
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
