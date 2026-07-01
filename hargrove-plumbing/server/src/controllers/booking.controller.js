// Thin HTTP adapter: read validated input, call one service, shape the response.
import * as bookingService from '../services/booking.service.js';

export async function createBooking(req, res, next) {
  try {
    const result = await bookingService.createBooking(req.validated);
    res.status(201).json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
}
