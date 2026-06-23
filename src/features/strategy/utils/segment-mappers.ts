import type { BuilderState, PredictionStats, SampleLead } from "../types";
import type {
  CompanySample,
  PreviewInput,
  PreviewResult,
  Segment,
  SegmentInput,
} from "../types/discovery";

/** ICP builder state → the inline body for `discovery/preview`. */
export function toPreviewInput(state: BuilderState): PreviewInput {
  return {
    industries: state.industries,
    geographies: state.geographies,
    companySizeMin: state.companySizeRange[0],
    companySizeMax: state.companySizeRange[1],
  };
}

/** ICP builder state (+ a name) → the payload to persist a segment. */
export function toSegmentInput(state: BuilderState, name: string): SegmentInput {
  return {
    name,
    industries: state.industries,
    geographies: state.geographies,
    companySizeMin: state.companySizeRange[0],
    companySizeMax: state.companySizeRange[1],
    techIds: state.selectedTechIds,
    intentTriggers: state.intentTriggers,
  };
}

/** A persisted segment → builder state, for resume-on-open. */
export function toBuilderState(segment: Segment): BuilderState {
  return {
    industries: segment.industries,
    geographies: segment.geographies,
    companySizeRange: [segment.companySizeMin, segment.companySizeMax],
    selectedTechIds: segment.techIds,
    intentTriggers: segment.intentTriggers,
  };
}

/** True when there is enough targeting to have an audience (mirrors the API). */
export function hasAudience(state: BuilderState): boolean {
  return state.industries.length > 0 && state.geographies.length > 0;
}

/** Server preview → the existing PredictorPanel `PredictionStats` shape. */
export function previewToStats(p: PreviewResult): PredictionStats {
  return {
    confidence: p.confidence,
    leadsPerWeek: p.leadsPerWeek,
    reachPerMonth: p.leadsPerWeek * 4,
    velocity: p.leadsPerWeek >= 20 ? "High" : p.leadsPerWeek >= 8 ? "Medium" : "Low",
    optimizationLabel:
      p.confidence >= 85
        ? "Peak Performance"
        : p.confidence >= 70
          ? "Strong"
          : p.confidence >= 50
            ? "Moderate"
            : "Building",
  };
}

/** Server company samples → the existing SamplePreviewTable `SampleLead` shape. */
export function samplesToLeads(sample: CompanySample[]): SampleLead[] {
  return sample.map((c) => ({
    id: c.id,
    company: c.name,
    companyInitial: (c.name.trim()[0] ?? "?").toUpperCase(),
    // No behavioral trigger yet — surface the firmographic match as the tag.
    trigger: (c.country ?? c.industry ?? "match").toUpperCase(),
    matchScore: Math.round(c.fitScore) / 10,
  }));
}
