// Minimal cookie reader — avoids a cookie-parser dependency.
// (Setting cookies uses Express's built-in res.cookie, which needs no parser.)
export function parseCookies(header = '') {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const key = part.slice(0, i).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
