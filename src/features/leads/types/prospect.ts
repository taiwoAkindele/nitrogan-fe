export type IntentLabel = "High" | "Medium" | "Low";
export type ProspectStatus = "new" | "saved" | "active" | "archive";

export interface Prospect {
  id: string;
  companyName: string;
  companyInitial: string;
  avatarColor: string;
  industry: string;
  employeeRange: string;
  intentLabel: IntentLabel;
  signalCount: number;
  signalSummary: string;
  timestamp: string;
  status: ProspectStatus;
}

export interface Signal {
  id: string;
  type: "expansion" | "executive" | "technographic" | "funding";
  title: string;
  description: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

export interface Firmographic {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ProspectDetail extends Prospect {
  description: string;
  location: string;
  websiteUrl: string;
  employeeCount: number;
  intentScore: number;
  signals: Signal[];
  personas: Persona[];
  firmographics: Firmographic[];
}
