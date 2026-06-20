export interface BuilderState {
  industries: string[];
  geographies: string[];
  companySizeRange: [number, number];
  selectedTechIds: string[];
  intentTriggers: Record<string, boolean>;
}

export interface TechItem {
  id: string;
  name: string;
  category: string;
}

export interface IntentTrigger {
  id: string;
  title: string;
  description: string;
}

export interface SampleLead {
  id: string;
  company: string;
  companyInitial: string;
  trigger: string;
  matchScore: number;
}

export interface PredictionStats {
  confidence: number;
  velocity: string;
  reachPerMonth: number;
}
