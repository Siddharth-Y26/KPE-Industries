// The site's only server code: the enquiry endpoint.
// Cloudflare serves every other path as a static file without running this Worker
// (see run_worker_first in wrangler.jsonc).

import { ACCEPTED_FIELDS, HONEYPOT_FIELD, TOKEN_FIELD, validateEnquiry } from "../lib/enquiry";
import { sendEnquiryEmail, type EmailEnv } from "./email";

type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

export type Env = EmailEnv & {
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGINS?: string;
  ENQUIRY_RATE_LIMITER?: RateLimiter;
};

const MAX_BODY_BYTES = 16 * 1024;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

function isAllowedOrigin(request: Request, env: Env): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  const allowed = [
    new URL(request.url).origin,
    ...(env.ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean),
  ];
  return allowed.includes(origin);
}

// Reads the body but gives up as soon as it passes the limit, so a client cannot make
// the Worker buffer an arbitrarily large request.
async function readBody(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function handleEnquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  // The form is only ever posted from the site itself. Other sites get no CORS
  // headers either, so a browser will not let them read a response.
  if (!isAllowedOrigin(request, env)) {
    return json({ ok: false, error: "forbidden" }, 403);
  }

  const ip = request.headers.get("CF-Connecting-IP");
  if (env.ENQUIRY_RATE_LIMITER) {
    const { success } = await env.ENQUIRY_RATE_LIMITER.limit({ key: ip ?? "unknown" });
    if (!success) return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": "60" });
  }

  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const declaredLength = Number(request.headers.get("Content-Length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) return json({ ok: false, error: "payload_too_large" }, 413);
  const body = await readBody(request, MAX_BODY_BYTES);
  if (body === null) return json({ ok: false, error: "payload_too_large" }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ ok: false, error: "invalid_json" }, 400);
  }
  const fields = payload as Record<string, unknown>;
  if (Object.keys(fields).some((key) => !ACCEPTED_FIELDS.includes(key))) {
    return json({ ok: false, error: "unexpected_field" }, 400);
  }

  // A filled honeypot means a bot. Answer as if it worked so the bot learns nothing.
  if (typeof fields[HONEYPOT_FIELD] === "string" && fields[HONEYPOT_FIELD] !== "") {
    return json({ ok: true }, 200);
  }

  const result = validateEnquiry(fields);
  if (!result.ok) return json({ ok: false, error: "validation", fields: result.errors }, 422);

  if (env.TURNSTILE_SECRET_KEY) {
    const token = fields[TOKEN_FIELD];
    if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
      return json({ ok: false, error: "challenge_required" }, 400);
    }
    if (!(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip))) {
      return json({ ok: false, error: "challenge_failed" }, 403);
    }
  }

  const sent = await sendEnquiryEmail(env, result.data);
  if (!sent.ok) {
    return json({ ok: false, error: "delivery_failed" }, sent.reason === "not_configured" ? 503 : 502);
  }

  return json({ ok: true }, 200);
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const { pathname } = new URL(request.url);
      if (pathname === "/api/enquiry") return await handleEnquiry(request, env);
      return json({ ok: false, error: "not_found" }, 404);
    } catch (error) {
      // Log the message for the operator; tell the client nothing about the internals.
      console.error(`[enquiry] Unhandled error: ${error instanceof Error ? error.message : "unknown"}`);
      return json({ ok: false, error: "server_error" }, 500);
    }
  },
};

export default worker;
