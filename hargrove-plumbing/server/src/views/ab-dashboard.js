// Presentation only: turn a report object into the results dashboard HTML.
const pct = (n) => `${(n * 100).toFixed(1)}%`;

const BANNER = {
  significant: '#3fb27f',
  inconclusive: '#c79a4b',
  collecting: '#45b6e0',
};

export function renderDashboard(r) {
  const maxRate = Math.max(0.0001, ...r.rows.map((x) => x.rate));
  const banner = BANNER[r.verdict.state] || '#45b6e0';
  const lift = r.stats.lift == null ? '—' : `${r.stats.lift >= 0 ? '+' : ''}${(r.stats.lift * 100).toFixed(1)}%`;
  const p = r.stats.p == null ? '—' : r.stats.p.toFixed(3);

  const rows = r.rows
    .map((row) => {
      const win = r.verdict.winner === row.variant;
      return `<tr class="${win ? 'win' : ''}">
        <td><span class="tag">${row.variant}</span>${row.label}</td>
        <td class="num">${row.views}</td>
        <td class="num">${row.conversions}</td>
        <td class="num rate">${pct(row.rate)}</td>
        <td class="barcell"><span class="bar" style="width:${((row.rate / maxRate) * 100).toFixed(1)}%"></span></td>
      </tr>`;
    })
    .join('');

  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="15">
<title>A/B results · ${r.experimentId}</title>
<style>
  :root{ font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
  *{ box-sizing:border-box; }
  body{ margin:0; background:#0a1626; color:#e8eef6; padding:clamp(1.5rem,5vw,3.5rem); }
  .wrap{ max-width:880px; margin:0 auto; }
  h1{ font-size:clamp(1.4rem,1rem+1.6vw,2rem); margin:0 0 .2rem; }
  .meta{ color:#9fb4c9; font-size:.9rem; margin:0 0 1.6rem; }
  .meta code{ color:#45b6e0; background:rgba(69,182,224,.12); padding:.1rem .4rem; border-radius:5px; }
  .banner{ border-left:4px solid ${banner}; background:rgba(255,255,255,.04); padding:1rem 1.2rem;
    border-radius:10px; margin:0 0 1.4rem; font-size:1.05rem; font-weight:600; }
  .kpis{ display:flex; gap:1rem; flex-wrap:wrap; margin:0 0 1.6rem; }
  .kpi{ flex:1; min-width:8rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
    border-radius:12px; padding:1rem 1.1rem; }
  .kpi b{ display:block; font-size:1.7rem; line-height:1.1; }
  .kpi small{ color:#9fb4c9; }
  table{ width:100%; border-collapse:collapse; background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.08); border-radius:12px; overflow:hidden; }
  th,td{ padding:.75rem 1rem; text-align:left; border-bottom:1px solid rgba(255,255,255,.07); }
  th{ color:#9fb4c9; font-weight:600; font-size:.82rem; text-transform:uppercase; letter-spacing:.04em; }
  td.num{ text-align:right; font-variant-numeric:tabular-nums; }
  td.rate{ font-weight:700; }
  tr.win td{ background:rgba(63,178,127,.10); }
  tr.win .tag{ background:#3fb27f; }
  .tag{ display:inline-block; width:1.4rem; height:1.4rem; line-height:1.4rem; text-align:center;
    border-radius:6px; background:#45b6e0; color:#04121f; font-weight:700; margin-right:.6rem; }
  .barcell{ width:30%; }
  .bar{ display:block; height:9px; border-radius:5px; background:linear-gradient(90deg,#45b6e0,#6fd0ef); }
  footer{ margin-top:1.6rem; color:#6f8298; font-size:.82rem; line-height:1.5; }
  a{ color:#9fb4c9; }
</style></head>
<body><div class="wrap">
  <h1>A/B test — hero CTA</h1>
  <p class="meta">Experiment <code>${r.experimentId}</code> · goal: ${r.goal} · auto-refreshes every 15s · <a href="/ab-results?format=json">JSON</a></p>

  <div class="banner">${r.verdict.message}</div>

  <div class="kpis">
    <div class="kpi"><b>${r.totals.views}</b><small>total views</small></div>
    <div class="kpi"><b>${r.totals.conversions}</b><small>total bookings</small></div>
    <div class="kpi"><b>${lift}</b><small>lift (B vs A)</small></div>
    <div class="kpi"><b>${p}</b><small>p-value</small></div>
  </div>

  <table>
    <thead><tr><th>Variant</th><th class="num">Views</th><th class="num">Bookings</th><th class="num">Conv. rate</th><th>Rate</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <footer>
    Views = unique visitors shown the page. A booking counts once per visitor when <code>POST /api/book</code> returns 2xx.<br>
    Significance is a two-proportion z-test at p&lt;0.05. Numbers shown are exact measured counts.
  </footer>
</div></body></html>`;
}
