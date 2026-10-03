import type { Enquiry } from "../lib/enquiry";

export type EmailEnv = {
  EMAIL_FROM?: string;
  EMAIL_TO?: string;
  EMAIL_API_KEY?: string;
  EMAIL_DRY_RUN?: string;
};

export type SendResult = { ok: true } | { ok: false; reason: "not_configured" | "provider_error" };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function timestamp(now: Date): string {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);
  return `${formatted} IST`;
}

export function buildEnquiryEmail(enquiry: Enquiry, now: Date) {
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Company", enquiry.company],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
    ["Requirement", enquiry.service],
    ["Project Location", enquiry.location || "Not provided"],
    ["Estimated Capacity", enquiry.capacity || "Not provided"],
    ["Preferred Contact", enquiry.preferredContact || "Not specified"],
    ["Message", enquiry.message],
    ["Timestamp", timestamp(now)],
  ];

  // Validation has already stripped line breaks from single-line fields, so neither
  // value can add headers to the outgoing message.
  const subject = `New Website Enquiry: ${enquiry.service} - ${enquiry.company}`.slice(0, 200);

  const text = ["New Website Enquiry", "", ...rows.map(([label, value]) => `${label}: ${value}`)].join("\n");

  const html = [
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#16202e">',
    '<h1 style="font-size:18px;margin:0 0 16px">New Website Enquiry</h1>',
    '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;color:#4a6178;white-space:nowrap">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;vertical-align:top;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    ),
    "</table>",
    "</div>",
  ].join("");

  return { subject, text, html };
}

export async function sendEnquiryEmail(env: EmailEnv, enquiry: Enquiry, now = new Date()): Promise<SendResult> {
  const { subject, text, html } = buildEnquiryEmail(enquiry, now);

  if (env.EMAIL_DRY_RUN === "true") {
    console.log(`[enquiry] EMAIL_DRY_RUN is on, nothing was sent.\nSubject: ${subject}\n\n${text}`);
    return { ok: true };
  }

  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM || !env.EMAIL_TO) {
    console.error("[enquiry] Email is not configured: EMAIL_API_KEY, EMAIL_FROM and EMAIL_TO are all required.");
    return { ok: false, reason: "not_configured" };
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: env.EMAIL_TO.split(",").map((address) => address.trim()).filter(Boolean),
      reply_to: enquiry.email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    // Status only. The response body can echo the enquirer's details.
    console.error(`[enquiry] Email provider returned HTTP ${response.status}.`);
    return { ok: false, reason: "provider_error" };
  }

  return { ok: true };
}
