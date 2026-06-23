/** API contract types for Discovery — mirror the backend `discovery.schema.ts`. */

export interface Facet {
  value: string;
  count: number;
}

export interface DiscoveryOptions {
  industries: Facet[];
  geographies: Facet[];
  sizeBands: string[];
  techCatalog: { id: string; name: string; category: string }[];
  intentTriggers: { id: string; title: string; description: string }[];
}

export interface CompanySample {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  country: string | null;
  sizeBand: string | null;
  fitScore: number;
}

export interface PreviewResult {
  reach: number;
  leadsPerWeek: number;
  confidence: number;
  sample: CompanySample[];
}

/** What the live builder sends to `discovery/preview` (inline ICP). */
export interface PreviewInput {
  industries: string[];
  geographies: string[];
  companySizeMin: number;
  companySizeMax: number;
}

export interface RunResult {
  matched: number;
  added: number;
}

export interface SegmentInput {
  name: string;
  industries: string[];
  geographies: string[];
  companySizeMin: number;
  companySizeMax: number;
  techIds: string[];
  intentTriggers: Record<string, boolean>;
}

export interface Segment extends SegmentInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
