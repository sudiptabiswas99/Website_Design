// Filesystem paths resolved once. This file lives at server/src/config/.
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The static marketing site sits at the project root (…/hargrove-plumbing).
export const SITE_ROOT = resolve(__dirname, '../../..');
// Persistent A/B event store lives under the server (…/hargrove-plumbing/server/data).
export const DATA_DIR = resolve(__dirname, '../../data');
