// Electrical & instrumentation scope from the company profile.

export const capabilities = [
  {
    title: "TG Sets",
    text: "Erection, testing & commissioning of turbo-generator sets up to 25 MW.",
    icon: "tg",
  },
  {
    title: "Transformers",
    text: "Erection, testing & commissioning of all types of transformers.",
    icon: "transformer",
  },
  {
    title: "Panels & Bus Duct",
    text: "ACB, VCB, MCC, VFD, HT/LT and instrumentation panels, bus duct.",
    icon: "panels",
  },
  {
    title: "Cabling & Earthing",
    text: "HT/LT, instrumentation and communication cables, trays and earthing.",
    icon: "cabling",
  },
  {
    title: "O&M Support",
    text: "Assistance for plant operation and maintenance.",
    icon: "om",
  },
] as const;

export const steelPlantAreas = [
  "Sponge Iron",
  "Pellet Plant",
  "Blast Furnace",
  "Sinter Plant",
  "Oxygen Plant",
  "SMS",
  "RMHS",
  "Coal Washery",
] as const;

export const capabilityPhotos = [
  { image: "gallery/mcc-panels", alt: "Line-up of MCC and switchgear panels", caption: "MCC / switchgear panels" },
  { image: "gallery/cable-trays", alt: "Cable trays routed through a plant building", caption: "Cable trays and bus duct" },
  {
    image: "gallery/cable-termination",
    alt: "Technician on a ladder carrying out cable termination work",
    caption: "Cable termination work",
  },
] as const;
