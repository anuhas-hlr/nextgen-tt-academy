/**
 * NextGen Table Tennis Academy - Notification Service
 * Modular service for email alerts, webhook dispatch, and database notification records.
 */

import { ACADEMY_CONFIG } from '@/lib/constants';
import { formatCurrencyLKR } from '@/lib/utils';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface BookingNotificationData {
  bookingReference: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  serviceTitle: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  totalAmount: number;
  adminNotes?: string;
}

/**
 * 1. Generate Email Template: Booking Approved
 */
export function generateBookingApprovedEmail(data: BookingNotificationData): EmailPayload {
  const subject = `Booking Confirmed: NextGen TT Academy (${data.bookingReference})`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F7FB; margin: 0; padding: 24px; color: #101B35; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; }
          .header { background: #101B35; padding: 32px 24px; text-align: center; color: #ffffff; }
          .badge { display: inline-block; background: #2675F5; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
          .content { padding: 32px 24px; }
          .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EDF2F7; font-size: 14px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748B; }
          .value { font-weight: 600; color: #101B35; }
          .ref { font-family: monospace; font-size: 18px; color: #2675F5; font-weight: 700; }
          .perk { background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #92400E; margin: 16px 0; }
          .footer { text-align: center; padding: 24px; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
          .btn { display: inline-block; background: #2675F5; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Session Confirmed</span>
            <h1 style="margin: 0; font-size: 24px;">NextGen Table Tennis Academy</h1>
            <p style="margin: 8px 0 0; color: #94A3B8; font-size: 14px;">Coach Chanul Dulsen</p>
          </div>

          <div class="content">
            <p style="font-size: 15px; margin-top: 0;">Hi <strong>${data.customerName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Great news! Your booking request at NextGen Table Tennis Academy has been <strong>approved and confirmed</strong> by Coach Chanul. Your table reservation is secured.
            </p>

            <div class="card">
              <div class="row">
                <span class="label">Booking Reference:</span>
                <span class="ref">${data.bookingReference}</span>
              </div>
              <div class="row">
                <span class="label">Program / Service:</span>
                <span class="value">${data.serviceTitle}</span>
              </div>
              <div class="row">
                <span class="label">Session Date:</span>
                <span class="value">${data.bookingDate}</span>
              </div>
              <div class="row">
                <span class="label">Reserved Time:</span>
                <span class="value">${data.startTime} - ${data.endTime} (${data.durationMinutes} min)</span>
              </div>
              <div class="row">
                <span class="label">Amount to Pay at Academy:</span>
                <span class="value" style="color: #10B981; font-size: 16px;">${formatCurrencyLKR(data.totalAmount)}</span>
              </div>
            </div>

            <div class="perk">
              🎱 <strong>Complimentary Academy Perk:</strong> You and your guardian have complimentary access to the academy pool table during your booked slot.
            </div>

            <p style="font-size: 13px; color: #64748B; line-height: 1.5;">
              <strong>Payment Policy:</strong> Please arrive 5-10 minutes prior to your session. Payment is collected physically in-person (Cash or Bank Transfer) at the academy desk.
            </p>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${ACADEMY_CONFIG.mapsUrl}" class="btn" target="_blank">
                📍 Open Academy in Google Maps
              </a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">NextGen Table Tennis Academy • Colombo, Sri Lanka</p>
            <p style="margin: 4px 0 0;">Phone / WhatsApp: ${ACADEMY_CONFIG.phone}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    to: data.customerEmail || '',
    subject,
    html,
  };
}

/**
 * 2. Generate Email Template: Booking Rejected / Unavailable
 */
export function generateBookingRejectedEmail(data: BookingNotificationData): EmailPayload {
  const subject = `Booking Update: NextGen TT Academy (${data.bookingReference})`;
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #F5F7FB; padding: 24px; color: #101B35;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; padding: 32px 24px;">
          <h2 style="color: #E11D48; margin-top: 0;">Session Request Update</h2>
          <p>Hi <strong>${data.customerName}</strong>,</p>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for your interest in training at NextGen Table Tennis Academy. Unfortunately, Coach Chanul is unable to accommodate your requested time slot (<strong>${data.bookingDate} at ${data.startTime}</strong>) due to court scheduling or tournament commitments.
          </p>

          ${
            data.adminNotes
              ? `<div style="background: #FEE2E2; border-left: 4px solid #E11D48; padding: 12px 16px; margin: 16px 0; font-size: 13px; color: #9F1239;">
                  <strong>Coach Notes:</strong> ${data.adminNotes}
                </div>`
              : ''
          }

          <p style="color: #475569; font-size: 14px;">
            We would love to train with you! Please check our live timetable to select another available opening, or message Coach Chanul directly.
          </p>

          <p style="margin-top: 24px; font-size: 13px; color: #64748B;">
            NextGen Table Tennis Academy<br>
            Phone / WhatsApp: ${ACADEMY_CONFIG.phone}
          </p>
        </div>
      </body>
    </html>
  `;

  return {
    to: data.customerEmail || '',
    subject,
    html,
  };
}

/**
 * 3. Modular Dispatcher
 * Automatically uses Resend API if RESEND_API_KEY is configured in .env.local,
 * otherwise cleanly logs to server console and marks database notification record.
 */
export async function sendEmailNotification(payload: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!payload.to || !payload.to.includes('@')) {
    return { success: false, error: 'No valid recipient email address provided.' };
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey && apiKey.startsWith('re_')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'NextGen TT Academy <bookings@nextgentt.lk>',
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error('Resend API response error:', json);
        return { success: false, error: json.message || 'Resend API failed' };
      }

      return { success: true, id: json.id };
    } catch (err: any) {
      console.error('Error dispatching email via Resend:', err);
      return { success: false, error: err.message };
    }
  }

  // Fallback: Mock / Log dispatch when Resend API key is not yet set
  console.log(`[NextGen Email Service (Mock)] Sent to: ${payload.to} | Subject: ${payload.subject}`);
  return { success: true, id: `mock-${Date.now()}` };
}
