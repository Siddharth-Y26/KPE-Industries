import { afterEach, describe, expect, it, vi } from "vitest";
import { LIMITS, validateEnquiry } from "../lib/enquiry";
import { buildEnquiryEmail } from "../worker/email";
import worker, { type Env } from "../worker/index";

const ORIGIN = "https://kpe.example";
const URL_ = `${ORIGIN}/api/enquiry`;

const valid = {
  name: "Test Engineer",
  company: "Example Industries",
  email: "test@example.com",
  phone: "+91 98765 43210",
  service: "Transformer Erection",
  message: "We need a 400 kVA transformer erected.",
  location: "Lucknow",
  capacity: "400 kVA",
  preferredContact: "Phone",
};

const dryRun: Env = { EMAIL_DRY_RUN: "true" };

function post(body: unknown, init: { headers?: Record<string, string>; raw?: string } = {}) {
  return new Request(URL_, {
    method: "POST",
    headers: { Origin: ORIGIN, "Content-Type": "application/json", ...init.headers },
    body: init.raw ?? JSON.stringify(body),
  });
}

async function send(request: Request, env: Env = dryRun) {
  const response = await worker.fetch(request, env);
  return { status: response.status, body: (await response.json()) as Record<string, unknown>, response };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("validateEnquiry", () => {
  it("accepts a complete enquiry and trims it", () => {
    const result = validateEnquiry({ ...valid, name: "  Test   Engineer  " });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.name).toBe("Test Engineer");
  });

  it("accepts an enquiry with the optional fields left out", () => {
    const { name, company, email, phone, service, message } = valid;
    expect(validateEnquiry({ name, company, email, phone, service, message }).ok).toBe(true);
  });

  it("reports every missing required field", () => {
    const result = validateEnquiry({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["company", "email", "message", "name", "phone", "service"]);
    }
  });

  it.each([
    ["email", "not-an-email"],
    ["email", "a@b"],
    ["phone", "12345"],
    ["phone", "call me maybe"],
    ["phone", "1234567890123456"],
    ["service", "Something Else"],
    ["capacity", "<script>"],
    ["preferredContact", "Carrier pigeon"],
    ["message", "short"],
    ["message", "x".repeat(LIMITS.message.max + 1)],
    ["name", "x".repeat(LIMITS.name.max + 1)],
  ])("rejects %s = %j", (field, value) => {
    const result = validateEnquiry({ ...valid, [field]: value });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveProperty(field);
  });

  it("strips line breaks from single-line fields so they cannot inject email headers", () => {
    const result = validateEnquiry({ ...valid, company: "Acme\r\nBcc: victim@example.com" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.company).toBe("Acme Bcc: victim@example.com");
  });

  it("keeps line breaks in the message", () => {
    const result = validateEnquiry({ ...valid, message: "Line one\r\nLine two" });
    expect(result.ok && result.data.message).toBe("Line one\nLine two");
  });

  it("treats non-string values as empty rather than throwing", () => {
    expect(validateEnquiry({ ...valid, name: { $ne: null }, phone: 12345 }).ok).toBe(false);
    expect(validateEnquiry(null).ok).toBe(false);
  });
});

describe("buildEnquiryEmail", () => {
  it("escapes HTML in every field", () => {
    const result = validateEnquiry({ ...valid, company: '<img src=x onerror="alert(1)">', message: "<b>bold</b> & more" });
    if (!result.ok) throw new Error("expected valid");
    const { html, text } = buildEnquiryEmail(result.data, new Date("2026-10-03T12:00:00Z"));
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<b>bold");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(html).toContain("&lt;b&gt;bold&lt;/b&gt; &amp; more");
    expect(text).toContain("Timestamp: 3 Oct 2026, 5:30 pm IST");
  });

  it("lists every field the business expects", () => {
    const result = validateEnquiry(valid);
    if (!result.ok) throw new Error("expected valid");
    const { subject, text } = buildEnquiryEmail(result.data, new Date());
    expect(subject).toBe("New Website Enquiry: Transformer Erection - Example Industries");
    for (const label of ["Name", "Company", "Email", "Phone", "Requirement", "Project Location", "Estimated Capacity", "Preferred Contact", "Message", "Timestamp"]) {
      expect(text).toContain(`${label}: `);
    }
  });
});

describe("POST /api/enquiry", () => {
  it("accepts a valid enquiry", async () => {
    const { status, body, response } = await send(post(valid));
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it.each(["GET", "PUT", "DELETE", "OPTIONS"])("rejects %s", async (method) => {
    const { status, response } = await send(new Request(URL_, { method, headers: { Origin: ORIGIN } }));
    expect(status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });

  it("rejects requests with no Origin or a foreign Origin", async () => {
    const noOrigin = new Request(URL_, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(valid) });
    expect((await send(noOrigin)).status).toBe(403);
    expect((await send(post(valid, { headers: { Origin: "https://evil.example" } }))).status).toBe(403);
  });

  it("accepts an extra origin listed in ALLOWED_ORIGINS", async () => {
    const env: Env = { ...dryRun, ALLOWED_ORIGINS: "https://www.kpe.example, https://preview.kpe.example" };
    expect((await send(post(valid, { headers: { Origin: "https://preview.kpe.example" } }), env)).status).toBe(200);
  });

  it("rejects a body that is not JSON", async () => {
    expect((await send(post(null, { headers: { "Content-Type": "text/plain" } }))).status).toBe(415);
    expect((await send(post(null, { raw: "{not json" }))).status).toBe(400);
    expect((await send(post(null, { raw: "[1,2,3]" }))).status).toBe(400);
    expect((await send(post(null, { raw: '"a string"' }))).status).toBe(400);
  });

  it("rejects an oversized body", async () => {
    const { status } = await send(post({ ...valid, message: "x".repeat(20_000) }));
    expect(status).toBe(413);
  });

  it("rejects fields it does not know", async () => {
    const { status, body } = await send(post({ ...valid, isAdmin: true }));
    expect(status).toBe(400);
    expect(body.error).toBe("unexpected_field");
  });

  it("returns field errors without sending anything", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { status, body } = await send(post({ ...valid, email: "nope" }));
    expect(status).toBe(422);
    expect(body.fields).toHaveProperty("email");
    expect(log).not.toHaveBeenCalled();
  });

  it("pretends to succeed when the honeypot is filled, and sends nothing", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { status, body } = await send(post({ ...valid, website: "http://spam.example" }));
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(log).not.toHaveBeenCalled();
  });

  it("applies the rate limit per client IP", async () => {
    const limit = vi.fn(async ({ key }: { key: string }) => ({ success: key !== "203.0.113.9" }));
    const env: Env = { ...dryRun, ENQUIRY_RATE_LIMITER: { limit } };
    const blocked = await send(post(valid, { headers: { "CF-Connecting-IP": "203.0.113.9" } }), env);
    expect(blocked.status).toBe(429);
    expect(blocked.response.headers.get("Retry-After")).toBe("60");
    expect((await send(post(valid, { headers: { "CF-Connecting-IP": "198.51.100.4" } }), env)).status).toBe(200);
    expect(limit).toHaveBeenCalledWith({ key: "203.0.113.9" });
  });

  it("requires and verifies a Turnstile token when a secret is configured", async () => {
    const env: Env = { ...dryRun, TURNSTILE_SECRET_KEY: "secret" };
    expect((await send(post(valid), env)).status).toBe(400);

    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const token = (init.body as URLSearchParams).get("response");
      return Response.json({ success: token === "good-token" });
    });
    vi.stubGlobal("fetch", fetchMock);
    expect((await send(post({ ...valid, turnstileToken: "bad-token" }), env)).status).toBe(403);
    expect((await send(post({ ...valid, turnstileToken: "good-token" }), env)).status).toBe(200);
    expect(fetchMock.mock.calls[0][0]).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
  });

  it("sends through the email provider with the enquirer as reply-to", async () => {
    const fetchMock = vi.fn(async () => Response.json({ id: "email_1" }));
    vi.stubGlobal("fetch", fetchMock);
    const env: Env = { EMAIL_API_KEY: "key_123", EMAIL_FROM: "KPE Website <enquiries@kpe.example>", EMAIL_TO: "owner@example.com" };
    expect((await send(post(valid), env)).status).toBe(200);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer key_123");
    const payload = JSON.parse(init.body as string);
    expect(payload.to).toEqual(["owner@example.com"]);
    expect(payload.reply_to).toBe("test@example.com");
    expect(payload.from).toBe("KPE Website <enquiries@kpe.example>");
  });

  it("fails loudly, without leaking details, when email is not configured or the provider errors", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const unconfigured = await send(post(valid), {});
    expect(unconfigured.status).toBe(503);
    expect(unconfigured.body).toEqual({ ok: false, error: "delivery_failed" });

    vi.stubGlobal("fetch", vi.fn(async () => new Response("upstream exploded: key_123", { status: 500 })));
    const env: Env = { EMAIL_API_KEY: "key_123", EMAIL_FROM: "a@kpe.example", EMAIL_TO: "b@example.com" };
    const failed = await send(post(valid), env);
    expect(failed.status).toBe(502);
    expect(JSON.stringify(failed.body)).not.toContain("key_123");
    expect(error).toHaveBeenCalledTimes(2);
  });

  it("answers unexpected failures with a generic error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const env: Env = { ...dryRun, ENQUIRY_RATE_LIMITER: { limit: async () => { throw new Error("binding broke: internal detail"); } } };
    const { status, body } = await send(post(valid), env);
    expect(status).toBe(500);
    expect(body).toEqual({ ok: false, error: "server_error" });
  });

  it("returns 404 for any other path under /api", async () => {
    const { status } = await send(new Request(`${ORIGIN}/api/admin`, { headers: { Origin: ORIGIN } }));
    expect(status).toBe(404);
  });
});
