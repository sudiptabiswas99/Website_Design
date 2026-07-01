// Business logic for a booking request. Knows nothing about HTTP (no req/res).
// Composes the lead email and hands it to the mailer transport.
import { sendMail } from './mailer.service.js';
import { config } from '../config/env.js';

const esc = (s = '') => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

function buildEmail(lead) {
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  // A universally-openable maps link from the pin (if the customer set one).
  const mapLink = lead.lat && lead.lng ? `https://www.google.com/maps?q=${lead.lat},${lead.lng}` : '';
  const rows = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Address', lead.address || '—'],
    ['ZIP', lead.zip || '—'],
    ['Service', lead.service || '—'],
    ['Notes', lead.notes || '—'],
    ['Map', mapLink || '—'],
    ['Received', `${when} PT`],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px;color:#c25a2b">New booking request</h2>
      <p style="margin:0 0 16px;color:#555">From the Hargrove &amp; Sons website</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(([k, v]) => {
            const cell =
              k === 'Map' && /^https?:\/\//.test(v)
                ? `<a href="${esc(v)}" style="color:#0e7ea8">Open in Google Maps →</a>`
                : esc(v);
            return `<tr>
                 <td style="padding:8px 12px;background:#f4eee2;font-weight:bold;width:120px;border:1px solid #e2d6c0">${k}</td>
                 <td style="padding:8px 12px;border:1px solid #e2d6c0">${cell}</td>
               </tr>`;
          })
          .join('')}
      </table>
    </div>`;
  return { text, html };
}

export async function createBooking(lead) {
  const { text, html } = buildEmail(lead);
  const result = await sendMail({
    to: config.booking.to,
    from: config.booking.from,
    subject: `New booking — ${lead.name} (${lead.service || 'general'})`,
    text,
    html,
  });
  return {
    message: `Thanks, ${lead.name.split(' ')[0]} — a plumber will reach out to ${lead.phone} shortly.`,
    previewUrl: result.previewUrl, // present only when using the dev Ethereal inbox
  };
}
