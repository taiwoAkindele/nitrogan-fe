import type {
  BuilderState,
  TechItem,
  IntentTrigger,
  SampleLead,
  PredictionStats,
} from "../types";

export const AVAILABLE_INDUSTRIES = [
  "Fintech",
  "Logistics",
  "E-commerce",
  "HealthTech",
  "EdTech",
  "AgriTech",
  "InsurTech",
  "PropTech",
];

export const AVAILABLE_GEOGRAPHIES = [
  "Nigeria",
  "Kenya",
  "South Africa",
  "Ghana",
  "Egypt",
  "Rwanda",
  "Tanzania",
  "Ethiopia",
];

export const TECH_CATALOG: TechItem[] = [
  { id: "1", name: "Stripe", category: "Payment Processing" },
  { id: "2", name: "WhatsApp API", category: "Communication" },
  { id: "3", name: "Paystack", category: "Payment Processing" },
  { id: "4", name: "Flutterwave", category: "Payment Processing" },
  { id: "5", name: "Twilio", category: "Communication" },
  { id: "6", name: "Segment", category: "Analytics" },
];

export const INTENT_TRIGGER_OPTIONS: IntentTrigger[] = [
  {
    id: "recent-funding",
    title: "Recent Funding",
    description: "Series A/B in last 6 months",
  },
  {
    id: "hiring-spikes",
    title: "Hiring Spikes",
    description: "Sales & Operations focus",
  },
  {
    id: "market-expansion",
    title: "Market Expansion",
    description: "New regional office announcements",
  },
];

export const MOCK_SAMPLE_LEADS: SampleLead[] = [
  {
    id: "s1",
    company: "Flutterwave Inc.",
    companyInitial: "F",
    trigger: "FUNDING",
    matchScore: 9.8,
  },
  {
    id: "s2",
    company: "Kobo360",
    companyInitial: "K",
    trigger: "EXPANSION",
    matchScore: 8.8,
  },
  {
    id: "s3",
    company: "Andela",
    companyInitial: "A",
    trigger: "HIRING",
    matchScore: 8.2,
  },
  {
    id: "s4",
    company: "Paystack",
    companyInitial: "P",
    trigger: "FUNDING",
    matchScore: 7.9,
  },
];

export const MOCK_PREDICTION: PredictionStats = {
  confidence: 92,
  velocity: "High",
  reachPerMonth: 180,
};

export const DEFAULT_BUILDER_STATE: BuilderState = {
  industries: ["Fintech", "Logistics"],
  geographies: ["Nigeria", "Kenya"],
  companySizeRange: [50, 500],
  selectedTechIds: ["2"],
  intentTriggers: {
    "recent-funding": true,
    "hiring-spikes": false,
    "market-expansion": false,
  },
};
