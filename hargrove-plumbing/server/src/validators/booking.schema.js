// Request-shape validation at the boundary (declarative, not hand-rolled in logic).
import { z } from 'zod';

export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  phone: z.string().trim().min(7, 'Please enter a valid phone number').max(40),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'ZIP must be 5 digits')
    .optional()
    .or(z.literal('')),
  service: z.string().trim().max(80).optional().or(z.literal('')),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
  // Service address + map pin. All optional so a quick request still goes through.
  address: z.string().trim().max(300).optional().or(z.literal('')),
  lat: z.string().trim().max(32).optional().or(z.literal('')),
  lng: z.string().trim().max(32).optional().or(z.literal('')),
  // Honeypot — bots fill hidden fields; humans never see it. Must stay empty.
  company: z.string().max(0).optional(),
});
