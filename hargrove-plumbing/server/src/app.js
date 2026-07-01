// Express wiring only: middleware, static site, API mount, error funnel.
import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { SITE_ROOT } from './config/paths.js';
import apiRoutes from './routes/index.js';
import abtestRoutes from './routes/abtest.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json({ limit: '64kb' }));
  app.use(express.urlencoded({ extended: true, limit: '64kb' }));

  // A/B test: serve the homepage with its variant applied, plus the results dashboard.
  // Mounted before express.static so '/' and '/index.html' get the variant transform.
  app.use(abtestRoutes);

  // Serve the marketing site so the form posts same-origin to /api/book.
  app.use(express.static(SITE_ROOT, { extensions: ['html'] }));

  app.use('/api', apiRoutes);

  // API 404s return JSON; everything else falls back to the site's index.
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
