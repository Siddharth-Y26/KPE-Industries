// Enquiry form rules, shared by the browser form and the server endpoint so the two
// can never disagree. The server result is the one that counts.
//
// Keep this file free of DOM, Node and Next.js imports: the Worker bundles it too.

export const SERVICE_OPTIONS = [
  "Power Plant Services",
  "Electrical & Instrumentation",
  "Transformer Erection",
  "Power Distribution",
  "Steel Industry Services",
  "Telecom Infrastructure",
  "Testing & Commissioning",
  "Operation & Maintenance",
  "Other",
] as const;

export const CONTACT_METHODS = ["Phone", "Email", "WhatsApp"] as const;

export const LIMITS = {
  name: { min: 2, max: 100 },
  company: { min: 2, max: 150 },
  email: { max: 254 },
  phone: { max: 20, minDigits: 7, maxDigits: 15 },
  location: { max: 150 },
  capacity: { max: 60 },
  message: { min: 10, max: 2000 },
} as const;

export type Enquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: (typeof SERVICE_OPTIONS)[number];
  message: string;
  location: string;
  capacity: string;
  preferredContact: (typeof CONTACT_METHODS)[number] | "";
};

export type EnquiryField = keyof Enquiry;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export type ValidationResult =
  | { ok: true; data: Enquiry }
  | { ok: false; errors: EnquiryErrors };

// Fields the endpoint accepts. `website` is the honeypot, `turnstileToken` the challenge.
export const HONEYPOT_FIELD = "website";
export const TOKEN_FIELD = "turnstileToken";
export const ACCEPTED_FIELDS: readonly string[] = [
  "name",
  "company",
  "email",
  "phone",
  "service",
  "message",
  "location",
  "capacity",
  "preferredContact",
  HONEYPOT_FIELD,
  TOKEN_FIELD,
];

const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;
const CONTROL_CHARS_EXCEPT_NEWLINE = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s\-()]+$/;
const CAPACITY = /^[0-9A-Za-z .,/+\-()]*$/;

function singleLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();
}

function multiLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS_EXCEPT_NEWLINE, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validateEnquiry(raw: unknown): ValidationResult {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: EnquiryErrors = {};

  const name = singleLine(input.name);
  if (name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name.max) errors.name = `Name must be ${LIMITS.name.max} characters or fewer.`;

  const company = singleLine(input.company);
  if (company.length < LIMITS.company.min) errors.company = "Please enter your company name.";
  else if (company.length > LIMITS.company.max)
    errors.company = `Company name must be ${LIMITS.company.max} characters or fewer.`;

  const email = singleLine(input.email);
  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.email.max || !EMAIL.test(email))
    errors.email = "Please enter a valid email address.";

  const phone = singleLine(input.phone);
  const digits = phone.replace(/\D/g, "").length;
  if (!phone) errors.phone = "Please enter your phone number.";
  else if (
    phone.length > LIMITS.phone.max ||
    !PHONE.test(phone) ||
    digits < LIMITS.phone.minDigits ||
    digits > LIMITS.phone.maxDigits
  )
    errors.phone = "Please enter a valid phone number.";

  const service = singleLine(input.service);
  if (!(SERVICE_OPTIONS as readonly string[]).includes(service))
    errors.service = "Please choose what you are enquiring about.";

  const message = multiLine(input.message);
  if (message.length < LIMITS.message.min) errors.message = "Please tell us a little about your requirement.";
  else if (message.length > LIMITS.message.max)
    errors.message = `Message must be ${LIMITS.message.max} characters or fewer.`;

  const location = singleLine(input.location);
  if (location.length > LIMITS.location.max)
    errors.location = `Location must be ${LIMITS.location.max} characters or fewer.`;

  const capacity = singleLine(input.capacity);
  if (capacity.length > LIMITS.capacity.max || !CAPACITY.test(capacity))
    errors.capacity = "Please enter a capacity such as 25 MW or 400 kVA.";

  const preferredContact = singleLine(input.preferredContact);
  if (preferredContact && !(CONTACT_METHODS as readonly string[]).includes(preferredContact))
    errors.preferredContact = "Please choose a contact method from the list.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      company,
      email,
      phone,
      service: service as Enquiry["service"],
      message,
      location,
      capacity,
      preferredContact: preferredContact as Enquiry["preferredContact"],
    },
  };
}
