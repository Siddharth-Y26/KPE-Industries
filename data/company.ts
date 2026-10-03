// Company facts, taken from the KPE company profile. Do not add claims here that the
// profile does not support.

export const about = {
  heading: "Engineering expertise. Built around execution.",
  summary:
    "Krishna Power & Engineers is an engineering company providing comprehensive solutions for the power, cement and steel industries, backed by experienced and skilled engineers.",
  whatWeDo:
    "Our professionals handle operation and maintenance and project execution, from concept to commissioning, in telecom, power and renewable infrastructure.",
  howWeWork:
    "Every project is undertaken with sincerity and delivered within the scheduled time frame, using adequate instruments and tools for quality work.",
  scope: [
    "Operation & maintenance",
    "Project execution",
    "Telecom infrastructure",
    "Power infrastructure",
    "Renewable infrastructure",
  ],
  principles: [
    {
      title: "Experience",
      text: "Skilled engineering professionals across power, steel and telecom.",
    },
    {
      title: "Execution",
      text: "Projects handled from concept through commissioning.",
    },
    {
      title: "Commitment",
      text: "Focus on quality, scheduled delivery and long-term client relationships.",
    },
  ],
} as const;

export const heroStats = [
  { value: 48, unit: "", label: "Clients & projects", note: "on record" },
  { value: 80, unit: "MW", label: "Largest power plant project", note: "" },
  { value: 25, unit: "MW", label: "TG set erection capability", note: "" },
] as const;

export const mission =
  "To provide impeccable service with the best quality to our clients at a reasonable price.";

export const vision =
  "To grow with humanity, honesty, safety and commitment, retaining the confidence and trust of our customers.";

export const values = [
  { title: "Humanity", text: "Growing with a strong sense of care for people.", icon: "humanity" },
  { title: "Honesty", text: "Transparent, trustworthy dealings with every client.", icon: "honesty" },
  { title: "Safety", text: "Safe execution at every site and on every project.", icon: "safety" },
  {
    title: "Commitment",
    text: "Sincere effort, hard work and long-lasting client relationships.",
    icon: "commitment",
  },
] as const;

export const processSteps = [
  { title: "Concept", text: "Understanding client needs and planning the project." },
  { title: "Erection", text: "Installing electrical and instrumentation equipment." },
  { title: "Testing", text: "Testing equipment, panels and cabling." },
  { title: "Commissioning", text: "Bringing systems into safe, reliable service." },
  { title: "O&M Support", text: "Assistance for operation and maintenance." },
] as const;

export const reasons = [
  {
    title: "Experienced team",
    text: "Skilled engineers across power, steel and telecom.",
    icon: "team",
  },
  {
    title: "On-time delivery",
    text: "Projects completed within the scheduled time frame.",
    icon: "time",
  },
  {
    title: "Quality workmanship",
    text: "Adequate instruments and tools for quality work.",
    icon: "quality",
  },
  {
    title: "Fair pricing",
    text: "Best quality at a reasonable price.",
    icon: "price",
  },
] as const;

// display:
//   "full"   - label and number are shown
//   "status" - label and statusText are shown, the number is not
//   "hidden" - not shown anywhere on the site
// Numbers are entered here only once they are approved for publication; until then
// `value` stays empty. Change `display` here and nowhere else.
export type Credential = {
  label: string;
  value: string;
  statusText: string;
  display: "full" | "status" | "hidden";
};

export const credentials: Credential[] = [
  {
    label: "Electrical Contractor Licence",
    value: "LW-3150",
    statusText: "Licensed",
    display: "full",
  },
  {
    label: "GST Registration",
    value: "09BFAPK5949C2ZF",
    statusText: "Registered",
    display: "full",
  },
  {
    label: "MSME (Udyam) Registration",
    value: "",
    statusText: "Registered",
    display: "status",
  },
  {
    label: "EPF Registration",
    value: "",
    statusText: "Registered",
    display: "status",
  },
  {
    label: "ESIC Registration",
    value: "",
    statusText: "Under process",
    display: "hidden",
  },
  {
    label: "PAN",
    value: "",
    statusText: "Available on request",
    display: "hidden",
  },
];
