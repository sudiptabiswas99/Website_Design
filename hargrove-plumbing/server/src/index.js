// Entry point: bootstrap only. Validate config (on import), verify mailer, start server.
import { config } from './config/env.js';
import { createApp } from './app.js';
import { verifyMailer } from './services/mailer.service.js';
import { logger } from './utils/logger.js';

const app = createApp();

app.listen(config.port, async () => {
  logger.info(`Hargrove booking server listening on http://localhost:${config.port}  (${config.env})`);
  logger.info(`Site:   http://localhost:${config.port}/`);
  logger.info(`Health: http://localhost:${config.port}/api/health`);
  try {
    const { ethereal } = await verifyMailer();
    logger.info(`Mailer ready${ethereal ? ' (Ethereal dev inbox — preview links returned in API responses)' : ''}.`);
  } catch (err) {
    logger.error('Mailer verification failed:', err.message);
    if (config.isProd) process.exit(1);
  }
});
