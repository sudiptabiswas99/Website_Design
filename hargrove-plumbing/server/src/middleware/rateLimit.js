// Throttle abusive submissions. Configured from env, applied at the router level.
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const bookingLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests — please try again in a few minutes.' },
});
