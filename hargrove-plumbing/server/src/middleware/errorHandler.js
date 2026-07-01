// One global error handler + 404. Controllers funnel errors here via next(err).
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export const notFound = (req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
};

// eslint-disable-next-line no-unused-vars  (Express needs the 4-arg signature)
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  logger.error(`${req.method} ${req.originalUrl} -> ${status}:`, err.message);
  res.status(status).json({
    ok: false,
    error: status === 500 ? 'Something went wrong on our end.' : err.message,
    ...(config.isProd ? {} : { detail: err.stack }),
  });
};
