// Posts a sample booking to a running server and prints the result.
// Usage: node scripts/smoketest.js   (server must be running on PORT)
const PORT = process.env.PORT || 8787;
const base = `http://localhost:${PORT}`;

const sample = {
  name: 'Jordan Avery',
  phone: '(562) 431-1960',
  zip: '95814',
  service: 'Water heater / tankless',
  notes: 'No hot water since this morning — smoketest submission.',
};

try {
  const health = await (await fetch(`${base}/api/health`)).json();
  console.log('health:', health);

  const res = await fetch(`${base}/api/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sample),
  });
  const body = await res.json();
  console.log(`POST /api/book -> ${res.status}`);
  console.log(JSON.stringify(body, null, 2));
  if (body.previewUrl) console.log('\n📧 Open the sent email here:\n' + body.previewUrl);
  process.exit(res.ok ? 0 : 1);
} catch (err) {
  console.error('smoketest failed:', err.message);
  process.exit(1);
}
