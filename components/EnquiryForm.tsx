"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import {
  CONTACT_METHODS,
  HONEYPOT_FIELD,
  LIMITS,
  SERVICE_OPTIONS,
  TOKEN_FIELD,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";
import { whatsappUrl } from "@/lib/whatsapp";
import { buttonClass, ButtonLink } from "./ui/Button";
import { WhatsAppIcon } from "./ui/WhatsAppIcon";

type Status = "idle" | "sending" | "success" | "error";
type Values = Record<EnquiryField, string>;

type Turnstile = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const emptyValues: Values = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  location: "",
  capacity: "",
  preferredContact: "",
};

// Order the fields appear in, used to move focus to the first one with an error.
const fieldOrder: EnquiryField[] = [
  "name",
  "company",
  "email",
  "phone",
  "service",
  "location",
  "capacity",
  "preferredContact",
  "message",
];

const inputClass =
  "block w-full rounded-sm border border-steel-200 bg-white px-4 py-3 text-base text-ink placeholder:text-steel-500 transition-colors hover:border-steel-400 focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20 aria-[invalid=true]:border-red-600";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 font-display text-sm font-semibold text-navy-900">
        <span>{label}</span>
        {optional ? <span className="text-xs font-normal text-steel-500">Optional</span> : null}
      </label>
      {children}
      {hint && !error ? <div className="mt-1.5 text-sm text-steel-500">{hint}</div> : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function EnquiryForm() {
  const formId = useId();
  const [values, setValues] = useState<Values>(emptyValues);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const [token, setToken] = useState("");
  const [challengeWanted, setChallengeWanted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const challengeRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  const whatsapp = whatsappUrl();
  const { turnstileSiteKey, endpoint } = siteConfig.enquiry;
  const { staticPreview } = siteConfig;
  const fieldId = (name: string) => `${formId}-${name}`;

  // The Turnstile script is fetched only once someone starts filling in the form,
  // so it costs nothing for visitors who never enquire.
  useEffect(() => {
    if (!challengeWanted || !turnstileSiteKey) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || !challengeRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(challengeRef.current, {
        sitekey: turnstileSiteKey,
        theme: "light",
        callback: (value: string) => setToken(value),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, [challengeWanted, turnstileSiteKey]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = (field: EnquiryField) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fieldProps = (field: EnquiryField) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    onChange: set(field),
    "aria-invalid": errors[field] ? (true as const) : undefined,
    "aria-describedby": errors[field] ? `${fieldId(field)}-error` : undefined,
  });

  function showErrors(next: EnquiryErrors) {
    setErrors(next);
    const first = fieldOrder.find((field) => next[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  function fail(message: string) {
    setFailure(message);
    setStatus("error");
    // A Turnstile token can be checked once, so a retry needs a fresh one.
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    setToken("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const result = validateEnquiry(values);
    if (!result.ok) {
      setStatus("idle");
      showErrors(result.errors);
      return;
    }
    if (staticPreview) {
      fail("This is a preview of the website, so the form is not connected yet. Please contact us directly by phone or email.");
      return;
    }
    if (turnstileSiteKey && !token) {
      setChallengeWanted(true);
      setFailure("Please complete the verification check below, then send again.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setFailure("");

    const fallback = whatsapp
      ? "We couldn't send your enquiry right now. Please try again or contact us directly via WhatsApp."
      : "We couldn't send your enquiry right now. Please try again or contact us directly by phone.";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          [HONEYPOT_FIELD]: honeypot,
          ...(token ? { [TOKEN_FIELD]: token } : {}),
        }),
      });
      const body: { ok?: boolean; fields?: EnquiryErrors } | null = await response.json().catch(() => null);

      if (response.ok && body?.ok) {
        setValues(emptyValues);
        setErrors({});
        setToken("");
        setStatus("success");
      } else if (response.status === 422 && body?.fields) {
        setStatus("idle");
        showErrors(body.fields);
      } else if (response.status === 429) {
        fail("You have sent several enquiries in a short time. Please wait a minute and try again.");
      } else {
        fail(fallback);
      }
    } catch {
      fail(fallback);
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-steel-100 bg-white p-8 outline-none sm:p-12"
      >
        <CircleCheck className="h-12 w-12 text-whatsapp" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="mt-6 text-2xl font-semibold text-navy-900 sm:text-3xl">Enquiry sent successfully.</h3>
        <p className="mt-3 text-lg leading-relaxed text-steel-500">
          Thank you. Your enquiry has been received. Our team will contact you shortly.
        </p>

        {whatsapp ? (
          <div className="mt-8 border-t border-steel-100 pt-8">
            <p className="font-display font-semibold text-navy-900">
              Prefer WhatsApp? Continue the conversation directly.
            </p>
            <ButtonLink href={whatsapp} variant="whatsapp" size="lg" className="mt-4 w-full sm:w-auto">
              <WhatsAppIcon />
              Chat on WhatsApp
            </ButtonLink>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 font-display text-sm font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocus={() => setChallengeWanted(!staticPreview)}
      noValidate
      aria-label="Project enquiry"
      className="border border-steel-100 bg-white p-6 sm:p-10"
    >
      {staticPreview ? (
        <p className="mb-7 border border-steel-200 bg-mist p-4 text-[0.95rem] leading-relaxed text-ink">
          <strong className="font-display font-semibold text-navy-900">Preview site.</strong> The enquiry form is not
          connected yet. To reach us now, call {siteConfig.contact.phoneDisplay} or write to{" "}
          {siteConfig.contact.email}.
        </p>
      ) : null}

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <Field id={fieldId("name")} label="Name" error={errors.name}>
          <input {...fieldProps("name")} type="text" autoComplete="name" maxLength={LIMITS.name.max} required className={inputClass} />
        </Field>

        <Field id={fieldId("company")} label="Company name" error={errors.company}>
          <input
            {...fieldProps("company")}
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company.max}
            required
            className={inputClass}
          />
        </Field>

        <Field id={fieldId("email")} label="Email" error={errors.email}>
          <input
            {...fieldProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email.max}
            required
            className={inputClass}
          />
        </Field>

        <Field id={fieldId("phone")} label="Phone number" error={errors.phone}>
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone.max}
            required
            className={inputClass}
          />
        </Field>

        <Field id={fieldId("service")} label="What are you enquiring about?" error={errors.service} className="sm:col-span-2">
          <select {...fieldProps("service")} required className={inputClass}>
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field id={fieldId("location")} label="Project location" optional error={errors.location}>
          <input
            {...fieldProps("location")}
            type="text"
            autoComplete="off"
            maxLength={LIMITS.location.max}
            className={inputClass}
          />
        </Field>

        <Field id={fieldId("capacity")} label="Estimated project capacity" optional error={errors.capacity}>
          <input
            {...fieldProps("capacity")}
            type="text"
            autoComplete="off"
            placeholder="e.g. 25 MW, 400 kVA"
            maxLength={LIMITS.capacity.max}
            className={inputClass}
          />
        </Field>

        <Field
          id={fieldId("preferredContact")}
          label="Preferred contact method"
          optional
          error={errors.preferredContact}
          className="sm:col-span-2"
        >
          <select {...fieldProps("preferredContact")} className={inputClass}>
            <option value="">No preference</option>
            {CONTACT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={fieldId("message")}
          label="Message"
          error={errors.message}
          hint={
            <span className="flex justify-between gap-4">
              <span>Tell us about your requirement.</span>
              <span className="tabular-nums">
                {values.message.length}/{LIMITS.message.max}
              </span>
            </span>
          }
          className="sm:col-span-2"
        >
          <textarea
            {...fieldProps("message")}
            rows={5}
            maxLength={LIMITS.message.max}
            required
            className={`${inputClass} min-h-36 resize-y`}
          />
        </Field>
      </div>

      {/* Honeypot: invisible to people, tempting to bots. A filled value is discarded server-side. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={fieldId(HONEYPOT_FIELD)}>Website</label>
        <input
          id={fieldId(HONEYPOT_FIELD)}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {turnstileSiteKey ? <div ref={challengeRef} className="mt-6 min-h-[65px]" /> : null}

      <div aria-live="assertive">
        {status === "error" && failure ? (
          <div className="mt-6 border border-red-200 bg-red-50 p-5 text-red-900">
            <p className="flex items-start gap-2.5 font-medium">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {failure}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {whatsapp ? (
                <ButtonLink href={whatsapp} variant="whatsapp">
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp Us
                </ButtonLink>
              ) : null}
              <ButtonLink href={siteConfig.contact.phoneHref} variant="outline">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {siteConfig.contact.phoneDisplay}
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </div>

      <button type="submit" disabled={sending} className={buttonClass("primary", "lg", "mt-7 w-full sm:w-auto sm:min-w-56")}>
        {sending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending enquiry...
          </>
        ) : (
          <>
            Send Enquiry
            <Send className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="mt-4 text-sm text-steel-500">
        We use these details only to respond to your enquiry. See our{" "}
        <Link href="/privacy" className="font-medium text-navy-700 underline underline-offset-4 hover:text-navy-900">
          privacy policy
        </Link>
        .
      </p>

      <noscript>
        <p className="mt-4 border border-steel-200 bg-mist p-4 text-sm text-ink">
          This form needs JavaScript. You can also reach us on {siteConfig.contact.phoneDisplay} or at{" "}
          {siteConfig.contact.email}.
        </p>
      </noscript>
    </form>
  );
}
