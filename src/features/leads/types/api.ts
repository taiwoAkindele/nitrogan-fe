/** API contract types for prospects (Sales Inbox) — mirror the backend. */

export type ProspectStatus = "new" | "saved" | "active" | "archive";
export type IntentLabel = "High" | "Medium" | "Low";

export interface ProspectListItem {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  employeeCount: number;
  employeeRange: string;
  websiteUrl: string;
  description: string;
  intentScore: number;
  intentLabel: IntentLabel;
  status: ProspectStatus;
  segmentId: string | null;
  createdAt: string;
}

export interface PaginatedProspects {
  items: ProspectListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProspectDetail extends ProspectListItem {
  signals: {
    id: string;
    type: string;
    title: string;
    description: string;
    scoreContribution: number;
    outreachAngle: string;
  }[];
  personas: { id: string; name: string; role: string; avatarUrl: string | null }[];
  firmographics: { id: string; label: string; value: string; highlight: boolean }[];
  feedback: "good" | "bad" | null;
}

export interface ProspectListParams {
  status?: ProspectStatus;
  search?: string;
  sort?: "intent" | "company";
  page?: number;
  pageSize?: number;
}
