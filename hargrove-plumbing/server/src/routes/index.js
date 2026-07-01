// Single aggregator: every feature router mounts here under its base path.
import { Router } from 'express';
import bookingRoutes from './booking.routes.js';
import { trackConversion } from '../middleware/abtest.middleware.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true, service: 'hargrove-booking', time: new Date().toISOString() }));
// trackConversion credits the visitor's A/B variant when a booking succeeds (2xx).
router.use('/book', trackConversion, bookingRoutes);

export default router;
