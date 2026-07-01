// Minimal leveled logger — replaces bare console.log in request paths.
// Swap for pino/winston later without touching call sites.
const ts = () => new Date().toISOString();
const fmt = (level, args) => [`[${ts()}] ${level}`, ...args];

export const logger = {
  info: (...a) => console.log(...fmt('INFO ', a)),
  warn: (...a) => console.warn(...fmt('WARN ', a)),
  error: (...a) => console.error(...fmt('ERROR', a)),
};
