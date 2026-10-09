// Every value that may change without a redesign lives here or in an environment
// variable. Company facts (services, projects, credentials) live in data/.

export type Address = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  // Left out when the client has not supplied it.
  postalCode?: string;
  country: string;
};

// Where the team works and visitors come. The client gave no PIN code for it.
const office: Address = {
  line1: "CP-71/TF-4 (3rd Floor), Galaxy Tower",
  line2: "Viraj Khand, Gomti Nagar",
  city: "Lucknow",
  state: "Uttar Pradesh",
  country: "IN",
};

// The company's registered address, shown beside the office and used in the privacy notice.
const registeredOffice: Address = {
  line1: "D3/125 Vibhav Khand",
  line2: "Gomti Nagar",
  city: "Lucknow",
  state: "Uttar Pradesh",
  postalCode: "226010",
  country: "IN",
};

// "Lucknow, Uttar Pradesh 226010", or without the PIN code when there is none.
export function cityLine(address: Address) {
  return [`${address.city}, ${address.state}`, address.postalCode].filter(Boolean).join(" ");
}

const mapsQuery = [office.line1, office.line2, cityLine(office)].join(", ");

export const siteConfig = {
  name: "Krishna Power & Engineers",
  shortName: "KPE",
  tagline:
    "Electrical, power and telecom infrastructure solutions for the power, steel and cement industries.",

  // No trailing slash. Falls back to localhost so `npm run dev` works without setup.
  // When the site lives in a sub-folder, this includes the sub-folder.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, ""),

  // The sub-folder the site is served from, e.g. "/KPE-Industries" on GitHub Pages.
  // Empty on the real domain.
  basePath: (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, ""),

  // True when the build is a preview on static-only hosting (GitHub Pages), where the
  // enquiry endpoint does not exist. The form explains this instead of failing, and
  // search engines are told not to index the preview.
  staticPreview: process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true",

  contact: {
    // Enquiries: the number behind every "Call" button.
    phoneDisplay: "+91 88749 00222",
    phoneHref: "tel:+918874900222",
    // For emergencies. Listed beside the enquiry number wherever contact details are shown.
    emergencyPhoneDisplay: "+91 88080 55589",
    emergencyPhoneHref: "tel:+918808055589",
    email: "info.krishnapowereng@gmail.com",
    office,
    registeredOffice,
    // Opens the office, not the registered address.
    mapsUrl:
      process.env.NEXT_PUBLIC_MAPS_URL ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  },

  whatsapp: {
    // Digits only, international format. Blank hides every WhatsApp button.
    number: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
    message: "Hello Krishna Power & Engineers, I would like to enquire about your services.",
  },

  enquiry: {
    endpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "/api/enquiry",
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  },

  analytics: {
    cloudflareToken: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN || "",
  },

  // None supplied in the company profile. Add a URL to show the link in the footer.
  social: {
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Contact", href: "/contact" },
] as const;

export const enquiryHref = "/contact#enquiry";
