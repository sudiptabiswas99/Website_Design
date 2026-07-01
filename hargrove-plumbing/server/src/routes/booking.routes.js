// URL -> middleware -> controller. No logic here.
import { Router } from 'express';
import { bookingLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { bookingSchema } from '../validators/booking.schema.js';
import * as bookingController from '../controllers/booking.controller.js';

const router = Router();

router.post('/', bookingLimiter, validate(bookingSchema), bookingController.createBooking);

export default router;
