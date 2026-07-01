// Single source of truth for configuration. Reads env once, validates, fails fast.
import 'dotenv/config';
import { z } from 'zod';

const bool = (def) =>
  z.preprocess((v) => (v === undefined ? def : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase())), z.boolean());

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(8787),

  // SMTP — optional in development (we fall back to an Ethereal test inbox),
  // required in production so a misconfigured deploy fails loudly at boot.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: bool(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Where new-lead emails are delivered, and the From identity.
  BOOKING_TO: z.string().email().optional(),
  BOOKING_FROM: z.string().default('Hargrove & Sons Website <no-reply@hargroveplumbing.example>'),

  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_MIN: z.coerce.number().int().positive().default(10),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('✖ Invalid environment configuration:\n', parsed.error.flatten().fieldErrors);
  process.exit(1);
}
const e = parsed.data;

// Production hard requirements — fail fast.
if (e.NODE_ENV === 'production') {
  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'BOOKING_TO'].filter((k) => !e[k]);
  if (missing.length) {
    console.error(`✖ Missing required production env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

export const config = {
  env: e.NODE_ENV,
  isProd: e.NODE_ENV === 'production',
  port: e.PORT,
  smtp: e.SMTP_HOST
    ? { host: e.SMTP_HOST, port: e.SMTP_PORT, secure: e.SMTP_SECURE, auth: { user: e.SMTP_USER, pass: e.SMTP_PASS } }
    : null, // null => mailer uses an Ethereal test account
  booking: { to: e.BOOKING_TO || 'leads@hargroveplumbing.example', from: e.BOOKING_FROM },
  cors: { origin: e.CORS_ORIGIN === '*' ? true : e.CORS_ORIGIN.split(',').map((s) => s.trim()) },
  rateLimit: { max: e.RATE_LIMIT_MAX, windowMs: e.RATE_LIMIT_WINDOW_MIN * 60 * 1000 },
};
