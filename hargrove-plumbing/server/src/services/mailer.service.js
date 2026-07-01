// Transport layer for email. Knows HOW to send; knows nothing about bookings/HTTP.
// Real SMTP when configured; otherwise an Ethereal test inbox (dev) with a preview URL.
import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let transporterPromise = null;
let usingEthereal = false;

async function buildTransporter() {
  if (config.smtp) {
    logger.info(`Mailer: using SMTP host ${config.smtp.host}:${config.smtp.port}`);
    return nodemailer.createTransport(config.smtp);
  }
  // Dev fallback: real, sendable test inbox at ethereal.email (no credentials needed).
  const test = await nodemailer.createTestAccount();
  usingEthereal = true;
  logger.warn(`Mailer: no SMTP configured — using Ethereal test inbox (${test.user}). Emails are NOT delivered to real recipients.`);
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: test.user, pass: test.pass },
  });
}

function getTransporter() {
  if (!transporterPromise) transporterPromise = buildTransporter();
  return transporterPromise;
}

export async function sendMail({ to, from, subject, text, html, replyTo }) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({ to, from, subject, text, html, replyTo });
  const previewUrl = usingEthereal ? nodemailer.getTestMessageUrl(info) : null;
  return { messageId: info.messageId, previewUrl };
}

// Verify connectivity at boot so a bad SMTP config fails loudly, not mid-request.
export async function verifyMailer() {
  const transporter = await getTransporter();
  await transporter.verify();
  return { ethereal: usingEthereal };
}
