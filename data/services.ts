// The four service categories from the company profile.

export type Service = {
  slug: string;
  name: string;
  summary: string;
  capabilities: string[];
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    slug: "power-plants",
    name: "Power Plants",
    summary:
      "Erection, testing and commissioning of turbo-generator sets, transformers and panels, with assistance for operation and maintenance.",
    capabilities: [
      "TG set erection, testing & commissioning up to 25 MW",
      "All types of transformers",
      "ACB panels",
      "VCB panels",
      "MCC",
      "VFD",
      "Bus duct",
      "O&M assistance",
    ],
    image: "services/power-plants",
    imageAlt: "Cranes lifting heavy equipment into position during erection",
  },
  {
    slug: "steel-industries",
    name: "Steel Industries",
    summary:
      "Complete electrical erection, testing and commissioning across the process areas of a steel plant.",
    capabilities: [
      "Complete electrical erection",
      "Testing & commissioning",
      "Sponge iron plants",
      "Pellet plants",
      "Blast furnace",
      "Sinter plants",
      "Oxygen plants",
      "SMS",
      "RMHS",
      "Coal washery",
    ],
    image: "services/steel-industries",
    imageAlt: "Industrial process plant with structural steelwork and stacks",
  },
  {
    slug: "power-distribution",
    name: "Power Distribution",
    summary:
      "11 kV lines, HT and LT overhead line supply and installation, and assistance for the operation of UPPCL substations.",
    capabilities: [
      "11 kV lines",
      "UPPCL substation operation assistance",
      "HT/LT overhead line supply",
      "HT/LT installation",
    ],
    image: "services/power-distribution",
    imageAlt: "Transmission towers and overhead power lines",
  },
  {
    slug: "telecom",
    name: "Telecom",
    summary:
      "EB work for telecom sites, SMPS and battery replacement, and FTTx project work.",
    capabilities: ["EB work for telecom sites", "SMPS & battery replacement", "FTTx project work"],
    image: "services/telecom",
    imageAlt: "Microwave dishes mounted on a telecom tower",
  },
];
