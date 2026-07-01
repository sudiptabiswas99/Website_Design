// Two boundary concerns for the experiment, kept out of the booking code:
//  - assignVariant: sticky variant on the page route (sets cookies, fills req.ab)
//  - trackConversion: credit the visitor's variant when a booking succeeds (2xx)
import { parseCookies } from '../utils/cookies.js';
import { experiment } from '../config/abtest.config.js';
import * as abService from '../services/abtest.service.js';

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: experiment.cookieMaxDays * 24 * 60 * 60 * 1000,
};

export function assignVariant(req, res, next) {
  const c = parseCookies(req.headers.cookie);
  const { visitorId, variant, fresh } = abService.assign({
    visitorId: c[experiment.cookieVid],
    variant: c[experiment.cookieVariant],
  });
  if (fresh) {
    res.cookie(experiment.cookieVid, visitorId, COOKIE_OPTS);
    res.cookie(experiment.cookieVariant, variant, COOKIE_OPTS);
  }
  req.ab = { visitorId, variant };
  next();
}

export function trackConversion(req, res, next) {
  const c = parseCookies(req.headers.cookie);
  const visitorId = c[experiment.cookieVid];
  const variant = c[experiment.cookieVariant];
  if (visitorId && variant) {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        abService.recordConversion(visitorId, variant);
      }
    });
  }
  next();
}
