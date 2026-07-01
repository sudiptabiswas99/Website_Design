// Thin HTTP adapter for the experiment: serve the variant homepage, render the report.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SITE_ROOT } from '../config/paths.js';
import { experiment } from '../config/abtest.config.js';
import * as abService from '../services/abtest.service.js';
import { renderDashboard } from '../views/ab-dashboard.js';

export async function serveHome(req, res, next) {
  try {
    const html = await readFile(resolve(SITE_ROOT, experiment.page), 'utf8');
    abService.recordExposure(req.ab.visitorId, req.ab.variant);
    res.type('html').send(abService.applyVariant(html, req.ab.variant));
  } catch (err) {
    next(err);
  }
}

export function getResults(req, res, next) {
  try {
    const report = abService.getReport();
    if (req.query.format === 'json') return res.json({ ok: true, ...report });
    res.type('html').send(renderDashboard(report));
  } catch (err) {
    next(err);
  }
}
