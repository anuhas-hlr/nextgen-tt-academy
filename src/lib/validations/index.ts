import { z } from 'zod';

export const publicBookingRequestSchema = z.object({
  bookingType: z.enum(['personal-coaching', 'group-training', 'table-rental']),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:00)?$/, 'Start time must be HH:mm'),
  durationMinutes: z.number().int().min(30).max(180).default(60),
  customerName: z.string().min(2, 'Full name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  customerPhone: z.string().min(8, 'Phone/WhatsApp number must have at least 8 digits'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  participantsCount: z.number().int().min(1).max(6).default(1),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type PublicBookingRequestInput = z.infer<typeof publicBookingRequestSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
