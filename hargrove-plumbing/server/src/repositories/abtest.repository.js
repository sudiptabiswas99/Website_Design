// The ONLY layer that knows where A/B events are stored. Today: a JSON file on disk.
// Swap to Postgres/SQLite/Redis by reimplementing this file — the service never changes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DATA_DIR } from '../config/paths.js';
import { experiment } from '../config/abtest.config.js';
import { logger } from '../utils/logger.js';

const FILE = resolve(DATA_DIR, `ab-${experiment.id}.json`);

// In-memory cache, loaded once, written through on every mutation. Node's single
// thread serializes these writes, which is plenty for a marketing site's volume.
let cache = null;

function load() {
  if (cache) return cache;
  try {
    if (existsSync(FILE)) cache = JSON.parse(readFileSync(FILE, 'utf8'));
  } catch (err) {
    logger.error('A/B store unreadable, starting fresh:', err.message);
  }
  if (!cache || cache.experimentId !== experiment.id) {
    cache = { experimentId: experiment.id, visitors: {} };
  }
  return cache;
}

function persist() {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(cache), 'utf8');
  } catch (err) {
    logger.error('A/B store write failed:', err.message);
  }
}

// Record that a visitor saw a variant. Idempotent — a reload is not a new view.
export function recordExposure(visitorId, variant) {
  const db = load();
  if (!db.visitors[visitorId]) {
    db.visitors[visitorId] = { variant, converted: false, firstSeen: new Date().toISOString() };
    persist();
  }
  return db.visitors[visitorId];
}

// Mark a visitor converted. Idempotent — one conversion per visitor.
export function recordConversion(visitorId, variant) {
  const db = load();
  const v =
    db.visitors[visitorId] ||
    (db.visitors[visitorId] = { variant, converted: false, firstSeen: new Date().toISOString() });
  if (!v.converted) {
    v.converted = true;
    v.convertedAt = new Date().toISOString();
    persist();
  }
  return v;
}

export function allVisitors() {
  return Object.values(load().visitors);
}
