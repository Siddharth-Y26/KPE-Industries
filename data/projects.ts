// Projects from the company profile. Fields the profile leaves blank stay undefined;
// do not fill them in from memory or guesswork.
//
// The profile also has an appendix of private clients with names and addresses.
// That list is deliberately not reproduced here. Only the aggregate counts are used.

export type Project = {
  client: string;
  type: string;
  sector: "Power" | "Steel" | "Cement" | "Industrial";
  capacity?: string;
  location?: string;
  // Optional key from data/image-manifest.json. No project photos have been supplied yet.
  image?: string;
};

export const projectHighlights: Project[] = [
  { client: "Adhunik Cement Limited", type: "Power plant", sector: "Cement", capacity: "80 MW" },
  { client: "MSP Steel & Power Limited", type: "Power plant", sector: "Power", capacity: "40 MW" },
  { client: "Shyam Steel Limited", type: "DRI steel plant", sector: "Steel", location: "Sambalpur, Odisha" },
  { client: "Anjani Steel", type: "Steel plant project", sector: "Steel" },
  { client: "Delhi Electrical Company", type: "Various distillery projects", sector: "Industrial" },
  { client: "Larsen & Toubro Limited", type: "Industrial electrical project", sector: "Industrial" },
  {
    client: "Council of Science & Technology, UP",
    type: "Industrial electrical project",
    sector: "Industrial",
  },
  {
    client: "M. I. Builders",
    type: "Industrial electrical project",
    sector: "Industrial",
    location: "Lucknow",
  },
  {
    client: "Jekneet Infotech Pvt. Ltd.",
    type: "Industrial electrical project",
    sector: "Industrial",
    location: "Lucknow",
  },
];

export const workInHand = [
  {
    work: "Electrical & instrumentation installation and commissioning",
    client: "MSP Steel & Power Limited",
    location: "Raigarh, Chhattisgarh",
  },
  {
    work: "Installation of 11 kV overhead lines",
    client: "Uttar Pradesh Power Corporation Ltd. (UPPCL)",
    location: "Uttar Pradesh",
  },
  { work: "Erection of transformer", client: "UPPCL", location: "Lucknow" },
  { work: "Erection of LT overhead line", client: "UPPCL", location: "Sandila" },
  {
    // Line voltage to be confirmed before it is shown.
    work: "Erection of transformer with HT lines",
    client: "AV Bio Medical Waste Service",
    location: "Sandila, Hardoi (UP)",
  },
] as const;

export const portfolio = {
  total: 48,
  breakdown: [
    { value: 32, label: "Power connections" },
    { value: 9, label: "Industrial electrical projects" },
    { value: 7, label: "Domestic wiring projects" },
  ],
  note: "28 of the 32 power connections fall in the 100 to 400 kVA range. The largest is 800 kVA.",
} as const;
